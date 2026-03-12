// Audio Engine — wraps Strudel/WebAudio for pattern evaluation and playback

export class Engine {
  constructor() {
    this.initialized = false;
    this.playing = false;
    this._strudel = null;   // module-level exports (evaluate, hush, initStrudel, samples)
    this._repl = null;      // repl object returned by initStrudel (has setcps, setCps)
    this._sampleImports = new Set(); // e.g. "samples('github:user/repo')"
  }

  async init() {
    if (this.initialized) return;

    // Import strudel using a relative path from src/ to node_modules/
    this._strudel = await import('../node_modules/@strudel/web/dist/index.mjs');

    // initStrudel sets up AudioContext, loads synth sounds, registers modules
    // prebake loads default drum/percussion samples so bd, sd, hh etc. work
    const strudel = this._strudel;
    this._repl = await strudel.initStrudel({
      prebake: async () => {
        try {
          await strudel.samples('github:tidalcycles/dirt-samples');
          console.log('[Malstrom] Default samples loaded');
        } catch (err) {
          console.warn('[Malstrom] Could not load default samples:', err.message);
        }
      }
    });
    this.initialized = true;
  }

  async play(code) {
    if (!this.initialized) await this.init();

    if (!code || !code.trim()) {
      throw new Error('No code to evaluate — connect modules to an Output');
    }

    // Prepend sample pack imports
    let fullCode = code;
    if (this._sampleImports.size > 0) {
      const imports = [...this._sampleImports].join('\n');
      fullCode = imports + '\n' + code;
    }

    // Append trigger hook for per-note visualization
    fullCode += `.onTrigger((hap) => window.__malstromTrigger?.(hap), false)`;

    console.log('[Malstrom] Evaluating:', fullCode);

    try {
      await this._strudel.evaluate(fullCode);
    } catch (err) {
      console.error('[Malstrom] Evaluate failed:', err, '\nCode:', fullCode);
      throw new Error(`Strudel eval: ${err.message}`);
    }
    this.playing = true;
  }

  async stop() {
    try {
      if (this._strudel && this.initialized) {
        this._strudel.hush();
      }
    } catch (err) {
      console.error('Stop error:', err);
    }
    this.playing = false;
  }

  setBpm(bpm) {
    if (this._repl?.setcps) {
      this._repl.setcps(bpm / 60 / 4);
    }
  }

  addSampleImport(importCode) {
    this._sampleImports.add(importCode);
  }

  removeSampleImport(importCode) {
    this._sampleImports.delete(importCode);
  }

  getSampleImports() {
    return [...this._sampleImports];
  }

  async initAudio() {
    await this.init();
  }

  isPlaying() {
    return this.playing;
  }

  isInitialized() {
    return this.initialized;
  }
}
