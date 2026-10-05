/**
 * Demucs Stem Separation Service Guide & API Integration
 * Demucs is Meta's deep learning model for audio source separation into stems:
 *  - Vocals (صوت الغناء)
 *  - Instrumental / Accompaniment (اللحن والموسيقى الخالية من الصوت)
 */

export interface DemucsSeparationResult {
  vocalsUrl?: string;
  instrumentalUrl?: string;
  message: string;
  stems: ('vocals' | 'no_vocals' | 'drums' | 'bass' | 'other')[];
}

/**
 * Command example for Demucs 2-stem separation:
 * `demucs --two-stems=vocals input_file.mp3`
 */
export function getDemucsCommand(inputFileName: string, outputDir: string = './separated'): string {
  return `demucs --two-stems=vocals -o ${outputDir} ${inputFileName}`;
}

export async function requestStemSeparation(fileOrUrl: string): Promise<DemucsSeparationResult> {
  try {
    const response = await fetch('/api/demucs/separate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileOrUrl }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    return {
      message: `تعذر فصل الصوت بواسطة Demucs: ${err.message || 'خطأ في معالجة الملف'}`,
      stems: ['vocals', 'no_vocals'],
    };
  }
}
