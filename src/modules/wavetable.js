import { Module } from '../module.js';

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
    return div;
  }

  compile(inputCode) {
    const table = this.selects.table?.value || 'saw';
    let code = inputCode || '"c3 e3 g3"';
    return `${code}.s("${table}")`;
  }
}
