// Bulk Module Definitions — mass-generated from strudel function catalog
import { makeModule, makeMultiInput, makeEffectFn, makeChain, effectSub, K, S, AI, PI, MI, EI, AO, PO, CO } from './factory.js';

// ============ TIME ============
export const EarlyModule = makeModule({ type:'early', title:'Shift Earlier', strudelName:'early', inputs:[PI,MI], outputs:[PO], knobs:[K('amount','Amt',0,16,0.25,0.01)] });
export const LateModule = makeModule({ type:'late', title:'Shift Later', strudelName:'late', inputs:[PI,MI], outputs:[PO], knobs:[K('amount','Amt',0,16,0.25,0.01)] });
export const IterBackModule = makeModule({ type:'iterBack', title:'Rotate Back', strudelName:'iterBack', inputs:[PI], outputs:[PO], knobs:[K('count','N',2,16,4,1)] });
export const CompressModule = makeModule({ type:'compress', title:'Compress', strudelName:'compress', inputs:[PI], outputs:[PO], knobs:[K('begin','Begin',0,1,0,0.01),K('end','End',0,1,0.5,0.01)] });
export const FocusModule = makeModule({ type:'focus', title:'Focus', strudelName:'focus', inputs:[PI], outputs:[PO], knobs:[K('begin','Begin',0,1,0,0.01),K('end','End',0,1,1,0.01)] });
export const LingerModule = makeModule({ type:'linger', title:'Linger', strudelName:'linger', inputs:[PI,MI], outputs:[PO], knobs:[K('fraction','Frac',0.01,1,0.25,0.01)] });
export const SwingByModule = makeModule({ type:'swingBy', title:'Swing By', strudelName:'swingBy', inputs:[PI], outputs:[PO], knobs:[K('amount','Amt',0,1,0.33,0.01),K('division','Div',1,16,2,1)] });
export const RepeatCyclesModule = makeModule({ type:'repeatCycles', title:'Repeat Cycles', strudelName:'repeatCycles', inputs:[PI], outputs:[PO], knobs:[K('count','N',1,16,2,1)] });
export const StretchModule = makeModule({ type:'stretch', title:'Stretch', strudelName:'stretch', inputs:[AI], outputs:[AO], knobs:[K('factor','Factor',0.1,16,1,0.1)] });
export const CpmModule = makeModule({ type:'cpm', title:'CPM', strudelName:'cpm', inputs:[PI], outputs:[PO], knobs:[K('cpm','CPM',20,300,120,1)] });
export const InsideModule = makeEffectFn({ type:'inside', title:'Inside', strudelName:'inside', knobs:[K('factor','Factor',0.25,16,2,0.25)] });
export const OutsideModule = makeEffectFn({ type:'outside', title:'Outside', strudelName:'outside', knobs:[K('factor','Factor',0.25,16,2,0.25)] });

// ============ STRUCTURE ============
export const EuclidRotModule = makeModule({ type:'euclidRot', title:'Euclid Rotate', strudelName:'euclidRot', inputs:[PI], outputs:[PO], knobs:[K('pulses','Pls',1,16,3,1),K('steps','Stp',1,16,8,1),K('rotation','Rot',0,16,0,1)] });
export const LastOfModule = makeEffectFn({ type:'lastOf', title:'Last Of', strudelName:'lastOf', knobs:[K('count','N',2,16,4,1)] });
export const WhenModule = makeModule({ type:'when', title:'When', strudelName:'when', inputs:[PI,MI,EI], outputs:[PO],
  compileFn(inputCode, modCode) { if (!inputCode) return null; const eff = effectSub(modCode); return `${inputCode}.when(${eff}, x => x)`; }
});
export const PlyWithModule = makeEffectFn({ type:'plyWith', title:'Ply With', strudelName:'plyWith', knobs:[K('count','N',1,8,2,1)] });
export const ChunkModule = makeEffectFn({ type:'chunk', title:'Chunk', strudelName:'chunk', knobs:[K('count','N',2,16,4,1)] });
export const ChunkBackModule = makeEffectFn({ type:'chunkBack', title:'Chunk Back', strudelName:'chunkBack', knobs:[K('count','N',2,16,4,1)] });
export const ResetModule = makeModule({ type:'reset', title:'Reset', strudelName:'reset', inputs:[PI,MI], outputs:[PO],
  compileFn(inputCode, modCode) { if (!inputCode) return null; return `${inputCode}.reset(${modCode||'"1"'})`; }
});
export const RestartModule = makeModule({ type:'restart', title:'Restart', strudelName:'restart', inputs:[PI,MI], outputs:[PO],
  compileFn(inputCode, modCode) { if (!inputCode) return null; return `${inputCode}.restart(${modCode||'"1"'})`; }
});
export const InvertModule = makeModule({ type:'invert', title:'Invert', strudelName:'inv', inputs:[PI], outputs:[PO] });
export const BrakModule = makeModule({ type:'brak', title:'Breakbeat', strudelName:'brak', inputs:[PI], outputs:[PO] });
export const PressModule = makeModule({ type:'press', title:'Press', strudelName:'press', inputs:[PI], outputs:[PO] });
export const PressByModule = makeModule({ type:'pressBy', title:'Press By', strudelName:'pressBy', inputs:[PI], outputs:[PO], knobs:[K('amount','Amt',0,1,0.5,0.01)] });
export const EchoWithModule = makeEffectFn({ type:'echoWith', title:'Echo With', strudelName:'echoWith', knobs:[K('count','N',1,8,3,1),K('time','Time',0,1,0.25,0.01)] });
export const WithinModule = makeEffectFn({ type:'within', title:'Within', strudelName:'within', knobs:[K('begin','Begin',0,1,0,0.01),K('end','End',0,1,0.5,0.01)] });
export const BypassModule = makeModule({ type:'bypass', title:'Bypass', strudelName:'bypass', inputs:[PI], outputs:[PO], knobs:[K('toggle','On',0,1,0,1)] });
export const CollectModule = makeModule({ type:'collect', title:'Collect', strudelName:'collect', inputs:[PI], outputs:[PO] });
export const HushModule = makeModule({ type:'hush', title:'Hush', strudelName:'silence', inputs:[], outputs:[PO],
  compileFn() { return 'silence'; }
});

