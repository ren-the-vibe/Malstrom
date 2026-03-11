import { Module } from '../module.js';

export class ReverbModule extends Module {
  constructor() {
    super('reverb', 'Reverb', {
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
    row.appendChild(this.createKnob('room', 'Room', 0, 1, 0.5, 0.05));
    row.appendChild(this.createKnob('size', 'Size', 0, 4, 2, 0.1));
    div.appendChild(row);
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const room = modCode || this.knobs.room.value;
    const size = this.knobs.size.value;
    return `${inputCode}.room(${room}).roomsize(${size})`;
  }
}
