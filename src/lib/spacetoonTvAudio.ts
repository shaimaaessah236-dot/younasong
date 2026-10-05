// Spacetoon Retro TV Audio Engine & Live FX Processor
// Provides authentic CRT TV sound effects, channel static, Spacetoon bumper chimes,
// and real-time Web Audio filters (CRT Speaker, Announcer Echo & Reverb, Cassette Tape).

class SpacetoonTvAudioEngine {
  private ctx: AudioContext | null = null;
  private staticNoiseNode: AudioBufferSourceNode | null = null;
  private staticGainNode: GainNode | null = null;
  private isStaticPlaying: boolean = false;
  
  // Microphone stream & recording for live Spacetoon announcer mode
  private micStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording: boolean = false;

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // 1. Play authentic Spacetoon Chime: "سنعود بعد قليل" (Sol-Do-Mi-Sol bell arpeggio)
  playSanoudChime(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [
        { freq: 392.00, time: 0.0, dur: 0.5 },
        { freq: 523.25, time: 0.22, dur: 0.55 },
        { freq: 659.25, time: 0.44, dur: 0.6 },
        { freq: 783.99, time: 0.68, dur: 1.2 }
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        const harm = ctx.createOscillator();
        const harmGain = ctx.createGain();
        harm.type = 'triangle';
        harm.frequency.setValueAtTime(freq * 2, now + time);

        gain.gain.setValueAtTime(0.001, now + time);
        gain.gain.exponentialRampToValueAtTime(0.35, now + time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        harmGain.gain.setValueAtTime(0.001, now + time);
        harmGain.gain.exponentialRampToValueAtTime(0.12, now + time + 0.03);
        harmGain.gain.exponentialRampToValueAtTime(0.001, now + time + dur * 0.7);

        osc.connect(gain);
        harm.connect(harmGain);
        gain.connect(ctx.destination);
        harmGain.connect(ctx.destination);

        osc.start(now + time);
        harm.start(now + time);
        osc.stop(now + time + dur);
        harm.stop(now + time + dur);
      });
    } catch (_e) {}
  }

  // 2. Play celebratory fanfare: "عُـدنـا!" (Upbeat C5 - E5 - G5 - C6)
  playOudnaFanfare(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [
        { freq: 523.25, time: 0.0, dur: 0.25 },
        { freq: 659.25, time: 0.18, dur: 0.3 },
        { freq: 783.99, time: 0.36, dur: 0.4 },
        { freq: 1046.50, time: 0.55, dur: 0.9 }
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.001, now + time);
        gain.gain.exponentialRampToValueAtTime(0.38, now + time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch (_e) {}
  }

  // 3. Channel Switch Static Buzz (Quick 180ms white noise burst)
  playChannelSwitchStatic(): void {
    try {
      const ctx = this.getAudioContext();
      const bufferSize = Math.floor(ctx.sampleRate * 0.22);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
    } catch (_e) {}
  }

  // 4. CRT Power Switch Clonk & De-gaussing Coil Whistle
  playCrtPowerClick(isOn: boolean): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const clonkOsc = ctx.createOscillator();
      const clonkGain = ctx.createGain();
      clonkOsc.type = 'square';
      clonkOsc.frequency.setValueAtTime(120, now);
      clonkOsc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

      clonkGain.gain.setValueAtTime(0.4, now);
      clonkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      clonkOsc.connect(clonkGain);
      clonkGain.connect(ctx.destination);
      clonkOsc.start(now);
      clonkOsc.stop(now + 0.08);

      if (isOn) {
        const whineOsc = ctx.createOscillator();
        const whineGain = ctx.createGain();
        whineOsc.type = 'sine';
        whineOsc.frequency.setValueAtTime(12000, now);
        whineOsc.frequency.exponentialRampToValueAtTime(15625, now + 0.3);

        whineGain.gain.setValueAtTime(0.001, now);
        whineGain.gain.exponentialRampToValueAtTime(0.03, now + 0.2);
        whineGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        whineOsc.connect(whineGain);
        whineGain.connect(ctx.destination);
        whineOsc.start(now);
        whineOsc.stop(now + 0.6);
      }
    } catch (_e) {}
  }

  // 5. Continuous Screen Static Loop
  startStaticNoise(): void {
    if (this.isStaticPlaying) return;
    try {
      const ctx = this.getAudioContext();
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      this.staticNoiseNode = ctx.createBufferSource();
      this.staticNoiseNode.buffer = buffer;
      this.staticNoiseNode.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.Q.setValueAtTime(1.0, ctx.currentTime);

      this.staticGainNode = ctx.createGain();
      this.staticGainNode.gain.setValueAtTime(0.08, ctx.currentTime);

      this.staticNoiseNode.connect(filter);
      filter.connect(this.staticGainNode);
      this.staticGainNode.connect(ctx.destination);

      this.staticNoiseNode.start();
      this.isStaticPlaying = true;
    } catch (_e) {}
  }

  stopStaticNoise(): void {
    if (!this.isStaticPlaying) return;
    try {
      if (this.staticGainNode && this.ctx) {
        this.staticGainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      }
      setTimeout(() => {
        try {
          this.staticNoiseNode?.stop();
          this.staticNoiseNode?.disconnect();
          this.staticNoiseNode = null;
        } catch (_e) {}
        this.isStaticPlaying = false;
      }, 100);
    } catch (_e) {
      this.isStaticPlaying = false;
    }
  }

  // 6. RECORD USER VOICE VIA MIC (تسجيل صوت المستخدم مع آليات أمان متعددة)
  async startVoiceRecording(): Promise<boolean> {
    try {
      this.recordedChunks = [];
      if (this.micStream) {
        this.micStream.getTracks().forEach((t) => t.stop());
        this.micStream = null;
      }

      if (typeof navigator === 'undefined') return false;

      // 1. Try standard navigator.mediaDevices.getUserMedia
      if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        try {
          this.micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });
        } catch (_complexErr) {
          try {
            this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          } catch (_simpleErr) {
            // will check legacy fallback
          }
        }
      }

      // 2. Fallback to legacy browser getUserMedia implementations
      if (!this.micStream) {
        const legacyGUM =
          (navigator as any).getUserMedia ||
          (navigator as any).webkitGetUserMedia ||
          (navigator as any).mozGetUserMedia ||
          (navigator as any).msGetUserMedia;

        if (legacyGUM) {
          this.micStream = await new Promise((resolve) => {
            legacyGUM.call(
              navigator,
              { audio: true },
              (stream: MediaStream) => resolve(stream),
              () => resolve(null)
            );
          });
        }
      }

      if (!this.micStream) return false;

      const supportedMime = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/aac',
        'audio/ogg'
      ].find((type) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type));

      const options = supportedMime ? { mimeType: supportedMime } : undefined;
      this.mediaRecorder = new MediaRecorder(this.micStream, options);

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      this.mediaRecorder.start(100);
      this.isRecording = true;
      return true;
    } catch (err) {
      console.warn('Microphone permission or hardware error:', err);
      this.isRecording = false;
      return false;
    }
  }

  // Stop recording and get the audio blob
  async stopVoiceRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        this.isRecording = false;
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.recordedChunks, { type: mimeType });
        if (this.micStream) {
          this.micStream.getTracks().forEach((t) => t.stop());
          this.micStream = null;
        }
        this.isRecording = false;
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  isMicRecording(): boolean {
    return this.isRecording;
  }

  // 7. PLAY RECORDED AUDIO WITH OFFICIAL SPACETOON ANNOUNCER DSP FILTER
  // Adds booming low-shelf broadcaster bass (+8dB at 130Hz) and studio slap-back delay
  async playWithAnnouncerFilter(audioBlob: Blob): Promise<void> {
    try {
      const ctx = this.getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume().catch(() => {});
      }

      try {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;

        // 1. Broadcaster Deep Chest Resonance (+8.5dB at 140Hz)
        const bassBoost = ctx.createBiquadFilter();
        bassBoost.type = 'lowshelf';
        bassBoost.frequency.setValueAtTime(140, ctx.currentTime);
        bassBoost.gain.setValueAtTime(8.5, ctx.currentTime);

        // 2. High-shelf warm roll-off (-3dB at 4500Hz)
        const highShelf = ctx.createBiquadFilter();
        highShelf.type = 'highshelf';
        highShelf.frequency.setValueAtTime(4500, ctx.currentTime);
        highShelf.gain.setValueAtTime(-2.5, ctx.currentTime);

        // 3. Studio Slap-back Echo (240ms delay with 35% repeat feedback)
        const delay = ctx.createDelay();
        delay.delayTime.setValueAtTime(0.24, ctx.currentTime);

        const feedback = ctx.createGain();
        feedback.gain.setValueAtTime(0.35, ctx.currentTime);

        const outputGain = ctx.createGain();
        outputGain.gain.setValueAtTime(1.2, ctx.currentTime);

        // Routing
        source.connect(bassBoost);
        bassBoost.connect(highShelf);
        highShelf.connect(outputGain);

        // Echo loop
        highShelf.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(outputGain);

        outputGain.connect(ctx.destination);
        source.start();
        return;
      } catch (decodeErr) {
        console.warn('Web Audio decode failed on blob, using HTMLAudioElement fallback:', decodeErr);
      }

      // Safe HTMLAudio fallback
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioEl = new Audio(audioUrl);
      audioEl.onended = () => URL.revokeObjectURL(audioUrl);
      await audioEl.play();
    } catch (err) {
      console.warn('Error playing audio through announcer DSP:', err);
    }
  }

  // 8. TEXT-TO-SPEECH ANNOUNCER (النطق الصوتي لمعلق سبيستون)
  speakAnnouncerLine(phrase: string): void {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'ar-SA';
        utterance.pitch = 0.85; // Deeper voice
        utterance.rate = 0.90;  // Broadcaster pacing

        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
        if (arabicVoice) utterance.voice = arabicVoice;

        window.speechSynthesis.speak(utterance);
      }
    } catch (_e) {}
  }
}

export const spacetoonTvAudio = new SpacetoonTvAudioEngine();
