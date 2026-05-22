import { useState } from 'react';
import { IDIOMS, IDIOMS_INTRO } from '../data/culture.js';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ── Text-to-speech ────────────────────────────────────────────────
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'th-TH';
  utt.rate = 0.85;
  window.speechSynthesis.speak(utt);
}

function SpeakerBtn({ text }) {
  const [playing, setPlaying] = useState(false);
  const handleClick = (e) => {
    e.stopPropagation();
    setPlaying(true);
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'th-TH';
    utt.rate = 0.85;
    utt.onend = () => setPlaying(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  };
  return (
    <button
      onClick={handleClick}
      title="Listen"
      className={cn(
        'relative flex items-center justify-center w-8 h-8 rounded-full border transition-colors shrink-0',
        playing
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary'
      )}
    >
      {playing && (
        <span className="absolute inset-0 rounded-full animate-speaker-ripple border border-primary/30" />
      )}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 5h2.5L8 2v10L4.5 9H2a1 1 0 01-1-1V6a1 1 0 011-1z" fill="currentColor"/>
        <path d="M10 4.5c1 .8 1.5 1.5 1.5 2.5s-.5 1.7-1.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

// ── Per-idiom SVG illustrations ───────────────────────────────────

// 1. น้ำขึ้นให้รีบตัก — scoop water while it rises
function IlluWater() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 55 Q20 45 30 55 Q40 65 50 55 Q60 45 70 55" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M10 63 Q20 53 30 63 Q40 73 50 63 Q60 53 70 63" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
      {/* ladle / bucket */}
      <rect x="38" y="20" width="4" height="22" rx="2" fill="#78716c"/>
      <path d="M30 38 Q30 46 40 46 Q50 46 50 38 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.2"/>
      {/* water drops */}
      <circle cx="26" cy="32" r="2.5" fill="#60a5fa" opacity="0.7"/>
      <circle cx="54" cy="28" r="2" fill="#93c5fd" opacity="0.6"/>
      <circle cx="20" cy="40" r="1.5" fill="#60a5fa" opacity="0.5"/>
    </svg>
  );
}

// 2. ช้าๆ ได้พร้าเล่มงาม — slow and steady, fine machete
function IlluMachete() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* machete */}
      <path d="M18 62 L56 20" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round"/>
      <path d="M18 62 L56 20 L60 24 Q50 34 18 62Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1"/>
      <rect x="14" y="58" width="8" height="12" rx="2" fill="#92400e" transform="rotate(-45 18 62)"/>
      {/* sparkles */}
      <path d="M62 16 L63 12 L64 16 L68 17 L64 18 L63 22 L62 18 L58 17Z" fill="#fbbf24"/>
      <path d="M54 10 L55 7 L56 10 L59 11 L56 12 L55 15 L54 12 L51 11Z" fill="#fde68a" opacity="0.8"/>
      {/* snail shell */}
      <circle cx="22" cy="32" r="10" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5"/>
      <path d="M22 32 m5 0 a5 5 0 1 1-5-5" stroke="#f59e0b" strokeWidth="1.2" fill="none"/>
      <ellipse cx="13" cy="36" rx="7" ry="4" fill="#d97706" opacity="0.7"/>
      {/* antennae */}
      <line x1="9" y1="33" x2="6" y2="28" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="12" y1="32" x2="10" y2="26" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="6" cy="27" r="1.5" fill="#92400e"/>
      <circle cx="10" cy="25" r="1.5" fill="#92400e"/>
    </svg>
  );
}

