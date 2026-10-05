import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  auth, 
  loginWithGoogle, 
  loginAnonymously, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from '../lib/firebase';

export interface AppUser {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  avatarIcon?: string;
  planetTheme?: string;
}

interface AuthModalOptions {
  title?: string;
  description?: string;
  defaultTab?: 'email' | 'quick' | 'google' | 'admin' | 'user';
  onSuccess?: () => void;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<AppUser>;
  signInWithEmail: (email: string, name?: string, avatarIcon?: string, planetTheme?: string) => Promise<AppUser>;
  signInAsGuest: () => Promise<AppUser>;
  signInWithCustomName: (name: string, avatarIcon?: string, planetTheme?: string) => Promise<AppUser>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalOptions: AuthModalOptions | null;
  openAuthModal: (options?: AuthModalOptions) => void;
  closeAuthModal: () => void;
}

const LOCAL_USER_KEY = 'yona_current_user';

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => { throw new Error('Not implemented'); },
  signInWithEmail: async () => { throw new Error('Not implemented'); },
  signInAsGuest: async () => { throw new Error('Not implemented'); },
  signInWithCustomName: async () => { throw new Error('Not implemented'); },
  signOut: async () => {},
  isAuthenticated: false,
  isAuthModalOpen: false,
  authModalOptions: null,
  openAuthModal: () => {},
  closeAuthModal: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear any previous mock/fallback user session
        if (parsed.email === 'member@gmail.com' || parsed.displayName === 'عضو Google سبيستون') {
          localStorage.removeItem(LOCAL_USER_KEY);
          return null;
        }
        return parsed;
      }
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalOptions, setAuthModalOptions] = useState<AuthModalOptions | null>(null);

  // Sync with Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const cleanEmail = currentUser.email || '';
        const derivedName = currentUser.displayName || (cleanEmail ? cleanEmail.split('@')[0] : (currentUser.isAnonymous ? 'زائر' : 'مستخدم'));
        const appUser: AppUser = {
          uid: currentUser.uid,
          displayName: derivedName,
          email: cleanEmail || null,
          photoURL: currentUser.photoURL,
          isAnonymous: currentUser.isAnonymous,
          avatarIcon: '🌟',
          planetTheme: 'adventure'
        };
        setUser(appUser);
        try {
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
        } catch {}
      } else {
        // Check if there is a local custom member session
        try {
          const localSaved = localStorage.getItem(LOCAL_USER_KEY);
          if (localSaved) {
            const parsed = JSON.parse(localSaved);
            if (parsed.email === 'member@gmail.com' || parsed.displayName === 'عضو Google سبيستون') {
              localStorage.removeItem(LOCAL_USER_KEY);
              setUser(null);
            } else {
              setUser(parsed);
            }
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openAuthModal = useCallback((options?: AuthModalOptions) => {
    setAuthModalOptions(options || null);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalOptions(null);
  }, []);

  const handleGoogleSignIn = async (): Promise<AppUser> => {
    try {
      const fbUser = await loginWithGoogle();
      const actualEmail = fbUser.email || '';
      // Use real Google displayName, or extract name from email prefix (e.g. ALsaudadam@gmail.com -> ALsaudadam)
      const actualName = fbUser.displayName || (actualEmail ? actualEmail.split('@')[0] : 'مستخدم Google');
      const appUser: AppUser = {
        uid: fbUser.uid || `google-${Date.now()}`,
        displayName: actualName,
        email: actualEmail || null,
        photoURL: fbUser.photoURL || null,
        isAnonymous: false,
        avatarIcon: '🌟',
        planetTheme: 'space'
      };
      setUser(appUser);
      try {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
      } catch {}
      return appUser;
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      // DO NOT fabricate fake mock users
      throw new Error(
        err.message || 'تعذر الاتصال بحساب Google. يمكنك إدخال اسمك وبريدك مباشرة في الخانات.'
      );
    }
  };

  const handleEmailSignIn = async (email: string, name?: string, avatarIcon = '🌟', planetTheme = 'space'): Promise<AppUser> => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      throw new Error('الرجاء إدخال بريد إلكتروني صحيح');
    }

    // Explicit Rule: If name is not provided, use the username part before @ (e.g. ALsaudadam@gmail.com -> ALsaudadam)
    const emailPrefix = trimmedEmail.split('@')[0];
    const derivedName = name && name.trim() ? name.trim() : emailPrefix;

    let uid = `email-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    try {
      const anon = await loginAnonymously().catch(() => null);
      if (anon?.uid) uid = anon.uid;
    } catch {}

    const appUser: AppUser = {
      uid,
      displayName: derivedName,
      email: trimmedEmail,
      photoURL: null,
      isAnonymous: false,
      avatarIcon,
      planetTheme
    };

    setUser(appUser);
    try {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
    } catch {}

    // Send email login notification to the user's email via backend API
    try {
      const resp = await fetch('/api/auth/send-login-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          name: derivedName,
          avatarIcon,
          planetTheme
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.notificationPayload) {
          try {
            localStorage.setItem('yona_last_email_notification', JSON.stringify(data.notificationPayload));
          } catch {}
        }
      }
    } catch (apiErr) {
      console.warn('Backend email notification notice:', apiErr);
    }

    return appUser;
  };

  const handleCustomNameSignIn = async (name: string, avatarIcon = '👑', planetTheme = 'adventure'): Promise<AppUser> => {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error('الرجاء إدخال الاسم أو اللقب');
    }

    let uid = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    try {
      const anon = await loginAnonymously().catch(() => null);
      if (anon?.uid) uid = anon.uid;
    } catch {}

    const appUser: AppUser = {
      uid,
      displayName: trimmed,
      email: null,
      photoURL: null,
      isAnonymous: false,
      avatarIcon,
      planetTheme
    };

    setUser(appUser);
    try {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
    } catch {}
    return appUser;
  };

  const handleGuestSignIn = async (): Promise<AppUser> => {
    let uid = `guest-${Date.now()}`;
    try {
      const anon = await loginAnonymously().catch(() => null);
      if (anon?.uid) uid = anon.uid;
    } catch {}

    const appUser: AppUser = {
      uid,
      displayName: 'زائر',
      email: null,
      photoURL: null,
      isAnonymous: true,
      avatarIcon: '🌟',
      planetTheme: 'space'
    };

    setUser(appUser);
    try {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
    } catch {}
    return appUser;
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
    } catch {}
    try {
      localStorage.removeItem(LOCAL_USER_KEY);
      localStorage.removeItem('yona_admin_authenticated');
      localStorage.removeItem('yona_cert_owner_auth');
    } catch {}
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle: handleGoogleSignIn,
        signInWithEmail: handleEmailSignIn,
        signInAsGuest: handleGuestSignIn,
        signInWithCustomName: handleCustomNameSignIn,
        signOut: handleSignOut,
        isAuthenticated,
        isAuthModalOpen,
        authModalOptions,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
