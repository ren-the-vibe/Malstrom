import { Module } from '../module.js';

export class NoiseModule extends Module {
  constructor() {
    super('noise', 'Noise', {
      inputs: [],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createSelect('type', ['white', 'pink', 'brown', 'crackle'], 'white'));
    return div;
  }

  compile() {
    const type = this.selects.type?.value || 'white';
    if (type === 'crackle') return `s("crackle")`;
    return `s("${type}noise")`;
  }
}
