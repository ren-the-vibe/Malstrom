import { Module } from '../module.js';

export class CompressorModule extends Module {
  constructor() {
    super('compressor', 'Compressor', {
      inputs: [{ name: 'in', type: 'audio', label: 'in' }],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('threshold', 'Thr', -60, 0, -20, 1));
    row.appendChild(this.createKnob('ratio', 'Ratio', 1, 20, 4, 0.5));
    div.appendChild(row);
    const row2 = document.createElement('div');
    row2.className = 'knob-row';
    row2.appendChild(this.createKnob('attack', 'Atk', 0, 1, 0.003, 0.001));
    row2.appendChild(this.createKnob('release', 'Rel', 0, 1, 0.25, 0.01));
    div.appendChild(row2);
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    const t = Math.round(this.knobs.threshold.value);
    const r = this.knobs.ratio.value;
    const a = this.knobs.attack.value;
    const rel = this.knobs.release.value;
    return `${inputCode}.compressor(${t}, ${r}, ${a}, ${rel})`;
  }
}
