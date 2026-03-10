// Module Registry — all module types + metadata for palette

import { SequenceModule } from './sequence.js';
import { NoteModule } from './note.js';
import { StackModule } from './stack.js';
import { CatModule } from './cat.js';
import { EuclidModule } from './euclid.js';
import { MiniModule } from './mini.js';
import { SlowModule } from './slow.js';
import { FastModule } from './fast.js';
import { RevModule } from './rev.js';
import { ZoomModule } from './zoom.js';
import { SometimesModule } from './sometimes.js';
import { DegradeModule } from './degrade.js';
import { ChooseModule } from './choose.js';
import { SynthModule } from './synth.js';
import { NoiseModule } from './noise.js';
import { SamplerModule } from './sampler.js';
import { WavetableModule } from './wavetable.js';
import { ADSRModule } from './adsr.js';
import { LFOModule } from './lfo.js';
import { PerlinModule } from './perlin.js';
import { RangeModule } from './range.js';
import { FilterModule } from './filter.js';
import { VowelModule } from './vowel.js';
import { ReverbModule } from './reverb.js';
import { DelayModule } from './delay.js';
import { DistortionModule } from './distortion.js';
import { ShapeModule } from './shape.js';
import { CrushModule } from './crush.js';
import { CoarseModule } from './coarse.js';
import { TremoloModule } from './tremolo.js';
import { PhaserModule } from './phaser.js';
import { PanModule } from './pan.js';
import { CompressorModule } from './compressor.js';
import { GainModule } from './gain.js';
import { KeyboardModule } from './keyboard.js';
import { PadGridModule } from './pad-grid.js';
import { OutputModule } from './output.js';
import { MidiOutModule } from './midi-out.js';
import { MidiInModule } from './midi-in.js';
import { OscOutModule } from './osc-out.js';
import { PianoRollModule } from './piano-roll.js';
import { ScopeModule } from './scope.js';
import { SpectrumModule } from './spectrum.js';
import { SpiralModule } from './spiral.js';
import { OrbitModule } from './orbit.js';
import { MergeModule } from './merge.js';

export const MODULE_CATEGORIES = [
  {
    name: 'Pattern',
    cssClass: 'cat-pattern',
    modules: [
      { type: 'sequence', label: 'Sequence', create: () => new SequenceModule() },
      { type: 'note', label: 'Note', create: () => new NoteModule() },
      { type: 'stack', label: 'Stack', create: () => new StackModule() },
      { type: 'cat', label: 'Cat', create: () => new CatModule() },
      { type: 'euclid', label: 'Euclid', create: () => new EuclidModule() },
      { type: 'mini', label: 'Mini', create: () => new MiniModule() },
    ]
  },
  {
    name: 'Time',
    cssClass: 'cat-time',
    modules: [
      { type: 'slow', label: 'Slow', create: () => new SlowModule() },
      { type: 'fast', label: 'Fast', create: () => new FastModule() },
      { type: 'rev', label: 'Reverse', create: () => new RevModule() },
      { type: 'zoom', label: 'Zoom', create: () => new ZoomModule() },
    ]
  },
  {
    name: 'Random',
    cssClass: 'cat-random',
    modules: [
      { type: 'sometimes', label: 'Sometimes', create: () => new SometimesModule() },
      { type: 'degrade', label: 'Degrade', create: () => new DegradeModule() },
      { type: 'choose', label: 'Choose', create: () => new ChooseModule() },
    ]
  },
  {
    name: 'Source',
    cssClass: 'cat-source',
    modules: [
      { type: 'synth', label: 'Synth', create: () => new SynthModule() },
      { type: 'noise', label: 'Noise', create: () => new NoiseModule() },
      { type: 'sampler', label: 'Sampler', create: () => new SamplerModule() },
      { type: 'wavetable', label: 'Wavetable', create: () => new WavetableModule() },
    ]
  },
  {
    name: 'Envelope',
    cssClass: 'cat-envelope',
    modules: [
      { type: 'adsr', label: 'ADSR', create: () => new ADSRModule() },
      { type: 'lfo', label: 'LFO', create: () => new LFOModule() },
      { type: 'perlin', label: 'Perlin', create: () => new PerlinModule() },
      { type: 'range', label: 'Range', create: () => new RangeModule() },
    ]
  },
  {
    name: 'Effect',
    cssClass: 'cat-effect',
    modules: [
      { type: 'filter', label: 'Filter', create: () => new FilterModule() },
      { type: 'vowel', label: 'Vowel', create: () => new VowelModule() },
      { type: 'reverb', label: 'Reverb', create: () => new ReverbModule() },
      { type: 'delay', label: 'Delay', create: () => new DelayModule() },
      { type: 'distortion', label: 'Distortion', create: () => new DistortionModule() },
      { type: 'shape', label: 'Shape', create: () => new ShapeModule() },
      { type: 'crush', label: 'Crush', create: () => new CrushModule() },
      { type: 'coarse', label: 'Coarse', create: () => new CoarseModule() },
      { type: 'tremolo', label: 'Tremolo', create: () => new TremoloModule() },
      { type: 'phaser', label: 'Phaser', create: () => new PhaserModule() },
      { type: 'pan', label: 'Pan', create: () => new PanModule() },
      { type: 'compressor', label: 'Compressor', create: () => new CompressorModule() },
      { type: 'gain', label: 'Gain', create: () => new GainModule() },
    ]
  },
  {
    name: 'Instrument',
    cssClass: 'cat-instrument',
    modules: [
      { type: 'keyboard', label: 'Keyboard', create: () => new KeyboardModule() },
      { type: 'pad-grid', label: 'Pad Grid', create: () => new PadGridModule() },
    ]
  },
  {
    name: 'I/O',
    cssClass: 'cat-io',
    modules: [
      { type: 'output', label: 'Output', create: () => new OutputModule() },
      { type: 'midi-out', label: 'MIDI Out', create: () => new MidiOutModule() },
      { type: 'midi-in', label: 'MIDI In', create: () => new MidiInModule() },
      { type: 'osc-out', label: 'OSC Out', create: () => new OscOutModule() },
    ]
  },
  {
    name: 'Visualize',
    cssClass: 'cat-viz',
    modules: [
      { type: 'piano-roll', label: 'Piano Roll', create: () => new PianoRollModule() },
      { type: 'scope', label: 'Scope', create: () => new ScopeModule() },
      { type: 'spectrum', label: 'Spectrum', create: () => new SpectrumModule() },
      { type: 'spiral', label: 'Spiral', create: () => new SpiralModule() },
    ]
  },
  {
    name: 'Utility',
    cssClass: 'cat-utility',
    modules: [
      { type: 'orbit', label: 'Orbit', create: () => new OrbitModule() },
      { type: 'merge', label: 'Merge', create: () => new MergeModule() },
    ]
  }
];

export function createModule(type) {
  for (const cat of MODULE_CATEGORIES) {
    for (const mod of cat.modules) {
      if (mod.type === type) return mod.create();
    }
  }
  return null;
}
