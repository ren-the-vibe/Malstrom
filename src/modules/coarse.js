import { Module } from '../module.js';

export class CoarseModule extends Module {
  constructor() {
    super('coarse', 'Coarse', {
      inputs: [{ name: 'in', type: 'audio', label: 'in' }],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('factor', 'Factor', 1, 32, 4, 1));
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.coarse(${Math.round(this.knobs.factor.value)})`;
  }
}