// ============ PROBABILITY ============
export const DegradeByModule = makeModule({ type:'degradeBy', title:'Degrade By', strudelName:'degradeBy', inputs:[PI,MI], outputs:[PO], knobs:[K('amount','Amt',0,1,0.5,0.01)] });
export const UndegradeByModule = makeModule({ type:'undegradeBy', title:'Undegrade By', strudelName:'undegradeBy', inputs:[PI], outputs:[PO], knobs:[K('amount','Amt',0,1,0.5,0.01)] });
export const ShuffleModule = makeModule({ type:'shuffle', title:'Shuffle', strudelName:'shuffle', inputs:[PI], outputs:[PO], knobs:[K('divisions','Divs',2,16,4,1)] });
export const ScrambleModule = makeModule({ type:'scramble', title:'Scramble', strudelName:'scramble', inputs:[PI], outputs:[PO], knobs:[K('divisions','Divs',2,16,4,1)] });
export const SomeCyclesModule = makeEffectFn({ type:'someCycles', title:'Some Cycles', strudelName:'someCycles' });
export const ChooseCyclesModule = makeMultiInput('chooseCycles','Choose Cycles','chooseCycles',4);
export const RandcatModule = makeMultiInput('randcat','Random Cat','randcat',4);
export const SeedModule = makeModule({ type:'seed', title:'Seed', strudelName:'seed', inputs:[PI], outputs:[PO], knobs:[K('seed','Seed',0,9999,0,1)] });

// ============ COMBINATORS ============
export const SlowcatModule = makeMultiInput('slowcat','Slow Cat','slowcat',4);
export const PolymeterModule = makeMultiInput('polymeter','Polymeter','polymeter',4);
export const PolyrhythmModule = makeMultiInput('polyrhythm','Polyrhythm','polyrhythm',4);
export const ArrangeModule = makeModule({
  type:'arrange', title:'Arrange', strudelName:'arrange',
  inputs:[{name:'in1',type:'pattern',label:'in1'},{name:'in2',type:'pattern',label:'in2'},{name:'in3',type:'pattern',label:'in3'},{name:'in4',type:'pattern',label:'in4'}],
  outputs:[PO], isMultiInput:true,
  knobs:[K('len1','L1',1,16,4,1),K('len2','L2',1,16,4,1),K('len3','L3',1,16,2,1),K('len4','L4',1,16,2,1)],
  compileFn(inputs) {
    const valid = (inputs||[]).filter(Boolean);
    if (valid.length===0) return null;
    const lens = ['len1','len2','len3','len4'];
    const parts = valid.map((c,i) => `[${this.knobs[lens[i]]?.value||4}, ${c}]`);
    return `arrange(${parts.join(', ')})`;
  }
});
export const TimeCatModule = makeModule({
  type:'timeCat', title:'Time Cat', strudelName:'timeCat',
  inputs:[{name:'in1',type:'pattern',label:'in1'},{name:'in2',type:'pattern',label:'in2'},{name:'in3',type:'pattern',label:'in3'},{name:'in4',type:'pattern',label:'in4'}],
  outputs:[PO], isMultiInput:true,
  knobs:[K('w1','W1',1,16,1,1),K('w2','W2',1,16,1,1),K('w3','W3',1,16,1,1),K('w4','W4',1,16,1,1)],
  compileFn(inputs) {
    const valid = (inputs||[]).filter(Boolean);
    if (valid.length===0) return null;
    const ws = ['w1','w2','w3','w4'];
    const parts = valid.map((c,i) => `[${this.knobs[ws[i]]?.value||1}, ${c}]`);
    return `timeCat(${parts.join(', ')})`;
  }
});
export const SuperimposeModule = makeEffectFn({ type:'superimpose', title:'Superimpose', strudelName:'superimpose' });
export const JuxByModule = makeEffectFn({ type:'juxBy', title:'Jux By', strudelName:'juxBy', knobs:[K('width','Width',0,1,0.5,0.01)] });
export const BiteModule = makeModule({ type:'bite', title:'Bite', strudelName:'bite', inputs:[PI,MI], outputs:[PO], knobs:[K('subdivs','Divs',2,16,4,1)],
  compileFn(inputCode, modCode) { if (!inputCode) return null; return `${inputCode}.bite(${this.knobs.subdivs.value}, ${modCode||'"0 1 2 3"'})`; }
});

// ============ SOURCES ============
export const CosineModule = makeModule({ type:'cosine', title:'Cosine', strudelName:'cosine', inputs:[], outputs:[CO] });
export const IsawModule = makeModule({ type:'isaw', title:'Inv Sawtooth', strudelName:'isaw', inputs:[], outputs:[CO] });
export const TimeModule = makeModule({ type:'time', title:'Time', strudelName:'time', inputs:[], outputs:[CO] });
export const MouseXModule = makeModule({ type:'mouseX', title:'Mouse X', strudelName:'mouseX', inputs:[], outputs:[CO] });
export const MouseYModule = makeModule({ type:'mouseY', title:'Mouse Y', strudelName:'mouseY', inputs:[], outputs:[CO] });
export const SilenceModule = makeModule({ type:'silence', title:'Silence', strudelName:'silence', inputs:[], outputs:[PO] });
export const PureModule = makeModule({ type:'pure', title:'Pure', strudelName:'pure', inputs:[], outputs:[PO], knobs:[K('value','Val',0,127,60,1)] });
export const RunModule = makeModule({ type:'run', title:'Run', strudelName:'run', inputs:[], outputs:[PO], knobs:[K('count','N',1,64,8,1)] });
export const SteadyModule = makeModule({ type:'steady', title:'Steady', strudelName:'steady', inputs:[], outputs:[CO] });
export const BrandModule = makeModule({ type:'brand', title:'Random Bool', strudelName:'brand', inputs:[], outputs:[CO] });

// ============ MATH ============
export const AddModule = makeModule({ type:'add', title:'Add', strudelName:'add', inputs:[PI,MI], outputs:[PO], knobs:[K('value','Val',-128,128,0,0.1)] });
export const SubModule = makeModule({ type:'sub', title:'Subtract', strudelName:'sub', inputs:[PI,MI], outputs:[PO], knobs:[K('value','Val',-128,128,0,0.1)] });
export const MulModule = makeModule({ type:'mul', title:'Multiply', strudelName:'mul', inputs:[PI,MI], outputs:[PO], knobs:[K('value','Val',0,16,1,0.1)] });
export const DivModule = makeModule({ type:'div', title:'Divide', strudelName:'div', inputs:[PI,MI], outputs:[PO], knobs:[K('value','Val',0.1,16,1,0.1)] });
export const ModuloModule = makeModule({ type:'modulo', title:'Modulo', strudelName:'mod', inputs:[PI], outputs:[PO], knobs:[K('value','Val',1,128,12,1)] });
export const PowModule = makeModule({ type:'pow', title:'Power', strudelName:'pow', inputs:[PI], outputs:[PO], knobs:[K('exponent','Exp',0.1,8,2,0.1)] });
export const RoundModule = makeModule({ type:'round', title:'Round', strudelName:'round', inputs:[PI], outputs:[PO] });
export const FloorModule = makeModule({ type:'floor', title:'Floor', strudelName:'floor', inputs:[PI], outputs:[PO] });
export const CeilModule = makeModule({ type:'ceil', title:'Ceiling', strudelName:'ceil', inputs:[PI], outputs:[PO] });
export const ClampModule = makeModule({ type:'clamp', title:'Clamp', strudelName:'clamp', inputs:[PI], outputs:[PO], knobs:[K('min','Min',0,127,0,1),K('max','Max',0,127,127,1)] });
export const RangexModule = makeModule({ type:'rangex', title:'Exp Range', strudelName:'rangex', inputs:[PI], outputs:[PO], knobs:[K('min','Min',0.01,20000,20,1),K('max','Max',0.01,20000,2000,1)] });
export const Range2Module = makeModule({ type:'range2', title:'Bipolar Range', strudelName:'range2', inputs:[PI], outputs:[PO], knobs:[K('min','Min',-128,128,-1,0.1),K('max','Max',-128,128,1,0.1)] });
export const ToBipolarModule = makeModule({ type:'toBipolar', title:'To Bipolar', strudelName:'toBipolar', inputs:[PI], outputs:[PO] });
export const FromBipolarModule = makeModule({ type:'fromBipolar', title:'From Bipolar', strudelName:'fromBipolar', inputs:[PI], outputs:[PO] });

