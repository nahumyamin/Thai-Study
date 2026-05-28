import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';
import { cn } from '@/lib/utils';

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function AuthModal({ open, onClose, initialMode = 'signup' }) {
  const { signInWithGoogle } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Reset state whenever modal opens or the intended mode changes
  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setEmail('');
      setPassword('');
      setError(null);
      setEmailSent(false);
      setLoading(false);
    }
  }, [open, initialMode]);

  if (!open) return null;

  // ── Google OAuth ───────────────────────────────────────────────
  const handleGoogle = async () => {
    if (!supabase) { setError('Auth not configured. Please try a hard refresh.'); return; }
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      if (result?.error) { setError(result.error.message); setLoading(false); }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  // ── Email auth ─────────────────────────────────────────────────
  const handleEmail = async (e) => {
    e.preventDefault();
    if (!supabase) { setError('Auth not configured.'); return; }
    setLoading(true);
    setError(null);

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: window.location.origin + import.meta.env.BASE_URL },
      });
      if (error) { setError(friendlyError(error.message)); setLoading(false); }
      else { setEmailSent(true); setLoading(false); }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) { setError(friendlyError(error.message)); setLoading(false); }
      // on success, onAuthStateChange fires → modal will be dismissed by parent
    }
  };

  // ── Email-sent confirmation screen ────────────────────────────
  if (emailSent) {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
        <div className="relative bg-card rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-border animate-page-in text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer text-xl leading-none p-1" aria-label="Close">✕</button>
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="font-serif text-xl text-foreground mb-2">Check your email</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>. Click it to activate your account.
          </p>
          <button
            onClick={() => { setEmailSent(false); setMode('login'); }}
            className="text-sm text-amber-600 hover:text-amber-500 transition-colors bg-transparent border-none cursor-pointer"
          >
            Back to sign in →
          </button>
        </div>
      </div>
    );
  }

  // ── Main modal ─────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-card rounded-2xl p-7 max-w-sm w-full shadow-2xl border border-border animate-page-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer text-xl leading-none p-1"
          aria-label="Close"
        >✕</button>

        {/* Brand */}
        <div className="text-center mb-6">
          <div className="font-serif text-2xl mb-1 text-foreground">
            Thai <em className="text-amber-500 not-italic">Study</em>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex rounded-lg border border-border p-0.5 mb-6">
          {(['signup', 'login'] ).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); }}
              className={cn(
                'flex-1 text-sm py-2 rounded-md transition-all font-medium cursor-pointer border-none',
                mode === m
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground bg-transparent'
              )}
            >
              {m === 'signup' ? 'Sign up' : 'Log in'}
            </button>
          ))}
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-sm font-medium text-foreground cursor-pointer disabled:opacity-50 shadow-sm mb-4"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[0.7rem] text-muted-foreground uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Email form */}
        <form onSubmit={handleEmail} className="space-y-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
              minLength={mode === 'signup' ? 6 : undefined}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer border-none disabled:opacity-50"
          >
            {loading ? '…' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-xs text-muted-foreground mt-4 text-center">
          {mode === 'signup' ? (
            <>Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError(null); }} className="text-foreground underline underline-offset-2 hover:text-primary transition-colors bg-transparent border-none cursor-pointer text-xs">
                Log in
              </button>
            </>
          ) : (
            <>New here?{' '}
              <button onClick={() => { setMode('signup'); setError(null); }} className="text-foreground underline underline-offset-2 hover:text-primary transition-colors bg-transparent border-none cursor-pointer text-xs">
                Create account
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function friendlyError(msg) {
  if (!msg) return 'Something went wrong. Please try again.';
  if (msg.includes('Invalid login credentials')) return 'Incorrect email or password.';
  if (msg.includes('Email not confirmed')) return 'Please confirm your email first. Check your inbox.';
  if (msg.includes('User already registered')) return 'An account with this email already exists. Try logging in.';
  if (msg.includes('Password should be')) return 'Password must be at least 6 characters.';
  if (msg.includes('Unable to validate')) return 'Please check your email address.';
  return msg;
}
