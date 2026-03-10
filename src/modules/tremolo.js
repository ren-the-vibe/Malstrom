import { Module } from '../module.js';

export class TremoloModule extends Module {
  constructor() {
    super('tremolo', 'Tremolo', {
      inputs: [{ name: 'in', type: 'audio', label: 'in' }],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('rate', 'Rate', 0.1, 20, 4, 0.1));
    row.appendChild(this.createKnob('depth', 'Depth', 0, 1, 0.5, 0.05));
    div.appendChild(row);
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.tremolo(${this.knobs.rate.value}, ${this.knobs.depth.value})`;
  }
}