// ============ SAMPLE ============
export const SpliceModule = makeModule({ type:'splice', title:'Splice', strudelName:'splice', inputs:[PI,MI], outputs:[PO], knobs:[K('slices','Slices',1,64,8,1)],
  compileFn(inputCode, modCode) { if (!inputCode) return null; return `${inputCode}.splice(${this.knobs.slices.value}, ${modCode||'"0 1 2 3"'})`; }
});
export const BeginModule = makeModule({ type:'begin', title:'Begin', strudelName:'begin', inputs:[AI,MI], outputs:[AO], knobs:[K('pos','Pos',0,1,0,0.01)] });
export const EndModule = makeModule({ type:'end', title:'End', strudelName:'end', inputs:[AI,MI], outputs:[AO], knobs:[K('pos','Pos',0,1,1,0.01)] });
export const LoopModule = makeModule({ type:'loop', title:'Loop', strudelName:'loop', inputs:[AI], outputs:[AO], knobs:[K('toggle','On',0,1,1,1)] });
export const LoopBeginModule = makeModule({ type:'loopBegin', title:'Loop Begin', strudelName:'loopb', inputs:[AI], outputs:[AO], knobs:[K('pos','Pos',0,1,0,0.01)] });
export const LoopEndModule = makeModule({ type:'loopEnd', title:'Loop End', strudelName:'loope', inputs:[AI], outputs:[AO], knobs:[K('pos','Pos',0,1,1,0.01)] });
export const CutModule = makeModule({ type:'cut', title:'Cut Group', strudelName:'cut', inputs:[AI], outputs:[AO], knobs:[K('group','Grp',0,16,1,1)] });
export const ClipModule = makeModule({ type:'clip', title:'Clip/Legato', strudelName:'clip', inputs:[PI,MI], outputs:[PO], knobs:[K('value','Val',0,4,1,0.01)] });
export const BankModule = makeModule({ type:'bank', title:'Bank', strudelName:'bank', inputs:[AI], outputs:[AO],
  selects:[S('bankName',['dirt-samples','electronic','808','piano','guitar','strings','brass','woodwind','percussion'],'dirt-samples')],
  compileFn(inputCode) { if (!inputCode) return null; const v=this.selects.bankName?.value||''; return v?`${inputCode}.bank("${v}")`:inputCode; }
});
export const SampleNModule = makeModule({ type:'sampleN', title:'Sample N', strudelName:'n', inputs:[PI,MI], outputs:[PO], knobs:[K('number','N',0,127,0,1)] });
export const SoundModule = makeModule({ type:'sound', title:'Sound', strudelName:'s', inputs:[], outputs:[AO],
  selects:[S('soundName',['bd','sd','hh','cp','cb','cr','oh','ch','misc','tabla','tabla2','breaks','jazz'],'bd')],
  compileFn() { return `s("${this.selects.soundName?.value||'bd'}")`; }
});

// ============ EFFECTS - Filter Mods ============
export const LpFilterEnvModule = makeChain({ type:'lpFilterEnv', title:'LP Filter Env', strudelName:'lpenv', inputs:[AI], outputs:[AO],
  knobs:[K('env','Env',-1,1,0,0.01),K('attack','Atk',0,1,0.01,0.01),K('decay','Dec',0,1,0.1,0.01),K('sustain','Sus',0,1,0.5,0.01),K('release','Rel',0,1,0.2,0.01)],
  params:[{method:'lpenv',knob:'env'},{method:'lpattack',knob:'attack'},{method:'lpdecay',knob:'decay'},{method:'lpsustain',knob:'sustain'},{method:'lprelease',knob:'release'}]
});
export const HpFilterEnvModule = makeChain({ type:'hpFilterEnv', title:'HP Filter Env', strudelName:'hpenv', inputs:[AI], outputs:[AO],
  knobs:[K('env','Env',-1,1,0,0.01),K('attack','Atk',0,1,0.01,0.01),K('decay','Dec',0,1,0.1,0.01),K('sustain','Sus',0,1,0.5,0.01),K('release','Rel',0,1,0.2,0.01)],
  params:[{method:'hpenv',knob:'env'},{method:'hpattack',knob:'attack'},{method:'hpdecay',knob:'decay'},{method:'hpsustain',knob:'sustain'},{method:'hprelease',knob:'release'}]
});
export const BpFilterEnvModule = makeChain({ type:'bpFilterEnv', title:'BP Filter Env', strudelName:'bpenv', inputs:[AI], outputs:[AO],
  knobs:[K('env','Env',-1,1,0,0.01),K('attack','Atk',0,1,0.01,0.01),K('decay','Dec',0,1,0.1,0.01),K('sustain','Sus',0,1,0.5,0.01),K('release','Rel',0,1,0.2,0.01)],
  params:[{method:'bpenv',knob:'env'},{method:'bpattack',knob:'attack'},{method:'bpdecay',knob:'decay'},{method:'bpsustain',knob:'sustain'},{method:'bprelease',knob:'release'}]
});
export const LpFilterLfoModule = makeChain({ type:'lpFilterLfo', title:'LP Filter LFO', strudelName:'lprate', inputs:[AI], outputs:[AO],
  knobs:[K('rate','Rate',0.1,20,1,0.1),K('depth','Depth',0,1,0.5,0.01)],
  params:[{method:'lprate',knob:'rate'},{method:'lpdepth',knob:'depth'}]
});
export const HpFilterLfoModule = makeChain({ type:'hpFilterLfo', title:'HP Filter LFO', strudelName:'hprate', inputs:[AI], outputs:[AO],
  knobs:[K('rate','Rate',0.1,20,1,0.1),K('depth','Depth',0,1,0.5,0.01)],
  params:[{method:'hprate',knob:'rate'},{method:'hpdepth',knob:'depth'}]
});
export const BpFilterLfoModule = makeChain({ type:'bpFilterLfo', title:'BP Filter LFO', strudelName:'bprate', inputs:[AI], outputs:[AO],
  knobs:[K('rate','Rate',0.1,20,1,0.1),K('depth','Depth',0,1,0.5,0.01)],
  params:[{method:'bprate',knob:'rate'},{method:'bpdepth',knob:'depth'}]
});
export const FtypeModule = makeModule({ type:'ftype', title:'Filter Type', strudelName:'ftype', inputs:[AI], outputs:[AO],
  selects:[S('ftype',['ladder','12db','24db'],'ladder')],
  compileFn(inputCode) { if (!inputCode) return null; return `${inputCode}.ftype("${this.selects.ftype?.value||'ladder'}")`; }
});

