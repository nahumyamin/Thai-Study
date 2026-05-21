import { cn } from '@/lib/utils';

/**
 * Shared consonant-class badge used on Pronunciation, Consonants,
 * Consonant Clusters, and Class Rush pages.
 *
 * Light:  bg-*-100 / text-*-900  → ~8-9:1 contrast
 * Dark:   bg-*-900/40 / text-*-200 → ~11-14:1 contrast
 */
// Light: dark neutral text on tinted bg → 12-13:1 contrast, no same-hue washout
// Dark:  light tinted text on dark tinted bg → 11-14:1 contrast
const STYLES = {
  mid:  'bg-blue-100  text-slate-800 border-blue-300  dark:bg-blue-900/40  dark:text-blue-200  dark:border-blue-800',
  high: 'bg-red-100   text-slate-800 border-red-300   dark:bg-red-900/40   dark:text-red-200   dark:border-red-800',
  low:  'bg-green-100 text-slate-800 border-green-300 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800',
};

/**
 * @param {'mid'|'high'|'low'} cls
 * @param {'badge'|'pill'|'block'} variant
 *   badge — tiny chip (default), used inline next to Thai characters
 *   pill  — slightly larger, used as section headings
 *   block — full-width label bar, used as group headers
 */
export default function ClassBadge({ cls, variant = 'badge', label, className }) {
  const text = label ?? cls;
  const base = STYLES[cls] ?? STYLES.low;

  if (variant === 'block') {
    return (
      <span className={cn(
        'inline-block text-xs font-semibold tracking-widest uppercase px-2 py-1 rounded-sm border',
        base,
        className
      )}>
        {text}
      </span>
    );
  }

  if (variant === 'pill') {
    return (
      <span className={cn(
        'inline-block text-[0.7rem] font-bold tracking-widest uppercase px-2 py-0.5 rounded border',
        base,
        className
      )}>
        {text}
      </span>
    );
  }

  // default: badge
  return (
    <span className={cn(
      'inline-block text-[0.6rem] font-bold uppercase tracking-widest px-1.5 py-px rounded border shrink-0',
      base,
      className
    )}>
      {text}
    </span>
  );
}
