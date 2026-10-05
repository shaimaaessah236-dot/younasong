// Spacetoon Dubbing Audio Engine & Real-Time Vocal Filter Processor
// Provides authentic Venus Centre (مركز الزهرة) and Spacetoon anime dubbing effects:
// 1. Vintage Radio-Style Filter (Bandpass 350Hz-3400Hz + warm saturation)
// 2. Legendary Announcer DSP (Deep broadcaster bass boost + studio slapback delay)
// 3. Venus Centre Clean Studio Dubbing (Presence EQ + plate room ambience)
// 4. Space Power Mecha / Cyborg (Metallic ring resonance)
// 5. 90s Cassette Tape (Tape saturation & warm high-cut)

export type SpacetoonVocalFilterId = 'radio' | 'announcer' | 'venus-clean' | 'mecha' | 'cassette' | 'none';

export interface SpacetoonVocalFilterConfig {
  id: SpacetoonVocalFilterId;
  name: string;
  arabicName: string;
  tagline: string;
  icon: string;
  color: string;
  badgeBg: string;
  description: string;
}

export const SPACETOON_VOCAL_FILTERS: SpacetoonVocalFilterConfig[] = [
  {
    id: 'radio',
    name: 'Vintage Anime Radio',
    arabicName: 'راديو سبيستون الكلاسيكي',
    tagline: 'صوت الإرسال اللاسلكي وراديو التسعينات',
    icon: '',
    color: '#F59E0B',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'يحاكي صوت الراديو العتيق وأجهزة الاتصال في دراغون بول، كونان والقناص عبر عزل الترددات (350Hz - 3400Hz) مع خشونة دافئة.'
  },
  {
    id: 'announcer',
    name: 'Legendary Announcer',
    arabicName: 'معلق سبيستون الفخم',
    tagline: 'صدى وضخامة صوت معلق القناة الأسطوري',
    icon: '',
    color: '#EF4444',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
    description: 'يضفي على صوتك نبرة إذاعية عميقة (+8dB Bass) وصدى استوديو مركز الزهرة الشهير عند إعلان فواصل الكواكب.'
  },
  {
    id: 'venus-clean',
    name: 'Venus Centre Studio',
    arabicName: 'دبلجة مركز الزهرة النقية',
    tagline: 'صوت الدوبلاج الكرتوني الكريستالي الصافي',
    icon: '',
    color: '#10B981',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'يحاكي ميكروفونات استوديو الزهرة بدمشق مع تعزيز وضوح مخارج الحروف وحضور نقي للشخصيات الكرتونية.'
  },
  {
    id: 'mecha',
    name: 'Space Power Mecha',
    arabicName: 'سايبورغ سبيس باور الآلي',
    tagline: 'رنين معدني لشخصيات الروبوت والأنمي الفضائي',
    icon: '',
    color: '#8B5CF6',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'يمنح صوتك طابعاً مستقبلياً معدنياً يناسب شارات سبيس باور وشخصيات الآليين مثل أجنحة الكاندام وجريندايزر.'
  },
  {
    id: 'cassette',
    name: '90s Cassette Tape',
    arabicName: 'شريط كاسيت التسعينات',
    tagline: 'دفء أشرطة الكاسيت المنزلية القديمة',
    icon: '',
    color: '#EC4899',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    description: 'يحاكي شريط الكاسيت الذهبي مع تشبع ناعم وخلفية دافئة تعيدك لذكريات الاستماع في المسجل القديم.'
  },
  {
    id: 'none',
    name: 'Raw Voice (Bypass)',
    arabicName: 'صوت نقي بدون فلتر',
    tagline: 'تسجيل مباشر من الميكروفون',
    icon: '',
    color: '#94A3B8',
    badgeBg: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    description: 'الصوت الخام الطبيعي كما تم التقاطه من الميكروفون مباشرة دون أي معالجة.'
  }
];

class SpacetoonDubbingAudioEngine {
  private ctx: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private activeSourceNode: AudioBufferSourceNode | null = null;
  private isLiveMonitoring: boolean = false;
  private monitorSourceNode: MediaStreamAudioSourceNode | null = null;

