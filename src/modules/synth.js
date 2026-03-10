import { Module } from '../module.js';

export class SynthModule extends Module {
  constructor() {
    super('synth', 'Synth', {
      inputs: [
        { name: 'in', type: 'pattern', label: 'pattern' },
        { name: 'mod', type: 'control', label: 'fm mod' }
      ],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createSelect('waveform', ['sine', 'sawtooth', 'square', 'triangle'], 'sawtooth'));
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('fmDepth', 'FM', 0, 10, 0, 0.1));
    div.appendChild(row);
    return div;
  }

  compile(inputCode) {
    const wave = this.selects.waveform?.value || 'sawtooth';
    const fm = this.knobs.fmDepth.value;
    let code = inputCode || '"c3 e3 g3"';
    code = `${code}.s("${wave}")`;
    if (fm > 0) code += `.fmh(${fm.toFixed(1)})`;
    return code;
  }
}
