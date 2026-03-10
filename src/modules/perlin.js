import { Module } from '../module.js';

export class PerlinModule extends Module {
  constructor() {
    super('perlin', 'Perlin', {
      inputs: [],
      outputs: [{ name: 'out', type: 'control', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('speed', 'Speed', 0.1, 20, 1, 0.1));
    row.appendChild(this.createKnob('min', 'Min', 0, 20000, 200, 1));
    row.appendChild(this.createKnob('max', 'Max', 0, 20000, 4000, 1));
    div.appendChild(row);
    return div;
  }

  compile() {
    const speed = this.knobs.speed.value;
    const min = Math.round(this.knobs.min.value);
    const max = Math.round(this.knobs.max.value);
    return `perlin.range(${min}, ${max}).slow(${speed})`;
  }
}
