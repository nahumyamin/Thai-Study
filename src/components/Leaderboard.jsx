import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// ── Medal config ──────────────────────────────────────────────────
const MEDALS = [
  {
    medal: '🥇', rank: 1, label: 'อันดับ 1',
    bg: 'from-amber-400/25 to-amber-300/10',
    border: 'border-amber-400/50',
    glow: 'shadow-amber-400/20',
    badge: 'bg-amber-400 text-amber-950',
    height: 'h-24 md:h-36',
    order: 'order-1 md:order-2',
    scale: 'md:-translate-y-4',
  },
  {
    medal: '🥈', rank: 2, label: 'อันดับ 2',
    bg: 'from-slate-400/20 to-slate-300/10',
    border: 'border-slate-400/40',
    glow: 'shadow-slate-400/20',
    badge: 'bg-slate-400 text-slate-950',
    height: 'h-24 md:h-28',
    order: 'order-2 md:order-1',
    scale: '',
  },
  {
    medal: '🥉', rank: 3, label: 'อันดับ 3',
    bg: 'from-orange-400/20 to-orange-300/10',
    border: 'border-orange-400/40',
    glow: 'shadow-orange-400/20',
    badge: 'bg-orange-500 text-white',
    height: 'h-24',
    order: 'order-3 md:order-3',
    scale: '',
  },
];

const LEVEL_EMOJIS = ['🌱', '🌿', '🍀', '🌺', '🌸', '🌟'];

const TAUNTS = [
  'Study harder! 📚',
  'Keep going! 🔥',
  'You\'re next! ⬆️',
];

// ── Empty slot (placeholder when < 3 users) ───────────────────────
function EmptySlot({ config }) {
  return (
    <div className={`${config.order} flex flex-col items-center gap-2 w-full md:flex-1`}>
      <div className={`
        w-full rounded-2xl border bg-gradient-to-b ${config.bg} ${config.border}
        ${config.height} flex flex-col items-center justify-center gap-1
        opacity-40
      `}>
        <div className="text-3xl">{config.medal}</div>
        <div className="text-[0.65rem] text-muted-foreground font-medium tracking-wider uppercase">
          {config.label}
        </div>
        <div className="text-xs text-muted-foreground/60 italic">— empty —</div>
      </div>
    </div>
  );
}

