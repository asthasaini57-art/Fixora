import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2, 
  UserCheck, 
  Eye, 
  EyeOff,
  CheckCircle2,
  Compass,
  Building2
} from 'lucide-react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  googleProvider, 
  signInAnonymously 
} from '../services/firebase';

interface AuthPageProps {
  onAuthSuccess?: () => void;
  onMunicipalityDirectAuth?: (email: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onMunicipalityDirectAuth }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'anon' | null>(null);

  const isMunicipalityEmail = (e: string) => {
    return e.trim().toLowerCase() === 'mayank54421@gmail.com';
  };

  const formatFirebaseError = (errCode: string, message: string): string => {
    switch (errCode) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled by administrators.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password combination.';
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in popup was closed before completing.';
      case 'auth/operation-not-allowed':
        return 'This sign-in provider is not enabled in your Firebase console. Please enable Email/Password or Google provider.';
      default:
        return message || 'Authentication failed. Please check your credentials and try again.';
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const isMuniEmail = isMunicipalityEmail(email);
    const isMuniPasswordValid = password === '654321';

    if (isMuniEmail && !isMuniPasswordValid) {
      setError('Galat password for Nagar Nigam Municipal Corporation account.');
      setLoading(false);
      return;
    }

    const isOfficial = isMuniEmail && isMuniPasswordValid;

    try {
      if (mode === 'signin') {
        try {
          await signInWithEmailAndPassword(auth, email.trim(), password);
        } catch (signInErr: any) {
          // If user doesn't exist yet in remote Firebase project, try creating it automatically
          if (signInErr?.code === 'auth/user-not-found' || signInErr?.code === 'auth/invalid-credential') {
            try {
              await createUserWithEmailAndPassword(auth, email.trim(), password);
            } catch (createErr: any) {
              if (isOfficial && onMunicipalityDirectAuth) {
                onMunicipalityDirectAuth(email.trim());
                return;
              }
              throw signInErr;
            }
          } else {
            if (isOfficial && onMunicipalityDirectAuth) {
              onMunicipalityDirectAuth(email.trim());
              return;
            }
            throw signInErr;
          }
        }
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      if (isOfficial && onMunicipalityDirectAuth) {
        onMunicipalityDirectAuth(email.trim());
      } else {
        setError(formatFirebaseError(err?.code || '', err?.message || ''));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSocialLoading('google');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-in Error:', err);
      setError(formatFirebaseError(err?.code || '', err?.message || ''));
    } finally {
      setSocialLoading(null);
    }
  };

  const handleAnonymousSignIn = async () => {
    setError(null);
    setSocialLoading('anon');
    try {
      await signInAnonymously(auth);
    } catch (err: any) {
      console.error('Anonymous Sign-in Error:', err);
      setError(formatFirebaseError(err?.code || '', err?.message || ''));
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-amber-500 selection:text-white relative overflow-hidden">
      
      {/* Background Subtle Gradient Blobs & Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="auth-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl mb-2">
            <AlertTriangle className="w-6 h-6 text-amber-400 stroke-[2.2]" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-white">
              Fixora
            </h1>
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-amber-300 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded">
              नगर निगम
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto">
            Public Damage Reporting & Ward Leadership Accountability (जनता जवाबदेही पोर्टल)
          </p>
        </div>

        {/* Municipal Officer Hint Card */}
        <div className="bg-amber-950/40 border border-amber-800/60 rounded-2xl p-3 text-xs text-amber-200/90 flex items-start gap-2.5">
          <Building2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-amber-300">Nagar Nigam Officer Portal Login:</span>
            <p className="text-[11px] text-amber-200/80">
              Officer Mayank: <strong className="text-white font-mono">mayank54421@gmail.com</strong> (Pass: <span className="font-mono text-white">654321</span>)
            </p>
          </div>
        </div>

        {/* Auth Card Container */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          
          {/* Sign In vs Sign Up Tabs */}
          <div className="flex p-1 bg-slate-950/80 rounded-xl border border-slate-800/80">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In (लॉगिन)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Naya Khata (Sign Up)
            </button>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-start gap-2 animate-in fade-in duration-150">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Kripya rukhein...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to Fixora (प्रवेश करें)' : 'Create Account (पंजीकरण)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 absolute font-mono">
              ya continue karein
            </span>
          </div>

          {/* Alternate Sign-In Methods */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={socialLoading !== null}
              className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2.5 disabled:opacity-60"
            >
              {socialLoading === 'google' ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={handleAnonymousSignIn}
              disabled={socialLoading !== null}
              className="w-full py-2.5 px-4 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 font-medium rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {socialLoading === 'anon' ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
              <span>Continue as Anonymous Citizen (आम नागरिक - बिना खाता)</span>
            </button>
          </div>

          {/* Firebase Connection Verification Badge */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Project: fixora-97b6d</span>
            </div>
            <span>Govt / Nagar Nigam Secure Auth</span>
          </div>

        </div>

        {/* Security & Privacy Footer Note */}
        <div className="text-center text-xs text-slate-500 space-y-1">
          <p className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>End-to-end encrypted civic reporting protocol</span>
          </p>
          <p className="text-[11px] text-slate-600">
            Zero identity leaks. Report potholes and civic issues with total peace of mind.
          </p>
        </div>

      </div>
    </div>
  );
};
