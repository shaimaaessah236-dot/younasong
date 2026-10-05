import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface AudioVisualizerProps {
  className?: string;
  barCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  className = '',
  barCount = 12,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLiveMic, setIsLiveMic] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const stopMic = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    setIsLiveMic(false);
  };

  const startMic = async () => {
    setMicError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError('المتصفح لا يدعم الميكروفون');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsLiveMic(true);
    } catch (err: any) {
      console.error('Mic access error:', err);
      setMicError('تعذر الوصول للميكروفون');
      stopMic();
    }
  };

  const toggleMic = () => {
    if (isLiveMic) {
      stopMic();
    } else {
      startMic();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const gap = 3;
      const totalGaps = gap * (barCount - 1);
      const barWidth = Math.max(3, (width - totalGaps) / barCount);

      let dataArray: Uint8Array | null = null;
      if (isLiveMic && analyserRef.current) {
        dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
      }

      phase += 0.08;

      for (let i = 0; i < barCount; i++) {
        let val = 0;
        if (dataArray && dataArray.length > 0) {
          const index = Math.floor((i / barCount) * dataArray.length);
          val = dataArray[index] / 255;
        } else {
          // Synthetic ambient waveform animation when mic is off
          const wave1 = Math.sin(phase + i * 0.4);
          const wave2 = Math.cos(phase * 0.8 + i * 0.3);
          val = (wave1 + wave2 + 2) / 4;
          val = Math.pow(val, 1.8);
        }

        const barHeight = Math.max(6, val * height * 0.9);
        const x = i * (barWidth + gap);
        const y = height - barHeight;

        // Pure 2-Stop Gradient: Base White -> Top Soft Pastel Pink (#F472B6) ONLY
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        if (isLiveMic) {
          gradient.addColorStop(0, '#ffffff'); // Base: Pure White
          gradient.addColorStop(1, '#f43f5e'); // Top: Rose Pink
        } else {
          gradient.addColorStop(0, '#ffffff'); // Base: Pure White
          gradient.addColorStop(1, '#f472b6'); // Top: Soft Pastel Pink
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isLiveMic, barCount]);

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  return (
    <div
      className={`relative flex items-center gap-2 group cursor-pointer ${className}`}
      onClick={toggleMic}
      title={isLiveMic ? 'تعطيل الميكروفون المباشر' : 'تفعيل الميكروفون للتحليل المباشر (AnalyserNode)'}
    >
      <canvas
        ref={canvasRef}
        width={140}
        height={36}
        className="visualizer w-[120px] h-[36px] block rounded-lg overflow-hidden"
      />

      <button
        type="button"
        className={`p-1.5 rounded-full border text-xs transition-all ${
          isLiveMic
            ? 'bg-rose-400 text-slate-950 border-rose-300 shadow-[0_0_10px_rgba(244,114,182,0.6)] animate-pulse'
            : 'bg-[#18181F] text-slate-400 border-white/10 hover:text-white hover:border-pink-300'
        }`}
      >
        {isLiveMic ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
      </button>

      {micError && (
        <span className="text-[10px] text-red-400 font-bold hidden sm:inline">
          {micError}
        </span>
      )}
    </div>
  );
};
