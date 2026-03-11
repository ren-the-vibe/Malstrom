import { Module } from '../module.js';

export class LayerModule extends Module {
  constructor() {
    super('layer', 'Layer', {
      strudelName: 'layer',
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
      return `${inputCode}.layer(x => x, x => ${effectCode.replace(/^.*?\./, 'x.')})`;
    }
    return inputCode;
  }
}
