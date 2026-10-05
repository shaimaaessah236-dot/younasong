// Acoustic Audio Engine - High-Fidelity Melodic Synthesis for YONA SONGS & Quiz Challenges
// Renders musical acoustic piano, nylon guitar, and celesta timbres with accurate note frequencies,
// true musical phrasing, micro-timing, and harmonic resonance.

export interface AcousticSnippetConfig {
  instrument: 'piano' | 'guitar' | 'musicbox';
  bpm: number;
  notes: { pitch: number; duration: number; delay: number; velocity?: number }[];
  cutoffSeconds: number; // Cut off right at the suspense hook!
}

// Standard Equal Temperament Note Frequencies (Hz)
export const NOTE_FREQS: Record<string, number> = {
  C3: 130.81, Db3: 138.59, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, Fs3: 185.00, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
  C4: 261.63, Db4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, Db5: 554.37, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Ab5: 830.61, A5: 880.00, Bb5: 932.33, B5: 987.77,
  C6: 1046.50
};

// Accurate Acoustic Melodic Hooks (Arabic Classics, Iconic Anime & Spacetoon Themes)
export const ACOUSTIC_SNIPPETS: Record<string, AcousticSnippetConfig> = {
  // 1. أنا وأخي: "شوقٌ يدفعني لأراها.. أمي ذكرى لا أنساها" (F Major / D Minor)
  'ana-wa-akhi': {
    instrument: 'piano',
    bpm: 90,
    cutoffSeconds: 6.2,
    notes: [
      { pitch: 349.23, duration: 0.55, delay: 0.0, velocity: 0.85 }, // F4 (شوق)
      { pitch: 392.00, duration: 0.55, delay: 0.55, velocity: 0.88 },// G4 (يد)
      { pitch: 440.00, duration: 0.90, delay: 1.10, velocity: 0.95 },// A4 (فعـ)
      { pitch: 466.16, duration: 0.50, delay: 2.00, velocity: 0.90 },// Bb4 (ني)
      { pitch: 440.00, duration: 0.70, delay: 2.50, velocity: 0.92 },// A4 (لأ)
      { pitch: 392.00, duration: 0.60, delay: 3.20, velocity: 0.85 },// G4 (را)
      { pitch: 349.23, duration: 1.10, delay: 3.80, velocity: 0.90 },// F4 (ها)
      { pitch: 329.63, duration: 0.60, delay: 4.90, velocity: 0.80 },// E4 (أمـ)
      { pitch: 293.66, duration: 1.20, delay: 5.50, velocity: 0.85 } // D4 (ـي) [Cliffhanger!]
    ]
  },

  // 2. القناص: "قد لمعت عيناه.. بالعزم انتفضت آماله" (A Minor)
  'hunter-qannas': {
    instrument: 'guitar',
    bpm: 120,
    cutoffSeconds: 5.6,
    notes: [
      { pitch: 220.00, duration: 0.40, delay: 0.0, velocity: 0.90 },  // A3 (قد)
      { pitch: 261.63, duration: 0.40, delay: 0.40, velocity: 0.92 }, // C4 (لمـ)
      { pitch: 293.66, duration: 0.45, delay: 0.80, velocity: 0.95 }, // D4 (ـعت)
      { pitch: 329.63, duration: 0.80, delay: 1.25, velocity: 1.00 }, // E4 (عيـ)
      { pitch: 329.63, duration: 0.50, delay: 2.05, velocity: 0.85 }, // E4 (ـنا)
      { pitch: 293.66, duration: 0.80, delay: 2.55, velocity: 0.90 }, // D4 (ـه)
      { pitch: 261.63, duration: 0.45, delay: 3.35, velocity: 0.88 }, // C4 (بالعزم)
      { pitch: 293.66, duration: 0.55, delay: 3.80, velocity: 0.92 }, // D4 (انتفـ)
      { pitch: 329.63, duration: 0.60, delay: 4.35, velocity: 0.95 }, // E4 (ـضت)
      { pitch: 440.00, duration: 1.20, delay: 4.95, velocity: 1.00 }  // A4 (آماله)
    ]
  },

  // 3. المحقق كونان: الجملة اللحنية الشهيرة بالبيانو والساكسفون (C Minor)
  'conan-detective': {
    instrument: 'piano',
    bpm: 132,
    cutoffSeconds: 5.4,
    notes: [
      { pitch: 261.63, duration: 0.28, delay: 0.0, velocity: 0.95 }, // C4
      { pitch: 311.13, duration: 0.28, delay: 0.28, velocity: 0.95 },// Eb4
      { pitch: 349.23, duration: 0.35, delay: 0.56, velocity: 1.00 },// F4
      { pitch: 369.99, duration: 0.35, delay: 0.91, velocity: 1.00 },// F#4
      { pitch: 392.00, duration: 0.60, delay: 1.26, velocity: 1.00 },// G4
      { pitch: 466.16, duration: 0.35, delay: 1.86, velocity: 0.95 },// Bb4
      { pitch: 523.25, duration: 1.10, delay: 2.21, velocity: 1.00 },// C5
      { pitch: 466.16, duration: 0.35, delay: 3.31, velocity: 0.90 },// Bb4
      { pitch: 392.00, duration: 0.50, delay: 3.66, velocity: 0.95 },// G4
      { pitch: 349.23, duration: 0.80, delay: 4.16, velocity: 0.90 } // F4 [Stop]
    ]
  },

  // 4. عهد الأصدقاء: "حلمنا نهار.. نهارنا عمل" (C Major)
  'romeo-blue-skies': {
    instrument: 'guitar',
    bpm: 96,
    cutoffSeconds: 6.0,
    notes: [
      { pitch: 261.63, duration: 0.55, delay: 0.0, velocity: 0.85 }, // C4 (حلمـ)
      { pitch: 329.63, duration: 0.55, delay: 0.55, velocity: 0.88 },// E4 (ـنا)
      { pitch: 392.00, duration: 0.90, delay: 1.10, velocity: 0.95 },// G4 (نهـ)
      { pitch: 392.00, duration: 0.80, delay: 2.00, velocity: 0.90 },// G4 (ـار)
      { pitch: 440.00, duration: 0.55, delay: 2.80, velocity: 0.92 },// A4 (نهـ)
      { pitch: 392.00, duration: 0.55, delay: 3.35, velocity: 0.90 },// G4 (ـار)
      { pitch: 329.63, duration: 0.60, delay: 3.90, velocity: 0.88 },// E4 (نا)
      { pitch: 293.66, duration: 1.20, delay: 4.50, velocity: 0.92 } // D4 (عمل)
    ]
  },

  // 5. ريمي: "أمي.. كم أهواها.. أشتاق لمرآها" (G Major)
  'remi-mother': {
    instrument: 'piano',
    bpm: 82,
    cutoffSeconds: 6.2,
    notes: [
      { pitch: 392.00, duration: 0.85, delay: 0.0, velocity: 0.85 }, // G4 (أمـ)
      { pitch: 493.88, duration: 1.10, delay: 0.85, velocity: 0.90 },// B4 (ـي)
      { pitch: 440.00, duration: 0.50, delay: 1.95, velocity: 0.85 },// A4 (كم)
      { pitch: 392.00, duration: 0.60, delay: 2.45, velocity: 0.88 },// G4 (أهـ)
      { pitch: 329.63, duration: 1.10, delay: 3.05, velocity: 0.85 },// E4 (ـواها)
      { pitch: 349.23, duration: 0.50, delay: 4.15, velocity: 0.80 },// F4 (أشـ)
      { pitch: 392.00, duration: 0.60, delay: 4.65, velocity: 0.85 },// G4 (ـتاق)
      { pitch: 440.00, duration: 1.20, delay: 5.25, velocity: 0.90 } // A4 (لمرآها)
    ]
  },

  // 6. ماوكلي: "في الغابة قانون يسري في كل مكان" (F Major)
  'mowgli-jungle-book': {
    instrument: 'guitar',
    bpm: 106,
    cutoffSeconds: 5.8,
    notes: [
      { pitch: 261.63, duration: 0.45, delay: 0.0, velocity: 0.85 }, // C4 (في الـ)
      { pitch: 349.23, duration: 0.60, delay: 0.45, velocity: 0.90 },// F4 (ـغا)
      { pitch: 392.00, duration: 0.45, delay: 1.05, velocity: 0.88 },// G4 (ـبة)
      { pitch: 440.00, duration: 0.80, delay: 1.50, velocity: 0.95 },// A4 (قا)
      { pitch: 392.00, duration: 0.50, delay: 2.30, velocity: 0.85 },// G4 (نون)
      { pitch: 349.23, duration: 0.60, delay: 2.80, velocity: 0.90 },// F4 (يسـ)
      { pitch: 329.63, duration: 0.60, delay: 3.40, velocity: 0.85 },// E4 (ـري)
      { pitch: 293.66, duration: 1.20, delay: 4.00, velocity: 0.88 } // D4 (في كل مكان)
    ]
  },

  // 7. دراجون بول: لحن البداية الأسطوري الحماسي (A Minor / C Major)
  'dragon-ball': {
    instrument: 'piano',
    bpm: 136,
    cutoffSeconds: 5.2,
    notes: [
      { pitch: 220.00, duration: 0.30, delay: 0.0, velocity: 0.95 }, // A3
      { pitch: 261.63, duration: 0.30, delay: 0.30, velocity: 0.95 },// C4
      { pitch: 293.66, duration: 0.35, delay: 0.60, velocity: 1.00 },// D4
      { pitch: 329.63, duration: 0.60, delay: 0.95, velocity: 1.00 },// E4
      { pitch: 392.00, duration: 0.40, delay: 1.55, velocity: 0.95 },// G4
      { pitch: 440.00, duration: 0.90, delay: 1.95, velocity: 1.00 },// A4
      { pitch: 392.00, duration: 0.40, delay: 2.85, velocity: 0.90 },// G4
      { pitch: 329.63, duration: 0.50, delay: 3.25, velocity: 0.95 },// E4
      { pitch: 293.66, duration: 1.00, delay: 3.75, velocity: 0.90 } // D4
    ]
  },

  // 8. كابتن ماجد: لحن الشوط والهدف الحماسي
  'captain-majed': {
    instrument: 'piano',
    bpm: 128,
    cutoffSeconds: 5.4,
    notes: [
      { pitch: 261.63, duration: 0.35, delay: 0.0, velocity: 0.90 }, // C4
      { pitch: 329.63, duration: 0.35, delay: 0.35, velocity: 0.90 },// E4
      { pitch: 392.00, duration: 0.55, delay: 0.70, velocity: 0.95 },// G4
      { pitch: 523.25, duration: 0.85, delay: 1.25, velocity: 1.00 },// C5
      { pitch: 493.88, duration: 0.40, delay: 2.10, velocity: 0.90 },// B4
      { pitch: 440.00, duration: 0.45, delay: 2.50, velocity: 0.90 },// A4
      { pitch: 392.00, duration: 1.10, delay: 2.95, velocity: 0.95 } // G4
    ]
  },

  // 9. أبطال الديجيتال: "في فخ غريب وقعنا.. في عالم الأرقام ضعنا"
  'digimon-heroes': {
    instrument: 'piano',
    bpm: 130,
    cutoffSeconds: 5.2,
    notes: [
      { pitch: 293.66, duration: 0.35, delay: 0.0, velocity: 0.95 }, // D4 (في)
      { pitch: 349.23, duration: 0.35, delay: 0.35, velocity: 0.95 },// F4 (فخ)
      { pitch: 392.00, duration: 0.40, delay: 0.70, velocity: 1.00 },// G4 (غريـ)
      { pitch: 440.00, duration: 0.75, delay: 1.10, velocity: 1.00 },// A4 (ـب)
      { pitch: 392.00, duration: 0.40, delay: 1.85, velocity: 0.90 },// G4 (وقـ)
      { pitch: 349.23, duration: 0.45, delay: 2.25, velocity: 0.90 },// F4 (ـعـ)
      { pitch: 329.63, duration: 0.50, delay: 2.70, velocity: 0.88 },// E4 (ـنا)
      { pitch: 293.66, duration: 1.10, delay: 3.20, velocity: 0.95 } // D4
    ]
  },

  // 10. الحديقة السرية: لحن العصفور والأزهار الدافئ (Musicbox / Celesta)
  'secret-garden': {
    instrument: 'musicbox',
    bpm: 88,
    cutoffSeconds: 5.8,
    notes: [
      { pitch: 392.00, duration: 0.65, delay: 0.0, velocity: 0.85 }, // G4
      { pitch: 440.00, duration: 0.65, delay: 0.65, velocity: 0.90 },// A4
      { pitch: 523.25, duration: 0.95, delay: 1.30, velocity: 0.95 },// C5
      { pitch: 440.00, duration: 0.65, delay: 2.25, velocity: 0.85 },// A4
      { pitch: 392.00, duration: 0.80, delay: 2.90, velocity: 0.90 },// G4
      { pitch: 329.63, duration: 1.20, delay: 3.70, velocity: 0.85 } // E4
    ]
  },

  // 11. هزيم الرعد: "هزيم الرعد.. ما عاش الظالم يسبيك"
  'hazim-alraad': {
    instrument: 'guitar',
    bpm: 118,
    cutoffSeconds: 5.6,
    notes: [
      { pitch: 220.00, duration: 0.50, delay: 0.0, velocity: 0.95 }, // A3
      { pitch: 220.00, duration: 0.50, delay: 0.50, velocity: 0.95 },// A3
      { pitch: 293.66, duration: 0.80, delay: 1.00, velocity: 1.00 },// D4
      { pitch: 261.63, duration: 0.50, delay: 1.80, velocity: 0.90 },// C4
      { pitch: 246.94, duration: 0.50, delay: 2.30, velocity: 0.85 },// B3
      { pitch: 220.00, duration: 1.20, delay: 2.80, velocity: 0.95 } // A3
    ]
  },

  // 12. بابار الفيل: لحن كلاسيكي هادئ
  'babar-elephant': {
    instrument: 'musicbox',
    bpm: 96,
    cutoffSeconds: 5.5,
    notes: [
      { pitch: 261.63, duration: 0.55, delay: 0.0, velocity: 0.85 }, // C4
      { pitch: 329.63, duration: 0.55, delay: 0.55, velocity: 0.85 },// E4
      { pitch: 392.00, duration: 0.80, delay: 1.10, velocity: 0.90 },// G4
      { pitch: 329.63, duration: 0.55, delay: 1.90, velocity: 0.80 },// E4
      { pitch: 261.63, duration: 1.20, delay: 2.45, velocity: 0.85 } // C4
    ]
  },

  // 13. أغنية طربية عربية شهيرة - فيروز: "كان عنا طاحون"
  'fairouz-tahoun': {
    instrument: 'guitar',
    bpm: 92,
    cutoffSeconds: 6.0,
    notes: [
      { pitch: 293.66, duration: 0.55, delay: 0.0, velocity: 0.88 }, // D4 (كان)
      { pitch: 349.23, duration: 0.55, delay: 0.55, velocity: 0.90 },// F4 (عنـ)
      { pitch: 392.00, duration: 0.90, delay: 1.10, velocity: 0.95 },// G4 (ـنا)
      { pitch: 440.00, duration: 0.65, delay: 2.00, velocity: 0.95 },// A4 (طاحـ)
      { pitch: 392.00, duration: 0.60, delay: 2.65, velocity: 0.90 },// G4 (ـون)
      { pitch: 349.23, duration: 0.60, delay: 3.25, velocity: 0.88 },// F4 (ع نبع)
      { pitch: 293.66, duration: 1.20, delay: 3.85, velocity: 0.90 } // D4 (المي)
    ]
  },

  // 14. أغنية عربية رومانسية - فضل شاكر: "يا غايب ليه ما تسأل"
  'fadel-shaker-ya-ghayeb': {
    instrument: 'piano',
    bpm: 84,
    cutoffSeconds: 6.2,
    notes: [
      { pitch: 329.63, duration: 0.60, delay: 0.0, velocity: 0.85 }, // E4 (يا)
      { pitch: 349.23, duration: 0.50, delay: 0.60, velocity: 0.88 },// F4 (غا)
      { pitch: 392.00, duration: 1.10, delay: 1.10, velocity: 0.95 },// G4 (يب)
      { pitch: 440.00, duration: 0.65, delay: 2.20, velocity: 0.90 },// A4 (ليه)
      { pitch: 392.00, duration: 0.55, delay: 2.85, velocity: 0.85 },// G4 (ما)
      { pitch: 329.63, duration: 1.20, delay: 3.40, velocity: 0.88 } // E4 (تسأل)
    ]
  },

  // 15. لحن عالمي كلاسيكي - Spirited Away / Always with Me (Inochi no Namae)
  'ghibli-spirited-away': {
    instrument: 'piano',
    bpm: 80,
    cutoffSeconds: 6.2,
    notes: [
      { pitch: 261.63, duration: 0.60, delay: 0.0, velocity: 0.85 }, // C4
      { pitch: 329.63, duration: 0.60, delay: 0.60, velocity: 0.88 },// E4
      { pitch: 392.00, duration: 0.80, delay: 1.20, velocity: 0.92 },// G4
      { pitch: 440.00, duration: 0.60, delay: 2.00, velocity: 0.90 },// A4
      { pitch: 392.00, duration: 0.60, delay: 2.60, velocity: 0.85 },// G4
      { pitch: 329.63, duration: 0.80, delay: 3.20, velocity: 0.88 },// E4
      { pitch: 261.63, duration: 1.20, delay: 4.00, velocity: 0.85 } // C4
    ]
  }
};

