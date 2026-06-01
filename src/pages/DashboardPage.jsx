import { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../lib/supabase.js';
import {
  getDailyChallengeHistory,
  updateDailyChallenge,
  deleteDailyChallenge,
  unlockAchievements,
} from '../lib/progress.js';
import { useAuth } from '../context/AuthContext.jsx';
import { cn } from '../lib/utils.js';
import {
  ACHIEVEMENTS,
  REVIEW_INTERVALS,
  getLevel,
  computeEarnedAchievements,
} from '../lib/gamification.js';
import { allVocab, topics } from '../data/vocab.js';
import { Button } from '@/components/ui/button.jsx';

// ─────────────────────────────────────────────────────────────────
// Tiny icon helpers
// ─────────────────────────────────────────────────────────────────
function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={cn('transition-transform duration-200', open ? 'rotate-180' : '')}
    >
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function BellIcon({ filled }) {
  return filled ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────
// Bell / Reminder modal
// ─────────────────────────────────────────────────────────────────
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function ReminderModal({ reminders, saving, onSave, onClose, userEmail }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-foreground">Email Reminders</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Sent to {userEmail}</p>
          </div>
          <button
            onClick={() => onSave({ ...reminders, email_enabled: !reminders.email_enabled })}
            className={cn(
              'relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer border-none shrink-0',
              reminders.email_enabled ? 'bg-amber-400' : 'bg-muted-foreground/30'
            )}
            aria-label="Toggle reminders"
          >
            <span className={cn(
              'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
              reminders.email_enabled ? 'translate-x-4' : 'translate-x-0.5'
            )} />
          </button>
        </div>

        {reminders.email_enabled && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Remind me at</label>
              <select
                value={reminders.reminder_hour}
                onChange={e => onSave({ ...reminders, reminder_hour: Number(e.target.value) })}
                className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background text-foreground cursor-pointer w-full"
              >
                {Array.from({ length: 24 }, (_, h) => (
                  <option key={h} value={h}>
                    {h === 0 ? '12:00 AM' : h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h - 12}:00 PM`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">On these days</label>
              <div className="flex gap-1.5 flex-wrap">
                {DAYS.map((day, i) => {
                  const active = reminders.reminder_days.includes(i);
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        const days = active
                          ? reminders.reminder_days.filter(d => d !== i)
                          : [...reminders.reminder_days, i].sort();
                        onSave({ ...reminders, reminder_days: days });
                      }}
                      className={cn(
                        'px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border',
                        active
                          ? 'bg-amber-400 text-zinc-900 border-amber-400'
                          : 'bg-transparent text-muted-foreground border-border hover:border-amber-400/50'
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {saving && <p className="text-xs text-muted-foreground">Saving…</p>}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border border-border rounded-xl py-2"
        >
          Done
        </button>
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────
// Level banner
// ─────────────────────────────────────────────────────────────────
function LevelBanner({ profile }) {
  const xp = profile?.total_xp ?? 0;
  const { level, label, minXp, nextLevel, progress } = getLevel(xp);

  return (
    <div className="rounded-xl border border-amber-400/30 bg-gradient-to-r from-amber-500/10 to-amber-400/5 p-5 mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <span className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-amber-600">
            Level {level}
          </span>
          <h2 className="text-xl font-bold text-foreground leading-tight">{label}</h2>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-amber-500">{xp.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">XP total</div>
        </div>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {nextLevel ? (
        <p className="text-xs text-muted-foreground mt-1.5">
          <span className="font-medium text-foreground">{(nextLevel.minXp - xp).toLocaleString()} XP</span>
          {' '}to{' '}
          <span className="font-medium text-foreground">{nextLevel.label}</span>
          <span className="text-muted-foreground/60"> (lv {nextLevel.level})</span>
        </p>
      ) : (
        <p className="text-xs text-amber-600 mt-1.5 font-semibold">Max level reached! 🎉</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Stat card
// ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-3xl font-bold text-foreground">{value}</div>
      <div className="text-sm font-medium text-foreground mt-1">{label}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Daily goal card
// ─────────────────────────────────────────────────────────────────
function DailyGoalCard({ profile, sessions, onGoalChange }) {
  const goal = profile?.daily_goal ?? 10;
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayWords = sessions
    .filter(s => s.created_at?.slice(0, 10) === todayStr)
    .reduce((sum, s) => sum + (s.words_studied || 0), 0);
  const pct = goal > 0 ? Math.min(1, todayWords / goal) : 0;
  const done = todayWords >= goal && goal > 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Today's Goal</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onGoalChange(Math.max(5, goal - 5))}
            className="w-6 h-6 rounded-md bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center text-sm cursor-pointer border-none leading-none"
          >−</button>
          <span className="text-xs font-semibold text-foreground w-8 text-center">{goal}</span>
          <button
            onClick={() => onGoalChange(goal + 5)}
            className="w-6 h-6 rounded-md bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center text-sm cursor-pointer border-none leading-none"
          >+</button>
        </div>
      </div>

      <div className="flex items-end gap-2 mb-3">
        <div className={cn('text-3xl font-bold', done ? 'text-emerald-500' : 'text-foreground')}>
          {todayWords}
        </div>
        <div className="text-sm text-muted-foreground mb-0.5">/ {goal} words</div>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', done ? 'bg-emerald-500' : 'bg-amber-400')}
          style={{ width: `${pct * 100}%` }}
        />
      </div>

      {done
        ? <p className="text-xs text-emerald-600 font-semibold mt-1.5">Goal reached! 🎉</p>
        : <p className="text-xs text-muted-foreground mt-1.5">{goal - todayWords} more to go</p>
      }
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Spaced repetition card
// ─────────────────────────────────────────────────────────────────
function SpacedRepCard({ progress, showPage }) {
  const now = Date.now();
  const dueCount = progress.filter(w => {
    const intervalMs = (REVIEW_INTERVALS[w.mastery_level] ?? 0) * 3_600_000;
    const lastSeen = new Date(w.last_seen_at).getTime();
    return now - lastSeen >= intervalMs;
  }).length;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold text-foreground mb-3">Spaced Repetition</h2>

      <div className={cn('text-3xl font-bold mb-1', dueCount > 0 ? 'text-amber-500' : 'text-emerald-500')}>
        {dueCount}
      </div>
      <p className="text-sm text-muted-foreground">
        {dueCount === 0 ? 'All caught up!' : `word${dueCount !== 1 ? 's' : ''} due for review`}
      </p>

      {dueCount > 0 && (
        <button
          onClick={() => showPage('review')}
          className="mt-3 text-xs font-semibold text-amber-600 hover:text-amber-500 transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          Review now →
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Study heatmap (last ~90 days, GitHub-style)
// ─────────────────────────────────────────────────────────────────
function StudyHeatmap({ sessions }) {
  const dailyWords = {};
  sessions.forEach(s => {
    const d = s.created_at?.slice(0, 10);
    if (d) dailyWords[d] = (dailyWords[d] || 0) + (s.words_studied || 0);
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);

  const start = new Date(today);
  start.setDate(today.getDate() - 89);
  start.setDate(start.getDate() - start.getDay());

  const weeks = [];
  const d = new Date(start);
  while (d <= today) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const dateStr = d.toISOString().slice(0, 10);
      const isFuture = dateStr > todayStr;
      week.push({
        date: dateStr,
        count: isFuture ? -1 : (dailyWords[dateStr] || 0),
        isToday: dateStr === todayStr,
      });
      d.setDate(d.getDate() + 1);
    }
    weeks.push(week);
  }

  const activeDays = Object.values(dailyWords).filter(c => c > 0).length;

  const getColor = (count, isToday) => {
    if (count < 0) return 'bg-transparent';
    if (count === 0) return cn('bg-muted rounded-sm', isToday && 'ring-1 ring-amber-400/60');
    if (count < 5)   return 'bg-amber-200 dark:bg-amber-900/80 rounded-sm';
    if (count < 15)  return 'bg-amber-400 dark:bg-amber-700 rounded-sm';
    if (count < 30)  return 'bg-amber-500 dark:bg-amber-500 rounded-sm';
    return 'bg-amber-600 dark:bg-amber-400 rounded-sm';
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Study Activity</h2>
        <span className="text-xs text-muted-foreground">{activeDays} active day{activeDays !== 1 ? 's' : ''} (last 90)</span>
      </div>

      <div className="flex gap-[3px] overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px] shrink-0">
            {week.map(day => (
              <div
                key={day.date}
                title={day.count >= 0 ? `${day.date}: ${day.count} word${day.count !== 1 ? 's' : ''}` : ''}
                className={cn('w-[11px] h-[11px]', getColor(day.count, day.isToday))}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 mt-2.5">
        <span className="text-[0.6rem] text-muted-foreground mr-0.5">Less</span>
        {['bg-muted', 'bg-amber-200 dark:bg-amber-900/80', 'bg-amber-400 dark:bg-amber-700', 'bg-amber-500', 'bg-amber-600 dark:bg-amber-400'].map((cls, i) => (
          <div key={i} className={cn('w-[9px] h-[9px] rounded-sm', cls)} />
        ))}
        <span className="text-[0.6rem] text-muted-foreground ml-0.5">More</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Topic mastery map
// ─────────────────────────────────────────────────────────────────
function TopicMasteryMap({ progress }) {
  // Match progress to vocab by stable word_id, falling back to thai_word for legacy rows.
  const byId = {}, byThai = {};
  progress.forEach(p => { if (p.word_id) byId[p.word_id] = p; byThai[p.thai_word] = p; });
  const progressFor = (w) => byId[w.id] ?? byThai[w.thai];

  const topicStats = Object.entries(topics).map(([id, { label }]) => {
    const words = allVocab.filter(w => w.topic === id);
    const total    = words.length;
    const studied  = words.filter(w => (progressFor(w)?.mastery_level ?? 0) >= 1).length;
    const mastered = words.filter(w => (progressFor(w)?.mastery_level ?? 0) === 5).length;
    const pct = total > 0 ? studied / total : 0;
    return { id, label, total, studied, mastered, pct };
  }).sort((a, b) => b.pct - a.pct || b.mastered - a.mastered);

  const totalStudied  = topicStats.reduce((n, t) => n + (t.studied > 0 ? 1 : 0), 0);
  const totalMastered = topicStats.reduce((n, t) => n + (t.mastered === t.total ? 1 : 0), 0);

  return (
    <div className="rounded-xl border border-border bg-card p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground">Topic Mastery</h2>
        <span className="text-xs text-muted-foreground">{totalStudied}/{topicStats.length} topics started</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {topicStats.map(({ id, label, total, studied, mastered, pct }) => (
          <div key={id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground font-thai-display truncate max-w-[140px]">
                {label}
              </span>
              <span className="text-[0.65rem] text-muted-foreground shrink-0 ml-2">
                {studied}/{total}
                {mastered > 0 && (
                  <span className="text-emerald-600 dark:text-emerald-400 ml-1">· {mastered}★</span>
                )}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  pct === 1 ? 'bg-emerald-500' : pct > 0.5 ? 'bg-amber-500' : pct > 0 ? 'bg-amber-400' : 'bg-transparent'
                )}
                style={{ width: `${pct * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {totalMastered > 0 && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 font-medium">
          {totalMastered} topic{totalMastered !== 1 ? 's' : ''} fully mastered 🌟
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Achievement grid
// ─────────────────────────────────────────────────────────────────
const CAT_LABELS = {
  habit:     'Habits',
  vocab:     'Vocabulary',
  quiz:      'Quiz & Games',
  challenge: 'Daily Challenge',
  level:     'Level Milestones',
};

function AchievementGrid({ dbAchievements }) {
  const [open, setOpen] = useState(true);

  const unlockedMap = {};
  dbAchievements.forEach(a => { unlockedMap[a.achievement_id] = a.unlocked_at; });
  const unlockedCount = Object.keys(unlockedMap).length;

  return (
    <div className="rounded-xl border border-border bg-card mb-6 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/40 transition-colors cursor-pointer bg-transparent border-none"
      >
        <div>
          <span className="text-sm font-semibold text-foreground">Achievements</span>
          <p className="text-xs text-muted-foreground mt-0.5">
            {unlockedCount} / {ACHIEVEMENTS.length} unlocked
          </p>
        </div>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="border-t border-border px-5 py-4 space-y-5">
          {Object.keys(CAT_LABELS).map(cat => {
            const catItems = ACHIEVEMENTS.filter(a => a.cat === cat);
            return (
              <div key={cat}>
                <h3 className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-2">
                  {CAT_LABELS[cat]}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {catItems.map(a => {
                    const unlockedAt = unlockedMap[a.id];
                    return (
                      <div
                        key={a.id}
                        className={cn(
                          'rounded-lg p-3 border transition-all',
                          unlockedAt
                            ? 'border-amber-400/40 bg-amber-400/5'
                            : 'border-border bg-muted/20 opacity-45 grayscale'
                        )}
                      >
                        <div className="text-xl mb-1">{a.emoji}</div>
                        <div className="text-xs font-semibold text-foreground leading-tight">{a.label}</div>
                        <div className="text-[0.6rem] text-muted-foreground mt-0.5 leading-snug">{a.desc}</div>
                        {unlockedAt && (
                          <div className="text-[0.6rem] text-amber-600 font-medium mt-1">
                            {new Date(unlockedAt).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: '2-digit',
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Daily challenges panel (collapsible, edit/delete)
// ─────────────────────────────────────────────────────────────────
const TODAY_DAY = Math.floor(Date.now() / 86_400_000);

function DailyChallengesPanel({ challenges, setChallenges, user }) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const last7 = Array.from({ length: 7 }, (_, i) => TODAY_DAY - 6 + i);
  const submittedDays = new Set(challenges.map(c => c.day));

  const startEdit = (c) => { setEditingId(c.id); setEditingText(c.sentence); };
  const cancelEdit = () => { setEditingId(null); setEditingText(''); };

  const handleSave = async (id) => {
    if (!editingText.trim()) return;
    setSaving(true);
    const updated = await updateDailyChallenge(user.id, id, editingText.trim());
    if (updated) {
      setChallenges(prev => prev.map(c => c.id === id ? { ...c, sentence: updated.sentence } : c));
      setEditingId(null);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    const ok = await deleteDailyChallenge(user.id, id);
    if (ok) setChallenges(prev => prev.filter(c => c.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="rounded-xl border border-border bg-card mb-6 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/40 transition-colors cursor-pointer bg-transparent border-none"
      >
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm font-semibold text-foreground">Daily Challenges</span>
            <p className="text-xs text-muted-foreground mt-0.5">
              {challenges.length === 0
                ? 'No submissions yet'
                : `${challenges.length} sentence${challenges.length === 1 ? '' : 's'} submitted`}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1" aria-label="Last 7 days">
            {last7.map(day => {
              const done = submittedDays.has(day);
              const isToday = day === TODAY_DAY;
              return (
                <span
                  key={day}
                  title={done ? 'Submitted' : isToday ? 'Today' : 'Missed'}
                  className={cn(
                    'inline-block rounded-full',
                    done      ? 'w-3 h-3 bg-amber-400'
                    : isToday ? 'w-3 h-3 border-2 border-amber-400/60'
                    :           'w-2.5 h-2.5 bg-muted-foreground/20'
                  )}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {challenges.length > 0 && (
            <span className="text-xl font-bold text-amber-500">{challenges.length}</span>
          )}
          <span className="text-muted-foreground">
            <ChevronIcon open={open} />
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-border">
          {challenges.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted-foreground text-center">
              No submissions yet.{' '}
              <span className="text-foreground">Complete today's challenge on the home page!</span>
            </p>
          ) : (
            <div className="divide-y divide-border">
              {challenges.map(c => (
                <div key={c.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[0.65rem] font-bold tracking-widest uppercase text-amber-600">
                        {new Date(c.submitted_at).toLocaleDateString('en-US', {
                          weekday: 'short', month: 'short', day: 'numeric',
                        })}
                      </span>
                      <span className="text-[0.65rem] text-muted-foreground">
                        · {c.word1_thai} + {c.word2_thai}
                      </span>
                    </div>
                    {editingId !== c.id && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => startEdit(c)} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer bg-transparent border-none" aria-label="Edit">
                          <PencilIcon />
                        </button>
                        <button onClick={() => handleDelete(c.id)} disabled={deletingId === c.id} className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer bg-transparent border-none disabled:opacity-40" aria-label="Delete">
                          <TrashIcon />
                        </button>
                      </div>
                    )}
                  </div>

                  {editingId === c.id ? (
                    <div>
                      <textarea
                        value={editingText}
                        onChange={e => setEditingText(e.target.value)}
                        rows={3}
                        autoFocus
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-thai-display text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none mb-2"
                      />
                      <div className="flex items-center gap-2">
                        <Button size="xs" onClick={() => handleSave(c.id)} disabled={saving || !editingText.trim()}>
                          {saving ? 'Saving…' : 'Save'}
                        </Button>
                        <button onClick={cancelEdit} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none px-2 py-1.5">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="font-thai-display text-sm text-foreground leading-relaxed border-l-2 border-amber-400/40 pl-3">
                      {c.sentence}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Mastery breakdown bar chart (collapsible)
// ─────────────────────────────────────────────────────────────────
const MASTERY_LABELS = ['Unseen', 'Seen', 'Learning', 'Familiar', 'Proficient', 'Mastered'];
const MASTERY_COLORS = [
  'bg-zinc-200 dark:bg-zinc-700',
  'bg-red-400',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-lime-400',
  'bg-emerald-500',
];

function MasteryBreakdown({ masteryBuckets, totalWords }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card mb-6 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/40 transition-colors cursor-pointer bg-transparent border-none"
      >
        <span className="text-sm font-semibold text-foreground">Mastery Breakdown</span>
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div className="border-t border-border px-5 py-4 space-y-2">
          {masteryBuckets.map(({ level, count }) => (
            <div key={level} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-20 shrink-0">{MASTERY_LABELS[level]}</span>
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={cn('h-2 rounded-full transition-all', MASTERY_COLORS[level])}
                  style={{ width: totalWords > 0 ? `${(count / totalWords) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Recent sessions (collapsible)
// ─────────────────────────────────────────────────────────────────
function RecentSessions({ sessions }) {
  const [open, setOpen] = useState(false);
  const recent = sessions.slice(0, 10);

  return (
    <div className="rounded-xl border border-border bg-card mb-6 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/40 transition-colors cursor-pointer bg-transparent border-none"
      >
        <div>
          <span className="text-sm font-semibold text-foreground">Recent Sessions</span>
          <p className="text-xs text-muted-foreground mt-0.5">{sessions.length} total</p>
        </div>
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div className="border-t border-border px-5 py-4 space-y-2">
          {recent.map(s => (
            <div key={s.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="capitalize text-foreground">{s.session_type}</span>
                <span className="text-muted-foreground">· {s.words_studied} words</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">
                  {s.words_studied > 0 ? Math.round((s.correct_count / s.words_studied) * 100) : 0}%
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(s.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main dashboard
// ─────────────────────────────────────────────────────────────────
export default function DashboardPage({ showPage }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [reminders, setReminders] = useState(null);
  const [reminderSaving, setReminderSaving] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [dbAchievements, setDbAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inline nickname editing
  const [editingNick, setEditingNick] = useState(false);
  const [nickDraft, setNickDraft] = useState('');
  const [nickSaving, setNickSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('vocab_progress').select('*').eq('user_id', user.id),
      supabase.from('study_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('reminder_settings').select('*').eq('user_id', user.id).single(),
      getDailyChallengeHistory(user.id, 90),
      supabase.from('achievements').select('*').eq('user_id', user.id),
    ]).then(async ([p, v, s, r, c, a]) => {
      const profileData    = p.data;
      const progressData   = v.data ?? [];
      const sessionsData   = s.data ?? [];
      const remindersData  = r.data ?? { email_enabled: false, reminder_hour: 9, reminder_days: [1, 2, 3, 4, 5] };
      const challengesData = c;
      const achievementsData = a.data ?? [];

      const earned = computeEarnedAchievements({
        progress: progressData,
        sessions: sessionsData,
        challenges: challengesData,
        profile: profileData,
      });
      const newIds = await unlockAchievements(
        user.id,
        earned,
        achievementsData.map(x => x.achievement_id)
      );
      const finalAchievements = [
        ...achievementsData,
        ...(newIds?.map(id => ({ achievement_id: id, unlocked_at: new Date().toISOString() })) ?? []),
      ];

      setProfile(profileData);
      setProgress(progressData);
      setSessions(sessionsData);
      setReminders(remindersData);
      setChallenges(challengesData);
      setDbAchievements(finalAchievements);
      setLoading(false);
    });
  }, [user]);

  const saveReminders = useCallback(async (updated) => {
    setReminderSaving(true);
    await supabase.from('reminder_settings').upsert({ user_id: user.id, ...updated });
    setReminders(updated);
    setReminderSaving(false);
  }, [user]);

  const handleGoalChange = useCallback(async (newGoal) => {
    if (!user) return;
    const clamped = Math.max(5, Math.min(200, newGoal));
    setProfile(prev => prev ? { ...prev, daily_goal: clamped } : prev);
    await supabase.from('profiles').update({ daily_goal: clamped }).eq('id', user.id);
  }, [user]);

  const handleNicknameSave = useCallback(async () => {
    if (!user) return;
    setNickSaving(true);
    const trimmed = nickDraft.trim().slice(0, 32);
    setProfile(prev => prev ? { ...prev, nickname: trimmed } : prev);
    await supabase.from('profiles').update({ nickname: trimmed || null }).eq('id', user.id);
    setNickSaving(false);
    setEditingNick(false);
  }, [user, nickDraft]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  // ── Derived stats ───────────────────────────────────────────────
  const totalWords   = progress.length;
  const mastered     = progress.filter(w => w.mastery_level === 5).length;
  const totalCorrect = progress.reduce((a, w) => a + w.times_correct, 0);
  const totalSeen    = progress.reduce((a, w) => a + w.times_seen, 0);
  const accuracy     = totalSeen > 0 ? Math.round((totalCorrect / totalSeen) * 100) : 0;

  const masteryBuckets = [0, 1, 2, 3, 4, 5].map(level => ({
    level,
    count: progress.filter(w => w.mastery_level === level).length,
  }));

  const weakWords = [...progress]
    .filter(w => w.times_seen >= 2)
    .sort((a, b) => (a.times_correct / a.times_seen) - (b.times_correct / b.times_seen))
    .slice(0, 8);

  const firstName = profile?.display_name?.split(' ')[0];
  const nickname = profile?.nickname;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground">
            {firstName ? `สวัสดี, ${firstName}` : 'Dashboard'}
          </h1>

          {/* Inline nickname */}
          {editingNick ? (
            <div className="flex items-center gap-2 mt-1.5">
              <input
                autoFocus
                value={nickDraft}
                onChange={e => setNickDraft(e.target.value)}
                maxLength={32}
                placeholder="Leaderboard nickname…"
                className="text-xs bg-background border border-border rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary/40 w-40"
              />
              <Button size="xs" onClick={handleNicknameSave} disabled={nickSaving}>
                {nickSaving ? '…' : 'Save'}
              </Button>
              <button
                onClick={() => setEditingNick(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors border-none bg-transparent cursor-pointer"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setNickDraft(nickname || ''); setEditingNick(true); }}
              className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0 group"
            >
              <span className="text-[0.65rem]">🍉</span>
              <span>{nickname || 'Set leaderboard nickname'}</span>
              <span className="opacity-0 group-hover:opacity-60 transition-opacity"><PencilIcon /></span>
            </button>
          )}
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Bell button */}
          {reminders && (
            <button
              onClick={() => setReminderOpen(true)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer text-xs font-medium',
                reminders.email_enabled
                  ? 'border-amber-400/50 bg-amber-400/10 text-amber-600 hover:bg-amber-400/20'
                  : 'border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
              aria-label="Email reminder settings"
            >
              <BellIcon filled={reminders.email_enabled} />
              <span>{reminders.email_enabled ? 'On' : 'Off'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Reminder modal */}
      {reminderOpen && reminders && (
        <ReminderModal
          reminders={reminders}
          saving={reminderSaving}
          onSave={saveReminders}
          onClose={() => setReminderOpen(false)}
          userEmail={user.email}
        />
      )}

      {/* Level banner */}
      <LevelBanner profile={profile} />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Day Streak"
          value={profile?.streak_count ?? 0}
          sub={`best: ${profile?.streak_best ?? 0} days`}
        />
        <StatCard
          label="Words Studied"
          value={totalWords}
          sub={`${mastered} mastered`}
        />
        <StatCard
          label="Accuracy"
          value={`${accuracy}%`}
          sub={`${totalCorrect}/${totalSeen} correct`}
        />
        <StatCard
          label="Sessions"
          value={sessions.length}
          sub="total sessions"
        />
      </div>

      {/* Goal + Spaced rep */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <DailyGoalCard profile={profile} sessions={sessions} onGoalChange={handleGoalChange} />
        <SpacedRepCard progress={progress} showPage={showPage} />
      </div>

      {/* Study heatmap */}
      <StudyHeatmap sessions={sessions} />

      {/* Topic mastery */}
      <TopicMasteryMap progress={progress} />

      {/* Daily challenges */}
      <DailyChallengesPanel
        challenges={challenges}
        setChallenges={setChallenges}
        user={user}
      />

      {/* Achievement grid */}
      <AchievementGrid dbAchievements={dbAchievements} />

      {/* Mastery breakdown (collapsed) */}
      <MasteryBreakdown masteryBuckets={masteryBuckets} totalWords={totalWords} />

      {/* Words to practice */}
      {weakWords.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5 mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Words to Practice</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {weakWords.map(w => (
              <div key={w.thai_word} className="rounded-lg bg-muted px-3 py-2 text-center">
                <div className="text-lg font-thai-display text-foreground">{w.thai_word}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {Math.round((w.times_correct / w.times_seen) * 100)}% correct
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => showPage('quiz')}
            className="mt-4 text-xs text-amber-600 hover:text-amber-500 transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            Practice these in Quiz →
          </button>
        </div>
      )}

      {/* Recent sessions (collapsed) */}
      {sessions.length > 0 && (
        <RecentSessions sessions={sessions} />
      )}

      {sessions.length === 0 && progress.length === 0 && (
        <div className="text-center text-muted-foreground text-sm py-8">
          No activity yet — go study some words and come back!
          <br />
          <button
            onClick={() => showPage('cards')}
            className="mt-3 text-amber-600 hover:text-amber-500 transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            Start with Flashcards →
          </button>
        </div>
      )}
    </div>
  );
}
