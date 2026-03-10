// Audio Engine — wraps Strudel/WebAudio for pattern evaluation and playback

export class Engine {
  constructor() {
    this.initialized = false;
    this.playing = false;
    this._strudel = null;   // module-level exports (evaluate, hush, initStrudel, samples)
    this._repl = null;      // repl object returned by initStrudel (has setcps, setCps)
    this._useCdnSamples = false;
  }

  async init() {
    if (this.initialized) return;

    // Import the pre-bundled strudel dist using the path from preload
    const strudelPath = window.malstrom?.strudelPath;
    if (strudelPath) {
      this._strudel = await import(strudelPath);
    } else {
      this._strudel = await import('@strudel/web');
    }

    // initStrudel sets up AudioContext, loads synth sounds, registers modules
    // It returns a repl object with { evaluate, hush, setcps, setCps, ... }
    this._repl = await this._strudel.initStrudel();
    this.initialized = true;
  }

  async play(code) {
    if (!this.initialized) await this.init();

    if (!code || !code.trim()) {
      throw new Error('No code to evaluate — connect modules to an Output');
    }

    // Prepend CDN samples loader if needed
    let fullCode = code;
    if (this._useCdnSamples) {
      fullCode = `await samples('github:tidalcycles/Dirt-Samples')\n${code}`;
    }

    await this._strudel.evaluate(fullCode);
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
    // setcps is on the repl object, not a module-level export
    if (this._repl?.setcps) {
      this._repl.setcps(bpm / 60 / 4);
    }
  }

  enableCdnSamples() {
    this._useCdnSamples = true;
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
