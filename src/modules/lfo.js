import { Module } from '../module.js';

export class LFOModule extends Module {
  constructor() {
    super('lfo', 'LFO', {
      inputs: [],
      outputs: [{ name: 'out', type: 'control', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createSelect('waveform', ['sine', 'saw', 'square', 'tri'], 'sine'));
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('rate', 'Rate', 0.1, 20, 1, 0.1));
    row.appendChild(this.createKnob('min', 'Min', 0, 20000, 200, 1));
    row.appendChild(this.createKnob('max', 'Max', 0, 20000, 4000, 1));
    div.appendChild(row);
    return div;
  }

  compile() {
    const wave = this.selects.waveform?.value || 'sine';
    const rate = this.knobs.rate.value;
    const min = this.knobs.min.value;
    const max = this.knobs.max.value;
    return `${wave}.range(${Math.round(min)}, ${Math.round(max)}).slow(${rate})`;
  }
}