// ============ EFFECTS - Delay/Reverb/Distortion Mods ============
export const DelaySyncModule = makeModule({ type:'delaySync', title:'Delay Sync', strudelName:'delaysync', inputs:[AI], outputs:[AO], knobs:[K('sync','Sync',0,1,0,1)] });
export const ReverbModModule = makeChain({ type:'reverbMod', title:'Reverb Mod', strudelName:'roomlp', inputs:[AI], outputs:[AO],
  knobs:[K('roomlp','LP',0,20000,15000,100),K('roomdim','Dim',0,1,0.5,0.01),K('roomfade','Fade',0,10,0.5,0.1),K('dry','Dry',0,1,1,0.01)],
  params:[{method:'roomlp',knob:'roomlp'},{method:'roomdim',knob:'roomdim'},{method:'roomfade',knob:'roomfade'},{method:'dry',knob:'dry'}]
});
export const DriveModule = makeModule({ type:'drive', title:'Drive', strudelName:'drive', inputs:[AI,MI], outputs:[AO], knobs:[K('amount','Amt',0,10,1,0.1)] });
export const WavelossModule = makeModule({ type:'waveloss', title:'Waveloss', strudelName:'waveloss', inputs:[AI,MI], outputs:[AO], knobs:[K('amount','Amt',0,100,0,1)] });
export const KrushModule = makeChain({ type:'krush', title:'Spectral Crush', strudelName:'krush', inputs:[AI], outputs:[AO],
  knobs:[K('amount','Amt',0,16,0,1),K('cutoff','Cut',0,20000,10000,100)],
  params:[{method:'krush',knob:'amount'},{method:'kcutoff',knob:'cutoff'}]
});
export const TriodeModule = makeModule({ type:'triode', title:'Triode', strudelName:'triode', inputs:[AI,MI], outputs:[AO], knobs:[K('amount','Amt',0,10,1,0.1)] });
export const WaveshaperModule = makeModule({ type:'waveshaper', title:'Waveshaper', strudelName:'soft', inputs:[AI], outputs:[AO],
  selects:[S('shape',['soft','hard','cubic','diode','asym','fold','sinefold','chebyshev'],'soft')],
  knobs:[K('amount','Amt',1,16,2,1)],
  compileFn(inputCode) { if (!inputCode) return null; return `${inputCode}.${this.selects.shape?.value||'soft'}(${this.knobs.amount.value})`; }
});

// ============ EFFECTS - Amplitude ============
export const PostgainModule = makeModule({ type:'postgain', title:'Post Gain', strudelName:'postgain', inputs:[AI,MI], outputs:[AO], knobs:[K('gain','Gain',0,2,1,0.01)] });
export const VelocityModule = makeModule({ type:'velocity', title:'Velocity', strudelName:'velocity', inputs:[PI,MI], outputs:[PO], knobs:[K('vel','Vel',0,1,1,0.01)] });
export const HoldModule = makeModule({ type:'hold', title:'Hold', strudelName:'hold', inputs:[AI], outputs:[AO], knobs:[K('time','Time',0,4,0,0.01)] });
export const GateModule2 = makeModule({ type:'gate', title:'Gate', strudelName:'gate', inputs:[AI,MI], outputs:[AO], knobs:[K('gate','Gate',0,1,1,0.01)] });
export const FadeTimeModule = makeModule({ type:'fadeTime', title:'Fade Time', strudelName:'fadeTime', inputs:[AI], outputs:[AO], knobs:[K('time','Time',0,4,0.1,0.01)] });

// ============ EFFECTS - Pan/Tremolo/Phaser Mods ============
export const PanModModule = makeChain({ type:'panMod', title:'Pan Mod', strudelName:'panspan', inputs:[AI], outputs:[AO],
  knobs:[K('span','Span',0,1,1,0.01),K('splay','Splay',0,1,0,0.01),K('width','Width',0,1,1,0.01)],
  params:[{method:'panspan',knob:'span'},{method:'pansplay',knob:'splay'},{method:'panwidth',knob:'width'}]
});
export const TremoloModModule = makeChain({ type:'tremoloMod', title:'Tremolo Mod', strudelName:'tremoloskew', inputs:[AI], outputs:[AO],
  knobs:[K('skew','Skew',0,1,0.5,0.01),K('phase','Phase',0,1,0,0.01)],
  params:[{method:'tremoloskew',knob:'skew'},{method:'tremolophase',knob:'phase'}]
});
export const PhaserModModule = makeChain({ type:'phaserMod', title:'Phaser Mod', strudelName:'phasercenter', inputs:[AI], outputs:[AO],
  knobs:[K('center','Center',0,10000,1000,10),K('sweep','Sweep',0,1,0.5,0.01)],
  params:[{method:'phasercenter',knob:'center'},{method:'phasersweep',knob:'sweep'}]
});

// ============ FM SYNTHESIS ============
export const FmOperatorModule = makeModule({ type:'fmOperator', title:'FM Operator', strudelName:'fmi', inputs:[AI], outputs:[AO],
  selects:[S('op',['1','2','3','4','5','6','7','8'],'1'),S('wave',['sine','saw','tri','square'],'sine')],
  knobs:[K('index','Idx',0,20,1,0.1),K('harm','Harm',0.25,16,1,0.25),K('attack','Atk',0,2,0.01,0.01),K('decay','Dec',0,2,0.1,0.01),K('sustain','Sus',0,1,0.5,0.01),K('release','Rel',0,4,0.2,0.01)],
  compileFn(inputCode) {
    if (!inputCode) return null;
    const n = this.selects.op?.value||'1';
    const w = this.selects.wave?.value||'sine';
    let c = inputCode;
    c += `.fmi${n}(${this.knobs.index.value}).fmh${n}(${this.knobs.harm.value})`;
    c += `.fmattack${n}(${this.knobs.attack.value}).fmdecay${n}(${this.knobs.decay.value})`;
    c += `.fmsustain${n}(${this.knobs.sustain.value}).fmrelease${n}(${this.knobs.release.value})`;
    if (w!=='sine') c += `.fmwave${n}("${w}")`;
    return c;
  }
});

