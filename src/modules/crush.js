import { Module } from '../module.js';

export class CrushModule extends Module {
  constructor() {
    super('crush', 'Crush', {
      inputs: [
        { name: 'in', type: 'audio', label: 'in' },
        { name: 'mod', type: 'control', label: 'mod' }
      ],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('bits', 'Bits', 1, 16, 8, 1));
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const bits = modCode || Math.round(this.knobs.bits.value);
    return `${inputCode}.crush(${bits})`;
  }
}
