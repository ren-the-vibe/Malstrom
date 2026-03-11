import { Module } from '../module.js';

export class DelayModule extends Module {
  constructor() {
    super('delay', 'Delay', {
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
    row.appendChild(this.createKnob('time', 'Time', 0, 1, 0.25, 0.01));
    row.appendChild(this.createKnob('feedback', 'FB', 0, 1, 0.5, 0.05));
    div.appendChild(row);
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const time = modCode || this.knobs.time.value;
    const fb = this.knobs.feedback.value;
    return `${inputCode}.delay(${time}).delayfeedback(${fb})`;
  }
}
