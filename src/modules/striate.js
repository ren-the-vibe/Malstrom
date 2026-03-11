import { Module } from '../module.js';

export class StriateModule extends Module {
  constructor() {
    super('striate', 'Granular', {
      strudelName: 'striate',
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('slices', 'Slices', 1, 64, 4, 1));
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.striate(${this.knobs.slices.value})`;
  }
}
