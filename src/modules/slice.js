import { Module } from '../module.js';

export class SliceModule extends Module {
  constructor() {
    super('slice', 'Slice', {
      strudelName: 'slice',
      inputs: [
        { name: 'in', type: 'pattern', label: 'in' },
        { name: 'mod', type: 'control', label: 'mod' }
      ],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('slices', 'Slices', 1, 64, 8, 1));
    return div;
  }

  compile(inputCode, modCode) {
    if (!inputCode) return null;
    const n = this.knobs.slices.value;
    const pat = modCode || `"0 1 2 3".scale(0, ${n})`;
    return `${inputCode}.slice(${n}, ${pat})`;
  }
}
