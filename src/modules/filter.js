import { Module } from '../module.js';

export class FilterModule extends Module {
  constructor() {
    super('filter', 'Filter', {
      inputs: [
        { name: 'in', type: 'audio', label: 'in' },
        { name: 'cutoffMod', type: 'control', label: 'cutoff mod' }
      ],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createSelect('type', ['lowpass', 'highpass', 'bandpass'], 'lowpass'));
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('cutoff', 'Cutoff', 20, 20000, 2000, 1));
    row.appendChild(this.createKnob('resonance', 'Res', 0, 40, 1, 0.5));
    div.appendChild(row);
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const type = this.selects.type?.value || 'lowpass';
    const cutoff = Math.round(this.knobs.cutoff.value);
    const res = this.knobs.resonance.value;
    const filterFn = type === 'highpass' ? 'hpf' : type === 'bandpass' ? 'bpf' : 'lpf';
    const cutoffVal = modCode || cutoff;
    let code = `${inputCode}.${filterFn}(${cutoffVal})`;
    if (res > 1) code += `.resonance(${res})`;
    return code;
  }
}
