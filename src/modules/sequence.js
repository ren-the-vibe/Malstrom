import { Module } from '../module.js';

// Global registry: modules register to receive trigger flash events
if (!window.__malstromModules) window.__malstromModules = new Map();

export class SequenceModule extends Module {
  constructor() {
    super('sequence', 'Sequence', {
      inputs: [],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
    this._noteTokenEls = [];
    this._triggerIndex = 0;
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createTextInput('pattern', 'e.g. c3 e3 g3 c4', 'c3 e3 g3 c4'));

    // Note token display (for per-note flash)
    this._tokenRow = document.createElement('div');
    this._tokenRow.className = 'note-token-row';
    div.appendChild(this._tokenRow);

    this._rebuildTokens();
    this.textInputs.pattern.addEventListener('input', () => this._rebuildTokens());

    // Register for trigger events
    window.__malstromModules.set(this.id, this);

    return div;
  }

  _rebuildTokens() {
    this._tokenRow.innerHTML = '';
    this._noteTokenEls = [];
    const pattern = this.textInputs.pattern?.value || '';
    const tokens = pattern.trim().split(/\s+/).filter(Boolean);
    for (const token of tokens) {
      const span = document.createElement('span');
      span.className = 'note-token';
      span.textContent = token;
      span.dataset.note = token;
      this._noteTokenEls.push(span);
      this._tokenRow.appendChild(span);
    }
    this._triggerIndex = 0;
  }

  // Called by the global trigger handler
  flashTrigger(value) {
    if (this._noteTokenEls.length === 0) return;
    // Advance through tokens sequentially
    const el = this._noteTokenEls[this._triggerIndex % this._noteTokenEls.length];
    if (el) {
      el.classList.remove('triggered');
      // Force reflow to restart animation
      void el.offsetWidth;
      el.classList.add('triggered');
    }
    this._triggerIndex++;
  }

  resetTrigger() {
    this._triggerIndex = 0;
    this._noteTokenEls.forEach(el => el.classList.remove('triggered'));
  }

  compile() {
    const pattern = this.textInputs.pattern?.value || '';
    if (!pattern.trim()) return null;
    return `note("${pattern.trim()}")`;
  }
}
