import { Module } from '../module.js';

export class CrushModule extends Module {
  constructor() {
    super('crush', 'Crush', {
      inputs: [{ name: 'in', type: 'audio', label: 'in' }],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('bits', 'Bits', 1, 16, 8, 1));
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.crush(${Math.round(this.knobs.bits.value)})`;
  }
}
