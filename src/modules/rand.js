import { Module } from '../module.js';

export class RandModule extends Module {
  constructor() {
    super('rand', 'Random', {
      strudelName: 'rand',
      inputs: [],
      outputs: [{ name: 'out', type: 'control', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createSelect('mode', ['continuous', 'integer'], 'continuous'));
    div.appendChild(this.createKnob('max', 'Max', 1, 128, 1, 1));
    return div;
  }

  compile() {
    const mode = this.selects.mode?.value || 'continuous';
    const max = this.knobs.max.value;
    if (mode === 'integer') {
      return `irand(${max})`;
    }
    return max === 1 ? 'rand' : `rand.mul(${max})`;
  }
}
