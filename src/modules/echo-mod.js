import { Module } from '../module.js';

export class EchoModule extends Module {
  constructor() {
    super('echo', 'Echo', {
      strudelName: 'echo',
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('count', 'N', 1, 8, 3, 1));
    row.appendChild(this.createKnob('time', 'Time', 0, 1, 0.25, 0.01));
    row.appendChild(this.createKnob('feedback', 'FB', 0, 1, 0.5, 0.01));
    div.appendChild(row);
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    const n = this.knobs.count.value;
    const t = this.knobs.time.value;
    const fb = this.knobs.feedback.value;
    return `${inputCode}.echo(${n}, ${t}, ${fb})`;
  }
}