// ── Single podium card ────────────────────────────────────────────
function PodiumCard({ entry, config, isCurrentUser }) {
  const levelEmoji = LEVEL_EMOJIS[Math.min(entry.level - 1, 5)];

  return (
    <div className={`${config.order} ${config.scale} flex flex-col items-center gap-2 w-full md:flex-1 transition-transform duration-300`}>
      <div className={`
        relative w-full rounded-2xl border bg-gradient-to-b ${config.bg} ${config.border}
        ${config.height} flex flex-col items-center justify-center gap-1 px-3
        shadow-lg ${config.glow}
        ${isCurrentUser ? 'ring-2 ring-primary/60 ring-offset-1 ring-offset-background' : ''}
      `}>
        {/* Crown pulse on rank 1 */}
        {config.rank === 1 && (
          <span className="absolute -top-4 text-2xl animate-bounce">👑</span>
        )}
        {/* Current user indicator */}
        {isCurrentUser && (
          <span className="absolute -top-2.5 -right-2.5 text-[0.55rem] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full uppercase tracking-wider">
            You
          </span>
        )}

        <div className="text-2xl">{config.medal}</div>

        {/* Nickname */}
        <div className="text-center font-bold text-sm leading-tight text-foreground max-w-full truncate px-1">
          {entry.nickname}
        </div>

        {/* Level badge */}
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-bold uppercase tracking-wide ${config.badge}`}>
          <span>{levelEmoji}</span>
          <span>Lv.{entry.level}</span>
        </div>
      </div>

      {/* XP + streak below card */}
      <div className="text-center">
        <div className="text-xs font-bold text-foreground">{entry.total_xp.toLocaleString()} <span className="text-muted-foreground font-normal">XP</span></div>
        {entry.streak > 0 && (
          <div className="text-[0.65rem] text-muted-foreground">🔥 {entry.streak}d streak</div>
        )}
      </div>
    </div>
  );
}

// ── Main leaderboard widget ───────────────────────────────────────
export default function Leaderboard({ currentUserId }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_leaderboard', { limit_n: 10 });
      if (!error && data) {
        setEntries(data);
        if (currentUserId) {
          const rank = data.find(e => e.rank <= 10)?.rank; // rough check — full rank via separate query would be better
          // find user's rank in the fetched list
          const userEntry = data.find((_, i) => {
            // We don't expose user_id from the function for privacy — so we'll fetch separately
            return false;
          });
          void userEntry;
        }
      }
      setLoading(false);
    }
    load();
  }, [currentUserId]);

  const top3 = entries.slice(0, 3);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-amber-500/15 via-primary/10 to-amber-500/15 px-5 py-4 border-b border-border text-center overflow-hidden">
        {/* Decorative Thai chars */}
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none select-none opacity-10 text-2xl font-thai">
          <span>ส</span><span>ุ</span><span>ด</span><span>ย</span><span>อ</span><span>ด</span>
        </div>
        <div className="relative">
          <p className="text-[0.6rem] font-bold tracking-[0.25em] uppercase text-amber-600 mb-0.5">
            🏆 สุดยอดนักเรียน 🏆
          </p>
          <h3 className="text-base font-bold text-foreground">Hall of Fame</h3>
          <p className="text-[0.65rem] text-muted-foreground mt-0.5">Top learners this season</p>
        </div>
      </div>

      <div className="p-5">
        {loading ? (
          /* Skeleton */
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-center md:h-36">
            {[0,1,2].map(i => (
              <div key={i} className={`w-full h-24 rounded-2xl bg-muted/50 animate-pulse md:flex-1 ${i===0?'md:h-36':i===2?'md:h-28':''}`} />
            ))}
          </div>
        ) : top3.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <div className="text-4xl mb-3">🌱</div>
            <p className="font-medium">No learners yet!</p>
            <p className="text-xs mt-1">Be the first to claim the throne.</p>
          </div>
        ) : (
          <>
            {/* Podium — mobile: 1st/2nd/3rd stacked; desktop: 2nd | 1st | 3rd */}
            <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-end md:justify-center">
              {MEDALS.map(config => {
                const entry = top3.find(e => Number(e.rank) === config.rank);
                if (!entry) return <EmptySlot key={config.rank} config={config} />;
                return (
                  <PodiumCard
                    key={config.rank}
                    entry={entry}
                    config={config}
                    isCurrentUser={false}
                  />
                );
              })}
            </div>

            {/* Runner-up list (ranks 4–10) if any */}
            {entries.length > 3 && (
              <div className="mt-3 space-y-1.5 border-t border-border/50 pt-3">
                {entries.slice(3).map(entry => {
                  const levelEmoji = LEVEL_EMOJIS[Math.min(entry.level - 1, 5)];
                  return (
                    <div key={entry.rank} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-muted/40 transition-colors">
                      <span className="text-xs font-bold text-muted-foreground w-5 text-right shrink-0">
                        {entry.rank}.
                      </span>
                      <span className="text-sm font-medium text-foreground flex-1 truncate">{entry.nickname}</span>
                      <span className="text-[0.65rem] text-muted-foreground shrink-0">{levelEmoji} Lv.{entry.level}</span>
                      <span className="text-[0.65rem] font-bold text-muted-foreground shrink-0">{entry.total_xp.toLocaleString()} XP</span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Footer CTA */}
        <div className="mt-4 pt-3 border-t border-border/50 text-center">
          <p className="text-[0.65rem] text-muted-foreground">
            Nicknames are auto-assigned 🍉 · Change yours in <span className="text-primary font-medium">Dashboard</span>
          </p>
        </div>
      </div>
    </div>
  );
}
