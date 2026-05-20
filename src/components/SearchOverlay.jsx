import { useState, useEffect, useRef } from 'react';
import { allVocab, topics } from '../data/vocab.js';
import { GRAMMAR_RULES } from '../data/grammar.js';
import { PASSAGES } from '../data/passages.js';
import { cn } from '@/lib/utils';

const stripTags = (s) => (s || '').replace(/<[^>]*>/g, '');

function runSearch(query) {
  if (!query.trim()) return null;
  const q = query.toLowerCase().trim();

  const vocab = allVocab
    .filter(w =>
      w.thai.includes(q) ||
      w.rom.toLowerCase().includes(q) ||
      w.en.toLowerCase().includes(q)
    )
    .slice(0, 6);

  const grammar = GRAMMAR_RULES
    .filter(r =>
      r.title.toLowerCase().includes(q) ||
      stripTags(r.pattern).toLowerCase().includes(q) ||
      stripTags(r.desc).toLowerCase().includes(q)
    )
    .slice(0, 4);

  const passages = PASSAGES
    .filter(p => p.title.toLowerCase().includes(q))
    .slice(0, 3);

  return { vocab, grammar, passages };
}

// ── Section header ────────────────────────────────────────────────
function SectionLabel({ label }) {
  return (
    <div className="px-4 pt-3 pb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
      {label}
    </div>
  );
}

// ── Search icon SVG ───────────────────────────────────────────────
export function SearchIcon({ className }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Main overlay ──────────────────────────────────────────────────
export default function SearchOverlay({ open, onClose, showPage }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const results = runSearch(query);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSelect = (page) => {
    showPage(page);
    onClose();
  };

  const hasResults = results && (results.vocab.length + results.grammar.length + results.passages.length) > 0;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-16 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[580px] bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <SearchIcon className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search words, grammar, passages…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-muted-foreground hover:text-foreground transition-colors text-base leading-none"
              aria-label="Clear"
            >
              ×
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[0.65rem] border border-border rounded text-muted-foreground font-mono">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[420px] overflow-y-auto">
          {!query.trim() && (
            <div className="px-4 py-8 text-sm text-muted-foreground text-center">
              Type to search across vocabulary, grammar rules, and passages
              <div className="mt-3 text-[0.7rem] text-muted-foreground/60">
                Press <kbd className="px-1 border border-border rounded font-mono">/</kbd> anywhere to open
              </div>
            </div>
          )}

          {query.trim() && !hasResults && (
            <div className="px-4 py-8 text-sm text-muted-foreground text-center">
              No results for <span className="text-foreground font-medium">"{query}"</span>
            </div>
          )}

          {results?.vocab.length > 0 && (
            <section>
              <SectionLabel label="Vocabulary" />
              {results.vocab.map((w, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect('cards')}
                  className="w-full text-left px-4 py-2.5 hover:bg-muted/50 flex items-baseline gap-3 transition-colors group"
                >
                  <span className="text-[1rem] text-foreground font-light shrink-0">{w.thai}</span>
                  <span className="text-sm text-muted-foreground truncate flex-1">{w.en}</span>
                  <span className="text-xs text-muted-foreground/60 italic shrink-0 hidden sm:block">{w.rom}</span>
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 self-center"
                    style={{ background: topics[w.topic]?.color || '#888' }}
                  />
                </button>
              ))}
            </section>
          )}

          {results?.grammar.length > 0 && (
            <section className={cn(results?.vocab.length > 0 && 'border-t border-border')}>
              <SectionLabel label="Grammar" />
              {results.grammar.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect('grammar')}
                  className="w-full text-left px-4 py-2.5 hover:bg-muted/50 flex items-baseline gap-3 transition-colors"
                >
                  <span className="font-serif italic text-primary text-sm shrink-0 w-5 text-right">{r.num}</span>
                  <span className="text-sm text-foreground flex-1 truncate">{r.title}</span>
                  <span className="text-xs font-mono text-muted-foreground/70 shrink-0 hidden sm:block max-w-[140px] truncate">
                    {stripTags(r.pattern)}
                  </span>
                </button>
              ))}
            </section>
          )}

          {results?.passages.length > 0 && (
            <section className={cn((results?.vocab.length + results?.grammar.length) > 0 && 'border-t border-border')}>
              <SectionLabel label="Passages" />
              {results.passages.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect('passages')}
                  className="w-full text-left px-4 py-2.5 hover:bg-muted/50 flex items-center gap-3 transition-colors"
                >
                  <span className="text-muted-foreground text-xs">📖</span>
                  <span className="text-sm text-foreground">{p.title}</span>
                </button>
              ))}
            </section>
          )}

          {hasResults && (
            <div className="px-4 py-2 border-t border-border text-[0.65rem] text-muted-foreground/60">
              Click a result to navigate to that section
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
