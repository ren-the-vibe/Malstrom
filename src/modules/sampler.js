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

// Shared registry for CDN-loaded sample packs (populated by sample browser)
export const loadedPacks = new Map(); // packName -> [sampleNames]

if (!window.__malstromModules) window.__malstromModules = new Map();

function getAllBankNames() {
  return [...Object.keys(SAMPLE_BANKS), ...loadedPacks.keys()];
}

function getSamplesForBank(bank) {
  if (SAMPLE_BANKS[bank]) return SAMPLE_BANKS[bank];
  if (loadedPacks.has(bank)) return loadedPacks.get(bank);
  return [];
}

export class SamplerModule extends Module {
  constructor() {
    super('sampler', 'Sampler', {
      inputs: [{ name: 'in', type: 'pattern', label: 'pattern' }],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createSelect('bank', getAllBankNames(), 'drums'));
    div.appendChild(this.createSelect('sample', SAMPLE_BANKS.drums, 'bd'));
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('n', 'N', 0, 15, 0, 1));
    div.appendChild(row);

    // Trigger flash indicator
    this._flashEl = document.createElement('div');
    this._flashEl.className = 'module-trigger-flash';
    div.appendChild(this._flashEl);

    // Update sample list when bank changes
    this.selects.bank.addEventListener('change', () => {
      const bank = this.selects.bank.value;
      const sampleSelect = this.selects.sample;
      sampleSelect.innerHTML = '';
      for (const s of getSamplesForBank(bank)) {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        sampleSelect.appendChild(opt);
      }
    });

    // Listen for CDN sample pack updates
    this._samplesUpdatedHandler = () => this._refreshBankList();
    document.addEventListener('malstrom:samples-updated', this._samplesUpdatedHandler);

    // Register for trigger events
    window.__malstromModules.set(this.id, this);

    return div;
  }

  _refreshBankList() {
    const bankSelect = this.selects.bank;
    if (!bankSelect) return;
    const currentBank = bankSelect.value;
    bankSelect.innerHTML = '';
    for (const name of getAllBankNames()) {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      if (name === currentBank) opt.selected = true;
      bankSelect.appendChild(opt);
    }
  }

  flashTrigger() {
    if (!this._flashEl) return;
    this._flashEl.classList.remove('triggered');
    void this._flashEl.offsetWidth;
    this._flashEl.classList.add('triggered');
  }

  resetTrigger() {
    this._flashEl?.classList.remove('triggered');
  }

  compile(inputCode) {
    const sample = this.selects.sample?.value || 'bd';
    const n = Math.round(this.knobs.n.value);
    let code;
    if (inputCode) {
      code = `${inputCode}.s("${sample}")`;
    } else {
      code = `s("${sample}")`;
    }
    if (n > 0) code += `.n(${n})`;
    return code;
  }
}
