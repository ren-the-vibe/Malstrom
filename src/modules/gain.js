import { Module } from '../module.js';

export class GainModule extends Module {
  constructor() {
    super('gain', 'Gain', {
      inputs: [
        { name: 'in', type: 'audio', label: 'in' },
        { name: 'mod', type: 'control', label: 'mod' }
      ],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('volume', 'Vol', 0, 2, 0.8, 0.05));
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const val = modCode || this.knobs.volume.value;
    return `${inputCode}.gain(${val})`;
  }
}
