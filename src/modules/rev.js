import { Module } from '../module.js';

export class RevModule extends Module {
  constructor() {
    super('rev', 'Reverse', {
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.rev()`;
  }
}