// ============ PITCH ============
export const FreqModule = makeModule({ type:'freq', title:'Frequency', strudelName:'freq', inputs:[PI,MI], outputs:[PO], knobs:[K('hz','Hz',20,20000,440,1)] });
export const DetuneModule = makeModule({ type:'detune', title:'Detune', strudelName:'detune', inputs:[AI,MI], outputs:[AO], knobs:[K('cents','Cents',-100,100,0,1)] });
export const UnisonModule = makeModule({ type:'unison', title:'Unison', strudelName:'unison', inputs:[AI], outputs:[AO], knobs:[K('voices','Voices',1,8,1,1)] });
export const SpreadModule = makeModule({ type:'spread', title:'Spread', strudelName:'spread', inputs:[AI], outputs:[AO], knobs:[K('spread','Spread',0,1,0.5,0.01)] });
export const AccelerateModule = makeModule({ type:'accelerate', title:'Accelerate', strudelName:'accelerate', inputs:[AI,MI], outputs:[AO], knobs:[K('amount','Amt',-4,4,0,0.1)] });
export const SlideModule = makeModule({ type:'slide', title:'Slide', strudelName:'slide', inputs:[AI], outputs:[AO], knobs:[K('amount','Amt',0,1,0,0.01)] });
export const SemitoneModule = makeModule({ type:'semitone', title:'Semitone', strudelName:'semitone', inputs:[PI,MI], outputs:[PO], knobs:[K('semi','Semi',-24,24,0,1)] });
export const OctaveModule = makeModule({ type:'octave', title:'Octave', strudelName:'octave', inputs:[PI], outputs:[PO], knobs:[K('oct','Oct',-4,4,0,1)] });
export const PitchEnvModule = makeChain({ type:'pitchEnv', title:'Pitch Env', strudelName:'penv', inputs:[AI], outputs:[AO],
  knobs:[K('penv','Env',-24,24,0,1),K('pattack','Atk',0,2,0.01,0.01),K('pdecay','Dec',0,2,0.1,0.01),K('psustain','Sus',0,1,0,0.01),K('prelease','Rel',0,2,0.1,0.01)],
  params:[{method:'penv',knob:'penv'},{method:'pattack',knob:'pattack'},{method:'pdecay',knob:'pdecay'},{method:'psustain',knob:'psustain'},{method:'prelease',knob:'prelease'}]
});
export const VibratoModule = makeModule({ type:'vibrato', title:'Vibrato', strudelName:'vibrato', inputs:[AI,MI], outputs:[AO], knobs:[K('depth','Depth',0,1,0,0.01)] });

// ============ WAVETABLE MODS ============
export const WtModModule = makeChain({ type:'wtMod', title:'WT Mod', strudelName:'wtenv', inputs:[AI], outputs:[AO],
  knobs:[K('env','Env',-1,1,0,0.01),K('attack','Atk',0,2,0.01,0.01),K('decay','Dec',0,2,0.1,0.01),K('sustain','Sus',0,1,0.5,0.01),K('release','Rel',0,2,0.2,0.01)],
  params:[{method:'wtenv',knob:'env'},{method:'wtattack',knob:'attack'},{method:'wtdecay',knob:'decay'},{method:'wtsustain',knob:'sustain'},{method:'wtrelease',knob:'release'}]
});
export const WtLfoModule = makeChain({ type:'wtLfo', title:'WT LFO', strudelName:'wtrate', inputs:[AI], outputs:[AO],
  knobs:[K('rate','Rate',0.1,20,1,0.1),K('depth','Depth',0,1,0.5,0.01)],
  params:[{method:'wtrate',knob:'rate'},{method:'wtdepth',knob:'depth'}]
});
export const WarpModule = makeModule({ type:'warp', title:'Warp', strudelName:'warp', inputs:[AI], outputs:[AO],
  selects:[S('mode',['bend','mirror','wrap','fold'],'bend')],
  knobs:[K('amount','Amt',0,16,0,0.1)],
  compileFn(inputCode) { if (!inputCode) return null; return `${inputCode}.warp(${this.knobs.amount.value}).warpmode("${this.selects.mode?.value||'bend'}")`; }
});

// ============ OTHER EFFECTS ============
export const FreqShiftModule = makeModule({ type:'freqShift', title:'Freq Shift', strudelName:'fshift', inputs:[AI,MI], outputs:[AO], knobs:[K('amount','Amt',-2000,2000,0,1)] });
export const ChorusModule = makeModule({ type:'chorus', title:'Chorus', strudelName:'chorus', inputs:[AI,MI], outputs:[AO], knobs:[K('amount','Amt',0,1,0.5,0.01)] });
export const PulseWidthModule = makeChain({ type:'pulseWidth', title:'Pulse Width', strudelName:'pw', inputs:[AI], outputs:[AO],
  knobs:[K('pw','PW',0,1,0.5,0.01),K('rate','Rate',0.1,20,1,0.1),K('sweep','Sweep',0,1,0,0.01)],
  params:[{method:'pw',knob:'pw'},{method:'pwrate',knob:'rate'},{method:'pwsweep',knob:'sweep'}]
});
export const RingModModule = makeChain({ type:'ringMod', title:'Ring Mod', strudelName:'ring', inputs:[AI], outputs:[AO],
  knobs:[K('ring','Ring',0,1,0,0.01),K('freq','Freq',20,5000,440,1)],
  params:[{method:'ring',knob:'ring'},{method:'ringf',knob:'freq'}]
});
export const SpectralModule = makeModule({ type:'spectral', title:'Spectral', strudelName:'octer', inputs:[AI], outputs:[AO],
  selects:[S('effect',['octer','enhance','comb','smear','freeze','scram','binshift'],'octer')],
  knobs:[K('amount','Amt',0,1,0.5,0.01)],
  compileFn(inputCode) { if (!inputCode) return null; return `${inputCode}.${this.selects.effect?.value||'octer'}(${this.knobs.amount.value})`; }
});