  public getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play Studio Dubbing Sync Beep (like broadcaster 3-2-1 sync pip)
  public playStudioBeep(isFinal: boolean = false): void {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isFinal ? 1200 : 880, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isFinal ? 0.35 : 0.12));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (isFinal ? 0.4 : 0.15));
    } catch (_e) {}
  }

  // Play subtle vintage radio static noise burst
  public playRadioStaticBurst(durationSec: number = 0.6): void {
    try {
      const ctx = this.getAudioContext();
      const bufferSize = ctx.sampleRate * durationSec;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.08;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, ctx.currentTime);
      filter.Q.setValueAtTime(2.0, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (_e) {}
  }

  // Create Saturation Curve for Radio Overdrive
  private createDistortionCurve(amount: number = 30): Float32Array {
    const k = amount;
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  // Build audio processing nodes for a specific filter
  public buildFilterNodes(
    filterId: SpacetoonVocalFilterId,
    targetCtx?: BaseAudioContext
  ): { input: AudioNode; output: AudioNode } {
    const ctx = (targetCtx || this.getAudioContext()) as AudioContext;
    const inputNode = ctx.createGain();
    const outputNode = ctx.createGain();

    if (filterId === 'none') {
      inputNode.connect(outputNode);
      return { input: inputNode, output: outputNode };
    }

    if (filterId === 'radio') {
      // 1. High Pass Filter: cut frequencies below 350Hz (remove deep boom)
      const hpf = ctx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.setValueAtTime(360, ctx.currentTime);
      hpf.Q.setValueAtTime(1.2, ctx.currentTime);

      // 2. Low Pass Filter: cut frequencies above 3400Hz (telephone / AM band)
      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.setValueAtTime(3300, ctx.currentTime);
      lpf.Q.setValueAtTime(1.5, ctx.currentTime);

      // 3. Peak presence boost at 1800Hz
      const peak = ctx.createBiquadFilter();
      peak.type = 'peaking';
      peak.frequency.setValueAtTime(1800, ctx.currentTime);
      peak.gain.setValueAtTime(6.0, ctx.currentTime);
      peak.Q.setValueAtTime(1.0, ctx.currentTime);

      // 4. Waveshaper saturation for subtle radio crackle
      const distortion = ctx.createWaveShaper();
      distortion.curve = this.createDistortionCurve(18) as Float32Array<ArrayBuffer>;
      distortion.oversample = '2x';

      // 5. Output level compensation
      const radioGain = ctx.createGain();
      radioGain.gain.setValueAtTime(1.3, ctx.currentTime);

      inputNode.connect(hpf);
      hpf.connect(lpf);
      lpf.connect(peak);
      peak.connect(distortion);
      distortion.connect(radioGain);
      radioGain.connect(outputNode);

      return { input: inputNode, output: outputNode };
    }

    if (filterId === 'announcer') {
      // 1. Deep Broadcaster Chest Bass (+8dB at 135Hz)
      const bass = ctx.createBiquadFilter();
      bass.type = 'lowshelf';
      bass.frequency.setValueAtTime(135, ctx.currentTime);
      bass.gain.setValueAtTime(8.5, ctx.currentTime);

      // 2. High-shelf warm roll-off (-3dB at 4500Hz)
      const highShelf = ctx.createBiquadFilter();
      highShelf.type = 'highshelf';
      highShelf.frequency.setValueAtTime(4500, ctx.currentTime);
      highShelf.gain.setValueAtTime(-2.5, ctx.currentTime);

      // 3. Studio slapback delay (210ms with 35% repeat)
      const delay = ctx.createDelay();
      delay.delayTime.setValueAtTime(0.21, ctx.currentTime);

      const feedback = ctx.createGain();
      feedback.gain.setValueAtTime(0.35, ctx.currentTime);

      const delayMix = ctx.createGain();
      delayMix.gain.setValueAtTime(0.55, ctx.currentTime);

      inputNode.connect(bass);
      bass.connect(highShelf);

      // Dry path
      highShelf.connect(outputNode);

      // Wet path (echo loop)
      highShelf.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(delayMix);
      delayMix.connect(outputNode);

      return { input: inputNode, output: outputNode };
    }

    if (filterId === 'venus-clean') {
      // 1. High Pass 75Hz (rumble cut)
      const hpf = ctx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.setValueAtTime(75, ctx.currentTime);

      // 2. Presence boost at 3200Hz for crystal vocal clarity
      const presence = ctx.createBiquadFilter();
      presence.type = 'peaking';
      presence.frequency.setValueAtTime(3200, ctx.currentTime);
      presence.gain.setValueAtTime(4.5, ctx.currentTime);
      presence.Q.setValueAtTime(1.1, ctx.currentTime);

      // 3. Air boost at 10kHz
      const air = ctx.createBiquadFilter();
      air.type = 'highshelf';
      air.frequency.setValueAtTime(10000, ctx.currentTime);
      air.gain.setValueAtTime(2.5, ctx.currentTime);

      // 4. Subtle studio room delay
      const roomDelay = ctx.createDelay();
      roomDelay.delayTime.setValueAtTime(0.045, ctx.currentTime); // 45ms room slap
      const roomGain = ctx.createGain();
      roomGain.gain.setValueAtTime(0.20, ctx.currentTime);

      inputNode.connect(hpf);
      hpf.connect(presence);
      presence.connect(air);
      air.connect(outputNode);

      // subtle room space
      air.connect(roomDelay);
      roomDelay.connect(roomGain);
      roomGain.connect(outputNode);

      return { input: inputNode, output: outputNode };
    }

    if (filterId === 'mecha') {
      // Sci-Fi ring-mod metallic resonance
      const bpf = ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.setValueAtTime(1200, ctx.currentTime);
      bpf.Q.setValueAtTime(6.0, ctx.currentTime); // High Q gives metallic resonance

      const peak2 = ctx.createBiquadFilter();
      peak2.type = 'peaking';
      peak2.frequency.setValueAtTime(2400, ctx.currentTime);
      peak2.gain.setValueAtTime(9.0, ctx.currentTime);
      peak2.Q.setValueAtTime(4.0, ctx.currentTime);

      const distortion = ctx.createWaveShaper();
      distortion.curve = this.createDistortionCurve(45) as Float32Array<ArrayBuffer>;

      inputNode.connect(bpf);
      bpf.connect(peak2);
      peak2.connect(distortion);
      distortion.connect(outputNode);

      return { input: inputNode, output: outputNode };
    }

    if (filterId === 'cassette') {
      // Warm roll-off above 6500Hz
      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.setValueAtTime(6800, ctx.currentTime);
      lpf.Q.setValueAtTime(0.8, ctx.currentTime);

      // Low mid warmth at 220Hz
      const warmth = ctx.createBiquadFilter();
      warmth.type = 'peaking';
      warmth.frequency.setValueAtTime(240, ctx.currentTime);
      warmth.gain.setValueAtTime(3.5, ctx.currentTime);

      const saturation = ctx.createWaveShaper();
      saturation.curve = this.createDistortionCurve(10) as Float32Array<ArrayBuffer>;

      inputNode.connect(warmth);
      warmth.connect(lpf);
      lpf.connect(saturation);
      saturation.connect(outputNode);

      return { input: inputNode, output: outputNode };
    }

    inputNode.connect(outputNode);
    return { input: inputNode, output: outputNode };
  }

  // Request user mic with automatic constraints fallback
  public async requestMicrophoneStream(): Promise<MediaStream | null> {
    try {
      if (this.micStream) {
        this.micStream.getTracks().forEach((t) => t.stop());
        this.micStream = null;
      }

      if (typeof navigator === 'undefined') return null;

      // 1. Try modern navigator.mediaDevices.getUserMedia
      if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        try {
          this.micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              channelCount: 1
            }
          });
          return this.micStream;
        } catch (_highFidelityErr) {
          try {
            this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return this.micStream;
          } catch (_simpleErr) {
            // fall through to legacy
          }
        }
      }

      // 2. Fallback to legacy browser getUserMedia implementations
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
        if (this.micStream) return this.micStream;
      }

      return null;
    } catch (err) {
      console.warn('Microphone access could not be acquired:', err);
      return null;
    }
  }

  // Get supported mime type for MediaRecorder
  public getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/ogg'
    ];
    for (const t of types) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
    return '';
  }

  // Start recording with given filter
  public async startRecording(stream: MediaStream): Promise<boolean> {
    try {
      this.recordedChunks = [];
      const mimeType = this.getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;
      
      this.mediaRecorder = new MediaRecorder(stream, options);
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      this.mediaRecorder.start(100);
      return true;
    } catch (err) {
      console.warn('MediaRecorder error:', err);
      return false;
    }
  }

  // Stop recording and return raw blob
  public async stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.getSupportedMimeType() || 'audio/webm';
        const blob = new Blob(this.recordedChunks, { type: mimeType });
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  // Stop active mic tracks
  public stopMicrophoneStream(): void {
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    this.stopLiveMonitoring();
  }

  // Start Live Monitoring (Hear yourself through filter in headphones)
  public startLiveMonitoring(stream: MediaStream, filterId: SpacetoonVocalFilterId): void {
    try {
      this.stopLiveMonitoring();
      const ctx = this.getAudioContext();
      this.monitorSourceNode = ctx.createMediaStreamSource(stream);
      const { input, output } = this.buildFilterNodes(filterId);
      
      this.monitorSourceNode.connect(input);
      output.connect(ctx.destination);
      this.isLiveMonitoring = true;
    } catch (err) {
      console.warn('Live monitoring error:', err);
    }
  }

  public stopLiveMonitoring(): void {
    if (this.monitorSourceNode) {
      try {
        this.monitorSourceNode.disconnect();
      } catch (_e) {}
      this.monitorSourceNode = null;
    }
    this.isLiveMonitoring = false;
  }

  // Play audio blob through filter with resilient fallback
  public async playFilteredAudio(
    audioBlob: Blob,
    filterId: SpacetoonVocalFilterId,
    onEnded?: () => void
  ): Promise<void> {
    try {
      this.stopActivePlayback();
      const ctx = this.getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume().catch(() => {});
      }

      try {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        this.activeSourceNode = source;

        const { input, output } = this.buildFilterNodes(filterId);
        source.connect(input);
        output.connect(ctx.destination);

        source.onended = () => {
          this.activeSourceNode = null;
          if (onEnded) onEnded();
        };

        source.start();
        return;
      } catch (decodeErr) {
        console.warn('Web Audio decode failed, attempting HTML5 Audio fallback:', decodeErr);
      }

      // Fallback directly to HTML5 Audio Element
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioEl = new Audio(audioUrl);
      audioEl.onended = () => {
        URL.revokeObjectURL(audioUrl);
        if (onEnded) onEnded();
      };
      audioEl.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        if (onEnded) onEnded();
      };
      await audioEl.play();
    } catch (err) {
      console.warn('Playback error:', err);
      if (onEnded) onEnded();
    }
  }

  public stopActivePlayback(): void {
    if (this.activeSourceNode) {
      try {
        this.activeSourceNode.stop();
        this.activeSourceNode.disconnect();
      } catch (_e) {}
      this.activeSourceNode = null;
    }
  }

  // Synthesize Spacetoon Iconic Quotes through SpeechSynthesis + Filter for zero-mic instant testing
  public speakQuoteThroughFilter(
    text: string,
    filterId: SpacetoonVocalFilterId,
    onEnded?: () => void
  ): void {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        
        // Pitch & rate adjusted based on filter
        if (filterId === 'announcer') {
          utterance.pitch = 0.82;
          utterance.rate = 0.90;
        } else if (filterId === 'radio') {
          utterance.pitch = 0.92;
          utterance.rate = 0.95;
        } else if (filterId === 'mecha') {
          utterance.pitch = 0.75;
          utterance.rate = 0.88;
        } else {
          utterance.pitch = 1.0;
          utterance.rate = 0.95;
        }

        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
        if (arabicVoice) utterance.voice = arabicVoice;

        utterance.onend = () => {
          if (onEnded) onEnded();
        };

        window.speechSynthesis.speak(utterance);
      } else {
        if (onEnded) onEnded();
      }
    } catch (_e) {
      if (onEnded) onEnded();
    }
  }

  // Render raw recording through vocal filter into permanent audio file (WAV)
  public async renderFilteredBlob(
    rawBlob: Blob,
    filterId: SpacetoonVocalFilterId
  ): Promise<Blob> {
    if (filterId === 'none') {
      return rawBlob;
    }

    try {
      const ctx = this.getAudioContext();
      const arrayBuffer = await rawBlob.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      const OfflineCtxClass =
        window.OfflineAudioContext ||
        (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext;

      const offlineCtx = new OfflineCtxClass(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = audioBuffer;

      const { input, output } = this.buildFilterNodes(filterId, offlineCtx);
      source.connect(input);
      output.connect(offlineCtx.destination);

      source.start(0);
      const renderedBuffer = await offlineCtx.startRendering();
      return audioBufferToWav(renderedBuffer);
    } catch (err) {
      console.warn('Failed to offline render filtered blob:', err);
      return rawBlob;
    }
  }
}

// Internal WAV encoder for OfflineAudioContext rendering
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  const channels: Float32Array[] = [];
  const sampleRate = buffer.sampleRate;
  let pos = 0;

  function setUint16(data: number) {
    out.setUint16(pos, data, true);
    pos += 2;
  }
  function setUint32(data: number) {
    out.setUint32(pos, data, true);
    pos += 4;
  }

  // RIFF header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8);
  setUint32(0x45564157); // "WAVE"

  // fmt subchunk
  setUint32(0x20746d66); // "fmt "
  setUint32(16); // 16 for PCM
  setUint16(1); // PCM format
  setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan); // byte rate
  setUint16(numOfChan * 2); // block align
  setUint16(16); // bits per sample

  // data subchunk
  setUint32(0x61746164); // "data"
  setUint32(length - pos - 4);

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  let offset = 0;
  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      out.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([out.buffer], { type: 'audio/wav' });
}

export const spacetoonDubbingAudio = new SpacetoonDubbingAudioEngine();
