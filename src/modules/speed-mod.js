import { Module } from '../module.js';

export class SpeedModule extends Module {
  constructor() {
    super('speed', 'Speed', {
      strudelName: 'speed',
      inputs: [
        { name: 'in', type: 'pattern', label: 'in' },
        { name: 'mod', type: 'control', label: 'mod' }
      ],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('speed', 'Speed', -4, 4, 1, 0.1));
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const val = modCode || this.knobs.speed.value;
    return `${inputCode}.speed(${val})`;
  }
}
