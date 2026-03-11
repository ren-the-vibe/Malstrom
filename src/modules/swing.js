import { Module } from '../module.js';

export class SwingModule extends Module {
  constructor() {
    super('swing', 'Swing', {
      strudelName: 'swing',
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('amount', 'Amt', 0, 1, 0.5, 0.01));
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.swing(${this.knobs.amount.value})`;
  }
}
