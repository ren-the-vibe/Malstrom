import { Module } from '../module.js';

export class IterModule extends Module {
  constructor() {
    super('iter', 'Rotate', {
      strudelName: 'iter',
      inputs: [
        { name: 'in', type: 'pattern', label: 'in' },
        { name: 'mod', type: 'control', label: 'mod' }
      ],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('count', 'Count', 2, 16, 4, 1));
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const val = modCode || this.knobs.count.value;
    return `${inputCode}.iter(${val})`;
  }
}
