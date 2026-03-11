import { Module } from '../module.js';

export class SquizModule extends Module {
  constructor() {
    super('squiz', 'Squiz', {
      strudelName: 'squiz',
      inputs: [
        { name: 'in', type: 'audio', label: 'in' },
        { name: 'mod', type: 'control', label: 'mod' }
      ],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('amount', 'Amt', 1, 64, 2, 1));
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const val = modCode || this.knobs.amount.value;
    return `${inputCode}.squiz(${val})`;
  }
}
