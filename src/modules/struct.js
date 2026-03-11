import { Module } from '../module.js';

export class StructModule extends Module {
  constructor() {
    super('struct', 'Rhythmic Gate', {
      strudelName: 'struct',
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
      return `${inputCode}.struct(${modCode})`;
    }
    return inputCode;
  }
}
