import { Module } from '../module.js';

export class OffModule extends Module {
  constructor() {
    super('off', 'Offset', {
      strudelName: 'off',
      inputs: [
        { name: 'in', type: 'pattern', label: 'in' },
        { name: 'effect', type: 'pattern', label: 'effect' }
      ],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('time', 'Time', 0, 1, 0.125, 0.01));
    return div;
  }

  compile(inputCode, effectCode) {
    if (!inputCode) return null;
    const t = this.knobs.time.value;
    if (effectCode) {
      return `${inputCode}.off(${t}, x => ${effectCode.replace(/^.*?\./, 'x.')})`;
    }
    return `${inputCode}.off(${t}, x => x)`;
  }
}
