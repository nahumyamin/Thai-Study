import { cn } from '@/lib/utils';

const KOFI_URL = 'https://ko-fi.com/thaistudy';

const SECTIONS = [
  {
    title: 'Vocabulary',
    links: [
      { label: 'Flashcards',    page: 'cards'   },
      { label: 'Quiz',          page: 'quiz'    },
      { label: 'Spaced Review', page: 'review'  },
      { label: 'Fill the Blank', page: 'cloze'  },
    ],
  },
  {
    title: 'Grammar',
    links: [
      { label: 'Word Scramble',   page: 'scramble'        },
      { label: 'Mistake Hunter',  page: 'mistake-hunter'  },
      { label: 'Classifier Drop', page: 'classifier-drop' },
    ],
  },
  {
    title: 'Reading & Script',
    links: [
      { label: 'Class Rush',       page: 'rush'            },
      { label: 'Consonant Cards',  page: 'consonant-cards' },
      { label: 'Reading Passages', page: 'passages'        },
      { label: 'Font Recognition', page: 'fonts'           },
      { label: 'Months',           page: 'months'          },
    ],
  },
  {
    title: 'Reference',
    links: [
      { label: 'Grammar Patterns',      page: 'grammar'       },
      { label: 'Pronunciation',         page: 'pronunciation' },
      { label: 'Numbers & Classifiers', page: 'classifiers'   },
      { label: 'Consonant Clusters',    page: 'clusters'      },
      { label: 'Reading Strategies',    page: 'reading'       },
      { label: 'Registers',             page: 'register'      },
      { label: 'Playbooks',             page: 'playbooks'     },
    ],
  },
  {
    title: 'Culture',
    links: [
      { label: 'Thai Anthems', page: 'culture'   },
      { label: 'Idioms',       page: 'idioms'    },
      { label: 'Festivals',    page: 'festivals' },
      { label: 'Thai Food',    page: 'food'      },
    ],
  },
];

function KofiIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
    </svg>
  );
}

export default function Footer({ showPage }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-white border-t border-white/10 mt-16">
      <div className="max-w-[1200px] mx-auto px-5 py-12">

        {/* Link grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10 mb-12">
          {SECTIONS.map(section => (
            <div key={section.title}>
              <h3 className="text-[0.6rem] font-bold uppercase tracking-widest text-white/35 mb-3">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.links.map(link => (
                  <li key={link.page}>
                    <a
                      href={`/${link.page}`}
                      onClick={(e) => { e.preventDefault(); showPage(link.page); }}
                      className="text-sm text-white/55 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-white/[0.08]">
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/25">© {year} Thai Study</span>
            <a
              href="/about"
              onClick={(e) => { e.preventDefault(); showPage('about'); }}
              className="text-xs text-white/35 hover:text-white/70 transition-colors"
            >
              About
            </a>
          </div>

          <a
            href={KOFI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF5E5B] hover:bg-[#e54e4b] text-white text-xs font-semibold transition-colors"
          >
            <KofiIcon />
            Support on Ko-fi
          </a>
        </div>

      </div>
    </footer>
  );
}
