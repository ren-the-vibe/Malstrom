import { Module } from '../module.js';

export class OrbitModule extends Module {
  constructor() {
    super('orbit', 'Orbit', {
      inputs: [
        { name: 'in', type: 'audio', label: 'in' },
        { name: 'mod', type: 'control', label: 'mod' }
      ],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('number', 'Orbit', 0, 11, 0, 1));
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const num = modCode || Math.round(this.knobs.number.value);
    return `${inputCode}.orbit(${num})`;
  }
}
