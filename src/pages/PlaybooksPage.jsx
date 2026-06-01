import { useState } from 'react';
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ── Connector chips ───────────────────────────────────────────────
const CONNECTORS = [
  { thai: 'แต่',    rom: 'tae',     en: 'but'      },
  { thai: 'เพราะ', rom: 'phro',    en: 'because'  },
  { thai: 'และ',   rom: 'lae',     en: 'and'      },
  { thai: 'แล้วก็', rom: 'laeo ko', en: 'and then' },
];

function ConnectorChips() {
  return (
    <div className="flex flex-wrap gap-2">
      {CONNECTORS.map(c => (
        <div key={c.thai}
          className="flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-xl border border-border bg-muted/40 select-none">
          <span className="text-xl font-thai-display text-foreground leading-tight">{c.thai}</span>
          <span className="text-[0.6rem] italic text-muted-foreground">{c.rom}</span>
          <span className="text-[0.65rem] font-medium text-muted-foreground">{c.en}</span>
        </div>
      ))}
    </div>
  );
}

// ── Context block (problem + when to use + practice) ─────────────
function ContextBlock({ problem, when, practice }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden mb-5">
      {/* Problem */}
      <div className="px-5 py-4 border-b border-border/60">
        <div className="text-[0.62rem] font-bold uppercase tracking-widest text-muted-foreground mb-2">The problem</div>
        <p className="text-sm text-foreground leading-relaxed">{problem}</p>
      </div>
      {/* When + Practice side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
        <div className="px-5 py-4">
          <div className="text-[0.62rem] font-bold uppercase tracking-widest text-muted-foreground mb-2">When to use it</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{when}</p>
        </div>
        <div className="px-5 py-4">
          <div className="text-[0.62rem] font-bold uppercase tracking-widest text-muted-foreground mb-2">Practice routine</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{practice}</p>
        </div>
      </div>
    </div>
  );
}

// ── Playbook 1 ────────────────────────────────────────────────────
function Playbook1() {
  return (
    <div>
      <ContextBlock
        problem="You want to write a Thai sentence but you start in English — you think of what you want to say, translate it, and write that down. The result is grammatically passable but sounds English-shaped. Unnatural not because it's wrong, but because it was built in the wrong language."
        when="Any time you sit down to write Thai: homework, the daily challenge, free writing. The trigger is the moment you notice you're about to compose in English first. Stop there, and run this instead."
        practice="Pick one Thai word from today's study. Don't think of an English topic — just sit with the word. Use steps 1–3 to get a short sentence (even two words). Then do step 4 once to extend it with a connector. One word → one extended sentence, no translation. That's one rep."
      />

      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground leading-relaxed mb-4">
        <span className="font-medium text-foreground">One-line method: </span>
        Stay in the word → take the first thing → don't reject it → grow it sideways with แต่ / เพราะ / และ
      </div>

      <Accordion type="multiple" className="flex flex-col gap-2">

        <AccordionItem value="s1" className="rounded-xl border border-border bg-card px-5 [&_button]:py-4">
          <AccordionTrigger className="text-sm font-medium hover:no-underline gap-3">
            <span className="font-serif italic text-primary text-2xl leading-none shrink-0 w-5">1</span>
            Stay with the Thai word — don't translate first
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground leading-relaxed pt-1">
              Don't ask <em>"what can I say about [topic]?"</em> — that's an English question that leads to English brainstorming. Ask instead: <em>"what have I heard next to this word?"</em> It's a memory-retrieval question. The moment you translate into English, English takes over the sentence shape.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="s2" className="rounded-xl border border-border bg-card px-5 [&_button]:py-4">
          <AccordionTrigger className="text-sm font-medium hover:no-underline gap-3">
            <span className="font-serif italic text-primary text-2xl leading-none shrink-0 w-5">2</span>
            Take the first Thai thing that surfaces
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground leading-relaxed pt-1">
              If <strong className="font-thai-display text-base text-foreground">ดี</strong> shows up first, that is the method working — trust it. Your Thai memory produced something real; use it. The instinct to pause and reach for something better is English trying to re-enter. Don't negotiate with it.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="s3" className="rounded-xl border border-border bg-card px-5 [&_button]:py-4">
          <AccordionTrigger className="text-sm font-medium hover:no-underline gap-3">
            <span className="font-serif italic text-primary text-2xl leading-none shrink-0 w-5">3</span>
            Don't reject it for being "too simple"
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground leading-relaxed pt-1">
              <em>"Too simple"</em> is the trap. Reaching for a harder word is exactly where English re-enters — because the harder word is one you don't own yet, so you look it up, and now you're translating again. <strong className="font-thai-display text-base text-foreground">ดี</strong> is yours. Simple words you own are more productive right now than complex words you borrow.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="s4" className="rounded-xl border border-border bg-card px-5 [&_button]:py-4">
          <AccordionTrigger className="text-sm font-medium hover:no-underline gap-3">
            <span className="font-serif italic text-primary text-2xl leading-none shrink-0 w-5">4</span>
            Grow sideways with connectors — not up with harder words
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-1">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Instead of swapping <strong className="font-thai-display text-base text-foreground">ดี</strong> for a fancier adjective, extend the sentence with connectors you already own. You build complexity through structure, not vocabulary — and the structure stays yours.
              </p>
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 mb-4">
                <div className="text-[0.62rem] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Worked example</div>
                <div className="flex flex-col gap-2">
                  {[
                    { thai: 'ระบบดี',                              en: 'the system is good' },
                    { thai: 'ระบบดี แต่ ไม่สะดวก',                en: '…but not convenient' },
                    { thai: 'ระบบดี แต่ ไม่สะดวก เพราะ ช้ามาก', en: "…because it's very slow" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-baseline gap-2.5">
                      <span className="text-muted-foreground/50 shrink-0 w-3 text-xs">{i > 0 ? '→' : ''}</span>
                      <span className="font-thai-display text-base text-foreground">{row.thai}</span>
                      <span className="text-xs text-muted-foreground italic hidden sm:inline">{row.en}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[0.62rem] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Connectors to keep ready</div>
              <ConnectorChips />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="s5" className="rounded-xl border border-border bg-card px-5 [&_button]:py-4">
          <AccordionTrigger className="text-sm font-medium hover:no-underline gap-3">
            <span className="font-serif italic text-primary text-2xl leading-none shrink-0 w-5">5</span>
            Silent-word test: silence means recognise, not own
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground leading-relaxed pt-1">
              Try Step 1 with a word. If nothing comes — no Thai connects to it, it just sits there silent — you only <em>recognise</em> it; you don't <em>own</em> it. That silence isn't failure, it's information. Note that word and study it differently: use it actively in sentences, not just on recognition flashcards. Owned words have neighbours; recognised words don't yet.
            </p>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}

// ── Playbook 2 ────────────────────────────────────────────────────
function Playbook2() {
  return (
    <div>
      <ContextBlock
        problem="You know exactly what you want to say — you could say it out loud right now — but the moment you have to write it, you freeze on the spelling. Or you write something, feel uncertain, stop mid-sentence to look it up, and lose the thread. The spelling problem breaks the writing flow."
        when="Any time you're writing Thai and a word's spelling feels uncertain. The key rule: do not stop the sentence. This is a deliberate two-pass method — first pass for flow, second pass for correctness."
        practice="Find 3 words you misspelled or hesitated on this week. Write each from memory without checking. Then compare against the correct form and name the culprit: was it a tone mark, a vowel, a final consonant, or a class confusion? Naming the error type makes the next fix stick faster."
      />

      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground leading-relaxed mb-4">
        <span className="font-medium text-foreground">One-line method: </span>
        Placeholder → sound it out syllable by syllable → drill trouble words Thai-only → cluster check
      </div>

      <Accordion type="multiple" className="flex flex-col gap-2">

        <AccordionItem value="s1" className="rounded-xl border border-border bg-card px-5 [&_button]:py-4">
          <AccordionTrigger className="text-sm font-medium hover:no-underline gap-3">
            <span className="font-serif italic text-primary text-2xl leading-none shrink-0 w-5">1</span>
            Write a placeholder — don't stop the chain to look up spelling
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground leading-relaxed pt-1">
              Breaking the Thai chain to find a spelling pulls you back into English. Write the sound phonetically, put a <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">?</code>, or leave a blank. Keep the sentence flowing. The sentence matters more than the spelling in the first pass. Come back and fix on a second read-through when the whole thought is already down.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="s2" className="rounded-xl border border-border bg-card px-5 [&_button]:py-4">
          <AccordionTrigger className="text-sm font-medium hover:no-underline gap-3">
            <span className="font-serif italic text-primary text-2xl leading-none shrink-0 w-5">2</span>
            Sound out by syllable, then audit the usual culprits
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-1">
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                On the second pass, sound the word out syllable by syllable, then run it through the four most common traps. Most spelling errors fall into one of these categories:
              </p>
              <ul className="flex flex-col gap-2.5">
                {[
                  { label: 'น / ม final-consonant confusion',   ex: 'กิน not กิม' },
                  { label: 'Dropped tone marks',                ex: 'mai ek ่ and mai tho ้ go missing most often' },
                  { label: 'Vowel shape errors',                ex: 'short vs long; เ–าะ vs เ–า' },
                  { label: 'Consonant class confusion',         ex: 'ข vs ค — different classes, different tone' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="font-serif italic text-primary shrink-0 mt-px">{i + 1}.</span>
                    <span>
                      <span className="text-foreground font-medium">{item.label}</span>
                      <span className="text-muted-foreground/70 ml-2 text-xs italic">({item.ex})</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="s3" className="rounded-xl border border-border bg-card px-5 [&_button]:py-4">
          <AccordionTrigger className="text-sm font-medium hover:no-underline gap-3">
            <span className="font-serif italic text-primary text-2xl leading-none shrink-0 w-5">3</span>
            Keep a trouble-words list and drill Thai-only
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-1">
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Words you recognise strongly but spell weakly are a specific category — they need a specific drill. Recognising a word is a low-effort passive skill; producing its spelling is an active skill. They don't train each other.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Keep a running list in a notebook or your phone. When you drill them, show <em>only the Thai script</em>: no romanisation, no English. You're testing whether the characters come automatically — not whether you can recognise them from a prompt. Thai-only cards force production, not recognition.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="s4" className="rounded-xl border border-border bg-card px-5 [&_button]:py-4">
          <AccordionTrigger className="text-sm font-medium hover:no-underline gap-3">
            <span className="font-serif italic text-primary text-2xl leading-none shrink-0 w-5">4</span>
            Cluster rule: a faint 'a' usually means a cluster, not สะ
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-1">
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Thai consonant clusters have <em>no written vowel</em> between the two opening consonants. The faint 'a' sound you hear is an intrinsic vowel that exists in speech but not in writing. When you hear it, resist writing <strong className="font-thai-display text-base text-foreground">สะ</strong> — the two consonants sit together with nothing in between.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                This is one of the most common written errors for learners who've built their Thai ear before their Thai hand. You've heard <strong className="font-thai-display text-base text-foreground">สบาย</strong> hundreds of times. But when writing, the mouth says <em>sa-baai</em> and the hand wants to write <em>สะบาย</em>.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { right: 'สนุก', wrong: 'สะนุก', en: 'fun'         },
                  { right: 'สบาย', wrong: 'สะบาย', en: 'comfortable' },
                  { right: 'สวย',  wrong: 'สะวย',  en: 'beautiful'   },
                ].map(ex => (
                  <div key={ex.right} className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                    <div className="text-xl font-thai-display text-foreground">{ex.right}</div>
                    <div className="text-xs text-muted-foreground italic mt-0.5 mb-1">{ex.en}</div>
                    <div className="text-[0.65rem] text-red-400 line-through opacity-70">{ex.wrong}</div>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function PlaybooksPage() {
  const [tab, setTab] = useState('pb1');

  return (
    <div className="max-w-[860px] mx-auto px-5 py-8">
      <h1 className="text-3xl font-serif font-normal mb-1">
        Study <em className="text-primary not-italic font-medium">Playbooks</em>
      </h1>
      <p className="text-sm text-muted-foreground leading-relaxed mt-1 mb-4">
        Two distinct methods for two distinct problems in Thai homework: <em>producing</em> a sentence without translating through English, and <em>encoding</em> a word you already own but can't spell. They address separate stages — use whichever one is blocking you.
      </p>

      <Separator className="mb-6" />

      {/* Tab bar */}
      <div className="flex gap-2 mb-7">
        {[
          { id: 'pb1', tag: 'Playbook 1', label: 'Building the Sentence', sub: 'producing Thai without translating' },
          { id: 'pb2', tag: 'Playbook 2', label: 'Writing It Down',       sub: 'encoding words you already own'    },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex-1 flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-colors',
              tab === t.id
                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-primary dark:text-primary-foreground dark:border-primary'
                : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <span className={cn('text-[0.6rem] font-bold uppercase tracking-widest mb-0.5',
              tab === t.id ? 'text-white/50 dark:text-primary-foreground/50' : 'text-muted-foreground/60')}>
              {t.tag}
            </span>
            <span className="text-sm font-semibold leading-tight">{t.label}</span>
            <span className={cn('text-xs mt-0.5 leading-tight hidden sm:block',
              tab === t.id ? 'text-white/60 dark:text-primary-foreground/60' : 'text-muted-foreground/70')}>
              {t.sub}
            </span>
          </button>
        ))}
      </div>

      {tab === 'pb1' && <Playbook1 />}
      {tab === 'pb2' && <Playbook2 />}
    </div>
  );
}
