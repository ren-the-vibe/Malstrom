import { Module } from '../module.js';

export class DegradeModule extends Module {
  constructor() {
    super('degrade', 'Degrade', {
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('amount', 'Amount', 0, 1, 0.5, 0.05));
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.degradeBy(${this.knobs.amount.value})`;
  }
}
