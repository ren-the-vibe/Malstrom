import { Module } from '../module.js';

export class FitModule extends Module {
  constructor() {
    super('fit', 'Fit', {
      strudelName: 'fit',
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    return null;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.fit()`;
  }
}
