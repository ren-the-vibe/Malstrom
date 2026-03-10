import { Module } from '../module.js';

export class ADSRModule extends Module {
  constructor() {
    super('adsr', 'ADSR', {
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('attack', 'A', 0, 2, 0.01, 0.01));
    row.appendChild(this.createKnob('decay', 'D', 0, 2, 0.1, 0.01));
    row.appendChild(this.createKnob('sustain', 'S', 0, 1, 0.8, 0.05));
    row.appendChild(this.createKnob('release', 'R', 0, 4, 0.3, 0.01));
    div.appendChild(row);
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    const a = this.knobs.attack.value;
    const d = this.knobs.decay.value;
    const s = this.knobs.sustain.value;
    const r = this.knobs.release.value;
    return `${inputCode}.attack(${a}).decay(${d}).sustain(${s}).release(${r})`;
  }
}
