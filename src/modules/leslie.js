import { Module } from '../module.js';

export class LeslieModule extends Module {
  constructor() {
    super('leslie', 'Leslie', {
      strudelName: 'leslie',
      inputs: [
        { name: 'in', type: 'audio', label: 'in' },
        { name: 'mod', type: 'control', label: 'mod' }
      ],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('rate', 'Rate', 0.1, 20, 1, 0.1));
    row.appendChild(this.createKnob('size', 'Size', 0, 4, 1, 0.1));
    div.appendChild(row);
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const les = modCode || 1;
    const r = this.knobs.rate.value;
    const s = this.knobs.size.value;
    return `${inputCode}.leslie(${les}).lrate(${r}).lsize(${s})`;
  }
}
