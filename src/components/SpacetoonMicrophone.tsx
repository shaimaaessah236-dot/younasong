import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Radio,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Square,
  RotateCcw,
  Sliders,
  Download,
  Check,
  AlertCircle,
  Headphones,
  Flame,
  Star,
  Film,
  Disc,
  Info
} from 'lucide-react';
import {
  spacetoonDubbingAudio,
  SPACETOON_VOCAL_FILTERS,
  SpacetoonVocalFilterId
} from '../lib/spacetoonDubbingAudio';
import { validateAudioFileUpload } from '../lib/securityProtection';
import spacetoonWatermarkImg from '../assets/images/spacetoon_screen_watermark_1790294083294.jpg';

export interface SpacetoonMicrophoneProps {
  onApplyAudioToRecorder?: (blob: Blob) => void;
  onClose?: () => void;
  standalone?: boolean;
}

// Iconic Spacetoon & Venus Centre Dubbing Lines for instant testing
const CLASSIC_DUBBING_LINES = [
  { text: 'سبيستون.. قناة شباب المستقبل!', role: 'شعار القناة الرسمي' },
  { text: 'المحقق كونان.. الحقيقة دائماً واحدة مهما طال الزمن!', role: 'المحقق كونان (أكشن)' },
  { text: 'أهلاً بكن في كوكب زمردة.. كوكب للبنات فقط!', role: 'فاصل زمردة' },
  { text: 'أبرقي أرعدي أبطالاً.. جاؤوك بصوت الحق الهادر كهزيم الرعد!', role: 'هزيم الرعد (أكشن)' },
  { text: 'قد لمعت عيناه.. في هدوء الليل صامد مغامر!', role: 'القناص (مغامرات)' },
  { text: 'أنا قصة إنسان.. أنا جرح الزمان.. أنا سالي سالي!', role: 'سالي (دراما)' },
  { text: 'أنا فلفول.. وأحب الفول والضحك والمرح!', role: 'فلفول (كوميديا)' },
  { text: 'سبيس باور.. قوة الخيال والإثارة للشباب والكبار!', role: 'سبيس باور Space Power' },
  { text: 'سبيستون.. سنعود بعد قليل.. انتظرونا!', role: 'فاصل سنعود بعد قليل' },
  { text: 'عُـــــدنـــــا إلى البرنامج!', role: 'فاصل عُـــدنـــا' },
  { text: 'سيمبا قادم.. سيمبا جاء.. سيمبا عند المخاضة!', role: 'سيمبا (مغامرات)' },
  { text: 'كابتن ماجد.. الهداف الأسطوري وركلة النمر الصاعقة!', role: 'رياضة (كابتن ماجد)' }
];

