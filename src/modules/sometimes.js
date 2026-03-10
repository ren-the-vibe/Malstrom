import { Module } from '../module.js';

export class SometimesModule extends Module {
  constructor() {
    super('sometimes', 'Sometimes', {
      inputs: [
        { name: 'in', type: 'pattern', label: 'in' },
        { name: 'effect', type: 'pattern', label: 'effect' }
      ],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createSelect('mode', ['sometimes', 'often', 'rarely', 'sometimesBy'], 'sometimes'));
    div.appendChild(this.createKnob('probability', 'Prob', 0, 1, 0.5, 0.05));
    return div;
  }

  compile(inputCode, effectCode) {
    if (!inputCode) return null;
    const mode = this.selects.mode?.value || 'sometimes';
    if (mode === 'sometimesBy') {
      const prob = this.knobs.probability.value;
      return effectCode
        ? `${inputCode}.sometimesBy(${prob}, x => ${effectCode.replace(/^.*?\./, 'x.')})`
        : `${inputCode}.sometimesBy(${prob}, x => x)`;
    }
    return effectCode
      ? `${inputCode}.${mode}(x => ${effectCode.replace(/^.*?\./, 'x.')})`
      : `${inputCode}.${mode}(x => x)`;
  }
}
