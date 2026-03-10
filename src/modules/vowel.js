import { Module } from '../module.js';

export class VowelModule extends Module {
  constructor() {
    super('vowel', 'Vowel', {
      inputs: [{ name: 'in', type: 'audio', label: 'in' }],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createSelect('vowel', ['a', 'e', 'i', 'o', 'u'], 'a'));
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.vowel("${this.selects.vowel?.value || 'a'}")`;
  }
}
