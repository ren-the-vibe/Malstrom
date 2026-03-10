import { Module } from '../module.js';

export class RangeModule extends Module {
  constructor() {
    super('range', 'Range', {
      inputs: [{ name: 'in', type: 'control', label: 'in' }],
      outputs: [{ name: 'out', type: 'control', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('min', 'Min', 0, 20000, 0, 1));
    row.appendChild(this.createKnob('max', 'Max', 0, 20000, 1000, 1));
    div.appendChild(row);
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    const min = Math.round(this.knobs.min.value);
    const max = Math.round(this.knobs.max.value);
    return `${inputCode}.range(${min}, ${max})`;
  }
}
