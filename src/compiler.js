// Compiler — traverses module connection graph → generates Strudel pattern code

export class Compiler {
  constructor(rack, cables) {
    this.rack = rack;
    this.cables = cables;
  }

  compile() {
    // Find all terminal modules (Output, MIDI Out, OSC Out) — these are our roots
    const terminalTypes = ['output', 'midi-out', 'osc-out', 'piano-roll', 'scope', 'spectrum', 'spiral', 'punchcard', 'wordfall', 'pitchwheel'];
    const terminals = this.rack.getAllModules().filter(
      m => terminalTypes.includes(m.type)
    );

    if (terminals.length === 0) return '';

    const patterns = [];
    for (const terminal of terminals) {
      const code = this._compileModule(terminal, new Set());
      if (code) patterns.push(code);
    }

    return patterns.join('\n');
  }

  _compileModule(module, visited) {
    if (visited.has(module.id)) return null; // prevent cycles
    visited.add(module.id);

    const moduleType = module.type;

    // Multi-input modules (stack, cat, choose, merge, slowcat, etc.)
    if (this._isMultiInput(module)) {
      return this._compileMultiInput(module, visited);
    }

    // Modules with a 'mod' (control) input and a main 'in'
    if (this._hasModInput(module)) {
      return this._compileWithMod(module, visited);
    }

    // Single-input passthrough modules (effects, time mods, etc.)
    const mainInput = this._getMainInput(module);
    if (mainInput) {
      const sourceModuleId = this.cables.getSourceModule(module.id, mainInput);
      let inputCode = null;
      if (sourceModuleId) {
        const sourceModule = this.rack.getModule(sourceModuleId);
        if (sourceModule) {
          inputCode = this._compileModule(sourceModule, visited);
        }
      }
      return module.compile(inputCode);
    }

    // Source modules (no inputs — sequence, mini, noise, keyboard, etc.)
    return module.compile();
  }

  _compileMultiInput(module, visited) {
    const inputNames = module.inputs.map(i => i.name);
    const inputCodes = [];
    for (const inputName of inputNames) {
      const sourceModuleId = this.cables.getSourceModule(module.id, inputName);
      if (sourceModuleId) {
        const sourceModule = this.rack.getModule(sourceModuleId);
        if (sourceModule) {
          // Clone visited per branch so one branch can't block another
          const branchVisited = new Set(visited);
          const code = this._compileModule(sourceModule, branchVisited);
          if (code) inputCodes.push(code);
        }
      }
    }
    visited.add(module.id);
    return module.compile(inputCodes);
  }

  _compileWithMod(module, visited) {
    // Get main audio/pattern input
    const mainInputName = this._getMainInput(module);
    let inputCode = null;
    if (mainInputName) {
      const sourceId = this.cables.getSourceModule(module.id, mainInputName);
      if (sourceId) {
        const source = this.rack.getModule(sourceId);
        if (source) inputCode = this._compileModule(source, visited);
      }
    }

    // Get mod/control input — use separate visited clone so mod doesn't conflict with main
    let modCode = null;
    const modInputName = this._getModInput(module);
    if (modInputName) {
      const modSourceId = this.cables.getSourceModule(module.id, modInputName);
      if (modSourceId) {
        const modSource = this.rack.getModule(modSourceId);
        if (modSource) {
          const modVisited = new Set(visited);
          modCode = this._compileModule(modSource, modVisited);
        }
      }
    }

    return module.compile(inputCode, modCode);
  }

  _isMultiInput(module) {
    // Check module flag first (factory-generated modules), then hardcoded list
    if (module.isMultiInput) return true;
    return ['stack', 'cat', 'choose', 'merge'].includes(module.type);
  }

  _hasModInput(module) {
    return module.inputs.some(i =>
      i.name === 'mod' || i.name === 'cutoffMod' || i.name === 'effect'
    );
  }

  _getMainInput(module) {
    // Find the primary input (not mod/control)
    const main = module.inputs.find(i =>
      i.name === 'in' || i.name === 'in1'
    );
    return main ? main.name : null;
  }

  _getModInput(module) {
    const mod = module.inputs.find(i =>
      i.name === 'mod' || i.name === 'cutoffMod' || i.name === 'effect'
    );
    return mod ? mod.name : null;
  }
}