// ============ MISC AUDIO ============
export const NudgeModule = makeModule({ type:'nudge', title:'Nudge', strudelName:'nudge', inputs:[PI], outputs:[PO], knobs:[K('amount','Amt',-1,1,0,0.001)] });
export const DrywetModule = makeModule({ type:'drywet', title:'Dry/Wet', strudelName:'drywet', inputs:[AI,MI], outputs:[AO], knobs:[K('mix','Mix',0,1,0.5,0.01)] });
export const BusModule = makeModule({ type:'bus', title:'Bus', strudelName:'bus', inputs:[AI], outputs:[AO], knobs:[K('number','Bus',0,15,0,1)] });
export const OvergainModule = makeModule({ type:'overgain', title:'Overdrive', strudelName:'overgain', inputs:[AI,MI], outputs:[AO], knobs:[K('gain','Gain',0,10,1,0.1)] });
export const ExpressionModule = makeModule({ type:'expression', title:'Expression', strudelName:'expression', inputs:[PI], outputs:[PO], knobs:[K('value','Val',0,127,127,1)] });

// ============ MIDI ============
export const MidiCCModule = makeChain({ type:'midiCC', title:'MIDI CC', strudelName:'ccn', inputs:[PI,MI], outputs:[PO],
  knobs:[K('ccn','CC#',0,127,1,1),K('ccv','Val',0,127,64,1)],
  params:[{method:'ccn',knob:'ccn'},{method:'ccv',knob:'ccv'}]
});
export const MidiBendModule = makeModule({ type:'midiBend', title:'Pitch Bend', strudelName:'midibend', inputs:[PI,MI], outputs:[PO], knobs:[K('bend','Bend',-8192,8192,0,1)] });
export const MidiTouchModule = makeModule({ type:'midiTouch', title:'Aftertouch', strudelName:'miditouch', inputs:[PI,MI], outputs:[PO], knobs:[K('pressure','Prs',0,127,0,1)] });
export const ProgChangeModule = makeModule({ type:'progChange', title:'Program Change', strudelName:'progNum', inputs:[PI], outputs:[PO], knobs:[K('number','Prog',0,127,0,1)] });

// ============ MUSICAL ============
export const ScaleModule = makeModule({ type:'scale', title:'Scale', strudelName:'scale', inputs:[PI], outputs:[PO],
  selects:[S('scaleName',['major','minor','dorian','mixolydian','lydian','phrygian','locrian','harmonic minor','melodic minor','whole tone','pentatonic','blues','chromatic'],'major')],
  compileFn(inputCode) { if (!inputCode) return null; return `${inputCode}.scale("${this.selects.scaleName?.value||'major'}")`; }
});
export const TransposeModule = makeModule({ type:'transpose', title:'Transpose', strudelName:'transpose', inputs:[PI,MI], outputs:[PO], knobs:[K('semi','Semi',-24,24,0,1)] });
export const ScaleTransposeModule = makeModule({ type:'scaleTranspose', title:'Scale Trans', strudelName:'scaleTranspose', inputs:[PI,MI], outputs:[PO], knobs:[K('degrees','Deg',-12,12,0,1)] });
export const ChordModule = makeModule({ type:'chord', title:'Chord', strudelName:'chord', inputs:[PI], outputs:[PO],
  selects:[S('chordName',['major','minor','7','m7','maj7','dim','aug','sus2','sus4','9','m9','11','13'],'major')],
  compileFn(inputCode) { if (!inputCode) return null; return `${inputCode}.chord("${this.selects.chordName?.value||'major'}")`; }
});
export const ArpModule = makeModule({ type:'arp', title:'Arpeggio', strudelName:'arp', inputs:[PI], outputs:[PO],
  selects:[S('mode',['up','down','updown','downup','converge','diverge','random'],'up')],
  compileFn(inputCode) { if (!inputCode) return null; return `${inputCode}.arp("${this.selects.mode?.value||'up'}")`; }
});
export const VoicingModule = makeModule({ type:'voicing', title:'Voicing', strudelName:'voicing', inputs:[PI], outputs:[PO] });

// ============ VISUALIZATION ============
export const PunchcardModule = makeModule({ type:'punchcard', title:'Punchcard', strudelName:'punchcard', inputs:[PI], outputs:[],
  compileFn(inputCode) { if (!inputCode) return null; return `${inputCode}.punchcard()`; }
});
export const WordfallModule = makeModule({ type:'wordfall', title:'Wordfall', strudelName:'wordfall', inputs:[PI], outputs:[],
  compileFn(inputCode) { if (!inputCode) return null; return `${inputCode}.wordfall()`; }
});
export const PitchwheelModule = makeModule({ type:'pitchwheel', title:'Pitch Wheel', strudelName:'pitchwheel', inputs:[PI], outputs:[],
  compileFn(inputCode) { if (!inputCode) return null; return `${inputCode}.pitchwheel()`; }
});

// ============ MISC PATTERN OPS ============
export const MorphModule = makeModule({ type:'morph', title:'Morph', strudelName:'morph', inputs:[PI,MI], outputs:[PO], knobs:[K('amount','Amt',0,1,0.5,0.01)] });
export const XfadeModule = makeModule({ type:'xfade', title:'Crossfade', strudelName:'xfade', inputs:[PI,MI], outputs:[PO], knobs:[K('amount','Amt',0,1,0.5,0.01)] });
export const BinaryModule = makeModule({ type:'binary', title:'Binary', strudelName:'binary', inputs:[], outputs:[PO], knobs:[K('number','Num',0,255,170,1)] });
export const TakeModule = makeModule({ type:'take', title:'Take', strudelName:'take', inputs:[PI], outputs:[PO], knobs:[K('count','N',1,64,4,1)] });
export const DropModule = makeModule({ type:'drop', title:'Drop', strudelName:'drop', inputs:[PI], outputs:[PO], knobs:[K('count','N',1,64,0,1)] });
export const ReplicateModule = makeModule({ type:'replicate', title:'Replicate', strudelName:'replicate', inputs:[PI], outputs:[PO], knobs:[K('count','N',1,16,2,1)] });

// ============ ZZFX ============
export const ZzfxModule = makeChain({ type:'zzfx', title:'ZZFX', strudelName:'zrand', inputs:[AI], outputs:[AO],
  knobs:[K('zrand','Rand',0,1,0.5,0.01),K('znoise','Noise',0,1,0,0.01),K('zmod','Mod',0,100,0,1),K('zcrush','Crush',0,16,0,1)],
  params:[{method:'zrand',knob:'zrand'},{method:'znoise',knob:'znoise'},{method:'zmod',knob:'zmod'},{method:'zcrush',knob:'zcrush'}]
});
export const ByteBeatModule = makeModule({ type:'byteBeat', title:'ByteBeat', strudelName:'bbexpr', inputs:[AI], outputs:[AO],
  selects:[S('expr',['((t>>4)&(t>>8))','t*(t>>5|t>>8)','t*((t>>9|t>>13)&25&t>>6)','(t>>6|t|t>>(t>>16))*10+((t>>11)&7)'],'((t>>4)&(t>>8))')],
  compileFn(inputCode) { if (!inputCode) return null; return `${inputCode}.bbexpr("${this.selects.expr?.value||''}")`; }
});

