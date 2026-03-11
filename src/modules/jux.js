import { Module } from '../module.js';

export class JuxModule extends Module {
  constructor() {
    super('jux', 'Stereo Split', {
      strudelName: 'jux',
      inputs: [
        { name: 'in', type: 'pattern', label: 'in' },
        { name: 'effect', type: 'pattern', label: 'effect' }
      ],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    return null;
  }

  compile(inputCode, effectCode) {
    if (!inputCode) return null;
    if (effectCode) {
      return `${inputCode}.jux(x => ${effectCode.replace(/^.*?\./, 'x.')})`;
    }
    return `${inputCode}.jux(x => x)`;
  }
}
