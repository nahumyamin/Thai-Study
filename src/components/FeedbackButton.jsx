import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const FORM_ID = 'xgoqjabj';
const PURPOSES = ['Self-study', 'Classroom / teaching', 'Travel prep', 'Living in Thailand', 'Other'];
const LEVELS   = ['Beginner', 'Intermediate', 'Advanced'];

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          className="text-2xl leading-none transition-transform hover:scale-110 focus:outline-none"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <span className={cn(
            'transition-colors',
            n <= (hover || value) ? 'text-amber-400' : 'text-muted-foreground/30'
          )}>★</span>
        </button>
      ))}
    </div>
  );
}

const PULSE_KEY = 'feedback-pulse-done';

export default function FeedbackButton() {
  const [open, setOpen]         = useState(false);
  const [rating, setRating]     = useState(0);
  const [purposes, setPurposes] = useState([]);
  const [level, setLevel]       = useState('');
  const [message, setMessage]   = useState('');
  const [status, setStatus]     = useState('idle'); // idle | submitting | success | error
  const [hovered, setHovered]   = useState(false);
  const [pulsed, setPulsed]     = useState(false);

  const isExpanded = hovered || pulsed;

  // One-time first-visit pulse for discoverability
  useEffect(() => {
    if (localStorage.getItem(PULSE_KEY)) return;
    const expand = setTimeout(() => {
      setPulsed(true);
      const collapse = setTimeout(() => {
        setPulsed(false);
        localStorage.setItem(PULSE_KEY, '1');
      }, 1800);
      return () => clearTimeout(collapse);
    }, 1500);
    return () => clearTimeout(expand);
  }, []);

  const togglePurpose = (p) =>
    setPurposes(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const handleOpen = () => {
    setRating(0); setPurposes([]); setLevel(''); setMessage(''); setStatus('idle');
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          rating:   rating ? `${rating} / 5` : 'Not rated',
          purpose:  purposes.length ? purposes.join(', ') : 'Not specified',
          level:    level || 'Not specified',
          message:  message.trim() || '(no message)',
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      {/* Floating action button — circle by default, pill on hover/pulse */}
      <button
        onClick={handleOpen}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Give feedback"
        className={cn(
          'fixed bottom-6 right-6 z-40 flex items-center justify-center rounded-full',
          'bg-primary text-primary-foreground shadow-lg cursor-pointer',
          'active:scale-95 transition-all duration-300 ease-in-out',
          isExpanded ? 'px-4' : 'w-12',
          'h-12',
        )}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden className="shrink-0">
          <path d="M7.5 1C3.91 1 1 3.69 1 7c0 1.73.8 3.28 2.08 4.38L2.5 14l2.9-1.45C5.9 12.84 6.69 13 7.5 13c3.59 0 6.5-2.69 6.5-6S11.09 1 7.5 1z" fill="currentColor"/>
        </svg>
        <span
          style={{
            maxWidth:    isExpanded ? '5rem'   : '0',
            opacity:     isExpanded ? 1        : 0,
            marginLeft:  isExpanded ? '0.4rem' : '0',
          }}
          className="text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out"
        >
          Feedback
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="text-4xl">🙏</div>
              <DialogTitle>Thank you!</DialogTitle>
              <DialogDescription>Your feedback has been sent. It really helps.</DialogDescription>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Close</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <DialogHeader>
                <DialogTitle>Quick feedback</DialogTitle>
                <DialogDescription>Takes about 30 seconds. Completely anonymous.</DialogDescription>
              </DialogHeader>

              {/* Rating */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Overall rating</label>
                <StarRating value={rating} onChange={setRating} />
              </div>

              {/* Purpose */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">What are you using it for?</label>
                <div className="flex flex-col gap-1.5">
                  {PURPOSES.map(p => (
                    <label key={p} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={purposes.includes(p)}
                        onChange={() => togglePurpose(p)}
                        className="accent-primary w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Your Thai level</label>
                <div className="flex gap-3">
                  {LEVELS.map(l => (
                    <label key={l} className="flex items-center gap-1.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="level"
                        value={l}
                        checked={level === l}
                        onChange={() => setLevel(l)}
                        className="accent-primary w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{l}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Free text */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Any comments? <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="What's working well, what's missing, ideas…"
                  rows={3}
                  className={cn(
                    'w-full rounded-md border border-input bg-background px-3 py-2',
                    'text-sm placeholder:text-muted-foreground resize-none',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
                  )}
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-destructive">Something went wrong — please try again.</p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending…' : 'Send feedback'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
