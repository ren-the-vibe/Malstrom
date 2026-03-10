import { Module } from '../module.js';

const DEFAULT_PADS = [
  'c3', 'd3', 'e3', 'f3',
  'g3', 'a3', 'b3', 'c4',
  'd4', 'e4', 'f4', 'g4',
  'a4', 'b4', 'c5', 'd5'
];

const PAD_KEYS = '1234qwerasdfzxcv';

export class PadGridModule extends Module {
  constructor() {
    super('pad-grid', 'Pad Grid', {
      inputs: [],
      outputs: [{ name: 'out', type: 'pattern', label: 'trigger' }]
    });
    this.activePads = new Set();
    this.padNotes = [...DEFAULT_PADS];
  }

  renderBody() {
    const div = document.createElement('div');
    const grid = document.createElement('div');
    grid.className = 'pad-grid';

    this.padEls = [];
    for (let i = 0; i < 16; i++) {
      const pad = document.createElement('div');
      pad.className = 'pad';
      pad.dataset.index = i;
      pad.title = `${this.padNotes[i]} [${PAD_KEYS[i]}]`;

      pad.addEventListener('mousedown', (e) => {
        this.activePads.add(i);
        pad.classList.add('active');
        if (this.onChange) this.onChange();
        e.preventDefault();
      });
      pad.addEventListener('mouseup', () => {
        this.activePads.delete(i);
        pad.classList.remove('active');
        if (this.onChange) this.onChange();
      });
      pad.addEventListener('mouseleave', () => {
        this.activePads.delete(i);
        pad.classList.remove('active');
      });

      this.padEls.push(pad);
      grid.appendChild(pad);
    }

    div.appendChild(grid);

    // Computer keyboard mapping
    this._keydownHandler = (e) => {
      if (e.repeat) return;
      const idx = PAD_KEYS.indexOf(e.key.toLowerCase());
      if (idx !== -1) {
        this.activePads.add(idx);
        this.padEls[idx].classList.add('active');
        if (this.onChange) this.onChange();
      }
    };
    this._keyupHandler = (e) => {
      const idx = PAD_KEYS.indexOf(e.key.toLowerCase());
      if (idx !== -1) {
        this.activePads.delete(idx);
        this.padEls[idx].classList.remove('active');
        if (this.onChange) this.onChange();
      }
    };
    document.addEventListener('keydown', this._keydownHandler);
    document.addEventListener('keyup', this._keyupHandler);

    return div;
  }

  compile() {
    if (this.activePads.size === 0) return null;
    const notes = Array.from(this.activePads).map(i => this.padNotes[i]).join(' ');
    return `note("${notes}")`;
  }
}
