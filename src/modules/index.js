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

// New modules
import { PalindromeModule } from './palindrome.js';
import { FitModule } from './fit.js';
import { SegmentModule } from './segment.js';
import { SwingModule } from './swing.js';
import { RibModule } from './rib.js';
import { LoopAtModule } from './loopat.js';
import { ChopModule } from './chop.js';
import { StriateModule } from './striate.js';
import { PlyModule } from './ply.js';
import { HurryModule } from './hurry.js';
import { IterModule } from './iter.js';
import { SpeedModule } from './speed-mod.js';
import { DjfModule } from './djf.js';
import { SquizModule } from './squiz.js';
import { ScrubModule } from './scrub.js';
import { EchoModule } from './echo-mod.js';
import { LeslieModule } from './leslie.js';
import { DuckModule } from './duck.js';
import { EveryModule } from './every.js';
import { OffModule } from './off.js';
import { JuxModule } from './jux.js';
import { LayerModule } from './layer.js';
import { RarelyModule } from './rarely.js';
import { SliceModule } from './slice.js';
import { RandModule } from './rand.js';
import { SignalModule } from './signal.js';
import { StructModule } from './struct.js';
import { MaskModule } from './mask.js';

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
    name: 'Sample',
    cssClass: 'cat-sample',
    modules: [
      { type: 'chop', label: 'Chop', create: () => new ChopModule() },
      { type: 'striate', label: 'Granular', create: () => new StriateModule() },
      { type: 'slice', label: 'Slice', create: () => new SliceModule() },
      { type: 'loopat', label: 'Loop At', create: () => new LoopAtModule() },
      { type: 'fit', label: 'Fit', create: () => new FitModule() },
      { type: 'scrub', label: 'Scrub', create: () => new ScrubModule() },
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
      { type: 'palindrome', label: 'Palindrome', create: () => new PalindromeModule() },
      { type: 'iter', label: 'Rotate', create: () => new IterModule() },
      { type: 'ply', label: 'Multiply', create: () => new PlyModule() },
      { type: 'hurry', label: 'Hurry', create: () => new HurryModule() },
      { type: 'off', label: 'Offset', create: () => new OffModule() },
      { type: 'swing', label: 'Swing', create: () => new SwingModule() },
    ]
  },
  {
    name: 'Random',
    cssClass: 'cat-random',
    modules: [
      { type: 'sometimes', label: 'Sometimes', create: () => new SometimesModule() },
      { type: 'degrade', label: 'Degrade', create: () => new DegradeModule() },
      { type: 'choose', label: 'Choose', create: () => new ChooseModule() },
      { type: 'every', label: 'Every N', create: () => new EveryModule() },
      { type: 'probability', label: 'Probability', create: () => new RarelyModule() },
      { type: 'rand', label: 'Random', create: () => new RandModule() },
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
      { type: 'signal', label: 'Signal', create: () => new SignalModule() },
    ]
  },
  {
    name: 'Structure',
    cssClass: 'cat-structure',
    modules: [
      { type: 'struct', label: 'Rhythmic Gate', create: () => new StructModule() },
      { type: 'mask', label: 'Mask', create: () => new MaskModule() },
      { type: 'segment', label: 'Quantize', create: () => new SegmentModule() },
      { type: 'jux', label: 'Stereo Split', create: () => new JuxModule() },
      { type: 'echo', label: 'Echo', create: () => new EchoModule() },
      { type: 'layer', label: 'Layer', create: () => new LayerModule() },
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
      { type: 'leslie', label: 'Leslie', create: () => new LeslieModule() },
      { type: 'djf', label: 'DJ Filter', create: () => new DjfModule() },
      { type: 'squiz', label: 'Squiz', create: () => new SquizModule() },
      { type: 'duck', label: 'Sidechain', create: () => new DuckModule() },
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
      { type: 'rib', label: 'Ribbon', create: () => new RibModule() },
      { type: 'speed', label: 'Speed', create: () => new SpeedModule() },
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
