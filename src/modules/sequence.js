import { Module } from '../module.js';

export class SequenceModule extends Module {
  constructor() {
    super('sequence', 'Sequence', {
      inputs: [],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createTextInput('pattern', 'e.g. c3 e3 g3 c4', 'c3 e3 g3 c4'));
    return div;
  }

  compile() {
    const pattern = this.textInputs.pattern?.value || '';
    if (!pattern.trim()) return null;
    return `"${pattern.trim()}"`;
  }
}
