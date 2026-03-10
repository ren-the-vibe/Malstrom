import { Module } from '../module.js';

export class FastModule extends Module {
  constructor() {
    super('fast', 'Fast', {
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('factor', 'Factor', 0.25, 16, 2, 0.25));
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.fast(${this.knobs.factor.value})`;
  }
}
