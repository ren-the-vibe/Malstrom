import { Module } from '../module.js';

const SAMPLE_BANKS = {
  drums: ['bd', 'sd', 'hh', 'oh', 'cp', 'cb', 'rs', 'lt', 'mt', 'ht', 'cr', 'rd'],
  percussion: ['tabla', 'tabla2', 'hand', 'east'],
  bass: ['bass', 'bass1', 'bass2', 'bass3'],
  keys: ['piano', 'rhodes', 'organ'],
  strings: ['strings', 'violin'],
  pads: ['pad', 'ambient'],
  misc: ['metal', 'industrial', 'glitch', 'noise']
};

export class SamplerModule extends Module {
  constructor() {
    super('sampler', 'Sampler', {
      inputs: [{ name: 'in', type: 'pattern', label: 'pattern' }],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createSelect('bank', Object.keys(SAMPLE_BANKS), 'drums'));
    div.appendChild(this.createSelect('sample', SAMPLE_BANKS.drums, 'bd'));
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('n', 'N', 0, 15, 0, 1));
    div.appendChild(row);

    // Update sample list when bank changes
    this.selects.bank.addEventListener('change', () => {
      const bank = this.selects.bank.value;
      const sampleSelect = this.selects.sample;
      sampleSelect.innerHTML = '';
      for (const s of (SAMPLE_BANKS[bank] || [])) {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        sampleSelect.appendChild(opt);
      }
    });

    return div;
  }

  compile(inputCode) {
    const sample = this.selects.sample?.value || 'bd';
    const n = Math.round(this.knobs.n.value);
    let code = inputCode || '"x"';
    code = `${code}.s("${sample}")`;
    if (n > 0) code += `.n(${n})`;
    return code;
  }
}
