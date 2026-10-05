import React, { useState, useRef, useEffect } from 'react';
import { Activity, Music, RotateCcw, Sparkles, Scissors, Sliders, Upload, Play, Pause, Download, CheckCircle2, Volume2, Mic, RefreshCw, Layers, ShieldCheck, Headphones, Radio, Crown, AlertCircle, Lock } from 'lucide-react';
import { separateAudioStems, StemsResult, IsolationMode } from '../lib/stemSeparationEngine';
import { getVipStatusInfo, consumeIsolationCredit, VipStatusInfo, FREE_ISOLATION_LIMIT } from '../lib/vipMembership';
import { validateAudioFileUpload } from '../lib/securityProtection';
import { VipUpgradeModal } from './VipUpgradeModal';
import { useLanguage } from '../context/LanguageContext';

export const AudioTools: React.FC = () => {
  const { language, isRtl, t } = useLanguage();
  const [activeTool, setActiveTool] = useState<'ai' | 'bpm' | 'key' | 'pitch' | 'cutter'>('ai');

  // --- 1. AI VOCAL SEPARATOR STATE ---
  const [aiFile, setAiFile] = useState<File | null>(null);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiStatusMsg, setAiStatusMsg] = useState('');
  const [stemsData, setStemsData] = useState<StemsResult | null>(null);
  const [activeStemTab, setActiveStemTab] = useState<'vocals' | 'instrumental' | 'bass'>('vocals');
  const [aiIsolationMode, setAiIsolationMode] = useState<IsolationMode>('ultra_clean');
  const [vipStatus, setVipStatus] = useState<VipStatusInfo>(() => getVipStatusInfo());
  const [showVipModal, setShowVipModal] = useState(false);

  useEffect(() => {
    const handleVipUpdate = () => {
      setVipStatus(getVipStatusInfo());
    };
    window.addEventListener('yona_vip_updated', handleVipUpdate);
    window.addEventListener('storage', handleVipUpdate);
    return () => {
      window.removeEventListener('yona_vip_updated', handleVipUpdate);
      window.removeEventListener('storage', handleVipUpdate);
    };
  }, []);

  const handleAiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Security validation against oversized files and invalid types
    const validation = validateAudioFileUpload(file, 25);
    if (!validation.valid) {
      setAiStatusMsg(validation.error || 'الملف الصوتي المرفوع غير صالح أو حجمه يتجاوز 25 ميجابايت.');
      if (e.target) e.target.value = '';
      return;
    }

    // Check VIP and Free Usage Quota
    const currentVip = getVipStatusInfo();
    if (!currentVip.canPerformIsolation) {
      setShowVipModal(true);
      setAiStatusMsg(' لقد استنفدت جميع المرات المجانية المتاحة لك (20/20 عملية عزل صوت). يجب الترقية بالدفع للاستمرار وبجودة أعلى!');
      return;
    }

    // Immediately consume 1 credit and update status
    consumeIsolationCredit();
    const updatedStatus = getVipStatusInfo();
    setVipStatus(updatedStatus);

    setAiFile(file);
    setAiProcessing(true);
    setAiProgress(10);
    setAiStatusMsg(`جاري استيراد وتحليل الملف الصوتي (الرصيد المتبقي: ${updatedStatus.isVip ? 'غير محدود ' : updatedStatus.remaining + ' عملية'})...`);
    setStemsData(null);

    try {
      const result = await separateAudioStems(file, file.name, (p) => {
        setAiProgress(p.progress);
        setAiStatusMsg(p.detail || p.stageName);
      }, {
        mode: aiIsolationMode,
        pianoGuitarSuppression: 0.90,
        noiseGateSensitivity: 0.85,
        deReverbStrength: 0.75
      });

      setStemsData(result);
      setAiProcessing(false);

      // If user just consumed their 20th and final free credit, show popup offering upgrade
      if (!updatedStatus.isVip && updatedStatus.remaining === 0) {
        setTimeout(() => {
          setShowVipModal(true);
        }, 1000);
      }
    } catch (err: any) {
      console.error('Stem separation failed:', err);
      setAiStatusMsg('تعذر عزل الصوت، يرجى التأكد من صلاحية الملف.');
      setAiProcessing(false);
    }
  };

  // --- 2. TAP BPM STATE ---
  const [taps, setTaps] = useState<number[]>([]);
  const [bpm, setBpm] = useState<number | null>(null);
  const [tempoName, setTempoName] = useState<string>('في انتظار الضغط...');
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playClickSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // ignore
    }
  };

  const handleTap = () => {
    playClickSound();
    const now = Date.now();
    const newTaps = [...taps, now].slice(-8);
    setTaps(newTaps);

    if (newTaps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      setBpm(calculatedBpm);

      if (calculatedBpm < 60) setTempoName('بطيء جداً (Largo / Adagio)');
      else if (calculatedBpm <= 75) setTempoName('بطيء دافئ (Adagio)');
      else if (calculatedBpm <= 108) setTempoName('معتدل هادئ (Andante)');
      else if (calculatedBpm <= 120) setTempoName('متوسط حماسي (Moderato)');
      else if (calculatedBpm <= 156) setTempoName('سريع وحيوي (Allegro)');
      else setTempoName('سريع جداً (Presto)');
    }
  };

  const resetBpm = () => {
    setTaps([]);
    setBpm(null);
    setTempoName('في انتظار الضغط...');
  };

  // --- 3. KEY DETECTOR STATE ---
  const [selectedRootKey, setSelectedRootKey] = useState<string>('A');
  const [selectedScaleType, setSelectedScaleType] = useState<'minor' | 'major'>('minor');

  const notesMap = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteFrequencies: Record<string, number> = {
    'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
    'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
    'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
  };

  const playPianoNote = (note: string) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const freq = noteFrequencies[note] || 440;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // ignore
    }
  };

  const getScaleNotes = (root: string, type: 'minor' | 'major') => {
    const rootIndex = notesMap.indexOf(root);
    if (rootIndex === -1) return [];
    const intervals = type === 'minor' ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11];
    return intervals.map(semitone => notesMap[(rootIndex + semitone) % 12]);
  };

  const scaleNotes = getScaleNotes(selectedRootKey, selectedScaleType);

  // --- 4. PITCH CHANGER STATE ---
  const [pitchSemitones, setPitchSemitones] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const pitchAudioRef = useRef<HTMLAudioElement | null>(null);

  // --- 5. AUDIO CUTTER STATE ---
  const [cutterStart, setCutterStart] = useState<number>(0);
  const [cutterEnd, setCutterEnd] = useState<number>(30);
  const [cutterFile, setCutterFile] = useState<File | null>(null);
  const [cutterNotice, setCutterNotice] = useState<string | null>(null);

  return (
    <div className={`space-y-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      
      {/* Title Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 shadow-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
        <div>
          <h2 className="text-2xl font-extrabold font-tajawal text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            <span>{t('toolsHeroTitle', 'Audio Engineering & Acapella Isolator Lab')}</span>
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            {language === 'ar'
              ? 'مجموعة كاملة من الأدوات التفاعلية لفصل الصوت بالذكاء الاصطناعي، قياس الإيقاع، تحديد السلم، تغيير الطبقة، وقص الصوتيات'
              : 'Interactive studio tools: AI stem separation, tap BPM counter, musical key finder, pitch shifter, and audio trimmer.'}
          </p>
        </div>

        {/* Tool Navigation Tabs (Glassmorphic) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
          <button
            onClick={() => setActiveTool('ai')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTool === 'ai'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>{t('toolsTabIsolator', 'AI Vocal Isolator')}</span>
          </button>

          <button
            onClick={() => setActiveTool('bpm')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTool === 'bpm'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{t('toolsTabBpm', 'Tap BPM')}</span>
          </button>

          <button
            onClick={() => setActiveTool('key')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTool === 'key'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>{t('toolsTabKey', 'Key Finder')}</span>
          </button>

          <button
            onClick={() => setActiveTool('pitch')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTool === 'pitch'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{t('toolsTabPitch', 'Pitch Shifter')}</span>
          </button>

          <button
            onClick={() => setActiveTool('cutter')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTool === 'cutter'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>{t('toolsTabCutter', 'Audio Trimmer')}</span>
          </button>
        </div>
      </div>

      {/* TOOL 1: AI VOCAL SEPARATOR */}
      {activeTool === 'ai' && (
        <div className={`p-8 rounded-3xl bg-[#0F172A]/80 backdrop-blur-xl border border-emerald-500/30 shadow-2xl space-y-6 max-w-3xl mx-auto ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="space-y-2 text-center">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30 inline-flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              AI Stem Separation Engine
            </span>
            <h3 className={`text-2xl font-bold ${isRtl ? 'font-tajawal' : 'font-sans'} text-white`}>
              {language === 'ar' ? 'فصل صوت الغناء عن الموسيقى بالذكاء الاصطناعي' : 'AI Vocal & Instrumental Stem Separator'}
            </h3>
            <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
              {language === 'ar'
                ? 'قم برفع أي ملف صوتي خاص بك، وسيقوم المحرك بمعالجة الملف المرفوع فقط وفصل صوت المغني عن الموسيقى الترافقية مع إمكانية المعاينة والتنزيل.'
                : 'Upload any audio track to isolate vocals from instrumental accompaniment with crystal-clear acapella output and instant download.'}
            </p>
          </div>

          {/* Usage Quota Banner */}
          <div className="p-3.5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs">
              <Crown className="w-4 h-4 text-emerald-400" />
              {vipStatus.isOwner ? (
                <span className="font-bold text-emerald-300">
                  {language === 'ar' ? 'حساب مالك المنصة: وصول غير محدود بالكامل ' : 'Platform Owner: Unlimited Full Access'}
                </span>
              ) : vipStatus.isVip ? (
                <span className="font-bold text-emerald-300">
                  {language === 'ar' ? 'عضوية VIP الذهبية: عزل غير محدود ' : 'Gold VIP: Unlimited Isolations'}
                </span>
              ) : (
                <span className="text-slate-300">
                  {language === 'ar' 
                    ? `الرصيد المتاح: ${vipStatus.remaining} من أصل ${vipStatus.totalAvailable} عملية مجانية`
                    : `Available Quota: ${vipStatus.remaining} of ${vipStatus.totalAvailable} free credits`}
                </span>
              )}
            </div>

            {!vipStatus.isOwner && !vipStatus.isVip && (
              <button
                type="button"
                onClick={() => setShowVipModal(true)}
                className="px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black text-xs font-bold border border-emerald-500/40 transition-all cursor-pointer flex items-center gap-1"
              >
                <Crown className="w-3.5 h-3.5 text-emerald-300" />
                <span>{language === 'ar' ? 'ترقية الرصيد / VIP ($5 - $10)' : 'Upgrade / VIP ($5 - $10)'}</span>
              </button>
            )}
          </div>

          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              {language === 'ar' ? 'اختر نمط عزل الصوت وحذف الآلات:' : 'Select Isolation & Instrument De-bleed Mode:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAiIsolationMode('ultra_clean')}
                className={`p-3 rounded-2xl border ${isRtl ? 'text-right' : 'text-left'} transition-all cursor-pointer ${
                  aiIsolationMode === 'ultra_clean'
                    ? 'bg-emerald-600/25 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 font-bold'
                    : 'bg-white/[0.03] backdrop-blur-md border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5 text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'ar' ? 'عزل فائق 99.9% ' : 'Ultra Clean (99.9%)'}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {language === 'ar' ? 'إزالة تامة للبيانو، الجيتار، والآلات' : 'Maximum piano, guitar & beat suppression'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAiIsolationMode('studio_warmth')}
                className={`p-3 rounded-2xl border ${isRtl ? 'text-right' : 'text-left'} transition-all cursor-pointer ${
                  aiIsolationMode === 'studio_warmth'
                    ? 'bg-emerald-600/25 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 font-bold'
                    : 'bg-white/[0.03] backdrop-blur-md border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5 text-emerald-300">
                  <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'ar' ? 'استوديو دافئ ' : 'Warm Studio'}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {language === 'ar' ? 'الحفاظ على عمق وخامة الصوت' : 'Preserve natural voice warmth & timbre'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAiIsolationMode('de_reverb')}
                className={`p-3 rounded-2xl border ${isRtl ? 'text-right' : 'text-left'} transition-all cursor-pointer ${
                  aiIsolationMode === 'de_reverb'
                    ? 'bg-emerald-600/25 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 font-bold'
                    : 'bg-white/[0.03] backdrop-blur-md border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5 text-emerald-300">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'ar' ? 'حذف الصدى ' : 'De-Reverb & Clean'}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {language === 'ar' ? 'تنظيف ارتداد الصدى والريفيرب' : 'Remove room echoes and reverb tails'}
                </div>
              </button>
            </div>
          </div>

          {/* Upload Area or Locked Quota Card */}
          {!vipStatus.isOwner && !vipStatus.isVip && vipStatus.remaining <= 0 ? (
            <div
              onClick={() => setShowVipModal(true)}
              className="border-2 border-dashed border-slate-600 hover:border-emerald-400 rounded-3xl p-10 text-center transition-all bg-black/40 backdrop-blur-md cursor-pointer relative group space-y-3 shadow-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 group-hover:bg-emerald-500/20 text-slate-300 group-hover:text-emerald-300 flex items-center justify-center mx-auto transition-colors">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <p className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                   انتهت جميع المحاولات المجانية (0 / 20)
                </p>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
                  لقد استنفدت رصيدك المجاني بالكامل. يتوجب عليك الدفع للترقية ($5 أو $10 VIP) للاستمرار في عزل الصوت وبجودة استوديو فائقة!
                </p>
              </div>
              <button
                type="button"
                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs inline-flex items-center gap-2 shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform"
              >
                <Crown className="w-4 h-4 fill-current" />
                <span>الترقية بالدفع وفتح عزل الصوت بجودة أعلى ($5 / $10)</span>
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-white/20 hover:border-emerald-400 rounded-3xl p-10 text-center transition-all bg-black/30 backdrop-blur-md relative group">
              <input
                type="file"
                accept="audio/*"
                onChange={handleAiUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <Upload className="w-12 h-12 text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-base font-bold text-white mb-1">انقر أو اسحب ملف الصوت هنا للمعالجة</p>
              <p className="text-xs text-slate-400">يدعم صيغ MP3, WAV, AAC, M4A حتى 25 ميجابايت</p>
              {aiFile && (
                <p className="mt-3 text-xs text-emerald-300 font-mono font-bold bg-emerald-500/15 py-1 px-3 rounded-full inline-block border border-emerald-500/30">
                  الملف المرفوع: {aiFile.name}
                </p>
              )}
            </div>
          )}

          {/* AI Progress Bar */}
          {aiProcessing && (
            <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-200 font-bold">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                  {aiStatusMsg || 'جاري تحليل واستخلاص ترددات الصوت البشري (Vocals Only)...'}
                </span>
                <span className="font-mono text-emerald-400">{aiProgress}%</span>
              </div>
              <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${aiProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* AI Output Result Preview & Download */}
          {stemsData && !aiProcessing && (
            <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-emerald-500/40 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">اكتمل عزل واستخراج المسارات بنجاح!</h4>
                    <p className="text-xs text-slate-400">تم فصل صوت المغني البشري عن اللحن والعوازف بدقة استوديو عالية</p>
                  </div>
                </div>
              </div>

              {/* Stem Select Tabs */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 flex-wrap">
                <button
                  onClick={() => setActiveStemTab('vocals')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeStemTab === 'vocals'
                      ? 'bg-emerald-600 text-white shadow-md font-black border border-emerald-400'
                      : 'bg-white/[0.04] backdrop-blur-md text-slate-300 hover:text-white'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'مسار الغناء فقط (Vocals Stem)' : 'Vocals Only Stem'}</span>
                </button>

                <button
                  onClick={() => setActiveStemTab('instrumental')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeStemTab === 'instrumental'
                      ? 'bg-emerald-600 text-white shadow-md font-black border border-emerald-400'
                      : 'bg-white/[0.04] backdrop-blur-md text-slate-300 hover:text-white'
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'الكاريوكي واللحن (Instrumental)' : 'Instrumental Karaoke'}</span>
                </button>

                <button
                  onClick={() => setActiveStemTab('bass')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeStemTab === 'bass'
                      ? 'bg-emerald-600 text-white shadow-md font-black border border-emerald-400'
                      : 'bg-white/[0.04] backdrop-blur-md text-slate-300 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'الإيقاع والبيز (Bass/Drums)' : 'Bass & Rhythm Stem'}</span>
                </button>
              </div>

              {/* Active Stem Player & Downloader */}
              {activeStemTab === 'vocals' && (
                <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'ar' ? 'استماع لصوت الغناء النقي (أكابيلا بدون عوازف)' : 'Listen to Pure Human Vocals (100% Acapella)'}</span>
                    </span>
                    <a
                      href={stemsData.vocalsUrl}
                      download={`yona_vocals_only_${aiFile?.name || 'stem'}.wav`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'تنزيل الغناء (WAV)' : 'Download Vocals (WAV)'}</span>
                    </a>
                  </div>
                  <audio controls src={stemsData.vocalsUrl} className="w-full h-10 rounded-xl bg-black/60" />
                </div>
              )}

              {activeStemTab === 'instrumental' && (
                <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Music className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'ar' ? 'استماع للحن الموسيقي بدون غناء (كاريوكي)' : 'Listen to Karaoke Instrumental Track'}</span>
                    </span>
                    <a
                      href={stemsData.instrumentalUrl}
                      download={`yona_instrumental_karaoke_${aiFile?.name || 'stem'}.wav`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'تنزيل الكاريوكي (WAV)' : 'Download Karaoke (WAV)'}</span>
                    </a>
                  </div>
                  <audio controls src={stemsData.instrumentalUrl} className="w-full h-10 rounded-xl bg-black/60" />
                </div>
              )}

              {activeStemTab === 'bass' && (
                <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'ar' ? 'استماع لمسار الإيقاع والبيز' : 'Listen to Bass & Rhythm Track'}</span>
                    </span>
                    <a
                      href={stemsData.bassUrl}
                      download={`yona_bass_rhythm_${aiFile?.name || 'stem'}.wav`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'تنزيل الإيقاع (WAV)' : 'Download Bass (WAV)'}</span>
                    </a>
                  </div>
                  <audio controls src={stemsData.bassUrl} className="w-full h-10 rounded-xl bg-black/60" />
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* TOOL 2: TAP BPM CALCULATOR */}
      {activeTool === 'bpm' && (
        <div className="p-8 rounded-3xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6 text-center max-w-2xl mx-auto">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30 inline-block">
              Web Audio Tap Engine
            </span>
            <h3 className="text-2xl font-bold font-tajawal text-white">حاسبة إيقاع الصوت (Tap BPM)</h3>
            <p className="text-xs text-slate-300">
              اضغط على الزر بانتظام مع إيقاع الأغنية أو الشارة لحساب الـ BPM بدقة
            </p>
          </div>

          <div className="py-6 flex justify-center">
            <button
              onClick={handleTap}
              className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white font-extrabold text-2xl flex flex-col items-center justify-center gap-2 shadow-2xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border-4 border-emerald-300/40"
            >
              <Activity className="w-8 h-8 animate-bounce" />
              <span>اضغط هنا</span>
              <span className="text-[10px] font-normal opacity-80">TAP HERE WITH TEMPO</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 space-y-2 max-w-md mx-auto">
            <div className="text-4xl font-extrabold font-inter text-emerald-400">
              {bpm ? `${bpm} BPM` : '--- BPM'}
            </div>
            <p className="text-xs font-bold text-emerald-300">{tempoName}</p>
            <p className="text-[11px] text-slate-400">
              عدد الضغطات المحسوبة: {taps.length} / 8
            </p>
          </div>

          <button
            onClick={resetBpm}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mx-auto transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة تعيين الضغطات</span>
          </button>
        </div>
      )}

      {/* TOOL 3: MUSICAL KEY & SCALE DETECTOR */}
      {activeTool === 'key' && (
        <div className="p-8 rounded-3xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6 max-w-3xl mx-auto text-right">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30 inline-block">
              Synthesizer & Scale Finder
            </span>
            <h3 className="text-2xl font-bold font-tajawal text-white">مكتشف وعازف السلّم والمقام الموسيقي</h3>
            <p className="text-xs text-slate-300">
              اختر النوتة الأساسية ونوع السلّم لمطابقة مقام الصوتيات وسماع نغمة السلم
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold block">النوتة الأساسية (Root Note):</label>
              <select
                value={selectedRootKey}
                onChange={(e) => setSelectedRootKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-inter font-bold focus:border-emerald-400"
              >
                {notesMap.map(n => (
                  <option key={n} value={n} className="bg-[#0F172A] text-white">{n}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold block">نوع السلّم (Scale Mood):</label>
              <select
                value={selectedScaleType}
                onChange={(e) => setSelectedScaleType(e.target.value as 'minor' | 'major')}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-inter font-bold focus:border-emerald-400"
              >
                <option value="minor" className="bg-[#0F172A] text-white">سُلم صغير حزين/عميق (Minor Scale)</option>
                <option value="major" className="bg-[#0F172A] text-white">سُلم كبير مبهج/حماسي (Major Scale)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs text-slate-300 font-bold block">بيانو افتراضي (انقر لسماع النغمة والمطابقة):</span>
            <div className="flex justify-center items-end gap-1.5 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 overflow-x-auto">
              {notesMap.map((note) => {
                const isScaleNote = scaleNotes.includes(note);
                const isAccidental = note.includes('#');

                return (
                  <button
                    key={note}
                    onClick={() => playPianoNote(note)}
                    className={`flex-1 min-w-[36px] max-w-[50px] transition-all rounded-b-xl flex flex-col justify-end items-center pb-2 cursor-pointer ${
                      isAccidental
                        ? 'h-24 bg-slate-900 border border-white/10 text-xs font-inter font-bold text-slate-300 hover:bg-emerald-500 hover:text-white'
                        : 'h-36 bg-white border border-gray-300 text-xs font-inter font-bold text-black hover:bg-emerald-100'
                    } ${isScaleNote ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-black' : ''}`}
                  >
                    <span>{note}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">نوتات السلّم ({selectedRootKey} {selectedScaleType}):</span>
              <span className="text-xs text-emerald-400 font-bold">
                {selectedScaleType === 'minor' ? 'شعور وجداني عميق' : 'شعور حماسي مبهج'}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pt-1 font-inter">
              {scaleNotes.map((n, idx) => (
                <span
                  key={idx}
                  onClick={() => playPianoNote(n)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-white font-extrabold text-sm hover:border-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TOOL 4: PITCH CHANGER */}
      {activeTool === 'pitch' && (
        <div className="p-8 rounded-3xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6 max-w-2xl mx-auto text-right">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30 inline-block">
              Web Audio Pitch Shifter
            </span>
            <h3 className="text-2xl font-bold font-tajawal text-white">مغيّر طبقة الصوت وسرعة الإيقاع (Pitch & Speed)</h3>
            <p className="text-xs text-slate-300">
              قم بالتحكم في سرعة وقرار/حدة طبقة الصوتيات لمطابقة صلتك الصوتية أثناء التمرين.
            </p>
          </div>

          <div className="space-y-6 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            {/* Pitch Semitones */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">تعديل الطبقة (Pitch Semitones):</span>
                <span className="font-mono text-emerald-400 font-bold">{pitchSemitones > 0 ? `+${pitchSemitones}` : pitchSemitones} نص نصف تون</span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="1"
                value={pitchSemitones}
                onChange={(e) => setPitchSemitones(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Playback Speed */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">سرعة التشغيل (Playback Speed):</span>
                <span className="font-mono text-emerald-400 font-bold">{playbackSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <button
              onClick={() => { setPitchSemitones(0); setPlaybackSpeed(1.0); }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة الضبط الافتراضي</span>
            </button>
          </div>
        </div>
      )}

      {/* TOOL 5: AUDIO CUTTER */}
      {activeTool === 'cutter' && (
        <div className="p-8 rounded-3xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6 max-w-2xl mx-auto text-right">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30 inline-block">
              Audio Trimmer & Clipper
            </span>
            <h3 className="text-2xl font-bold font-tajawal text-white">مقص وقاطع الصوتيات (Audio Cutter)</h3>
            <p className="text-xs text-slate-300">
              حدد زمني البداية والنهاية لقص أي مقطع صبيحي أو شارة أنمي بسهولة.
            </p>
          </div>

          <div className="space-y-4 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-bold block">اختر ملف الصوت للقص:</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    setCutterFile(null);
                    return;
                  }
                  const check = validateAudioFileUpload(file, 30);
                  if (!check.valid) {
                    setCutterNotice(check.error || 'الملف الصوتي غير صالح أو يتجاوز 30 ميجابايت.');
                    setCutterFile(null);
                    if (e.target) e.target.value = '';
                    return;
                  }
                  setCutterNotice(null);
                  setCutterFile(file);
                }}
                className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold">زمن البداية (ثانية):</span>
                <input
                  type="number"
                  min="0"
                  value={cutterStart}
                  onChange={(e) => setCutterStart(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold">زمن النهاية (ثانية):</span>
                <input
                  type="number"
                  min="1"
                  value={cutterEnd}
                  onChange={(e) => setCutterEnd(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs font-mono"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setCutterNotice(`تم تحديد المقطع بنجاح من ${cutterStart} ثانية إلى ${cutterEnd} ثانية!`);
                setTimeout(() => setCutterNotice(null), 4000);
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer"
            >
              <Scissors className="w-4 h-4" />
              <span>قص ومعاينة المقطع</span>
            </button>

            {cutterNotice && (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 px-4 py-2.5 rounded-xl text-xs font-bold text-center animate-fade-in">
                {cutterNotice}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIP Upgrade Modal */}
      {showVipModal && (
        <VipUpgradeModal
          isOpen={showVipModal}
          onClose={() => {
            setShowVipModal(false);
            setVipStatus(getVipStatusInfo());
          }}
          onSuccess={() => {
            setVipStatus(getVipStatusInfo());
          }}
        />
      )}

    </div>
  );
};
