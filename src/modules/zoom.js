import { Module } from '../module.js';

export class ZoomModule extends Module {
  constructor() {
    super('zoom', 'Zoom', {
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('start', 'Start', 0, 1, 0, 0.05));
    row.appendChild(this.createKnob('end', 'End', 0, 1, 0.5, 0.05));
    div.appendChild(row);
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.zoom(${this.knobs.start.value}, ${this.knobs.end.value})`;
  }
}
