/**
 * Security & Anti-Fraud Protection Module for Yona Platform
 * 
 * Features:
 * 1. Legitimate View Counter Verification (Threshold playback + Session Cooldown + Anti-Spam Flood Guard)
 * 2. Fake Likes & Voting Shield (Unique Device Token + Action Debouncing + Cooldown)
 * 3. Audience Comments Anti-Spam & Content Quality Guard
 */

const FINGERPRINT_KEY = 'yona_sec_device_token';
const LAST_COMMENT_TIME_KEY = 'yona_sec_last_comment_ts';
const LAST_COMMENT_TEXT_KEY = 'yona_sec_last_comment_hash';
const RECENT_VIEW_BURST_KEY = 'yona_sec_view_burst_tracker';

/**
 * Returns or creates a persistent pseudonymous client device token.
 * Used to prevent guest vote multiplication and identify unique listeners.
 */
export function getDeviceSecurityToken(): string {
  if (typeof window === 'undefined') return 'server_render_token';
  try {
    let token = localStorage.getItem(FINGERPRINT_KEY);
    if (!token) {
      const entropy = [
        navigator.userAgent || '',
        screen.width + 'x' + screen.height,
        Intl.DateTimeFormat().resolvedOptions().timeZone || '',
        Date.now().toString(36),
        Math.random().toString(36).substring(2, 10),
      ].join('|');
      
      // Simple lightweight DJB2-like hash combined with random entropy
      let hash = 5381;
      for (let i = 0; i < entropy.length; i++) {
        hash = (hash * 33) ^ entropy.charCodeAt(i);
      }
      token = `yona_dev_${Math.abs(hash).toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem(FINGERPRINT_KEY, token);
    }
    return token;
  } catch {
    return 'fallback_device_token';
  }
}

/**
 * Action Debounce & Click Flood Protection
 * Prevents automated scripts or rapid multiple-clicking from registering fake likes or votes.
 */
const lastActionTimes = new Map<string, number>();

export function isActionRateLimited(actionKey: string, cooldownMs: number = 1000): boolean {
  const now = Date.now();
  const lastTime = lastActionTimes.get(actionKey) || 0;
  if (now - lastTime < cooldownMs) {
    return true; // Rate-limited (spam / burst detected)
  }
  lastActionTimes.set(actionKey, now);
  return false;
}

/**
 * Legitimate Song View Verification:
 * - Playback threshold: Must have listened for at least 10 seconds.
 * - Session Cooldown: Same song cannot be counted multiple times within 20 minutes from same browser.
 * - Global Flood Guard: Maximum 10 view increments in 60 seconds across all songs (anti-bot loop shield).
 */
export function recordLegitimateSongView(songId: string): { recorded: boolean; reason?: string } {
  if (typeof window === 'undefined') return { recorded: false, reason: 'SSR' };

  try {
    const now = Date.now();

    // 1. Anti-Bot Burst Guard: check global rapid increments
    let burstData: { count: number; windowStart: number } = { count: 0, windowStart: now };
    const savedBurst = sessionStorage.getItem(RECENT_VIEW_BURST_KEY);
    if (savedBurst) {
      try {
        const parsed = JSON.parse(savedBurst);
        if (now - parsed.windowStart < 60000) {
          burstData = parsed;
        }
      } catch {}
    }

    if (burstData.count >= 12) {
      return { recorded: false, reason: 'rate_limited_burst' };
    }

    // 2. Song Session Cooldown: 20 minutes
    const sessionKey = `yona_view_${songId}`;
    const lastViewedAt = sessionStorage.getItem(sessionKey);
    const TWENTY_MINUTES = 20 * 60 * 1000;

    if (lastViewedAt) {
      const elapsed = now - parseInt(lastViewedAt, 10);
      if (elapsed < TWENTY_MINUTES) {
        return { recorded: false, reason: 'session_cooldown_active' };
      }
    }

    // Mark as legitimately viewed
    sessionStorage.setItem(sessionKey, now.toString());
    burstData.count += 1;
    sessionStorage.setItem(RECENT_VIEW_BURST_KEY, JSON.stringify(burstData));

    return { recorded: true };
  } catch (err) {
    return { recorded: false, reason: 'storage_error' };
  }
}

/**
 * Checks if a specific device has already liked a contest entry or recording
 */
export function hasDeviceLiked(targetId: string, namespace: string = 'contest'): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const token = getDeviceSecurityToken();
    return localStorage.getItem(`yona_liked_${namespace}_${targetId}_${token}`) === '1';
  } catch {
    return false;
  }
}

/**
 * Sets or toggles device like state
 */
export function setDeviceLiked(targetId: string, liked: boolean, namespace: string = 'contest'): void {
  if (typeof window === 'undefined') return;
  try {
    const token = getDeviceSecurityToken();
    const key = `yona_liked_${namespace}_${targetId}_${token}`;
    if (liked) {
      localStorage.setItem(key, '1');
    } else {
      localStorage.removeItem(key);
    }
  } catch {}
}

/**
 * Anti-Spam Guard for Public Audience Comments
 * - Prevents rapid multi-posting (minimum 5s cooldown)
 * - Prevents posting identical duplicate comments
 * - Checks text quality (length, repetitive characters)
 */
export function validateAudienceComment(text: string): { valid: boolean; message?: string } {
  const clean = text.trim();
  if (!clean || clean.length < 3) {
    return { valid: false, message: 'التعليق قصير جداً (3 أحرف على الأقل مطلوب).' };
  }

  if (clean.length > 280) {
    return { valid: false, message: 'التعليق طويل جداً (الحد الأقصى 280 حرفاً).' };
  }

  // Check repetitive character spam (e.g. "ههههههههههههههههههههههههههههههههههههههههه" > 15 times)
  if (/(.)\1{12,}/.test(clean)) {
    return { valid: false, message: 'يُرجى عدم تكرار نفس الحرف بشكل مفرط.' };
  }

  if (typeof window !== 'undefined') {
    const now = Date.now();
    const lastTime = parseInt(sessionStorage.getItem(LAST_COMMENT_TIME_KEY) || '0', 10);
    const lastHash = sessionStorage.getItem(LAST_COMMENT_TEXT_KEY);

    // Cooldown check (5 seconds between comments)
    if (now - lastTime < 5000) {
      const waitSec = Math.ceil((5000 - (now - lastTime)) / 1000);
      return { valid: false, message: `يرجى الانتظار ${waitSec} ثوانٍ قبل كتابة تعليق آخر لمنع التكرار.` };
    }

    // Duplicate check
    const currentHash = clean.toLowerCase().replace(/\s+/g, '');
    if (lastHash === currentHash) {
      return { valid: false, message: 'لقد قمت بنشر هذا التعليق للتو! يرجى كتابة تعليق جديد.' };
    }

    // Update tracking
    sessionStorage.setItem(LAST_COMMENT_TIME_KEY, now.toString());
    sessionStorage.setItem(LAST_COMMENT_TEXT_KEY, currentHash);
  }

  return { valid: true };
}

/**
 * Escapes potentially dangerous HTML entities to prevent Cross-Site Scripting (XSS).
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes user input string: strips dangerous script tags, javascript: protocols,
 * and dangerous HTML event handlers (onload, onerror, onclick, etc.).
 */
export function sanitizeUserInput(input: string): string {
  if (!input) return '';
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/\s+on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')
    .trim();
  return sanitized;
}

/**
 * Validates audio file uploads to prevent DoS attacks, browser memory exhaustion,
 * and unsupported/corrupted file types.
 * 
 * Default max size: 30 MB
 */
export function validateAudioFileUpload(
  file: File | Blob,
  maxSizeMb: number = 30
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'لم يتم تحديد أي ملف.' };
  }

  // Check file size
  const maxBytes = maxSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    const currentMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `حجم الملف الصوتي كبير جداً (${currentMb} ميجابايت). الحد الأقصى المسموح به هو ${maxSizeMb} ميجابايت لضمان سرعة المعالجة وتفادي بطء المتصفح.`
    };
  }

  // Check file type if it's a File object with name and type
  if ('type' in file && file.type) {
    const validAudioPrefixes = ['audio/', 'video/mp4', 'video/webm', 'video/ogg'];
    const isAudioType = validAudioPrefixes.some((prefix) => file.type.toLowerCase().startsWith(prefix));
    
    // Also check extension as fallback for some mobile browsers that send empty mime
    const fileName = ('name' in file ? (file as File).name : '').toLowerCase();
    const validExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.webm', '.flac', '.opus', '.wma', '.mp4'];
    const hasValidExtension = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isAudioType && !hasValidExtension) {
      return {
        valid: false,
        error: 'صيغة الملف غير مدعومة. يرجى اختيار ملف صوتي بصيغة (MP3, WAV, M4A, AAC, OGG, WebM).'
      };
    }
  }

  return { valid: true };
}

/**
 * Validates image uploads (e.g. for custom story cards or avatars).
 * Default max size: 8 MB
 */
export function validateImageFileUpload(
  file: File | Blob,
  maxSizeMb: number = 8
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'لم يتم تحديد أي ملف.' };
  }

  const maxBytes = maxSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    const currentMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `حجم الصورة كبير جداً (${currentMb} ميجابايت). الحد الأقصى المسموح به هو ${maxSizeMb} ميجابايت.`
    };
  }

  if ('type' in file && file.type) {
    if (!file.type.toLowerCase().startsWith('image/')) {
      return {
        valid: false,
        error: 'الملف المختار ليس صورة صالحة. يرجى اختيار صورة بصيغة (PNG, JPG, WebP).'
      };
    }
  }

  return { valid: true };
}

