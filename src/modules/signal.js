import { Module } from '../module.js';

export class SignalModule extends Module {
  constructor() {
    super('signal', 'Signal', {
      strudelName: 'sine',
      inputs: [],
      outputs: [{ name: 'out', type: 'control', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createSelect('waveform', ['sine', 'saw', 'tri', 'square', 'rand', 'irand'], 'sine'));
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('min', 'Min', 0, 127, 0, 1));
    row.appendChild(this.createKnob('max', 'Max', 0, 127, 127, 1));
    row.appendChild(this.createKnob('segments', 'Seg', 1, 64, 16, 1));
    div.appendChild(row);
    return div;
  }

  compile() {
    const wave = this.selects.waveform?.value || 'sine';
    const min = this.knobs.min.value;
    const max = this.knobs.max.value;
    const seg = this.knobs.segments.value;
    return `${wave}.range(${min}, ${max}).segment(${seg})`;
  }
}