// 3. หนีเสือปะจระเข้ — flee tiger, meet crocodile
function IlluTigerCroc() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tiger left */}
      <ellipse cx="18" cy="46" rx="12" ry="8" fill="#fb923c"/>
      <ellipse cx="18" cy="46" rx="12" ry="8" fill="none" stroke="#ea580c" strokeWidth="1"/>
      <circle cx="18" cy="38" r="7" fill="#fb923c" stroke="#ea580c" strokeWidth="1"/>
      {/* tiger stripes */}
      <path d="M14 42 Q16 40 18 42" stroke="#92400e" strokeWidth="1.2" fill="none"/>
      <path d="M18 42 Q20 40 22 42" stroke="#92400e" strokeWidth="1.2" fill="none"/>
      <circle cx="16" cy="37" r="1.2" fill="#1e1b4b"/>
      <circle cx="20" cy="37" r="1.2" fill="#1e1b4b"/>
      {/* running figure in middle */}
      <circle cx="40" cy="34" r="4" fill="#fcd34d" stroke="#d97706" strokeWidth="1"/>
      <line x1="40" y1="38" x2="40" y2="50" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
      <line x1="40" y1="42" x2="34" y2="47" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
      <line x1="40" y1="42" x2="46" y2="47" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
      <line x1="40" y1="50" x2="36" y2="57" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
      <line x1="40" y1="50" x2="44" y2="57" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
      {/* Crocodile right */}
      <ellipse cx="62" cy="50" rx="14" ry="6" fill="#4ade80" stroke="#16a34a" strokeWidth="1"/>
      <path d="M48 48 L76 48 L76 52 L48 52Z" fill="#4ade80"/>
      {/* croc teeth */}
      <path d="M52 44 L54 48 L56 44 L58 48 L60 44 L62 48 L64 44 L66 48 L68 44" stroke="#16a34a" strokeWidth="1.2" fill="none"/>
      <circle cx="58" cy="44" r="2" fill="#4ade80" stroke="#16a34a" strokeWidth="1"/>
      <circle cx="57" cy="43" r="1" fill="#1e1b4b"/>
      <circle cx="59" cy="43" r="1" fill="#1e1b4b"/>
    </svg>
  );
}

// 4. ปากหวานก้นเปรี้ยว — sweet mouth, sour behind
function IlluSweetSour() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* left half: honey/sweet */}
      <path d="M40 15 A25 25 0 0 0 40 65 Z" fill="#fde68a"/>
      <path d="M40 15 A25 25 0 0 1 40 65 Z" fill="#86efac"/>
      <circle cx="40" cy="40" r="25" fill="none" stroke="#e2e8f0" strokeWidth="1.5"/>
      {/* smile left */}
      <path d="M28 44 Q33 50 38 44" stroke="#92400e" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* frown right */}
      <path d="M42 48 Q47 42 52 48" stroke="#15803d" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* eyes */}
      <circle cx="32" cy="36" r="2" fill="#92400e"/>
      <circle cx="48" cy="36" r="2" fill="#15803d"/>
      {/* dividing line */}
      <line x1="40" y1="15" x2="40" y2="65" stroke="#d1d5db" strokeWidth="1" strokeDasharray="3 2"/>
      {/* candy left */}
      <circle cx="27" cy="24" r="4" fill="#f9a8d4" stroke="#ec4899" strokeWidth="1"/>
      {/* lime right */}
      <circle cx="53" cy="24" r="4" fill="#86efac" stroke="#16a34a" strokeWidth="1"/>
      <line x1="53" y1="20" x2="53" y2="28" stroke="#16a34a" strokeWidth="1"/>
      <line x1="49" y1="24" x2="57" y2="24" stroke="#16a34a" strokeWidth="1"/>
    </svg>
  );
}

// 5. กบในกะลา — frog under coconut shell
function IlluFrogShell() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* coconut shell */}
      <path d="M15 55 Q15 28 40 28 Q65 28 65 55 Z" fill="#92400e" stroke="#78350f" strokeWidth="1.5"/>
      <path d="M15 55 Q40 62 65 55" stroke="#78350f" strokeWidth="1.5"/>
      {/* shell texture */}
      <path d="M28 36 Q40 32 52 36" stroke="#78350f" strokeWidth="1" opacity="0.5" strokeDasharray="3 2"/>
      {/* frog peeking out from bottom */}
      <ellipse cx="40" cy="56" rx="10" ry="6" fill="#4ade80" stroke="#16a34a" strokeWidth="1.2"/>
      {/* frog eyes */}
      <circle cx="36" cy="52" r="3.5" fill="#4ade80" stroke="#16a34a" strokeWidth="1"/>
      <circle cx="44" cy="52" r="3.5" fill="#4ade80" stroke="#16a34a" strokeWidth="1"/>
      <circle cx="36" cy="52" r="1.5" fill="#1e1b4b"/>
      <circle cx="44" cy="52" r="1.5" fill="#1e1b4b"/>
      {/* tiny world outside */}
      <circle cx="60" cy="20" r="8" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1"/>
      <path d="M54 20 Q57 17 60 20 Q63 23 66 20" stroke="#60a5fa" strokeWidth="1" fill="none"/>
      <path d="M53 23 Q58 26 67 22" stroke="#60a5fa" strokeWidth="0.8" fill="none"/>
    </svg>
  );
}

