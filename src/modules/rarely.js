import { Module } from '../module.js';

export class RarelyModule extends Module {
  constructor() {
    super('probability', 'Probability', {
      strudelName: 'rarely',
      inputs: [
        { name: 'in', type: 'pattern', label: 'in' },
        { name: 'effect', type: 'pattern', label: 'effect' }
      ],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createSelect('mode', ['almostNever', 'rarely', 'often', 'almostAlways'], 'rarely'));
    return div;
  }

  compile(inputCode, effectCode) {
    if (!inputCode) return null;
    const mode = this.selects.mode?.value || 'rarely';
    if (effectCode) {
      return `${inputCode}.${mode}(x => ${effectCode.replace(/^.*?\./, 'x.')})`;
    }
    return `${inputCode}.${mode}(x => x)`;
  }
}
