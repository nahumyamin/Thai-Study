import { useState } from 'react';
import { IDIOMS, IDIOMS_INTRO } from '../data/culture.js';
import { Separator } from '@/components/ui/separator';
import { useRomaji } from '../context/RomajiContext.jsx';
import { cn } from '@/lib/utils';

// ── Illustration PNGs ─────────────────────────────────────────────
import imgWater         from '/idioms/water.png';
import imgMachete       from '/idioms/machete.png';
import imgTigerCroc     from '/idioms/tiger-croc.png';
import imgSweetSour     from '/idioms/sweet-sour.png';
import imgFrogShell     from '/idioms/frog-shell.png';
import imgTwoBirds      from '/idioms/two-birds.png';
import imgCow           from '/idioms/cow.png';
import imgSquint        from '/idioms/squint.png';
import imgBuddha        from '/idioms/buddha.png';
import imgGingerGalangal from '/idioms/ginger-galangal.png';
import imgChicken       from '/idioms/chicken.png';
import imgSugarAnts     from '/idioms/sugar-ants.png';

const ILLUSTRATIONS = {
  'น้ำขึ้นให้รีบตัก':                imgWater,
  'ช้าๆ ได้พร้าเล่มงาม':              imgMachete,
  'หนีเสือปะจระเข้':                  imgTigerCroc,
  'ปากหวานก้นเปรี้ยว':                imgSweetSour,
  'กบในกะลา':                        imgFrogShell,
  'ยิงปืนนัดเดียวได้นกสองตัว':        imgTwoBirds,
  'รักวัวให้ผูก รักลูกให้ตี':          imgCow,
  'เข้าเมืองตาหลิ่ว ต้องหลิ่วตาตาม': imgSquint,
  'ปิดทองหลังพระ':                    imgBuddha,
  'ขิงก็ราข่าก็แรง':                  imgGingerGalangal,
  'ไก่งามเพราะขน คนงามเพราะแต่ง':    imgChicken,
  'น้ำตาลใกล้มด':                    imgSugarAnts,
};

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

// ── Idiom card ────────────────────────────────────────────────────
function IdiomCard({ idiom }) {
  const imgSrc = ILLUSTRATIONS[idiom.thai];
  const { showRomaji } = useRomaji();

  return (
    <div className="rounded-xl border border-border bg-card flex flex-col overflow-hidden">
      {/* Illustration banner */}
      <div className="h-48 overflow-hidden" style={{ backgroundColor: '#f2e8d9' }}>
        {imgSrc
          ? <img src={imgSrc} alt={idiom.literal} className="w-full h-full object-cover object-top" />
          : null}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Thai + romanisation + speaker */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-thai-display text-2xl text-foreground leading-snug mb-0.5">
              {idiom.thai}
            </div>
            {showRomaji && <div className="text-xs italic text-muted-foreground">{idiom.rom}</div>}
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
