// Module Factory — generates module classes from config objects
import { Module } from '../module.js';

// Shorthand helpers for configs
export const K = (name, label, min, max, def, step = 0.01) => ({ name, label, min, max, def, step });
export const S = (name, options, def) => ({ name, options, def });

// Standard input/output definitions
export const AI = { name: 'in', type: 'audio', label: 'in' };
export const PI = { name: 'in', type: 'pattern', label: 'in' };
export const MI = { name: 'mod', type: 'control', label: 'mod' };
export const EI = { name: 'effect', type: 'pattern', label: 'effect' };
export const AO = { name: 'out', type: 'audio', label: 'out' };
export const PO = { name: 'out', type: 'pattern', label: 'out' };
export const CO = { name: 'out', type: 'control', label: 'out' };

// Helper: replace first segment of effect code with x for lambda
export function effectSub(effectCode) {
  return effectCode ? effectCode.replace(/^.*?\./, 'x.') : 'x';
}

/**
 * Generate a Module subclass from a config object.
 *
 * Config shape:
 *   type, title, strudelName,
 *   inputs: [], outputs: [],
 *   knobs: [], selects: [],
 *   isMultiInput: false,
 *   compileFn(inputCode, modCode) — optional custom compile
 */
export function makeModule(cfg) {
  const {
    type, title, strudelName,
    inputs = [AI], outputs = [AO],
    knobs = [], selects = [],
    isMultiInput = false,
    compileFn
  } = cfg;

  class GeneratedModule extends Module {
    constructor() {
      super(type, title, { strudelName, inputs, outputs });
      this._cfg = cfg;
      this.isMultiInput = isMultiInput;
    }

    renderBody() {
      if (knobs.length === 0 && selects.length === 0) return null;
      const div = document.createElement('div');
      for (const s of selects) {
        div.appendChild(this.createSelect(s.name, s.options, s.def));
      }
      if (knobs.length > 0) {
        for (let i = 0; i < knobs.length; i += 3) {
          const row = document.createElement('div');
          row.className = 'knob-row';
          for (let j = i; j < Math.min(i + 3, knobs.length); j++) {
            const k = knobs[j];
            row.appendChild(this.createKnob(k.name, k.label, k.min, k.max, k.def, k.step));
          }
          div.appendChild(row);
        }
      }
      return div;
    }

    compile(inputCode, modCode) {
      if (compileFn) return compileFn.call(this, inputCode, modCode);

      // Source modules (no inputs)
      if (inputs.length === 0) {
        const vals = knobs.map(k => this.knobs[k.name].value);
        return vals.length ? `${strudelName}(${vals.join(', ')})` : strudelName;
      }

      // Multi-input combinators
      if (isMultiInput) {
        const valid = (inputCode || []).filter(Boolean);
        if (valid.length === 0) return null;
        if (valid.length === 1) return valid[0];
        return `${strudelName}(${valid.join(', ')})`;
      }

      if (!inputCode) return null;

      // Standard: .method(knobValues...) with optional mod override
      const vals = knobs.map(k => this.knobs[k.name].value);
      if (modCode && inputs.some(i => i.name === 'mod' || i.name === 'cutoffMod')) {
        vals[0] = modCode;
      }
      return vals.length
        ? `${inputCode}.${strudelName}(${vals.join(', ')})`
        : `${inputCode}.${strudelName}()`;
    }
  }

  return GeneratedModule;
}

// Multi-input factory helper (for slowcat, polymeter, etc.)
export function makeMultiInput(type, title, strudelName, count = 4) {
  const inputs = [];
  for (let i = 1; i <= count; i++) {
    inputs.push({ name: `in${i}`, type: 'pattern', label: `in${i}` });
  }
  return makeModule({
    type, title, strudelName,
    inputs, outputs: [PO],
    isMultiInput: true
  });
}

// Effect-function factory (for every, when, within, etc.)
export function makeEffectFn(cfg) {
  return makeModule({
    ...cfg,
    inputs: [PI, EI, ...(cfg.extraInputs || [])],
    outputs: [PO],
    compileFn(inputCode, effectCode) {
      if (!inputCode) return null;
      const vals = (cfg.knobs || []).map(k => this.knobs[k.name].value);
      const sels = (cfg.selects || []).map(s => this.selects[s.name]?.value);
      const allArgs = [...sels, ...vals];
      const eff = effectSub(effectCode);
      const argsStr = allArgs.length ? `${allArgs.join(', ')}, ` : '';
      return `${inputCode}.${cfg.strudelName}(${argsStr}x => ${eff})`;
    }
  });
}

// Chain factory — compiles as .method1(v).method2(v)...
export function makeChain(cfg) {
  return makeModule({
    ...cfg,
    compileFn(inputCode) {
      if (!inputCode) return null;
      let code = inputCode;
      for (const p of cfg.params) {
        const val = this.knobs[p.knob]?.value ?? (this.selects[p.knob]?.value);
        if (val !== undefined) code += `.${p.method}(${val})`;
      }
      return code;
    }
  });
}
