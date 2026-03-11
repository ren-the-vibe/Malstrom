import { Module } from '../module.js';

export class SegmentModule extends Module {
  constructor() {
    super('segment', 'Quantize', {
      strudelName: 'segment',
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('count', 'Segs', 1, 64, 8, 1));
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.segment(${this.knobs.count.value})`;
  }
}