// 6. ยิงปืนนัดเดียวได้นกสองตัว — one shot, two birds
function IlluTwoBirds() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* arrow path */}
      <path d="M12 55 Q30 30 55 22" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 2"/>
      {/* arrowhead */}
      <path d="M50 18 L58 22 L52 27Z" fill="#f59e0b"/>
      {/* bird 1 */}
      <ellipse cx="60" cy="18" rx="7" ry="5" fill="#60a5fa" stroke="#3b82f6" strokeWidth="1"/>
      <path d="M64 14 Q68 10 66 18" fill="#3b82f6"/>
      <circle cx="63" cy="16" r="1" fill="white"/>
      {/* bird 2 */}
      <ellipse cx="62" cy="30" rx="6" ry="4" fill="#f472b6" stroke="#ec4899" strokeWidth="1"/>
      <path d="M65 27 Q69 23 67 30" fill="#ec4899"/>
      <circle cx="65" cy="28" r="1" fill="white"/>
      {/* bow / slingshot */}
      <path d="M8 48 Q5 55 8 62" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <line x1="8" y1="48" x2="12" y2="55" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="62" x2="12" y2="55" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// 7. รักวัวให้ผูก รักลูกให้ตี — love cow, tie it; love child, discipline
function IlluCow() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* post */}
      <rect x="55" y="25" width="5" height="40" rx="2" fill="#92400e"/>
      {/* rope */}
      <path d="M42 38 Q50 33 55 38" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="3 2"/>
      {/* cow body */}
      <ellipse cx="30" cy="48" rx="16" ry="10" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5"/>
      {/* cow head */}
      <ellipse cx="46" cy="40" rx="9" ry="7" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5"/>
      {/* cow spots */}
      <ellipse cx="26" cy="45" rx="5" ry="3" fill="#d97706" opacity="0.4"/>
      <ellipse cx="34" cy="52" rx="3" ry="2" fill="#d97706" opacity="0.4"/>
      {/* cow eye */}
      <circle cx="49" cy="38" r="1.5" fill="#1e1b4b"/>
      {/* cow ears */}
      <ellipse cx="39" cy="35" rx="3" ry="2" fill="#fde68a" stroke="#d97706" strokeWidth="1" transform="rotate(-20 39 35)"/>
      {/* cow legs */}
      {[18,24,32,38].map(x => <rect key={x} x={x} y="57" width="3" height="10" rx="1.5" fill="#d97706"/>)}
      {/* heart above */}
      <path d="M28 18 C28 16 26 14 24 16 C22 14 20 16 20 18 C20 21 24 25 24 25 C24 25 28 21 28 18Z" fill="#f87171"/>
    </svg>
  );
}

// 8. เข้าเมืองตาหลิ่ว — enter squinting city, squint too
function IlluSquint() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* face 1 — local */}
      <circle cx="25" cy="38" r="18" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5"/>
      {/* squinting eyes face 1 */}
      <path d="M17 34 Q20 31 23 34" stroke="#92400e" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M27 34 Q30 31 33 34" stroke="#92400e" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M18 43 Q25 48 32 43" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      {/* face 2 — visitor adapting */}
      <circle cx="55" cy="38" r="18" fill="#bfdbfe" stroke="#60a5fa" strokeWidth="1.5"/>
      {/* squinting eyes face 2 — matching */}
      <path d="M47 34 Q50 31 53 34" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M57 34 Q60 31 63 34" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M48 43 Q55 48 62 43" stroke="#1e40af" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      {/* arrow between */}
      <path d="M42 38 L38 38" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" markerEnd="url(#arr)"/>
      <circle cx="40" cy="38" r="2" fill="#94a3b8"/>
    </svg>
  );
}

