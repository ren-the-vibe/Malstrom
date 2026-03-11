import { Module } from '../module.js';

export class MaskModule extends Module {
  constructor() {
    super('mask', 'Mask', {
      strudelName: 'mask',
      inputs: [
        { name: 'in', type: 'pattern', label: 'in' },
        { name: 'mod', type: 'control', label: 'mod' }
      ],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    return null;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    if (modCode) {
      return `${inputCode}.mask(${modCode})`;
    }
    return inputCode;
  }
}
