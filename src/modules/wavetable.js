import { Module } from '../module.js';

if (!window.__malstromModules) window.__malstromModules = new Map();

const WAVETABLES = [
  'saw', 'square', 'tri', 'sine',
  'akwf_0001', 'akwf_0002', 'akwf_0003', 'akwf_0004', 'akwf_0005',
  'akwf_0010', 'akwf_0020', 'akwf_0050', 'akwf_0100'
];

export class WavetableModule extends Module {
  constructor() {
    super('wavetable', 'Wavetable', {
      inputs: [{ name: 'in', type: 'pattern', label: 'pattern' }],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createSelect('table', WAVETABLES, 'saw'));

    this._flashEl = document.createElement('div');
    this._flashEl.className = 'module-trigger-flash';
    div.appendChild(this._flashEl);

    window.__malstromModules.set(this.id, this);
    return div;
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
    const table = this.selects.table?.value || 'saw';
    let code = inputCode || 'note("c3 e3 g3")';
    return `${code}.s("${table}")`;
  }
}
