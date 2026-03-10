import { Module } from '../module.js';

export class StackModule extends Module {
  constructor() {
    super('stack', 'Stack', {
      inputs: [
        { name: 'in1', type: 'pattern', label: 'in 1' },
        { name: 'in2', type: 'pattern', label: 'in 2' },
        { name: 'in3', type: 'pattern', label: 'in 3' },
        { name: 'in4', type: 'pattern', label: 'in 4' }
      ],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  compile(inputs) {
    // inputs is an array of compiled code strings from connected inputs
    const valid = (inputs || []).filter(Boolean);
    if (valid.length === 0) return null;
    if (valid.length === 1) return valid[0];
    return `stack(${valid.join(', ')})`;
  }
}
