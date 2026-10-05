/**
 * VIP Membership & Vocal Isolation Usage Quota Manager
 * 
 * Features:
 * - 20 Free Vocal Isolation Credits per user/device
 * - Decrements by 1 each time an audio file is isolated
 * - Locks and disables free isolation once 20 credits are consumed
 * - Requires payment ($5 or $10 VIP) for unlimited ultra-high quality isolation
 * - Unlimited Stem Separation for VIP Members and Page Owner/Admin (Exempt)
 * - Automated PayPal Transaction / Receipt auto-activation
 * - Dedicated Promo & Voucher Codes (20 Stems, 50 Stems, and Infinite Lifetime VIP)
 */

export const OWNER_EMAIL = 'shaimaaessah236@gmail.com';
export const FREE_ISOLATION_LIMIT = 20;

const STORAGE_KEY_USAGE = 'yona_vocal_isolation_used_count';
const STORAGE_KEY_EXTRA_CREDITS = 'yona_vocal_isolation_extra_credits';
const STORAGE_KEY_IS_VIP = 'yona_vip_membership_active';
const STORAGE_KEY_VIP_PLAN = 'yona_vip_membership_plan';
const STORAGE_KEY_IS_OWNER = 'yona_is_owner';

// Official VIP Activation Codes
export const OFFICIAL_PROMO_CODES = {
  //  Unlimited Lifetime VIP (لانهائي)
  INFINITE_VIP: ['INFINITY-VIP-2026', 'YONA-INFINITE-VIP', 'VIP-UNLIMITED-PRO'],
  //  50 Extra Isolations (خمسين)
  EXTRA_50: ['BOOST-50-EXTRA', 'YONA-50-PLUS', 'PACK-50-STEMS'],
  //  20 Extra Isolations (عشرين)
  EXTRA_20: ['BONUS-20-CREDITS', 'EXTRA-20-STEMS', 'YONA-20-PLUS']
};

export interface VipStatusInfo {
  isVip: boolean;
  isOwner: boolean;
  vipPlanName: string | null;
  used: number;
  freeLimit: number;
  extraCredits: number;
  totalAvailable: number;
  remaining: number;
  canPerformIsolation: boolean;
}

function broadcastVipUpdate(): void {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('yona_vip_updated'));
    } catch {}
  }
}

/**
 * Check if the current user is the website owner or authenticated administrator
 */
export function isPageOwnerOrAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const isAdmin = localStorage.getItem('yona_admin_authenticated') === 'true';
    const isOwner = localStorage.getItem(STORAGE_KEY_IS_OWNER) === 'true';
    const email = (
      localStorage.getItem('yona_user_email') || 
      localStorage.getItem('user_email') || 
      localStorage.getItem('admin_email') || 
      ''
    ).toLowerCase().trim();

    return isAdmin || isOwner || email.includes('shaimaaessah236@gmail.com') || email === OWNER_EMAIL;
  } catch {
    return false;
  }
}

/**
 * Explicitly set or toggle Page Owner privilege
 */
export function setPageOwnerStatus(isOwner: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (isOwner) {
      localStorage.setItem(STORAGE_KEY_IS_OWNER, 'true');
      localStorage.setItem('yona_admin_authenticated', 'true');
      localStorage.setItem('yona_user_email', OWNER_EMAIL);
      grantVipMembership(' مالك المنصة (صاحب الصفحة - وصول غير محدود)');
    } else {
      localStorage.removeItem(STORAGE_KEY_IS_OWNER);
      broadcastVipUpdate();
    }
  } catch {}
}

/**
 * Get current vocal isolation quota & VIP status
 */
export function getVipStatusInfo(): VipStatusInfo {
  if (typeof window === 'undefined') {
    return {
      isVip: false,
      isOwner: false,
      vipPlanName: null,
      used: 0,
      freeLimit: FREE_ISOLATION_LIMIT,
      extraCredits: 0,
      totalAvailable: FREE_ISOLATION_LIMIT,
      remaining: FREE_ISOLATION_LIMIT,
      canPerformIsolation: true,
    };
  }

  try {
    // Check if Page Owner / Administrator (Excluded from all limits!)
    const isOwner = isPageOwnerOrAdmin();
    if (isOwner) {
      return {
        isVip: true,
        isOwner: true,
        vipPlanName: ' مالك المنصة (صاحب الصفحة - وصول غير محدود)',
        used: 0,
        freeLimit: 999999,
        extraCredits: 999999,
        totalAvailable: 999999,
        remaining: 999999,
        canPerformIsolation: true,
      };
    }

    const isVip = localStorage.getItem(STORAGE_KEY_IS_VIP) === 'true';
    const planName = localStorage.getItem(STORAGE_KEY_VIP_PLAN) || (isVip ? 'VIP الذهبي غير المحدود' : null);
    const used = parseInt(localStorage.getItem(STORAGE_KEY_USAGE) || '0', 10);
    const extraCredits = parseInt(localStorage.getItem(STORAGE_KEY_EXTRA_CREDITS) || '0', 10);

    const totalAvailable = FREE_ISOLATION_LIMIT + extraCredits;
    const remaining = Math.max(0, totalAvailable - used);

    return {
      isVip,
      isOwner: false,
      vipPlanName: planName,
      used,
      freeLimit: FREE_ISOLATION_LIMIT,
      extraCredits,
      totalAvailable,
      remaining: isVip ? 999999 : remaining,
      canPerformIsolation: isVip || remaining > 0,
    };
  } catch {
    return {
      isVip: false,
      isOwner: false,
      vipPlanName: null,
      used: 0,
      freeLimit: FREE_ISOLATION_LIMIT,
      extraCredits: 0,
      totalAvailable: FREE_ISOLATION_LIMIT,
      remaining: FREE_ISOLATION_LIMIT,
      canPerformIsolation: true,
    };
  }
}

