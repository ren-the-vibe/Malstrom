import { Module } from '../module.js';

const WHITE_NOTES = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
const BLACK_NOTE_OFFSETS = [
  { note: 'db', offset: 14 },
  { note: 'eb', offset: 34 },
  { note: 'gb', offset: 74 },
  { note: 'ab', offset: 94 },
  { note: 'bb', offset: 114 }
];

const KEY_MAP = {
  'a': 'c', 'w': 'db', 's': 'd', 'e': 'eb', 'd': 'e',
  'f': 'f', 't': 'gb', 'g': 'g', 'y': 'ab', 'h': 'a',
  'u': 'bb', 'j': 'b', 'k': 'c5', 'o': 'db5', 'l': 'd5'
};

export class KeyboardModule extends Module {
  constructor() {
    super('keyboard', 'Keyboard', {
      inputs: [],
      outputs: [{ name: 'out', type: 'pattern', label: 'notes' }]
    });
    this.activeNotes = new Set();
    this.octave = 4;
    this.keyEls = {};
  }

  renderBody() {
    const div = document.createElement('div');

    // Octave selector
    const octRow = document.createElement('div');
    octRow.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:4px;';
    const octLabel = document.createElement('span');
    octLabel.className = 'jack-label';
    octLabel.textContent = 'OCT';
    const octSelect = this.createSelect('octave', ['2', '3', '4', '5', '6'], '4');
    octSelect.style.width = '50px';
    octRow.appendChild(octLabel);
    octRow.appendChild(octSelect);
    div.appendChild(octRow);

    // Keyboard
    const kb = document.createElement('div');
    kb.className = 'keyboard';
    kb.style.width = '160px';

    // White keys (2 octaves = 14 keys)
    for (let i = 0; i < 14; i++) {
      const key = document.createElement('div');
      key.className = 'key white';
      const noteName = WHITE_NOTES[i % 7];
      const oct = this.octave + Math.floor(i / 7);
      key.dataset.note = `${noteName}${oct}`;
      key.style.left = `${i * 20}px`;
      key.style.position = 'absolute';
      this.keyEls[`${noteName}${oct}`] = key;

      key.addEventListener('mousedown', (e) => { this._noteOn(key.dataset.note); e.preventDefault(); });
      key.addEventListener('mouseup', () => this._noteOff(key.dataset.note));
      key.addEventListener('mouseleave', () => this._noteOff(key.dataset.note));
      kb.appendChild(key);
    }

    // Black keys (2 octaves)
    for (let oct = 0; oct < 2; oct++) {
      for (const bk of BLACK_NOTE_OFFSETS) {
        const key = document.createElement('div');
        key.className = 'key black';
        const noteOct = this.octave + oct;
        key.dataset.note = `${bk.note}${noteOct}`;
        key.style.left = `${bk.offset + oct * 140}px`;
        this.keyEls[`${bk.note}${noteOct}`] = key;

        key.addEventListener('mousedown', (e) => { this._noteOn(key.dataset.note); e.preventDefault(); });
        key.addEventListener('mouseup', () => this._noteOff(key.dataset.note));
        key.addEventListener('mouseleave', () => this._noteOff(key.dataset.note));
        kb.appendChild(key);
      }
    }

    kb.style.width = '280px';
    div.appendChild(kb);

    // Computer keyboard listener
    this._keydownHandler = (e) => {
      if (e.repeat) return;
      const mapped = KEY_MAP[e.key.toLowerCase()];
      if (mapped) {
        const oct = this.selects.octave?.value || '4';
        const fullNote = mapped.includes('5') ? mapped.replace('5', String(Number(oct) + 1)) : `${mapped}${oct}`;
        this._noteOn(fullNote);
      }
    };
    this._keyupHandler = (e) => {
      const mapped = KEY_MAP[e.key.toLowerCase()];
      if (mapped) {
        const oct = this.selects.octave?.value || '4';
        const fullNote = mapped.includes('5') ? mapped.replace('5', String(Number(oct) + 1)) : `${mapped}${oct}`;
        this._noteOff(fullNote);
      }
    };
    document.addEventListener('keydown', this._keydownHandler);
    document.addEventListener('keyup', this._keyupHandler);

    return div;
  }

  _noteOn(note) {
    this.activeNotes.add(note);
    const el = this.keyEls[note];
    if (el) el.classList.add('active');
    if (this.onChange) this.onChange();
  }

  _noteOff(note) {
    this.activeNotes.delete(note);
    const el = this.keyEls[note];
    if (el) el.classList.remove('active');
    if (this.onChange) this.onChange();
  }

  compile() {
    if (this.activeNotes.size === 0) {
      // Return a default pattern based on no active notes
      return null;
    }
    const notes = Array.from(this.activeNotes).join(' ');
    return `note("${notes}")`;
  }
}
