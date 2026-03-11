import { Module } from '../module.js';

export class ScrubModule extends Module {
  constructor() {
    super('scrub', 'Scrub', {
      strudelName: 'scrub',
      inputs: [
        { name: 'in', type: 'pattern', label: 'in' },
        { name: 'mod', type: 'control', label: 'mod' }
      ],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('speed', 'Speed', 0.1, 4, 1, 0.1));
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const pos = modCode || this.knobs.speed.value;
    return `${inputCode}.scrub(${pos})`;
  }
}
