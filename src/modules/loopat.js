import { Module } from '../module.js';

export class LoopAtModule extends Module {
  constructor() {
    super('loopat', 'Loop At', {
      strudelName: 'loopAt',
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('cycles', 'Cycles', 0.25, 16, 1, 0.25));
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.loopAt(${this.knobs.cycles.value})`;
  }
}
