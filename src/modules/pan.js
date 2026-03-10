import { Module } from '../module.js';

export class PanModule extends Module {
  constructor() {
    super('pan', 'Pan', {
      inputs: [
        { name: 'in', type: 'audio', label: 'in' },
        { name: 'mod', type: 'control', label: 'mod' }
      ],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('position', 'Pan', 0, 1, 0.5, 0.05));
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const val = modCode || this.knobs.position.value;
    return `${inputCode}.pan(${val})`;
  }
}
