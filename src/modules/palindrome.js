import { Module } from '../module.js';

export class PalindromeModule extends Module {
  constructor() {
    super('palindrome', 'Palindrome', {
      strudelName: 'palindrome',
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    return null;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.palindrome()`;
  }
}
