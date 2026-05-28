import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function AuthModal({ open, onClose }) {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSignIn = async () => {
    if (!supabase) {
      setError('Auth not configured. Please try a hard refresh.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      if (result?.error) setError(result.error.message);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-card rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-border animate-page-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer text-xl leading-none p-1"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="text-center mb-7">
          <div className="font-serif text-3xl mb-2.5 text-foreground">
            Thai <em className="text-amber-500 not-italic">Study</em>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Sign in to track your progress, build streaks, and see which words need the most review.
          </p>
        </div>

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-sm font-medium text-foreground cursor-pointer disabled:opacity-50 shadow-sm"
        >
          <GoogleIcon />
          {loading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        {error && (
          <p className="text-xs text-red-500 mt-4 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2 text-center">
            {error}
          </p>
        )}

        <p className="text-xs text-muted-foreground mt-5 text-center">
          All study features work without signing in —{' '}
          <button
            onClick={onClose}
            className="underline underline-offset-2 hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0 text-xs"
          >
            explore without an account
          </button>
        </p>
      </div>
    </div>
  );
}
