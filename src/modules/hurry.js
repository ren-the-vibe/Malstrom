import { Module } from '../module.js';

export class HurryModule extends Module {
  constructor() {
    super('hurry', 'Hurry', {
      strudelName: 'hurry',
      inputs: [
        { name: 'in', type: 'pattern', label: 'in' },
        { name: 'mod', type: 'control', label: 'mod' }
      ],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('factor', 'Factor', 0.25, 16, 2, 0.25));
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const val = modCode || this.knobs.factor.value;
    return `${inputCode}.hurry(${val})`;
  }
}
