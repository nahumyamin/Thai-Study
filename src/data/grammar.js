export const GRAMMAR_INTRO = `Thai grammar is remarkably different from English. There are no verb conjugations, no plural endings, and no articles. Word order and a small set of particles carry most of the grammatical meaning. These ten patterns cover the structures you will encounter most frequently.`;

export const GRAMMAR_RULES = [
  {
    num: 1,
    title: 'Basic sentence order: Subject – Verb – Object',
    pattern: 'S + V + O',
    desc: `Thai follows the same subject–verb–object order as English. Verbs do not change form for tense, person, or number. Context, time words, and aspect particles tell you <em>when</em> something happens.`,
    key: 'highlighted = key word',
    examples: [
      { thai: 'ฉัน<mark>กิน</mark>ข้าว', rom: 'chan <mark>gin</mark> khao', en: 'I eat rice. (or: I ate rice. — tense from context)' },
      { thai: 'เขา<mark>ขาย</mark>เครื่องสำอาง', rom: 'khao <mark>khai</mark> khrueang sam ang', en: 'She sells cosmetics.' },
      { thai: 'รัฐบาล<mark>กำหนด</mark>กฎหมาย', rom: 'rat tha ban <mark>kam not</mark> kot mai', en: 'The government sets the law.' },
    ],
  },
  {
    num: 2,
    title: 'Tense & aspect with จะ / กำลัง / แล้ว / เคย',
    pattern: 'particle + verb',
    desc: `There are no verb tenses in Thai. Instead, four particles placed before or after the verb signal when or how an action happens: <strong>จะ</strong> (future/intention), <strong>กำลัง</strong> (right now), <strong>แล้ว</strong> (completed / already), <strong>เคย</strong> (past experience / used to).`,
    key: 'highlighted = tense particle',
    examples: [
      { thai: 'เขา<mark>จะ</mark>ไปวัดพรุ่งนี้', rom: 'khao <mark>cha</mark> pai wat phrueng ni', en: 'He <mark>will go</mark> to the temple tomorrow.' },
      { thai: 'ฉัน<mark>กำลัง</mark>กินข้าวอยู่', rom: 'chan <mark>kam lang</mark> gin khao yu', en: 'I <mark>am eating</mark> right now.' },
      { thai: 'เขา<mark>เคย</mark>อยู่ในกองทัพ', rom: 'khao <mark>khoei</mark> yu nai kong thap', en: 'He <mark>used to</mark> be in the military.' },
    ],
  },
  {
    num: 3,
    title: 'Negation with ไม่',
    pattern: 'ไม่ + verb/adjective',
    desc: `<strong>ไม่</strong> (mai, falling tone) is placed directly before a verb or adjective to negate it — equivalent to "not", "don't", or "doesn't". For the verb <strong>มี</strong> (to have/exist), negation uses <strong>ไม่มี</strong>. Emphatic negation adds <strong>เลย</strong> at the end: <em>not at all</em>.`,
    key: 'highlighted = negation word',
    examples: [
      { thai: 'ฉัน<mark>ไม่</mark>ชอบอาหารเผ็ด', rom: 'chan <mark>mai</mark> chop ahan phet', en: 'I <mark>don\'t</mark> like spicy food.' },
      { thai: 'ซอยนี้<mark>ไม่มี</mark>ที่กลับรถ', rom: 'soi ni <mark>mai mi</mark> thi klap rot', en: 'This alley has <mark>no</mark> turning space.' },
      { thai: 'เขา<mark>ไม่</mark>สนใจเลย', rom: 'khao <mark>mai</mark> son chai loei', en: 'He is <mark>not interested at all</mark>.' },
    ],
  },
  {
    num: 4,
    title: 'Adjectives follow nouns; comparison with กว่า',
    pattern: 'noun + adjective; A + adj + กว่า + B',
    desc: `In Thai, adjectives come <em>after</em> the noun they describe, unlike English. For comparisons, add <strong>กว่า</strong> after the adjective: <em>more … than</em>. Superlatives use <strong>ที่สุด</strong> after the adjective: <em>the most …</em>.`,
    key: 'highlighted = adjective / comparison word',
    examples: [
      { thai: 'ซอย<mark>แคบ</mark> / บ้าน<mark>เก่า</mark>', rom: 'soi <mark>khaep</mark> / ban <mark>kao</mark>', en: 'a <mark>narrow</mark> alley / an <mark>old</mark> house' },
      { thai: 'รถไฟแพง<mark>กว่า</mark>รถทัวร์', rom: 'rot fai phaeng <mark>kwa</mark> rot thua', en: 'The train is <mark>more expensive than</mark> the bus.' },
      { thai: 'ผัดไทยเป็นอาหารที่มีชื่อเสียง<mark>ที่สุด</mark>', rom: 'phat thai pen ahan thi mi chue siang <mark>thi sut</mark>', en: 'Pad thai is <mark>the most</mark> famous dish.' },
    ],
  },
  {
    num: 5,
    title: 'Modals: ต้อง / สามารถ...ได้ / อยาก / ควร / อาจจะ',
    pattern: 'modal + verb (+ ได้)',
    desc: `Thai modals sit before the main verb and do not change form. The most common ones: <strong>ต้อง</strong> (must), <strong>สามารถ…ได้</strong> (can/able to — split around the verb), <strong>อยาก</strong> (want to), <strong>ควร</strong> (should), <strong>อาจจะ</strong> (might). <strong>ได้</strong> alone after a verb also means "can" or marks a completed action.`,
    key: 'highlighted = modal',
    examples: [
      { thai: 'คุณ<mark>ต้อง</mark>จ่ายก่อนวันที่ห้า', rom: 'khun <mark>tong</mark> chai kon wan thi ha', en: 'You <mark>must</mark> pay before the 5th.' },
      { thai: '<mark>สามารถ</mark>ถอนเงิน<mark>ได้</mark>ที่ตู้เอทีเอ็ม', rom: '<mark>sa mat</mark> thon ngoen <mark>dai</mark> thi tu ATM', en: 'You <mark>can</mark> withdraw money at an ATM.' },
      { thai: 'เขา<mark>อาจจะ</mark>เป็นทหารก็ได้', rom: 'khao <mark>at cha</mark> pen tha han ko dai', en: 'He <mark>might</mark> become a soldier.' },
    ],
  },
  {
    num: 6,
    title: 'Causative ทำให้ — "to cause / to make"',
    pattern: 'cause + ทำให้ + effect',
    desc: `<strong>ทำให้</strong> (tham hai) is one of the most common structures in written Thai. It connects a cause to its effect, meaning "causes", "makes", or "results in". The subject performs the action that brings about the result stated after ทำให้.`,
    key: 'highlighted = ทำให้',
    examples: [
      { thai: 'หมอกควัน<mark>ทำให้</mark>หายใจไม่ออก', rom: 'mok khwan <mark>tham hai</mark> hai jai mai ok', en: 'The smog <mark>makes</mark> it hard to breathe.' },
      { thai: 'รถไฟฟ้า<mark>ทำให้</mark>มีคนมาขอซื้อที่ดิน', rom: 'rot fai fa <mark>tham hai</mark> mi khon ma kho sue thi din', en: 'The Skytrain <mark>caused</mark> people to come and buy land.' },
      { thai: 'การกินน้ำน้อย<mark>ทำให้</mark>ร่างกายอ่อนแอ', rom: 'kan gin nam noi <mark>tham hai</mark> rang kai on ae', en: 'Drinking too little water <mark>makes</mark> the body weak.' },
    ],
  },
  {
    num: 7,
    title: 'Conditionals with ถ้า…ก็ — "if … then …"',
    pattern: 'ถ้า + condition + ก็ + result',
    desc: `<strong>ถ้า</strong> opens the condition clause (if). <strong>ก็</strong> starts the result clause (then). ก็ is optional in informal speech but very common in written Thai. The structure works for present, future, and hypothetical situations alike — tense comes from context.`,
    key: 'highlighted = conditional words',
    examples: [
      { thai: '<mark>ถ้า</mark>ได้ใบแดง<mark>ก็</mark>ต้องเป็นทหาร', rom: '<mark>tha</mark> dai bai daeng <mark>ko</mark> tong pen tha han', en: '<mark>If</mark> you draw a red card, <mark>then</mark> you must serve.' },
      { thai: '<mark>ถ้า</mark>ซื้อเป็นจำนวนมาก<mark>ก็</mark>มีบริการส่งฟรี', rom: '<mark>tha</mark> sue pen cam nuan mak <mark>ko</mark> mi bo ri kan song fri', en: '<mark>If</mark> you buy in bulk, <mark>there is</mark> free delivery.' },
      { thai: '<mark>ถ้า</mark>ไม่จ่ายก่อนวันที่ห้า<mark>ก็</mark>จะถูกตัดไฟ', rom: '<mark>tha</mark> mai chai kon wan thi ha <mark>ko</mark> cha thuk tat fai', en: '<mark>If</mark> you don\'t pay by the 5th, the power <mark>will be</mark> cut.' },
    ],
  },
  {
    num: 8,
    title: 'Relative clauses with ที่ — "that / which / who"',
    pattern: 'noun + ที่ + verb/clause',
    desc: `<strong>ที่</strong> functions as a relative pronoun, equivalent to English "that", "which", or "who". It follows the noun being described and introduces a clause that modifies it. The same word ที่ also means "place", so context matters.`,
    key: 'highlighted = ที่',
    examples: [
      { thai: 'คนไทย<mark>ที่</mark>สูบบุหรี่มีเกือบสิบล้านคน', rom: 'khon thai <mark>thi</mark> sup bu ri mi kuea sip lan khon', en: 'Thais <mark>who</mark> smoke number almost ten million.' },
      { thai: 'ความเชื่อ<mark>ที่</mark>คนรุ่นก่อนบอกต่อกันมา', rom: 'khwam chuea <mark>thi</mark> khon run kon bok to kan ma', en: 'Beliefs <mark>that</mark> past generations passed down.' },
      { thai: 'งาน<mark>ที่</mark>คนไทยไม่อยากทำ', rom: 'ngan <mark>thi</mark> khon thai mai yak tham', en: 'Work <mark>that</mark> Thais don\'t want to do.' },
    ],
  },
  {
    num: 9,
    title: 'Reporting speech & thought with ว่า',
    pattern: 'verb of saying/thinking + ว่า + clause',
    desc: `<strong>ว่า</strong> introduces a quoted or reported clause after verbs of saying, thinking, believing, or knowing — like English "that" in "he said <em>that</em>…". There is no change between direct and indirect speech; the verb form stays the same.`,
    key: 'highlighted = ว่า',
    examples: [
      { thai: 'หลายคนบอก<mark>ว่า</mark>โรแมนติกมาก', rom: 'lai khon bok <mark>wa</mark> ro maen tik mak', en: 'Many people say <mark>that</mark> it is very romantic.' },
      { thai: 'รัฐบาลยอมรับ<mark>ว่า</mark>นี่คือปัญหาระดับชาติ', rom: 'rat tha ban yom rap <mark>wa</mark> ni khue pan ha ra dap chat', en: 'The government admits <mark>that</mark> this is a national problem.' },
      { thai: 'ฉันเชื่อ<mark>ว่า</mark>จะมีทางแก้ไขปัญหาได้', rom: 'chan chuea <mark>wa</mark> cha mi thang kae khai pan ha dai', en: 'I believe <mark>that</mark> there will be a solution.' },
    ],
  },
  {
    num: 10,
    title: 'Discourse connectors: เพราะ / แต่ / ดังนั้น / อย่างไรก็ตาม',
    pattern: 'clause + connector + clause',
    desc: `These four connectors build the logical flow of sentences. <strong>เพราะ</strong> gives a reason (because). <strong>แต่</strong> introduces a contrast (but). <strong>ดังนั้น</strong> signals a conclusion (therefore). <strong>อย่างไรก็ตาม</strong> concedes a point (however). Mastering them dramatically improves reading speed.`,
    key: 'highlighted = connector',
    examples: [
      { thai: 'คนชอบรถไฟ<mark>เพราะ</mark>ราคาถูก <mark>แต่</mark>ใช้เวลานาน', rom: 'khon chop rot fai <mark>phro</mark> ra kha thuk <mark>tae</mark> chai we la nan', en: 'People like the train <mark>because</mark> it\'s cheap, <mark>but</mark> it takes a long time.' },
      { thai: 'น้ำมีความสำคัญมาก <mark>ดังนั้น</mark>เราต้องดื่มทุกวัน', rom: 'nam mi khwam sam khan mak <mark>dang nan</mark> rao tong dueam thuk wan', en: 'Water is very important; <mark>therefore</mark> we must drink it every day.' },
      { thai: 'ผิดกฎหมาย <mark>อย่างไรก็ตาม</mark>คนก็ยังซื้ออยู่', rom: 'phit kot mai <mark>yang rai ko tam</mark> khon ko yang sue yu', en: 'It is illegal; <mark>however</mark>, people still buy it.' },
    ],
  },
  {
    num: 11,
    title: 'The five uses of ให้',
    pattern: 'give · let · for · so that · causative',
    desc: `<strong>ให้</strong> (hai) is one of Thai's most versatile words. Its meaning shifts depending on position and surrounding verbs. The same written word carries five distinct grammatical functions — sometimes in the same sentence. Learning to distinguish them is key to reading Thai naturally.`,
    key: null,
    // Special rendering: sub-sections
    subSections: [
      {
        label: '① ให้ = to give (main verb)',
        desc: 'When ให้ is the main verb of a sentence, it simply means "to give". The structure is: giver + <strong>ให้</strong> + recipient + thing given.',
        key: 'highlighted = ให้',
        examples: [
          { thai: 'พนักงาน<mark>ให้</mark>เงินมา', rom: 'pha nak ngan <mark>hai</mark> ngoen ma', en: 'The staff <mark>gives</mark> the money over.' },
          { thai: 'เจ้าภาพ<mark>ให้</mark>ของเล็กๆ น้อยๆ แก่แขก', rom: 'chao phap <mark>hai</mark> khong lek lek noi noi kae khaek', en: 'The host <mark>gives</mark> small gifts to the guests.' },
        ],
      },
      {
        label: '② verb + ให้ + person = to do something for someone (beneficiary)',
        desc: 'ให้ after a verb introduces the person who benefits from the action — "do X <em>for</em> Y". The person receiving the benefit follows ให้ directly.',
        key: 'highlighted = ให้',
        examples: [
          { thai: 'มีบริการมาส่ง<mark>ให้</mark>ถึงบ้าน', rom: 'mi bo ri kan ma song <mark>hai</mark> thueng ban', en: 'There is a delivery service that brings it <mark>for</mark> you right to your door.' },
          { thai: 'ฉันฝากให้เขาซื้อเครื่องสำอาง', rom: 'chan fak <mark>hai</mark> khao sue khrueang sam ang', en: 'I asked him to buy cosmetics <mark>for</mark> me. (entrusted it to him)' },
        ],
      },
      {
        label: '③ ให้ + person + verb = to let / to have someone do something (permissive / causative)',
        desc: 'When ให้ precedes a person and then a verb, it means "to let", "to allow", or "to have someone do something". This is the permissive-causative pattern. The subject enables or instructs someone else to act.',
        key: 'highlighted = ให้',
        examples: [
          { thai: 'รัฐบาลสั่ง<mark>ให้</mark>ทุกคนอยู่บ้าน', rom: 'rat tha ban sang <mark>hai</mark> thuk khon yu ban', en: 'The government ordered <mark>everyone to</mark> stay home. (had everyone stay)' },
          { thai: 'กฎหมายอนุญาต<mark>ให้</mark>ติดป้ายว่ามีบุหรี่ขาย', rom: 'kot mai a nu yat <mark>hai</mark> tit pai wa mi bu ri khai', en: 'The law <mark>allows</mark> shops to post a sign saying cigarettes are sold.' },
          { thai: 'รัฐบาลสนับสนุน<mark>ให้</mark>ทุกคนได้เรียนมหาวิทยาลัย', rom: 'rat tha ban sa nap sa nun <mark>hai</mark> thuk khon dai rian ma ha wit tha ya lai', en: 'The government supports <mark>everyone being able to</mark> study at university.' },
        ],
      },
      {
        label: '④ verb + ให้ + result = so that / in order to achieve a result',
        desc: 'After an action verb, ให้ can introduce the intended result or outcome — meaning "so that", "until", or "enough to". It links an action to the state it is supposed to produce.',
        key: 'highlighted = ให้',
        examples: [
          { thai: 'เอาไปต้ม<mark>ให้</mark>เดือดก่อน', rom: 'ao pai tom <mark>hai</mark> dueat kon', en: 'Take it and boil it <mark>until</mark> it boils first.' },
          { thai: 'รัฐบาลพยายามลดจำนวนคนสูบบุหรี่<mark>ให้</mark>น้อยลง', rom: 'rat tha ban pha ya yam lot cam nuan khon sup bu ri <mark>hai</mark> noi long', en: 'The government tries to reduce the number of smokers <mark>so that</mark> it goes down.' },
        ],
      },
      {
        label: '⑤ ให้ in reported instructions = "to" after verbs of telling / asking',
        desc: 'After verbs like บอก (tell), ขอ (ask/request), สั่ง (order), เชิญ (invite), ให้ introduces what was requested or instructed — equivalent to English "to" in "told him <em>to</em> come".',
        key: 'highlighted = ให้',
        examples: [
          { thai: 'ครอบครัวจะเชิญแขก<mark>ให้</mark>มางานศพ', rom: 'khrob khruea cha choen khaek <mark>hai</mark> ma ngan sop', en: 'The family will invite guests <mark>to</mark> come to the funeral.' },
          { thai: 'เจ้าหน้าที่จะเรียกคน<mark>ให้</mark>ออกมารับบิล', rom: 'chao na thi cha riak khon <mark>hai</mark> ok ma rap bin', en: 'The officer will call someone <mark>to</mark> come out and collect the bill.' },
        ],
      },
    ],
    quickRef: [
      '① <strong>ให้</strong> alone as main verb → <em>give</em>',
      '② verb + <strong>ให้</strong> + person → <em>do X for someone</em>',
      '③ verb + <strong>ให้</strong> + person + verb → <em>let / have / allow someone to do X</em>',
      '④ verb + <strong>ให้</strong> + adjective/result → <em>so that / until / enough to</em>',
      '⑤ tell/ask/invite + <strong>ให้</strong> + verb → <em>told/asked/invited to do X</em>',
    ],
    examples: [],
  },
];
