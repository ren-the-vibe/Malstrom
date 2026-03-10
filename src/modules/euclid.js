import { Module } from '../module.js';

export class EuclidModule extends Module {
  constructor() {
    super('euclid', 'Euclid', {
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('hits', 'Hits', 1, 16, 3, 1));
    row.appendChild(this.createKnob('steps', 'Steps', 1, 16, 8, 1));
    row.appendChild(this.createKnob('rotation', 'Rot', 0, 15, 0, 1));
    div.appendChild(row);
    return div;
  }

  compile(inputCode) {
    const hits = Math.round(this.knobs.hits.value);
    const steps = Math.round(this.knobs.steps.value);
    const rotation = Math.round(this.knobs.rotation.value);
    const euclidCall = rotation > 0
      ? `.euclid(${hits}, ${steps}, ${rotation})`
      : `.euclid(${hits}, ${steps})`;
    return inputCode ? `${inputCode}${euclidCall}` : `"c3"${euclidCall}`;
  }
}
