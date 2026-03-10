import { Module } from '../module.js';

export class SpectrumModule extends Module {
  constructor() {
    super('spectrum', 'Spectrum', {
      inputs: [{ name: 'in', type: 'audio', label: 'in' }],
      outputs: [{ name: 'out', type: 'audio', label: 'thru' }]
    });
    this.canvas = null;
  }

  renderBody() {
    const div = document.createElement('div');
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'viz-canvas';
    this.canvas.width = 280;
    this.canvas.height = 80;
    div.appendChild(this.canvas);

    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 280, 80);
    ctx.fillStyle = '#444466';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Spectrum Analyzer', 140, 44);

    return div;
  }

  compile(inputCode) {
    return inputCode || null;
  }
}
