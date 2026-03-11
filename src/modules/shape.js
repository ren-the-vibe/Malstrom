import { Module } from '../module.js';

export class ShapeModule extends Module {
  constructor() {
    super('shape', 'Shape', {
      inputs: [
        { name: 'in', type: 'audio', label: 'in' },
        { name: 'mod', type: 'control', label: 'mod' }
      ],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('amount', 'Amount', 0, 1, 0.3, 0.05));
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const amount = modCode || this.knobs.amount.value;
    return `${inputCode}.shape(${amount})`;
  }
}
