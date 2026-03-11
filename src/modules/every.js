import { Module } from '../module.js';

export class EveryModule extends Module {
  constructor() {
    super('every', 'Every N', {
      strudelName: 'every',
      inputs: [
        { name: 'in', type: 'pattern', label: 'in' },
        { name: 'effect', type: 'pattern', label: 'effect' }
      ],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('count', 'N', 2, 16, 4, 1));
    return div;
  }

  compile(inputCode, effectCode) {
    if (!inputCode) return null;
    const n = this.knobs.count.value;
    if (effectCode) {
      return `${inputCode}.every(${n}, x => ${effectCode.replace(/^.*?\./, 'x.')})`;
    }
    return `${inputCode}.every(${n}, x => x)`;
  }
}
