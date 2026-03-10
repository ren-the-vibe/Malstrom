import { Module } from '../module.js';

export class NoteModule extends Module {
  constructor() {
    super('note', 'Note', {
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createTextInput('notes', 'e.g. c3 e3 g3', 'c3 e3 g3'));
    return div;
  }

  compile(inputCode) {
    const notes = this.textInputs.notes?.value || '';
    if (!notes.trim()) return inputCode;
    if (inputCode) return `${inputCode}.note("${notes.trim()}")`;
    return `note("${notes.trim()}")`;
  }
}