// In-memory cache for rendered WAV blob URLs
const renderedWavCache = new Map<string, string>();

/**
 * Synthesizes an authentic acoustic WAV with physical resonance and natural harmonics.
 * Does not require external audio files, works completely offline, and sounds like real instruments.
 */
export function getOrCreateAcousticWavUrl(snippetKey: string): string {
  if (typeof window === 'undefined') return '';
  if (renderedWavCache.has(snippetKey)) {
    return renderedWavCache.get(snippetKey)!;
  }

  const preset = ACOUSTIC_SNIPPETS[snippetKey] || ACOUSTIC_SNIPPETS['ana-wa-akhi'];
  const sampleRate = 44100;
  const totalDuration = Math.min(preset.cutoffSeconds + 0.8, 8.0);
  const totalSamples = Math.floor(sampleRate * totalDuration);

  // Allocate stereo buffers
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  preset.notes.forEach((note) => {
    const startSample = Math.floor(note.delay * sampleRate);
    if (startSample >= totalSamples) return;

    const noteDuration = note.duration;
    const noteSamples = Math.floor(noteDuration * sampleRate * 1.6);
    const endSample = Math.min(totalSamples, startSample + noteSamples);
    const vel = note.velocity || 0.85;
    const freq = note.pitch;

    for (let i = startSample; i < endSample; i++) {
      const t = (i - startSample) / sampleRate;

      let sample = 0;

      if (preset.instrument === 'piano') {
        // Acoustic Grand Piano Modeling with natural harmonic overtone decay
        const decay1 = Math.exp(-t * 2.2);
        const decay2 = Math.exp(-t * 3.5);
        const decay3 = Math.exp(-t * 5.2);
        const decay4 = Math.exp(-t * 7.5);

        const h1 = Math.sin(2 * Math.PI * freq * t) * 0.60 * decay1;
        const h2 = Math.sin(2 * Math.PI * freq * 2.002 * t) * 0.26 * decay2;
        const h3 = Math.sin(2 * Math.PI * freq * 3.008 * t) * 0.12 * decay3;
        const h4 = Math.sin(2 * Math.PI * freq * 4.015 * t) * 0.06 * decay4;

        // Warm felt hammer strike
        const hammer = t < 0.012 ? (Math.random() * 2 - 1) * 0.10 * Math.exp(-t * 220) : 0;
        sample = (h1 + h2 + h3 + h4 + hammer) * vel * 0.72;
      } else if (preset.instrument === 'guitar') {
        // Nylon Classical Acoustic Guitar with warm pluck body resonance
        const decay = Math.exp(-t * 2.8);
        const g1 = Math.sin(2 * Math.PI * freq * t) * 0.55 * decay;
        const g2 = Math.sin(2 * Math.PI * freq * 2.0 * t) * 0.28 * Math.exp(-t * 4.2);
        const g3 = Math.sin(2 * Math.PI * freq * 3.0 * t) * 0.12 * Math.exp(-t * 6.5);
        const pluck = t < 0.018 ? (Math.random() * 2 - 1) * 0.20 * Math.exp(-t * 200) : 0;
        sample = (g1 + g2 + g3 + pluck) * vel * 0.75;
      } else {
        // Musicbox / Celesta: Pure glassy bell timbre
        const decay = Math.exp(-t * 1.6);
        const m1 = Math.sin(2 * Math.PI * freq * t) * 0.75 * decay;
        const m2 = Math.sin(2 * Math.PI * freq * 2.0 * t) * 0.18 * Math.exp(-t * 3.2);
        sample = (m1 + m2) * vel * 0.65;
      }

      // Cutoff fade-out right at cutoffSeconds
      if (i / sampleRate > preset.cutoffSeconds) {
        const fadeProgress = (i / sampleRate - preset.cutoffSeconds) / 0.5;
        const fadeMultiplier = Math.max(0, 1 - fadeProgress);
        sample *= fadeMultiplier;
      }

      // Stereo spread and spatial depth
      left[i] += sample * 0.85;
      const rightSampleIndex = i + 12;
      if (rightSampleIndex < totalSamples) {
        right[rightSampleIndex] += sample * 0.85;
      } else {
        right[i] += sample * 0.85;
      }
    }
  });

  // Encode to 16-bit PCM WAV Blob
  const numOfChan = 2;
  const headerLength = 44;
  const dataLength = totalSamples * numOfChan * 2;
  const buffer = new ArrayBuffer(headerLength + dataLength);
  const view = new DataView(buffer);

  function writeString(offset: number, str: string) {
    for (let j = 0; j < str.length; j++) {
      view.setUint8(offset + j, str.charCodeAt(j));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numOfChan, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numOfChan * 2, true);
  view.setUint16(32, numOfChan * 2, true);
  view.setUint16(34, 16, true); // 16-bit
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    // Left Channel
    let sL = Math.max(-1, Math.min(1, left[i]));
    view.setInt16(offset, sL < 0 ? sL * 0x8000 : sL * 0x7fff, true);
    offset += 2;
    // Right Channel
    let sR = Math.max(-1, Math.min(1, right[i]));
    view.setInt16(offset, sR < 0 ? sR * 0x8000 : sR * 0x7fff, true);
    offset += 2;
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  renderedWavCache.set(snippetKey, url);
  return url;
}
