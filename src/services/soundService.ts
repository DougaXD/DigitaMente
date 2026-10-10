/**
 * Sound Service - Síntese de áudio de alta fidelidade via Web Audio API (v1.1)
 * 
 * Cadeia de áudio:
 * Fonte -> VoiceGain -> MasterGain -> DynamicsCompressorNode -> Destination
 * Ganho de compensação de ~2.5x com compressão dinâmica sem clipping.
 */

import { KeySoundProfile, ErrorSoundProfile } from '../types';

class SoundService {
  private audioCtx: AudioContext | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private isMuted: boolean = false;
  private masterVolume: number = 0.5; // Padrão 50%
  private keyVolume: number = 0.7;   // Padrão 70%
  private errorVolume: number = 1.0; // Padrão 100%

  private keyProfile: KeySoundProfile = 'mechanical';
  private errorProfile: ErrorSoundProfile = 'buzzer';

  // Controle de vozes simultâneas (até 8 vozes)
  private activeVoicesCount: number = 0;
  private readonly MAX_VOICES = 8;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.audioCtx && this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }
      });
      window.addEventListener('focus', () => {
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }
      });
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return null;
      this.audioCtx = new AudioContextClass();

      // Dynamics Compressor: threshold -10 dB, ratio 4, attack 3 ms, release 120 ms
      this.compressor = this.audioCtx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-10, this.audioCtx.currentTime);
      this.compressor.knee.setValueAtTime(6, this.audioCtx.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.audioCtx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.audioCtx.currentTime);
      this.compressor.release.setValueAtTime(0.12, this.audioCtx.currentTime);

      // Master Gain com compensação ~2.5x
      this.masterGain = this.audioCtx.createGain();
      this.updateMasterGain();

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.audioCtx.destination);

      // Prepara buffer de ruído branco estático reutilizável (1 segundo)
      const bufferSize = this.audioCtx.sampleRate;
      this.noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    return this.audioCtx;
  }

  private updateMasterGain(): void {
    if (this.masterGain && this.audioCtx) {
      const compGain = 2.5; // Ganho compensatório para soar alto e encorpado
      const target = this.isMuted ? 0 : this.masterVolume * compGain;
      this.masterGain.gain.setValueAtTime(target, this.audioCtx.currentTime);
    }
  }

  public setVolume(vol: number): void {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    this.updateMasterGain();
  }

  public setKeyVolume(vol: number): void {
    this.keyVolume = Math.max(0, Math.min(1, vol));
  }

  public setErrorVolume(vol: number): void {
    this.errorVolume = Math.max(0, Math.min(1, vol));
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    this.updateMasterGain();
  }

  public setKeyProfile(profile: KeySoundProfile): void {
    this.keyProfile = profile;
  }

  public setErrorProfile(profile: ErrorSoundProfile): void {
    this.errorProfile = profile;
  }

  public resume(): void {
    this.initContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  /**
   * Som de tecla sintetizado com variação natural e perfis
   */
  public playKeySound(keyType: 'regular' | 'space' | 'backspace' = 'regular', customProfile?: KeySoundProfile): void {
    if (this.isMuted || this.masterVolume <= 0 || this.keyVolume <= 0) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    if (this.activeVoicesCount >= this.MAX_VOICES) return;
    this.activeVoicesCount++;

    const now = ctx.currentTime;
    const profile = customProfile || this.keyProfile;

    // Variação orgânica aleatória: tom ±6%, volume ±10%
    const pitchRatio = 1 + (Math.random() * 0.12 - 0.06);
    const volVariance = 1 + (Math.random() * 0.2 - 0.1);
    const effectiveVol = Math.min(1, this.keyVolume * volVariance);

    const voiceGain = ctx.createGain();
    voiceGain.connect(this.masterGain);

    const cleanup = (delay: number) => {
      setTimeout(() => {
        this.activeVoicesCount = Math.max(0, this.activeVoicesCount - 1);
        try { voiceGain.disconnect(); } catch (_) {}
      }, delay * 1000 + 50);
    };

    if (profile === 'membrane') {
      // Perfil Suave (membrana): sem ruído agudo, thock discreto filtrado
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      const baseFreq = keyType === 'space' ? 120 : 180;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq * pitchRatio, now);
      osc.frequency.exponentialRampToValueAtTime(70 * pitchRatio, now + 0.05);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.35 * effectiveVol, now + 0.002);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(voiceGain);

      osc.start(now);
      osc.stop(now + 0.06);
      cleanup(0.06);
      return;
    }

    if (profile === 'clicky') {
      // Perfil Clicky: click seco em 4500Hz + thock muito curto
      if (this.noiseBuffer) {
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = this.noiseBuffer;
        const noiseFilter = ctx.createBiquadFilter();
        const noiseGain = ctx.createGain();

        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(4500 * pitchRatio, now);
        noiseFilter.Q.setValueAtTime(2.0, now);

        noiseGain.gain.setValueAtTime(0.001, now);
        noiseGain.gain.linearRampToValueAtTime(0.6 * effectiveVol, now + 0.001);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(voiceGain);

        noiseSource.start(now);
        noiseSource.stop(now + 0.025);
      }

      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280 * pitchRatio, now);
      osc.frequency.exponentialRampToValueAtTime(140 * pitchRatio, now + 0.03);

      oscGain.gain.setValueAtTime(0.2 * effectiveVol, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(oscGain);
      oscGain.connect(voiceGain);
      osc.start(now);
      osc.stop(now + 0.035);

      cleanup(0.04);
      return;
    }

    // Perfil Mecânico (padrão 'mechanical' - Thock autêntico):
    // Camada click (55%): ruído branco com bandpass ~3000 Hz, Q ~1.2
    if (this.noiseBuffer) {
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = this.noiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      const noiseGain = ctx.createGain();

      const clickFreq = keyType === 'backspace' ? 3600 : 2900;
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(clickFreq * pitchRatio, now);
      noiseFilter.Q.setValueAtTime(1.2, now);

      const decayTime = keyType === 'backspace' ? 0.02 : 0.032;
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.55 * effectiveVol, now + 0.001);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + decayTime);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(voiceGain);

      noiseSource.start(now);
      noiseSource.stop(now + decayTime + 0.005);
    }

    // Camada thock (45%): oscilador 160-220Hz caindo para ~120Hz
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    const thockStart = keyType === 'space' ? 140 : keyType === 'backspace' ? 240 : 200;
    const thockEnd = keyType === 'space' ? 95 : 120;
    const thockDuration = keyType === 'space' ? 0.11 : 0.075;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(thockStart * pitchRatio, now);
    osc.frequency.exponentialRampToValueAtTime(thockEnd * pitchRatio, now + 0.05);

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(0.48 * effectiveVol, now + 0.001);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + thockDuration);

    osc.connect(oscGain);
    oscGain.connect(voiceGain);

    osc.start(now);
    osc.stop(now + thockDuration + 0.01);

    cleanup(thockDuration + 0.02);
  }

  /**
   * Som de erro inconfundível (3 perfis selecionáveis)
   */
  public playErrorSound(customProfile?: ErrorSoundProfile): void {
    if (this.isMuted || this.masterVolume <= 0 || this.errorVolume <= 0) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const profile = customProfile || this.errorProfile;
    const effectiveVol = Math.min(1, this.errorVolume);

    const voiceGain = ctx.createGain();
    voiceGain.connect(this.masterGain);

    if (profile === 'descending_beep') {
      // Dois bipes senoidais: 440 Hz e depois 330 Hz, 90 ms cada
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);
      g1.gain.setValueAtTime(0.45 * effectiveVol, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
      osc1.connect(g1);
      g1.connect(voiceGain);
      osc1.start(now);
      osc1.stop(now + 0.09);

      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(330, now + 0.095);
      g2.gain.setValueAtTime(0.45 * effectiveVol, now + 0.095);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.185);
      osc2.connect(g2);
      g2.connect(voiceGain);
      osc2.start(now + 0.095);
      osc2.stop(now + 0.19);
      return;
    }

    if (profile === 'dry_knock') {
      // Toc seco: impacto curto e grave, mais percussivo
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.07);

      g.gain.setValueAtTime(0.7 * effectiveVol, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(g);
      g.connect(voiceGain);
      osc.start(now);
      osc.stop(now + 0.08);
      return;
    }

    // Perfil Padrão: Buzzer
    // Dois pulsos de onda dente-de-serra com lowpass em ~900 Hz:
    // ~180 Hz por 90 ms, pausa de 30 ms, ~140 Hz por 140 ms (descendente)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);
    filter.connect(voiceGain);

    // Pulso 1
    const osc1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(180, now);
    g1.gain.setValueAtTime(0.55 * effectiveVol, now);
    g1.gain.linearRampToValueAtTime(0.45 * effectiveVol, now + 0.07);
    g1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc1.connect(g1);
    g1.connect(filter);
    osc1.start(now);
    osc1.stop(now + 0.095);

    // Pulso 2
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(155, now + 0.12);
    osc2.frequency.linearRampToValueAtTime(125, now + 0.26);
    g2.gain.setValueAtTime(0.55 * effectiveVol, now + 0.12);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
    osc2.connect(g2);
    g2.connect(filter);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.265);
  }

  /**
   * Som de conclusão harmonioso e suave
   */
  public playCompletionSound(): void {
    if (this.isMuted || this.masterVolume <= 0) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, index) => {
      const noteTime = now + index * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      const peakVol = 0.35;
      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(peakVol, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(noteTime);
      osc.stop(noteTime + 0.42);
    });
  }

  // Métodos de teste para a tela de configurações
  public testKeySound(profile: KeySoundProfile): void {
    this.playKeySound('regular', profile);
  }

  public testErrorSound(profile: ErrorSoundProfile): void {
    this.playErrorSound(profile);
  }
}

export const soundService = new SoundService();
