import { Module } from '../module.js';

export class PlyModule extends Module {
  constructor() {
    super('ply', 'Multiply', {
      strudelName: 'ply',
      inputs: [
        { name: 'in', type: 'pattern', label: 'in' },
        { name: 'mod', type: 'control', label: 'mod' }
      ],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('count', 'Count', 1, 8, 2, 1));
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const val = modCode || this.knobs.count.value;
    return `${inputCode}.ply(${val})`;
  }
}
