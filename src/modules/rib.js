import { Module } from '../module.js';

export class RibModule extends Module {
  constructor() {
    super('rib', 'Ribbon', {
      strudelName: 'rib',
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('offset', 'Offset', 0, 256, 0, 1));
    row.appendChild(this.createKnob('duration', 'Dur', 0.1, 4, 1, 0.1));
    div.appendChild(row);
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.rib(${this.knobs.offset.value}, ${this.knobs.duration.value})`;
  }
}
