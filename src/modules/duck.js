import { Module } from '../module.js';

export class DuckModule extends Module {
  constructor() {
    super('duck', 'Sidechain', {
      strudelName: 'duck',
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
    row.appendChild(this.createKnob('depth', 'Depth', 0, 1, 0.5, 0.01));
    row.appendChild(this.createKnob('attack', 'Atk', 0, 1, 0.1, 0.01));
    div.appendChild(row);
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const ratio = modCode || '"4:3:2"';
    const d = this.knobs.depth.value;
    const a = this.knobs.attack.value;
    return `${inputCode}.duck(${ratio}).duckdepth(${d}).duckattack(${a})`;
  }
}
