import { Module } from '../module.js';

export class PhaserModule extends Module {
  constructor() {
    super('phaser', 'Phaser', {
      inputs: [
        { name: 'in', type: 'audio', label: 'in' },
        { name: 'mod', type: 'control', label: 'mod' }
      ],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('rate', 'Rate', 0.1, 20, 1, 0.1));
    row.appendChild(this.createKnob('depth', 'Depth', 0, 1, 0.5, 0.05));
    div.appendChild(row);
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const rate = modCode || this.knobs.rate.value;
    return `${inputCode}.phaser(${rate}, ${this.knobs.depth.value})`;
  }
}