// 9. ปิดทองหลังพระ — gilding back of Buddha
function IlluBuddha() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Buddha silhouette — from behind */}
      <ellipse cx="40" cy="25" rx="12" ry="14" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5"/>
      {/* flame/ushnisha on top */}
      <path d="M40 11 Q43 5 40 2 Q37 5 40 11Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1"/>
      {/* robe / body */}
      <path d="M20 72 Q20 48 40 48 Q60 48 60 72Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5"/>
      {/* gold being applied to the back — glowing patches */}
      <ellipse cx="40" cy="30" rx="8" ry="5" fill="#fbbf24" opacity="0.85"/>
      <ellipse cx="40" cy="56" rx="10" ry="6" fill="#fbbf24" opacity="0.8"/>
      <ellipse cx="33" cy="43" rx="5" ry="3" fill="#fde68a" opacity="0.7"/>
      <ellipse cx="47" cy="43" rx="5" ry="3" fill="#fde68a" opacity="0.7"/>
      {/* gold sparkles */}
      <circle cx="58" cy="28" r="2" fill="#fbbf24"/>
      <circle cx="22" cy="50" r="1.5" fill="#fbbf24" opacity="0.7"/>
      <path d="M62 22 L63 18 L64 22 L68 23 L64 24 L63 28 L62 24 L58 23Z" fill="#fbbf24" opacity="0.9"/>
    </svg>
  );
}

// 10. ขิงก็ราข่าก็แรง — ginger and galangal both fierce
function IlluGingerGalangal() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* left root (ginger) */}
      <path d="M10 55 Q14 40 20 38 Q26 36 28 42 Q30 48 24 52 Q18 56 10 55Z" fill="#fde68a" stroke="#d97706" strokeWidth="1.5"/>
      <path d="M20 38 Q22 28 26 24" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
      <path d="M26 36 Q28 26 32 24" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/>
      {/* left fire */}
      <path d="M26 24 Q27 18 25 14 Q24 18 22 16 Q23 20 20 22 Q22 18 21 14 Q19 18 20 22" fill="#fb923c" stroke="#ea580c" strokeWidth="0.5"/>
      {/* right root (galangal) */}
      <path d="M70 55 Q66 40 60 38 Q54 36 52 42 Q50 48 56 52 Q62 56 70 55Z" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5"/>
      <path d="M60 38 Q58 28 54 24" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
      <path d="M54 36 Q52 26 48 24" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/>
      {/* right fire */}
      <path d="M54 24 Q53 18 55 14 Q56 18 58 16 Q57 20 60 22 Q58 18 59 14 Q61 18 60 22" fill="#4ade80" stroke="#16a34a" strokeWidth="0.5"/>
      {/* clash sparks in middle */}
      <path d="M38 36 L40 30 L42 36 L48 38 L42 40 L40 46 L38 40 L32 38Z" fill="#fbbf24"/>
    </svg>
  );
}

// 11. ไก่งามเพราะขน คนงามเพราะแต่ง — chicken beautiful by feathers
function IlluChicken() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* divider */}
      <line x1="40" y1="10" x2="40" y2="72" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 2"/>
      {/* chicken left */}
      <ellipse cx="22" cy="50" rx="12" ry="9" fill="#fef3c7" stroke="#d97706" strokeWidth="1"/>
      <circle cx="22" cy="38" r="7" fill="#fef3c7" stroke="#d97706" strokeWidth="1"/>
      {/* colorful feathers */}
      <path d="M10 45 Q6 38 14 36" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M10 50 Q4 46 8 40" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M10 55 Q4 54 8 48" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M34 45 Q38 38 30 36" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* beak */}
      <path d="M28 37 L32 39 L28 41Z" fill="#f59e0b"/>
      <circle cx="29" cy="36" r="1" fill="#1e1b4b"/>
      {/* person right */}
      <circle cx="58" cy="30" r="7" fill="#fcd34d" stroke="#d97706" strokeWidth="1"/>
      {/* nice clothes */}
      <path d="M48 72 Q48 50 58 48 Q68 50 68 72Z" fill="#6366f1" stroke="#4f46e5" strokeWidth="1"/>
      {/* collar / lapels */}
      <path d="M53 48 L58 56 L63 48" stroke="#818cf8" strokeWidth="1.5" fill="none"/>
      {/* buttons */}
      <circle cx="58" cy="58" r="1.5" fill="#c7d2fe"/>
      <circle cx="58" cy="63" r="1.5" fill="#c7d2fe"/>
    </svg>
  );
}

