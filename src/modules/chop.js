import { Module } from '../module.js';

export class ChopModule extends Module {
  constructor() {
    super('chop', 'Chop', {
      strudelName: 'chop',
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('slices', 'Slices', 1, 64, 8, 1));
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.chop(${this.knobs.slices.value})`;
  }
}
