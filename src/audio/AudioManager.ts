interface ActiveLoop {
  oscillator: OscillatorNode;
  gain: GainNode;
}

export class AudioManager {
  private context: AudioContext | null = null;
  private ambientLoop: ActiveLoop | null = null;
  private textureLoop: ActiveLoop | null = null;
  private subtitleCallback: ((text: string) => void) | null = null;
  private allowAudio = false;

  attachSubtitleCallback(callback: (text: string) => void) {
    this.subtitleCallback = callback;
  }

  requestStart() {
    if (this.context) {
      return;
    }
    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.allowAudio = true;
    } catch (error) {
      console.warn('AudioContext unavailable', error);
      this.allowAudio = false;
    }
  }

  playAmbient(sceneName: string) {
    if (!this.allowAudio) {
      return;
    }
    this.stopAmbient();
    const context = this.context;
    if (!context) {
      return;
    }
    this.ambientLoop = this.createHum(context, 45, 0.08);
    this.textureLoop = this.createHum(context, 220, 0.02, 'sawtooth');
    this.speak(`Ambient: ${sceneName}`);
  }

  trigger(name: string, intensity = 0.2) {
    if (!this.allowAudio || !this.context) {
      return;
    }
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = 'sine';
    osc.frequency.value = 200 + Math.random() * 200;
    gain.gain.value = intensity;
    osc.connect(gain).connect(this.context.destination);
    osc.start();
    osc.stop(this.context.currentTime + 0.6);
    this.speak(name);
  }

  stopAmbient() {
    if (this.ambientLoop) {
      this.fadeOut(this.ambientLoop);
      this.ambientLoop = null;
    }
    if (this.textureLoop) {
      this.fadeOut(this.textureLoop);
      this.textureLoop = null;
    }
  }

  private createHum(
    context: AudioContext,
    frequency: number,
    gainValue: number,
    type: OscillatorType = 'sine'
  ): ActiveLoop {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = gainValue;
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    return { oscillator, gain };
  }

  private fadeOut(loop: ActiveLoop) {
    if (!this.context) {
      return;
    }
    const now = this.context.currentTime;
    loop.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    loop.oscillator.stop(now + 0.6);
  }

  private speak(text: string) {
    if (this.subtitleCallback) {
      this.subtitleCallback(text);
    }
  }
}

export const audioManager = new AudioManager();