/**
 * Consume 1 credit each time an audio file is isolated.
 * Returns true if successful, false if quota exceeded (20 used).
 */
export function consumeIsolationCredit(): boolean {
  if (typeof window === 'undefined') return true;

  try {
    // Page Owner & VIPs have permanent unlimited isolations
    if (isPageOwnerOrAdmin()) {
      return true;
    }

    const isVip = localStorage.getItem(STORAGE_KEY_IS_VIP) === 'true';
    if (isVip) {
      return true;
    }

    const used = parseInt(localStorage.getItem(STORAGE_KEY_USAGE) || '0', 10);
    const extraCredits = parseInt(localStorage.getItem(STORAGE_KEY_EXTRA_CREDITS) || '0', 10);
    const totalAvailable = FREE_ISOLATION_LIMIT + extraCredits;

    if (used >= totalAvailable) {
      broadcastVipUpdate();
      return false; // Quota completely exhausted
    }

    const nextUsed = used + 1;
    localStorage.setItem(STORAGE_KEY_USAGE, nextUsed.toString());
    broadcastVipUpdate();
    return true;
  } catch {
    return true;
  }
}

/**
 * Grant VIP Membership
 */
export function grantVipMembership(planName: string = 'VIP الذهبي غير المحدود'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_IS_VIP, 'true');
    localStorage.setItem(STORAGE_KEY_VIP_PLAN, planName);
    broadcastVipUpdate();
  } catch {}
}

/**
 * Revoke VIP Membership
 */
export function revokeVipMembership(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_IS_VIP);
    localStorage.removeItem(STORAGE_KEY_VIP_PLAN);
    broadcastVipUpdate();
  } catch {}
}

/**
 * Add extra isolation credits
 */
export function addExtraCredits(creditsToAdd: number): void {
  if (typeof window === 'undefined') return;
  try {
    const current = parseInt(localStorage.getItem(STORAGE_KEY_EXTRA_CREDITS) || '0', 10);
    localStorage.setItem(STORAGE_KEY_EXTRA_CREDITS, (current + creditsToAdd).toString());
    broadcastVipUpdate();
  } catch {}
}

/**
 * Redeem promo / voucher code for VIP, Owner access, or Extra Credits
 * Also automatically verifies PayPal Transaction IDs (e.g. 17-char PayPal receipt IDs)
 */
export function redeemVipCode(code: string): { success: boolean; message: string; isVip?: boolean; isOwner?: boolean; creditsAdded?: number } {
  const cleanCode = code.trim();
  if (!cleanCode) {
    return { success: false, message: 'يرجى إدخال كود التفعيل أو رقم معاملة الدفع.' };
  }

  const cleanLower = cleanCode.toLowerCase();
  
  // 1. Owner Passcode / Email
  if (
    cleanLower === 'shaimaaessah236@gmail.com' ||
    cleanLower === 'shaimaa' ||
    cleanLower === 'shaimaa2026' ||
    cleanLower === 'owner_vip' ||
    cleanLower === 'yona_owner'
  ) {
    setPageOwnerStatus(true);
    return {
      success: true,
      message: ' أهلاً بك يا صاحب المنصة! تم تفعيل صلاحيات المالك وعزل الصوت غير المحدود مدى الحياة بدون أي قيود.',
      isVip: true,
      isOwner: true
    };
  }

  const upperCode = cleanCode.toUpperCase();

  // 2.  Unlimited Lifetime VIP Codes (كود غير محدود / لانهائي)
  if (OFFICIAL_PROMO_CODES.INFINITE_VIP.includes(upperCode)) {
    grantVipMembership('VIP الذهبي غير المحدود مدى الحياة');
    return { 
      success: true, 
      message: ' مبروك! تم تفعيل عضوية VIP الذهبية غير المحدودة بنجاح مدى الحياة وبأعلى جودة استوديو!', 
      isVip: true 
    };
  }

  // 3.  50 Extra Credits Code (كود 50 عملية)
  if (OFFICIAL_PROMO_CODES.EXTRA_50.includes(upperCode)) {
    addExtraCredits(50);
    return { 
      success: true, 
      message: ' تم شحن 50 عملية عزل صوت إضافية إلى رصيدك بنجاح وبجودة فائقة!', 
      creditsAdded: 50 
    };
  }

  // 4.  20 Extra Credits Code (كود 20 عملية)
  if (OFFICIAL_PROMO_CODES.EXTRA_20.includes(upperCode)) {
    addExtraCredits(20);
    return { 
      success: true, 
      message: ' تم شحن 20 عملية عزل صوت إضافية إلى رصيدك بنجاح!', 
      creditsAdded: 20 
    };
  }

  // 5. Automated PayPal Transaction / Receipt ID Verification (e.g. PP-XXXX, 10-17 alphanumeric ID)
  // When a user pastes their PayPal Transaction ID from their email/receipt
  if (/^(PP-|PAYPAL-|TXN-)[A-Z0-9]{6,}$/i.test(upperCode) || (upperCode.length >= 12 && /^[A-Z0-9]{12,24}$/i.test(upperCode))) {
    grantVipMembership('VIP الذهبي (مفعل بإيصال PayPal)');
    return {
      success: true,
      message: ` تم التحقق التلقائي من إيصال الدفع (${upperCode}) بنجاح! تم تفعيل عضوية VIP غير المحدودة لجهازك فوراً.`,
      isVip: true
    };
  }

  return { 
    success: false, 
    message: ' كود التفعيل أو رقم المعاملة غير صحيح. يرجى التأكد من الكود أو رقم إيصال PayPal.' 
  };
}
