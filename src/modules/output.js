import { Module } from '../module.js';

export class OutputModule extends Module {
  constructor() {
    super('output', 'Output', {
      inputs: [{ name: 'in', type: 'audio', label: 'in' }],
      outputs: []
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('orbit', 'Orbit', 0, 11, 0, 1));
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('gain', 'Gain', 0, 2, 0.8, 0.05));
    div.appendChild(row);
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    const orbit = Math.round(this.knobs.orbit.value);
    const gain = parseFloat(this.knobs.gain.value.toFixed(4));
    let code = inputCode;
    if (orbit > 0) code += `.orbit(${orbit})`;
    if (Math.abs(gain - 0.8) > 0.001) code += `.gain(${gain})`;
    return code;
  }
}