// 12. น้ำตาลใกล้มด — sugar near ants
function IlluSugarAnts() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* sugar pile */}
      <path d="M25 60 Q30 42 40 40 Q50 42 55 60Z" fill="#fde68a" stroke="#d97706" strokeWidth="1.5"/>
      <path d="M28 60 Q34 50 40 48 Q46 50 52 60" fill="#fef3c7" stroke="none"/>
      {/* sugar crystals sparkle */}
      <circle cx="36" cy="47" r="1.5" fill="white" opacity="0.8"/>
      <circle cx="43" cy="44" r="1" fill="white" opacity="0.7"/>
      <circle cx="40" cy="50" r="1.5" fill="white" opacity="0.6"/>
      {/* ant trail */}
      <path d="M68 25 Q60 35 55 45 Q50 55 45 58" stroke="#374151" strokeWidth="1" strokeDasharray="2 3" strokeLinecap="round" fill="none"/>
      {/* ants */}
      {[
        { cx: 65, cy: 28 },
        { cx: 59, cy: 36 },
        { cx: 53, cy: 46 },
        { cx: 47, cy: 55 },
      ].map(({ cx, cy }, i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <ellipse cx="0" cy="0" rx="2.5" ry="1.5" fill="#1f2937"/>
          <ellipse cx="0" cy="-3" rx="2" ry="1.5" fill="#1f2937"/>
          <ellipse cx="0" cy="3" rx="1.5" ry="1" fill="#1f2937"/>
          <line x1="-2" y1="-2" x2="-5" y2="-4" stroke="#1f2937" strokeWidth="0.8"/>
          <line x1="2" y1="-2" x2="5" y2="-4" stroke="#1f2937" strokeWidth="0.8"/>
          <line x1="-2" y1="0" x2="-5" y2="1" stroke="#1f2937" strokeWidth="0.8"/>
          <line x1="2" y1="0" x2="5" y2="1" stroke="#1f2937" strokeWidth="0.8"/>
        </g>
      ))}
    </svg>
  );
}

const ILLUSTRATIONS = {
  'น้ำขึ้นให้รีบตัก':                IlluWater,
  'ช้าๆ ได้พร้าเล่มงาม':              IlluMachete,
  'หนีเสือปะจระเข้':                  IlluTigerCroc,
  'ปากหวานก้นเปรี้ยว':                IlluSweetSour,
  'กบในกะลา':                        IlluFrogShell,
  'ยิงปืนนัดเดียวได้นกสองตัว':        IlluTwoBirds,
  'รักวัวให้ผูก รักลูกให้ตี':          IlluCow,
  'เข้าเมืองตาหลิ่ว ต้องหลิ่วตาตาม': IlluSquint,
  'ปิดทองหลังพระ':                    IlluBuddha,
  'ขิงก็ราข่าก็แรง':                  IlluGingerGalangal,
  'ไก่งามเพราะขน คนงามเพราะแต่ง':    IlluChicken,
  'น้ำตาลใกล้มด':                    IlluSugarAnts,
};

// ── Idiom card ────────────────────────────────────────────────────
function IdiomCard({ idiom }) {
  const Illu = ILLUSTRATIONS[idiom.thai];

  return (
    <div className="rounded-xl border border-border bg-card flex flex-col overflow-hidden">
      {/* Illustration banner */}
      <div className="flex items-center justify-center bg-muted/30 h-28 px-4 py-3">
        {Illu ? <Illu /> : null}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Thai + romanisation + speaker */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-thai-display text-2xl text-foreground leading-snug mb-0.5">
              {idiom.thai}
            </div>
            <div className="text-xs italic text-muted-foreground">{idiom.rom}</div>
          </div>
          <SpeakerBtn text={idiom.thai} />
        </div>

        {/* Literal */}
        <div className="flex gap-2 text-sm">
          <span className="text-[0.68rem] font-semibold tracking-widest uppercase text-muted-foreground shrink-0 pt-px w-12">
            Literal
          </span>
          <span className="text-muted-foreground italic leading-snug">"{idiom.literal}"</span>
        </div>

        <Separator />

        {/* Meaning */}
        <p className="text-sm text-foreground leading-relaxed flex-1">{idiom.meaning}</p>

        {/* English equivalent */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[0.65rem] font-semibold tracking-widest uppercase text-muted-foreground shrink-0">
            cf.
          </span>
          <span className="text-xs text-primary font-medium">"{idiom.equivalent}"</span>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function IdiomsPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Thai <em className="text-primary not-italic font-medium">Idioms</em>
      </h1>
      <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">สำนวนไทย</p>
      <Separator className="mb-5" />
      <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-[68ch]">
        {IDIOMS_INTRO}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {IDIOMS.map(idiom => (
          <IdiomCard key={idiom.thai} idiom={idiom} />
        ))}
      </div>
    </div>
  );
}