export const SpacetoonMicrophone: React.FC<SpacetoonMicrophoneProps> = ({
  onApplyAudioToRecorder,
  onClose,
  standalone = false,
}) => {
  // Selected Vocal Filter
  const [selectedFilterId, setSelectedFilterId] = useState<SpacetoonVocalFilterId>('radio');
  
  // Recording & Hardware States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [isLiveMonitoring, setIsLiveMonitoring] = useState(false);

  // Playback & Recorded Audio States
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [activeSpeechLine, setActiveSpeechLine] = useState<string | null>(null);
  const [isSynthesizingSpeech, setIsSynthesizingSpeech] = useState(false);
  
  // Audio VU Meter Level (0 to 100)
  const [vuLevel, setVuLevel] = useState(0);
  const [hasAppliedSuccess, setHasAppliedSuccess] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [customInputText, setCustomInputText] = useState('');
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);

  const timerIntervalRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeFilterConfig = SPACETOON_VOCAL_FILTERS.find((f) => f.id === selectedFilterId) || SPACETOON_VOCAL_FILTERS[0];

  // Stop recording timer
  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Start countdown before recording (classic studio dubbing 3-2-1 sync)
  const handleStartRecordingWithCountdown = () => {
    setMicPermissionError(null);
    setHasAppliedSuccess(false);
    let count = 3;
    setCountdown(count);
    spacetoonDubbingAudio.playStudioBeep(false);

    const interval = window.setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        spacetoonDubbingAudio.playStudioBeep(false);
      } else if (count === 0) {
        setCountdown(0);
        spacetoonDubbingAudio.playStudioBeep(true);
        clearInterval(interval);
        setTimeout(() => {
          setCountdown(null);
          handleStartRecording();
        }, 500);
      }
    }, 750);
  };

  // Start Voice Recording with mic
  const handleStartRecording = async () => {
    setMicPermissionError(null);
    setHasAppliedSuccess(false);

    try {
      const stream = await spacetoonDubbingAudio.requestMicrophoneStream();
      if (!stream) {
        setMicPermissionError('تعذر فتح الميكروفون. يرجى التأكد من السماح بالوصول للميكروفون في المتصفح، أو استخدم أزرار المحاكاة السريعة بالأسفل!');
        return;
      }

      setMicStream(stream);

      // Setup Web Audio Analyser for VU Meter & Oscilloscope
      const ctx = spacetoonDubbingAudio.getAudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyserRef.current = analyser;

      // Start Analyser Loop
      const updateMeter = () => {
        if (!analyserRef.current) return;
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          sum += data[i];
        }
        const avg = sum / data.length;
        const normalized = Math.min(100, Math.round((avg / 255) * 140));
        setVuLevel(normalized);

        // Draw Oscilloscope onto Canvas
        if (canvasRef.current) {
          const cvs = canvasRef.current;
          const cvsCtx = cvs.getContext('2d');
          if (cvsCtx) {
            cvsCtx.clearRect(0, 0, cvs.width, cvs.height);
            const sliceWidth = cvs.width / data.length;
            let x = 0;

            for (let i = 0; i < data.length; i++) {
              const v = data[i] / 255;
              const barH = v * cvs.height;
              
              // Retro Amber / Red LED Gradient
              const grad = cvsCtx.createLinearGradient(0, cvs.height, 0, 0);
              grad.addColorStop(0, '#EF4444');
              grad.addColorStop(0.5, '#F59E0B');
              grad.addColorStop(1, '#10B981');

              cvsCtx.fillStyle = grad;
              cvsCtx.fillRect(x, cvs.height - barH, sliceWidth - 1, barH);
              x += sliceWidth;
            }
          }
        }

        animationFrameRef.current = requestAnimationFrame(updateMeter);
      };
      updateMeter();

      // Start MediaRecorder
      const started = await spacetoonDubbingAudio.startRecording(stream);
      if (started) {
        setIsRecording(true);
        setRecordingSeconds(0);
        stopTimer();
        timerIntervalRef.current = window.setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);

        // If live monitoring is enabled, connect
        if (isLiveMonitoring) {
          spacetoonDubbingAudio.startLiveMonitoring(stream, selectedFilterId);
        }
      } else {
        setMicPermissionError('حدث خطأ أثناء بدء التسجيل. يرجى تجربة متصفح آخر أو استخدام المحاكي الصوتي.');
      }
    } catch (err) {
      console.warn('Microphone error:', err);
      setMicPermissionError('يرجى النقر على زر القفل في شريط المتصفح والسماح بصلاحية الميكروفون.');
    }
  };

  // Stop Recording & Render Permanent Filtered Audio
  const handleStopRecording = async () => {
    setIsRecording(false);
    stopTimer();

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setVuLevel(0);

    const blob = await spacetoonDubbingAudio.stopRecording();
    spacetoonDubbingAudio.stopMicrophoneStream();
    setMicStream(null);

    if (blob && blob.size > 0) {
      let finalBlob = blob;
      try {
        finalBlob = await spacetoonDubbingAudio.renderFilteredBlob(blob, selectedFilterId);
      } catch (err) {
        console.warn('Error rendering filtered blob:', err);
      }
      setRecordedBlob(finalBlob);
      // Auto-preview take through selected filter
      handlePlayTake(finalBlob, selectedFilterId);
    }
  };

  // Play Take through current or changed filter
  const handlePlayTake = async (blobToPlay?: Blob, filterId?: SpacetoonVocalFilterId) => {
    const targetBlob = blobToPlay || recordedBlob;
    if (!targetBlob) return;

    const targetFilter = filterId || selectedFilterId;
    setIsPlayingRecorded(true);

    // Mock VU animation during playback
    let mockTick = 0;
    const mockInterval = window.setInterval(() => {
      mockTick++;
      const val = 40 + Math.sin(mockTick * 0.4) * 30 + Math.random() * 20;
      setVuLevel(Math.min(100, Math.round(val)));
    }, 100);

    await spacetoonDubbingAudio.playFilteredAudio(targetBlob, targetFilter, () => {
      setIsPlayingRecorded(false);
      clearInterval(mockInterval);
      setVuLevel(0);
    });
  };

  // Stop Active Playback
  const handleStopPlayback = () => {
    spacetoonDubbingAudio.stopActivePlayback();
    setIsPlayingRecorded(false);
    setVuLevel(0);
  };

  // Switch filter during playback or rehearsal
  const handleSelectFilter = (fId: SpacetoonVocalFilterId) => {
    setSelectedFilterId(fId);
    if (isPlayingRecorded && recordedBlob) {
      handlePlayTake(recordedBlob, fId);
    }
    if (isRecording && micStream && isLiveMonitoring) {
      spacetoonDubbingAudio.startLiveMonitoring(micStream, fId);
    }
  };

  // Toggle Live Monitoring
  const handleToggleMonitoring = () => {
    const next = !isLiveMonitoring;
    setIsLiveMonitoring(next);
    if (isRecording && micStream) {
      if (next) {
        spacetoonDubbingAudio.startLiveMonitoring(micStream, selectedFilterId);
      } else {
        spacetoonDubbingAudio.stopLiveMonitoring();
      }
    }
  };

  // Download Recorded Audio
  const handleDownloadTake = () => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spacetoon_dubbing_${selectedFilterId}_take.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Apply to StudioRecorder track
  const handleApplyToRecorder = () => {
    if (!recordedBlob) return;
    if (onApplyAudioToRecorder) {
      onApplyAudioToRecorder(recordedBlob);
      setHasAppliedSuccess(true);
      setTimeout(() => setHasAppliedSuccess(false), 3000);
    }
  };

  // Instant Simulation & Dubbing Lines Testing (works 100% without microphone hardware)
  const handleSpeakDubbingLine = (lineText: string) => {
    setActiveSpeechLine(lineText);
    setIsSynthesizingSpeech(true);

    // Mock VU animation during quote speech
    let mockTick = 0;
    const mockInterval = window.setInterval(() => {
      mockTick++;
      const val = 45 + Math.sin(mockTick * 0.5) * 35 + Math.random() * 15;
      setVuLevel(Math.min(100, Math.round(val)));
    }, 100);

    spacetoonDubbingAudio.speakQuoteThroughFilter(lineText, selectedFilterId, () => {
      setIsSynthesizingSpeech(false);
      setActiveSpeechLine(null);
      clearInterval(mockInterval);
      setVuLevel(0);
    });
  };

  // Upload Voice File from User Device
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate audio file size and format against memory crashes and abuse
    const validation = validateAudioFileUpload(file, 30);
    if (!validation.valid) {
      setMicPermissionError(validation.error || 'الملف الصوتي غير صالح أو حجمه يتجاوز 30 ميجابايت.');
      if (e.target) e.target.value = '';
      return;
    }

    try {
      setHasAppliedSuccess(false);
      setMicPermissionError(null);
      const processed = await spacetoonDubbingAudio.renderFilteredBlob(file, selectedFilterId);
      setRecordedBlob(processed);
      handlePlayTake(processed, selectedFilterId);
    } catch (err) {
      console.warn('File upload processing error:', err);
      setRecordedBlob(file);
      handlePlayTake(file, selectedFilterId);
    }
  };

  // Dub Custom Text Input
  const handleDubCustomText = () => {
    if (!customInputText.trim()) return;
    handleSpeakDubbingLine(customInputText.trim());
  };

  // Format time (00:00)
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      spacetoonDubbingAudio.stopMicrophoneStream();
      spacetoonDubbingAudio.stopActivePlayback();
    };
  }, []);

  const isOnAir = isRecording || isPlayingRecorded || isSynthesizingSpeech;

  return (
    <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 bg-gradient-to-b from-[#181320] via-[#100c18] to-[#0a0710] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.15)] p-6 sm:p-8 text-right font-cairo">
      
      {/* Background Studio Acoustic Texture */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* TOP HEADER: Illuminated ON-AIR Studio Sign & Branding */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-white/10 gap-4">
        
        {/* Studio Branding & Mascot Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-600 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
            <img
              src={spacetoonWatermarkImg}
              alt="Spacetoon Studio Mascot"
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-300">SPACETOON DUBBING STUDIO</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                مركز الزهرة 
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-tajawal text-white">
              ميكروفون دبلجة وفلاتر سبيستون
            </h2>
          </div>
        </div>

        {/* GLOWING RETRO "ON AIR" / "على الهواء" SIGN WITH REALISTIC BULB PULSE */}
        <div className="flex items-center gap-3">
          <div className={`relative px-5 py-2.5 rounded-2xl border-2 font-mono font-black tracking-widest text-xs flex items-center gap-3 transition-all duration-300 ${
            isOnAir
              ? 'bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.9),inset_0_0_18px_rgba(220,38,38,0.7)] animate-pulse'
              : 'bg-zinc-900 border-zinc-700 text-zinc-500 shadow-inner'
          }`}>
            <span className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
              isOnAir
                ? 'bg-red-500 shadow-[0_0_15px_#ef4444] animate-ping'
                : 'bg-zinc-700'
            }`} />
            <div className="flex flex-col text-right">
              <span className="text-sm font-black tracking-wider text-red-100">
                {isOnAir ? '● ON AIR' : '○ STANDBY'}
              </span>
              <span className="text-[10px] font-sans font-bold text-red-200/90">
                {isOnAir ? 'على الهواء مباشرة • استوديو الدوبلاج' : 'استوديو سبيستون جاهز'}
              </span>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xs cursor-pointer transition-all"
              title="إغلاق"
            >
              
            </button>
          )}
        </div>

      </div>

      {/* MAIN DUBBING CONSOLE: Microphone Column + VU Meters + Controls */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 my-6 items-center">
        
        {/* COLUMN 1: Vintage Broadcast Microphone Visualizer (Col 5) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-black/60 border border-white/10 relative overflow-hidden text-center space-y-4">
          
          {/* Studio Pop Filter & Microphone Art */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            
            {/* Illuminated Aura Ring */}
            <div className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none ${
              isOnAir
                ? 'bg-red-500/30 blur-2xl scale-110 animate-pulse'
                : 'bg-amber-500/10 blur-xl scale-95'
            }`} />

            {/* Dynamic Acoustic Shockwaves / Ripple Rings when ON AIR */}
            {isOnAir && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-ping pointer-events-none" />
                <div className="absolute -inset-4 rounded-full border border-amber-500/30 animate-pulse pointer-events-none" />
                <div className="absolute -inset-8 rounded-full border border-red-500/20 animate-ping [animation-duration:2.5s] pointer-events-none" />
              </>
            )}

            {/* Circular VU Ring */}
            <div
              className="absolute inset-2 rounded-full border-4 border-dashed transition-all duration-200"
              style={{
                borderColor: isOnAir ? activeFilterConfig.color : '#3f3f46',
                transform: `rotate(${vuLevel * 2}deg)`
              }}
            />

            {/* Countdown Overlay over microphone */}
            {countdown !== null && (
              <div className="absolute inset-0 z-30 rounded-full bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in zoom-in-75 duration-200">
                <span className="text-5xl font-black font-mono text-red-500 drop-shadow-[0_0_20px_#ef4444] animate-bounce">
                  {countdown > 0 ? countdown : 'ON AIR!'}
                </span>
                <span className="text-xs font-bold text-amber-300 mt-2 font-tajawal">
                  {countdown > 0 ? 'استعد للدوبلاج..' : 'سجل الآن على الهواء!'}
                </span>
              </div>
            )}

            {/* Vintage Studio Metallic Mic Stand */}
            <div className="relative z-10 w-28 h-36 rounded-full bg-gradient-to-b from-[#2a2a32] via-[#1a1a20] to-[#0f0f14] border-2 border-white/20 shadow-2xl flex flex-col items-center justify-between p-3">
              
              {/* Metallic Mic Mesh Grille */}
              <div className="w-full h-18 rounded-t-full bg-gradient-to-b from-zinc-400 via-zinc-600 to-zinc-800 border-b border-black flex flex-col justify-center items-center overflow-hidden relative shadow-inner">
                <div className="w-full h-full opacity-40 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:4px_4px]" />
                <span className="absolute text-[9px] font-mono font-bold text-zinc-300 drop-shadow">
                  NEUMANN U87
                </span>
              </div>

              {/* Pop Shield Ring */}
              <div className="w-full flex items-center justify-center gap-1.5 py-1">
                <span className={`w-2 h-2 rounded-full ${
                  isRecording ? 'bg-red-500 animate-ping' : 'bg-amber-400'
                }`} />
                <span className="text-[10px] font-mono text-zinc-400 font-bold">
                  VENUS 2000
                </span>
              </div>

              {/* Base Mount */}
              <div className="w-10 h-3 rounded-full bg-zinc-700 border border-zinc-500" />
            </div>

          </div>

          {/* Real-time Oscilloscope & VU Needle */}
          <div className="w-full space-y-2">
            
            {/* Oscilloscope Canvas */}
            <div className="w-full h-12 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden relative shadow-inner">
              <canvas
                ref={canvasRef}
                width={240}
                height={48}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 left-2 text-[8px] font-mono text-zinc-500">
                INPUT FREQ SPECTRUM
              </span>
            </div>

            {/* VU Meter Bars (Stereo L/R) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>VU METER (dB)</span>
                <span className="font-bold text-amber-300">{vuLevel}%</span>
              </div>
              <div className="w-full h-3 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden p-0.5 flex gap-0.5">
                {[...Array(24)].map((_, idx) => {
                  const threshold = (idx / 24) * 100;
                  const isLit = vuLevel >= threshold;
                  const isRedZone = idx >= 18;
                  const isAmberZone = idx >= 12 && idx < 18;

                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-sm transition-all duration-75 ${
                        isLit
                          ? isRedZone
                            ? 'bg-red-500 shadow-[0_0_6px_#ef4444]'
                            : isAmberZone
                              ? 'bg-amber-400 shadow-[0_0_4px_#f59e0b]'
                              : 'bg-emerald-400 shadow-[0_0_4px_#10b981]'
                          : 'bg-zinc-800'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Recording Timecode */}
            <div className="pt-2 flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-zinc-600'}`} />
                <span>{isRecording ? 'RECORDING TIME' : 'TAKE DURATION'}</span>
              </span>
              <span className="font-black text-amber-300 text-sm tracking-wider">
                {formatTimer(recordingSeconds)}
              </span>
            </div>

          </div>

        </div>

        {/* COLUMN 2: Filter Selectors & Studio Action Deck (Col 7) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Filter Description Header */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>اختر فلتر الدبلجة والصوت الإذاعي الكلاسيكي:</span>
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              اختر الفلتر الذي ترغب في تطبيقه على صوتك (فلتر الراديو، معلق سبيستون، الدبلجة الكرتونية أو الآلي):
            </p>
          </div>

          {/* Vocal Filter Selector Grid (5 Iconic Spacetoon Filters) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SPACETOON_VOCAL_FILTERS.map((f) => {
              const isSelected = selectedFilterId === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => handleSelectFilter(f.id)}
                  className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-start gap-3 hover:translate-y-[-2px] ${
                    isSelected
                      ? 'border-2 shadow-lg shadow-amber-500/10'
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-slate-300'
                  }`}
                  style={{
                    borderColor: isSelected ? f.color : undefined,
                    backgroundColor: isSelected ? `${f.color}20` : undefined
                  }}
                >
                  <span className="text-2xl shrink-0 p-1.5 rounded-xl bg-black/40 border border-white/10">
                    {f.icon}
                  </span>
                  <div className="space-y-0.5 min-w-0">
                    <span
                      className="block text-xs font-black truncate"
                      style={{ color: isSelected ? f.color : '#fff' }}
                    >
                      {f.arabicName}
                    </span>
                    <span className="block text-[11px] text-slate-400 leading-tight">
                      {f.tagline}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Filter Details Card */}
          <div
            className="p-3.5 rounded-2xl border flex items-center gap-3 text-xs"
            style={{
              borderColor: `${activeFilterConfig.color}40`,
              backgroundColor: `${activeFilterConfig.color}10`
            }}
          >
            <Info className="w-4 h-4 shrink-0" style={{ color: activeFilterConfig.color }} />
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {activeFilterConfig.description}
            </p>
          </div>

          {/* Hardware & Live Monitoring Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleToggleMonitoring}
                className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  isLiveMonitoring
                    ? 'bg-amber-500 text-black border-amber-400 font-bold'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
                title="سماع صوتك فورياً بالفلتر أثناء التحدث (يُفضل استخدام سماعات الرأس لمنع الصدى)"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{isLiveMonitoring ? 'مراقبة الصوت المباشر: شغال ' : 'مراقبة بالسمّاعة'}</span>
              </button>

              <button
                onClick={() => spacetoonDubbingAudio.playRadioStaticBurst(0.7)}
                className="px-3 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 flex items-center gap-1.5 cursor-pointer transition-all text-xs font-bold"
                title="سماع صوت تشويش راديو سبيستون القديم"
              >
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>تشويش الراديو (FX) </span>
              </button>
            </div>

            <span className="text-[11px] text-slate-400 font-mono">
              DSP SAMPLE RATE: 44.1 kHz
            </span>
          </div>

          {/* MAIN RECORDING & PLAYBACK ACTION BAR */}
          <div className="p-4 rounded-2xl bg-black/70 border border-white/10 flex flex-wrap items-center justify-between gap-3">
            
            {/* Main Record Buttons */}
            {!isRecording ? (
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleStartRecordingWithCountdown}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm shadow-xl shadow-red-600/30 flex items-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                  title="بدء التسجيل مع عد تنازلي استوديو 3.. 2.. 1.. ON AIR!"
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-white animate-ping" />
                  <Mic className="w-4 h-4" />
                  <span>دبلجة مع عد تنازلي (3-2-1) </span>
                </button>

                <button
                  onClick={handleStartRecording}
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all border border-white/10 hover:border-white/25"
                  title="بدء التسجيل فوراً دون انتظار"
                >
                  <span>تسجيل فوري </span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="audio/*"
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all border border-amber-500/30"
                  title="رفع ملف صوتي أو تسجيل فويس من جهازك لتطبيق الفلتر عليه"
                >
                  <Disc className="w-3.5 h-3.5 text-amber-400" />
                  <span>رفع تسجيل صوتي </span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleStopRecording}
                className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-xl shadow-red-600/50 flex items-center gap-2.5 cursor-pointer animate-pulse active:scale-95 transition-all"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>إيقاف التسجيل ومعالجة الفلتر </span>
              </button>
            )}

            {/* Playback Controls (if recorded take exists) */}
            {recordedBlob && (
              <div className="flex items-center gap-2">
                {!isPlayingRecorded ? (
                  <button
                    onClick={() => handlePlayTake()}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30 cursor-pointer transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>تشغيل الصوت بالفلتر</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopPlayback}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>إيقاف</span>
                  </button>
                )}

                <button
                  onClick={handleDownloadTake}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 cursor-pointer transition-all"
                  title="تحميل ملف الصوت المدبلج"
                >
                  <Download className="w-4 h-4" />
                </button>

                {onApplyAudioToRecorder && (
                  <button
                    onClick={handleApplyToRecorder}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                      hasAppliedSuccess
                        ? 'bg-emerald-500 text-black border border-emerald-400'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{hasAppliedSuccess ? 'تم التطبيق في الاستوديو!' : 'تطبيق الصوت في الاستوديو'}</span>
                  </button>
                )}
              </div>
            )}

          </div>

          {/* Permission Error Diagnostic Callout & Troubleshooting */}
          {micPermissionError && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs font-medium space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>تنبيه صلاحيات الميكروفون في المتصفح:</span>
                </div>
                <button
                  onClick={() => setShowTroubleshooter((prev) => !prev)}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-[11px] font-bold border border-rose-500/30 transition-all cursor-pointer"
                >
                  {showTroubleshooter ? 'إخفاء الإرشادات ▲' : 'كيفية السماح بالمايك ▼'}
                </button>
              </div>
              <p className="leading-relaxed">{micPermissionError}</p>

              {showTroubleshooter && (
                <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-[11px] text-slate-300 space-y-2">
                  <div className="font-bold text-amber-300">طريقة تفعيل المايك في متصفحك:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li><strong className="text-white">آيفون / سفاري (Safari iOS):</strong> انقر على زر <code className="bg-black/60 px-1 py-0.5 rounded text-amber-300">aA</code> في شريط العناوين، ثم «إعدادات موقع الويب» وفعل الميكروفون إلى <strong className="text-emerald-400">سماح (Allow)</strong>.</li>
                    <li><strong className="text-white">أندرويد / كروم (Chrome Android):</strong> انقر على رمز القفل  أو النقاط الثلاث بجوار الرابط، ثم «أذونات الموقع» وفعل الميكروفون.</li>
                    <li><strong className="text-white">الكمبيوتر (Chrome / Edge):</strong> انقر على رمز القفل  في أقصى يسار شريط الرابط واجعل Microphone في وضع <strong className="text-emerald-400">Allow</strong> ثم حدّث الصفحة.</li>
                  </ul>
                </div>
              )}

              <p className="text-[11px] text-amber-300">
                 لا تقلق: يمكنك استخدام <strong>«محاكي دبلجة سبيستون الفوري»</strong> أو <strong>«رفع ملف صوتي»</strong> لتجربة الفلاتر وسماع النتيجة فوراً بدون الحاجة للمايك!
              </p>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* CUSTOM TEXT DUBBING PROMPTER: Type any text & Dub it through filter       */}
      {/* ========================================================================= */}
      <div className="relative z-10 my-4 p-4 rounded-2xl bg-black/40 border border-amber-500/20 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span> دبلجة أي نص من كتابتك (تحدث بصوت سبيستون بدون مايك):</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customInputText}
            onChange={(e) => setCustomInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleDubCustomText();
            }}
            placeholder="اكتب أي جملة هنا لدبلجتها فوراً (مثال: أهلاً بكم يا شباب المستقبل في كوكب أكشن)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={handleDubCustomText}
            disabled={!customInputText.trim()}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 shadow-lg shadow-amber-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>دبلجة ونطق النص بالفلتر </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INSTANT SIMULATION DUBBING BOARD: Test Filters on Classic Lines (No-Mic)  */}
      {/* ========================================================================= */}
      <div className="relative z-10 mt-8 pt-6 border-t border-white/10 space-y-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black font-tajawal text-white">
              محاكي دبلجة سبيستون الفوري (اختبار الفلاتر على أشهر الجمل بدون مايك):
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            CLICK TO TEST {selectedFilterId.toUpperCase()} FILTER
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          انقر على أي جملة من أشهر روائع مركز الزهرة لتستمع إليها فوراً بالفيديو والصوت بعد معالجتها بـ ({activeFilterConfig.arabicName}):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {CLASSIC_DUBBING_LINES.map((item, idx) => {
            const isPlayingThis = activeSpeechLine === item.text;
            return (
              <button
                key={idx}
                onClick={() => handleSpeakDubbingLine(item.text)}
                className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-2 group hover:translate-y-[-2px] ${
                  isPlayingThis
                    ? 'border-2 shadow-lg shadow-amber-500/20 bg-amber-500/20'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10'
                }`}
                style={{
                  borderColor: isPlayingThis ? activeFilterConfig.color : undefined
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-amber-300 border border-white/10">
                    {item.role}
                  </span>
                  <Play className={`w-3 h-3 text-amber-400 group-hover:scale-125 transition-transform ${
                    isPlayingThis ? 'animate-spin' : ''
                  }`} />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-amber-200 transition-colors">
                  «{item.text}»
                </span>
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
};