// ============ CATEGORY REGISTRY ============
export const BULK_CATEGORIES = [
  { name: 'Time', cssClass: 'cat-time', append: true, modules: [
    { type:'early', label:'Shift Earlier', create:()=>new EarlyModule() },
    { type:'late', label:'Shift Later', create:()=>new LateModule() },
    { type:'iterBack', label:'Rotate Back', create:()=>new IterBackModule() },
    { type:'compress', label:'Compress', create:()=>new CompressModule() },
    { type:'focus', label:'Focus', create:()=>new FocusModule() },
    { type:'linger', label:'Linger', create:()=>new LingerModule() },
    { type:'swingBy', label:'Swing By', create:()=>new SwingByModule() },
    { type:'repeatCycles', label:'Repeat Cycles', create:()=>new RepeatCyclesModule() },
    { type:'stretch', label:'Stretch', create:()=>new StretchModule() },
    { type:'cpm', label:'CPM', create:()=>new CpmModule() },
    { type:'inside', label:'Inside', create:()=>new InsideModule() },
    { type:'outside', label:'Outside', create:()=>new OutsideModule() },
  ]},
  { name: 'Structure', cssClass: 'cat-structure', append: true, modules: [
    { type:'euclidRot', label:'Euclid Rotate', create:()=>new EuclidRotModule() },
    { type:'lastOf', label:'Last Of', create:()=>new LastOfModule() },
    { type:'when', label:'When', create:()=>new WhenModule() },
    { type:'plyWith', label:'Ply With', create:()=>new PlyWithModule() },
    { type:'chunk', label:'Chunk', create:()=>new ChunkModule() },
    { type:'chunkBack', label:'Chunk Back', create:()=>new ChunkBackModule() },
    { type:'reset', label:'Reset', create:()=>new ResetModule() },
    { type:'restart', label:'Restart', create:()=>new RestartModule() },
    { type:'invert', label:'Invert', create:()=>new InvertModule() },
    { type:'brak', label:'Breakbeat', create:()=>new BrakModule() },
    { type:'press', label:'Press', create:()=>new PressModule() },
    { type:'pressBy', label:'Press By', create:()=>new PressByModule() },
    { type:'echoWith', label:'Echo With', create:()=>new EchoWithModule() },
    { type:'within', label:'Within', create:()=>new WithinModule() },
    { type:'bypass', label:'Bypass', create:()=>new BypassModule() },
    { type:'collect', label:'Collect', create:()=>new CollectModule() },
  ]},
  { name: 'Random', cssClass: 'cat-random', append: true, modules: [
    { type:'degradeBy', label:'Degrade By', create:()=>new DegradeByModule() },
    { type:'undegradeBy', label:'Undegrade By', create:()=>new UndegradeByModule() },
    { type:'shuffle', label:'Shuffle', create:()=>new ShuffleModule() },
    { type:'scramble', label:'Scramble', create:()=>new ScrambleModule() },
    { type:'someCycles', label:'Some Cycles', create:()=>new SomeCyclesModule() },
    { type:'seed', label:'Seed', create:()=>new SeedModule() },
  ]},
  { name: 'Combinator', cssClass: 'cat-combinator', modules: [
    { type:'slowcat', label:'Slow Cat', create:()=>new SlowcatModule() },
    { type:'polymeter', label:'Polymeter', create:()=>new PolymeterModule() },
    { type:'polyrhythm', label:'Polyrhythm', create:()=>new PolyrhythmModule() },
    { type:'arrange', label:'Arrange', create:()=>new ArrangeModule() },
    { type:'timeCat', label:'Time Cat', create:()=>new TimeCatModule() },
    { type:'chooseCycles', label:'Choose Cycles', create:()=>new ChooseCyclesModule() },
    { type:'randcat', label:'Random Cat', create:()=>new RandcatModule() },
    { type:'superimpose', label:'Superimpose', create:()=>new SuperimposeModule() },
    { type:'juxBy', label:'Jux By', create:()=>new JuxByModule() },
    { type:'bite', label:'Bite', create:()=>new BiteModule() },
  ]},
  { name: 'Source', cssClass: 'cat-source', append: true, modules: [
    { type:'cosine', label:'Cosine', create:()=>new CosineModule() },
    { type:'isaw', label:'Inv Sawtooth', create:()=>new IsawModule() },
    { type:'time', label:'Time', create:()=>new TimeModule() },
    { type:'mouseX', label:'Mouse X', create:()=>new MouseXModule() },
    { type:'mouseY', label:'Mouse Y', create:()=>new MouseYModule() },
    { type:'silence', label:'Silence', create:()=>new SilenceModule() },
    { type:'pure', label:'Pure', create:()=>new PureModule() },
    { type:'run', label:'Run', create:()=>new RunModule() },
    { type:'steady', label:'Steady', create:()=>new SteadyModule() },
    { type:'brand', label:'Random Bool', create:()=>new BrandModule() },
    { type:'sound', label:'Sound', create:()=>new SoundModule() },
    { type:'hush', label:'Hush', create:()=>new HushModule() },
  ]},
  { name: 'Math', cssClass: 'cat-math', modules: [
    { type:'add', label:'Add', create:()=>new AddModule() },
    { type:'sub', label:'Subtract', create:()=>new SubModule() },
    { type:'mul', label:'Multiply', create:()=>new MulModule() },
    { type:'div', label:'Divide', create:()=>new DivModule() },
    { type:'modulo', label:'Modulo', create:()=>new ModuloModule() },
    { type:'pow', label:'Power', create:()=>new PowModule() },
    { type:'round', label:'Round', create:()=>new RoundModule() },
    { type:'floor', label:'Floor', create:()=>new FloorModule() },
    { type:'ceil', label:'Ceiling', create:()=>new CeilModule() },
    { type:'clamp', label:'Clamp', create:()=>new ClampModule() },
    { type:'rangex', label:'Exp Range', create:()=>new RangexModule() },
    { type:'range2', label:'Bipolar Range', create:()=>new Range2Module() },
    { type:'toBipolar', label:'To Bipolar', create:()=>new ToBipolarModule() },
    { type:'fromBipolar', label:'From Bipolar', create:()=>new FromBipolarModule() },
  ]},
  { name: 'Sample', cssClass: 'cat-sample', append: true, modules: [
    { type:'splice', label:'Splice', create:()=>new SpliceModule() },
    { type:'begin', label:'Begin', create:()=>new BeginModule() },
    { type:'end', label:'End', create:()=>new EndModule() },
    { type:'loop', label:'Loop', create:()=>new LoopModule() },
    { type:'loopBegin', label:'Loop Begin', create:()=>new LoopBeginModule() },
    { type:'loopEnd', label:'Loop End', create:()=>new LoopEndModule() },
    { type:'cut', label:'Cut Group', create:()=>new CutModule() },
    { type:'clip', label:'Clip/Legato', create:()=>new ClipModule() },
    { type:'bank', label:'Bank', create:()=>new BankModule() },
    { type:'sampleN', label:'Sample N', create:()=>new SampleNModule() },
  ]},
  { name: 'Effect', cssClass: 'cat-effect', append: true, modules: [
    { type:'lpFilterEnv', label:'LP Filter Env', create:()=>new LpFilterEnvModule() },
    { type:'hpFilterEnv', label:'HP Filter Env', create:()=>new HpFilterEnvModule() },
    { type:'bpFilterEnv', label:'BP Filter Env', create:()=>new BpFilterEnvModule() },
    { type:'lpFilterLfo', label:'LP Filter LFO', create:()=>new LpFilterLfoModule() },
    { type:'hpFilterLfo', label:'HP Filter LFO', create:()=>new HpFilterLfoModule() },
    { type:'bpFilterLfo', label:'BP Filter LFO', create:()=>new BpFilterLfoModule() },
    { type:'ftype', label:'Filter Type', create:()=>new FtypeModule() },
    { type:'delaySync', label:'Delay Sync', create:()=>new DelaySyncModule() },
    { type:'reverbMod', label:'Reverb Mod', create:()=>new ReverbModModule() },
    { type:'drive', label:'Drive', create:()=>new DriveModule() },
    { type:'waveloss', label:'Waveloss', create:()=>new WavelossModule() },
    { type:'krush', label:'Spectral Crush', create:()=>new KrushModule() },
    { type:'triode', label:'Triode', create:()=>new TriodeModule() },
    { type:'waveshaper', label:'Waveshaper', create:()=>new WaveshaperModule() },
    { type:'postgain', label:'Post Gain', create:()=>new PostgainModule() },
    { type:'velocity', label:'Velocity', create:()=>new VelocityModule() },
    { type:'hold', label:'Hold', create:()=>new HoldModule() },
    { type:'gate', label:'Gate', create:()=>new GateModule2() },
    { type:'fadeTime', label:'Fade Time', create:()=>new FadeTimeModule() },
    { type:'panMod', label:'Pan Mod', create:()=>new PanModModule() },
    { type:'tremoloMod', label:'Tremolo Mod', create:()=>new TremoloModModule() },
    { type:'phaserMod', label:'Phaser Mod', create:()=>new PhaserModModule() },
    { type:'fmOperator', label:'FM Operator', create:()=>new FmOperatorModule() },
    { type:'freq', label:'Frequency', create:()=>new FreqModule() },
    { type:'detune', label:'Detune', create:()=>new DetuneModule() },
    { type:'unison', label:'Unison', create:()=>new UnisonModule() },
    { type:'spread', label:'Spread', create:()=>new SpreadModule() },
    { type:'accelerate', label:'Accelerate', create:()=>new AccelerateModule() },
    { type:'slide', label:'Slide', create:()=>new SlideModule() },
    { type:'semitone', label:'Semitone', create:()=>new SemitoneModule() },
    { type:'octave', label:'Octave', create:()=>new OctaveModule() },
    { type:'pitchEnv', label:'Pitch Env', create:()=>new PitchEnvModule() },
    { type:'vibrato', label:'Vibrato', create:()=>new VibratoModule() },
    { type:'wtMod', label:'WT Mod', create:()=>new WtModModule() },
    { type:'wtLfo', label:'WT LFO', create:()=>new WtLfoModule() },
    { type:'warp', label:'Warp', create:()=>new WarpModule() },
    { type:'freqShift', label:'Freq Shift', create:()=>new FreqShiftModule() },
    { type:'chorus', label:'Chorus', create:()=>new ChorusModule() },
    { type:'pulseWidth', label:'Pulse Width', create:()=>new PulseWidthModule() },
    { type:'ringMod', label:'Ring Mod', create:()=>new RingModModule() },
    { type:'spectral', label:'Spectral', create:()=>new SpectralModule() },
    { type:'nudge', label:'Nudge', create:()=>new NudgeModule() },
    { type:'drywet', label:'Dry/Wet', create:()=>new DrywetModule() },
    { type:'bus', label:'Bus', create:()=>new BusModule() },
    { type:'overgain', label:'Overdrive', create:()=>new OvergainModule() },
    { type:'expression', label:'Expression', create:()=>new ExpressionModule() },
  ]},
  { name: 'MIDI', cssClass: 'cat-midi', append: true, modules: [
    { type:'midiCC', label:'MIDI CC', create:()=>new MidiCCModule() },
    { type:'midiBend', label:'Pitch Bend', create:()=>new MidiBendModule() },
    { type:'midiTouch', label:'Aftertouch', create:()=>new MidiTouchModule() },
    { type:'progChange', label:'Program Change', create:()=>new ProgChangeModule() },
  ]},
  { name: 'Musical', cssClass: 'cat-musical', modules: [
    { type:'scale', label:'Scale', create:()=>new ScaleModule() },
    { type:'transpose', label:'Transpose', create:()=>new TransposeModule() },
    { type:'scaleTranspose', label:'Scale Trans', create:()=>new ScaleTransposeModule() },
    { type:'chord', label:'Chord', create:()=>new ChordModule() },
    { type:'arp', label:'Arpeggio', create:()=>new ArpModule() },
    { type:'voicing', label:'Voicing', create:()=>new VoicingModule() },
  ]},
  { name: 'Visualize', cssClass: 'cat-viz', append: true, modules: [
    { type:'punchcard', label:'Punchcard', create:()=>new PunchcardModule() },
    { type:'wordfall', label:'Wordfall', create:()=>new WordfallModule() },
    { type:'pitchwheel', label:'Pitch Wheel', create:()=>new PitchwheelModule() },
  ]},
  { name: 'Pattern Ops', cssClass: 'cat-misc', modules: [
    { type:'morph', label:'Morph', create:()=>new MorphModule() },
    { type:'xfade', label:'Crossfade', create:()=>new XfadeModule() },
    { type:'binary', label:'Binary', create:()=>new BinaryModule() },
    { type:'take', label:'Take', create:()=>new TakeModule() },
    { type:'drop', label:'Drop', create:()=>new DropModule() },
    { type:'replicate', label:'Replicate', create:()=>new ReplicateModule() },
  ]},
  { name: 'ZZFX', cssClass: 'cat-zzfx', modules: [
    { type:'zzfx', label:'ZZFX', create:()=>new ZzfxModule() },
    { type:'byteBeat', label:'ByteBeat', create:()=>new ByteBeatModule() },
  ]},
];
