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
import { BULK_CATEGORIES } from './bulk.js';

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

// Merge bulk-generated modules into categories
for (const bulkCat of BULK_CATEGORIES) {
  if (bulkCat.append) {
    // Append to existing category
    const existing = MODULE_CATEGORIES.find(c => c.name === bulkCat.name);
    if (existing) {
      existing.modules.push(...bulkCat.modules);
    } else {
      MODULE_CATEGORIES.push(bulkCat);
    }
  } else {
    MODULE_CATEGORIES.push(bulkCat);
  }
}

// Sort modules alphabetically within each category
for (const cat of MODULE_CATEGORIES) {
  cat.modules.sort((a, b) => a.label.localeCompare(b.label));
}

// Module descriptions for tooltips
const MODULE_DESCS = {
  // Pattern
  sequence: 'Sequence of note values in mini-notation',
  note: 'Note pattern with pitch values',
  stack: 'Layer multiple patterns simultaneously',
  cat: 'Concatenate patterns into a sequence',
  euclid: 'Euclidean rhythm generator',
  mini: 'Raw mini-notation pattern input',
  // Sample
  chop: 'Chop sample into N equal parts',
  striate: 'Granular playback — interleave sample slices',
  slice: 'Play specific slices of a sample',
  loopat: 'Loop sample to fit N cycles',
  fit: 'Fit sample length to pattern cycle',
  scrub: 'Scrub through sample position manually',
  splice: 'Like chop but with individual envelopes',
  begin: 'Set sample playback start point (0–1)',
  end: 'Set sample playback end point (0–1)',
  loop: 'Enable sample looping',
  loopBegin: 'Set loop region start point',
  loopEnd: 'Set loop region end point',
  cut: 'Cut group — stop previous sound in same group',
  clip: 'Clip/legato — hold notes for full duration',
  bank: 'Select sample bank folder',
  sampleN: 'Select sample variation number',
  // Time
  slow: 'Slow down pattern by a factor',
  fast: 'Speed up pattern by a factor',
  rev: 'Reverse the pattern order',
  zoom: 'Zoom into a time window of the pattern',
  palindrome: 'Play pattern forward then backward',
  iter: 'Rotate pattern steps left each cycle',
  ply: 'Multiply each event — repeat in place',
  hurry: 'Speed up pattern and pitch together',
  off: 'Overlay shifted copy of pattern',
  swing: 'Add swing feel to pattern timing',
  early: 'Shift pattern earlier in time',
  late: 'Shift pattern later in time',
  iterBack: 'Rotate pattern steps right each cycle',
  compress: 'Compress pattern into a time window',
  focus: 'Focus on a time span within each cycle',
  linger: 'Repeat a portion of the pattern',
  swingBy: 'Apply custom swing amount',
  repeatCycles: 'Repeat each cycle N times',
  stretch: 'Stretch pattern to fit N cycles',
  cpm: 'Set cycles per minute',
  inside: 'Apply function inside sped-up time',
  outside: 'Apply function in slowed-down time',
  // Random
  sometimes: 'Apply effect randomly ~50% of the time',
  degrade: 'Randomly drop events from pattern',
  choose: 'Randomly choose from input patterns',
  every: 'Apply effect every Nth cycle',
  probability: 'Apply effect with given probability',
  rand: 'Continuous random value (0–1)',
  degradeBy: 'Drop events with specific probability',
  undegradeBy: 'Keep events with specific probability',
  shuffle: 'Shuffle pattern segments randomly',
  scramble: 'Scramble pattern into random order',
  someCycles: 'Apply effect to some random cycles',
  seed: 'Set random seed for reproducibility',
  // Source
  synth: 'Synthesizer — play notes with waveforms',
  noise: 'Noise generator (white, pink, brown)',
  sampler: 'Sample player — trigger samples by name',
  wavetable: 'Wavetable synthesizer',
  signal: 'Continuous signal (sine, saw, square, tri)',
  cosine: 'Cosine wave signal (0–1)',
  isaw: 'Inverted sawtooth wave signal',
  time: 'Continuous time value signal',
  mouseX: 'Mouse X position as control signal',
  mouseY: 'Mouse Y position as control signal',
  silence: 'Silent pattern — no output',
  pure: 'Pure constant value pattern',
  run: 'Ascending number sequence 0 to N-1',
  steady: 'Steady continuous signal',
  brand: 'Random boolean (true/false) signal',
  sound: 'Sound source by sample name',
  hush: 'Silence — stops all sound',
  // Structure
  struct: 'Gate pattern with a rhythmic structure',
  mask: 'Mask pattern — keep events where mask is true',
  segment: 'Quantize pattern to N steps per cycle',
  jux: 'Apply effect to one stereo channel only',
  echo: 'Echo events with feedback and decay',
  layer: 'Layer multiple transformations on same input',
  euclidRot: 'Euclidean rhythm with rotation offset',
  lastOf: 'Apply effect on last of every N cycles',
  when: 'Apply effect on specific cycle numbers',
  plyWith: 'Multiply events with a transformation',
  chunk: 'Apply effect to one chunk per cycle',
  chunkBack: 'Chunk processing in reverse order',
  reset: 'Reset pattern phase on trigger',
  restart: 'Restart pattern from beginning on trigger',
  invert: 'Invert pattern — swap notes and rests',
  brak: 'Breakbeat pattern transformation',
  press: 'Squeeze events into first half of cycle',
  pressBy: 'Squeeze events by a given amount',
  echoWith: 'Echo with custom transformation function',
  within: 'Apply effect within a time range',
  bypass: 'Bypass/pass through without effect',
  collect: 'Collect and group simultaneous events',
  // Envelope
  adsr: 'Attack-Decay-Sustain-Release envelope',
  lfo: 'Low-frequency oscillator modulation',
  perlin: 'Perlin noise — smooth random modulation',
  range: 'Map signal to a custom value range',
  // Effect
  filter: 'Resonant filter (low/high/band pass)',
  vowel: 'Vowel formant filter (a, e, i, o, u)',
  reverb: 'Reverb — room/hall space simulation',
  delay: 'Delay — time-based echo effect',
  distortion: 'Distortion — overdrive and saturation',
  shape: 'Waveshaping distortion',
  crush: 'Bit crush — reduce bit depth',
  coarse: 'Sample rate reduction',
  tremolo: 'Amplitude modulation tremolo',
  phaser: 'Phaser — sweeping comb filter effect',
  pan: 'Stereo panning position',
  compressor: 'Dynamic range compressor',
  gain: 'Volume gain control',
  leslie: 'Leslie speaker simulation (rotating)',
  djf: 'DJ-style low/high pass filter',
  squiz: 'Pitch-squashing distortion',
  duck: 'Sidechain compression/ducking',
  lpFilterEnv: 'Low-pass filter with envelope',
  hpFilterEnv: 'High-pass filter with envelope',
  bpFilterEnv: 'Band-pass filter with envelope',
  lpFilterLfo: 'Low-pass filter modulated by LFO',
  hpFilterLfo: 'High-pass filter modulated by LFO',
  bpFilterLfo: 'Band-pass filter modulated by LFO',
  ftype: 'Set filter type (ladder, etc.)',
  delaySync: 'Tempo-synced delay effect',
  reverbMod: 'Reverb with modulation',
  drive: 'Soft overdrive',
  waveloss: 'Drop audio samples for lo-fi effect',
  krush: 'Spectral bit-crushing',
  triode: 'Vacuum tube triode distortion',
  waveshaper: 'Waveshaper curve selection',
  postgain: 'Gain applied after effects',
  velocity: 'Note velocity / volume per event',
  hold: 'Hold/sustain duration control',
  gate: 'Gate — note duration as ratio',
  fadeTime: 'Fade in/out transition time',
  panMod: 'Pan with modulation source',
  tremoloMod: 'Tremolo with modulation control',
  phaserMod: 'Phaser with modulation control',
  fmOperator: 'FM synthesis operator',
  freq: 'Set frequency in Hz directly',
  detune: 'Detune pitch by cents',
  unison: 'Unison — layer detuned copies',
  spread: 'Spread voices across stereo field',
  accelerate: 'Pitch glide — accelerate frequency',
  slide: 'Pitch slide between notes',
  semitone: 'Transpose by semitones',
  octave: 'Transpose by octaves',
  pitchEnv: 'Pitch envelope modulation',
  vibrato: 'Pitch vibrato effect',
  wtMod: 'Wavetable position modulation',
  wtLfo: 'Wavetable LFO modulation',
  warp: 'Wavetable warp control',
  freqShift: 'Frequency shift in Hz',
  chorus: 'Chorus effect — detuned copies',
  pulseWidth: 'Pulse width for square wave',
  ringMod: 'Ring modulation effect',
  spectral: 'Spectral processing (blur, smear, etc.)',
  nudge: 'Micro-timing nudge in seconds',
  drywet: 'Dry/wet mix balance',
  bus: 'Route audio to a named bus',
  overgain: 'Overdrive gain amount',
  expression: 'Expression/dynamics control',
  // Combinator
  slowcat: 'Concatenate patterns one per cycle',
  polymeter: 'Layer patterns with different lengths',
  polyrhythm: 'Layer patterns with different speeds',
  arrange: 'Arrange patterns with durations',
  timeCat: 'Concatenate with weighted durations',
  chooseCycles: 'Choose different pattern each cycle',
  randcat: 'Random concatenation of patterns',
  superimpose: 'Overlay transformed copy of pattern',
  juxBy: 'Stereo split with adjustable width',
  bite: 'Reorder pattern subdivisions',
  // Math
  add: 'Add a value to pattern numbers',
  sub: 'Subtract a value from pattern numbers',
  mul: 'Multiply pattern numbers by a value',
  div: 'Divide pattern numbers by a value',
  modulo: 'Modulo — remainder after division',
  pow: 'Raise pattern numbers to a power',
  round: 'Round pattern numbers to nearest integer',
  floor: 'Round down pattern numbers',
  ceil: 'Round up pattern numbers',
  clamp: 'Clamp values to a min/max range',
  rangex: 'Exponential range mapping',
  range2: 'Bipolar range mapping (-1 to 1)',
  toBipolar: 'Convert unipolar (0–1) to bipolar (-1–1)',
  fromBipolar: 'Convert bipolar (-1–1) to unipolar (0–1)',
  // Instrument
  keyboard: 'Play notes with computer keyboard',
  'pad-grid': 'Trigger pad grid controller',
  // I/O
  output: 'Audio output — sends to speakers',
  'midi-out': 'Send MIDI notes to external device',
  'midi-in': 'Receive MIDI from external controller',
  'osc-out': 'Send OSC messages',
  // Visualize
  'piano-roll': 'Piano roll note visualization',
  scope: 'Oscilloscope waveform display',
  spectrum: 'Frequency spectrum analyzer',
  spiral: 'Spiral note visualization',
  punchcard: 'Punchcard pattern visualization',
  wordfall: 'Falling text visualization',
  pitchwheel: 'Pitch wheel visualization',
  // Utility
  orbit: 'Route to separate effect bus',
  merge: 'Merge multiple audio signals',
  rib: 'Ribbon controller input',
  speed: 'Sample playback speed',
  // Musical
  scale: 'Quantize notes to a musical scale',
  transpose: 'Transpose notes by semitones',
  scaleTranspose: 'Transpose within a scale',
  chord: 'Add chord voicings to notes',
  arp: 'Arpeggiate chords',
  voicing: 'Smart chord voicing selection',
  // MIDI
  midiCC: 'Send MIDI continuous controller',
  midiBend: 'Send MIDI pitch bend',
  midiTouch: 'Send MIDI aftertouch',
  progChange: 'Send MIDI program change',
  // Pattern Ops
  morph: 'Morph between two patterns',
  xfade: 'Crossfade between two patterns',
  binary: 'Binary number as rhythm pattern',
  take: 'Take first N cycles of pattern',
  drop: 'Drop first N cycles of pattern',
  replicate: 'Replicate each event N times',
  // ZZFX
  zzfx: 'ZZFX sound effect synthesizer',
  byteBeat: 'ByteBeat algorithmic audio formula',
};

// Attach descriptions to module defs
for (const cat of MODULE_CATEGORIES) {
  for (const mod of cat.modules) {
    if (!mod.desc && MODULE_DESCS[mod.type]) {
      mod.desc = MODULE_DESCS[mod.type];
    }
  }
}

export function createModule(type) {
  for (const cat of MODULE_CATEGORIES) {
    for (const mod of cat.modules) {
      if (mod.type === type) {
        const m = mod.create();
        if (mod.desc) m.desc = mod.desc;
        return m;
      }
    }
  }
  return null;
}
