import { cn } from '@/lib/utils';

/**
 * Small, unobtrusive control shown during active practice that steps the user
 * back to the tool's instructions / setup screen. Used across all practice tools
 * for a consistent exit affordance.
 */
export default function ExitButton({ onClick, className = '', label = 'Exit' }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium text-muted-foreground',
        'hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0',
        className,
      )}
      aria-label="Exit to instructions"
    >
      <span aria-hidden className="text-sm leading-none">←</span> {label}
    </button>
  );
}
