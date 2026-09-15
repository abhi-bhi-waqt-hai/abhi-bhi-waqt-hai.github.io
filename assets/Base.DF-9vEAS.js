import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, f as renderScript, d as renderComponent, e as renderSlot, g as renderHead } from './astro/server.DGswJgvN.js';
import 'piccolore';
import 'html-escaper';
import 'clsx';
/* empty css                            */

const en = {
  meta: {
    /* THE NAME OF THE SITE. Round 36: this was the English
           'There is still time' and the Devanagari appeared only in the wordmark on
           the page and in og:title. So the browser TAB, the bookmark a reader
           saves, and the search result all named the site in English while every
           visible surface named it in Hindi. The owner asked for one name; this is
           the string that decides it.
    
           Base.astro composes it two ways and both stay bilingual:
             home     ->  अभी भी वक़्त है — There is still time.
             a page   ->  Credits · अभी भी वक़्त है
           so the English is still there to be searched for, and the name leads. */
    title: "अभी भी वक़्त है",
    tagline: "There is still time.",
    description: "If you are using, and you have started to wonder what happens if you tell someone: there is a law in India that protects you when you ask for help. This page explains it, and what it does not cover. Nothing here is saved. Nothing is sent anywhere.",
    shareTitle: "अभी भी वक़्त है — There is still time",
    shareDesc: "What Indian law actually says about asking for help with drugs, what it does not cover, and the free numbers that answer at any hour. No account, no tracking, nothing saved."
  },
  nav: {
    home: "Home",
    rightNow: "Right now, tonight",
    whatHappens: "What happens if I ask",
    campaigns: "The campaigns",
    whereToGo: "Where to go",
    sources: "Where this comes from",
    theNumber: "The number",
    credits: "Credits",
    sections: "Chapters"
  },
  plates: {
    night: {
      alt: "An empty residential lane after midnight. One street lamp lights a patch of road and a bicycle leaning against a compound wall; everything beyond it is dark.",
      caption: "Half past one, and the street is asleep."
    },
    morning: {
      alt: "An empty room with the window open, the first light of the day lying in two bars across the floor.",
      caption: "Morning comes whether or not anything was decided tonight."
    },
    start: {
      alt: "A single plastic chair against the parapet of an empty rooftop terrace, one long shadow across the red floor.",
      caption: "Somewhere to sit down, and leave again the same day."
    },
    asking: {
      alt: "An old wooden door standing open onto a bright corridor, morning light on the floor beyond it.",
      caption: "The door is not the one you are picturing."
    },
    paper: {
      alt: "A file of loose papers tied with cotton tape on a wooden desk, morning light across it.",
      caption: "Every sentence on this site can be checked against the page it came from."
    }
  },
  /* ── The six real photographs ─────────────────────────────────────────
       Every other picture on this site was generated. These six were taken,
       of things this site names and a reader can check, and their captions
       say so — the point of them is that they are NOT made.
  
       `run-day` is captioned honestly about what it is not: it is a
       Government of India anti-drug event from 2010, ten years before the
       campaign this page is about. Captioning it as Nasha Mukt Bharat
       Abhiyaan would be the exact fabrication this site exists to avoid, and
       no free-licensed photograph of that campaign could be found — see
       docs/HANDOFF.md §7 for where it was looked for. */
  photos: {
    act: {
      alt: "The first page of the Narcotic Drugs and Psychotropic Substances Act, 1985 as passed, headed “No. 61 of 1985” and dated 16 September 1985, with a handwritten note in the margin.",
      cap: "This is the Act itself, page one, photographed from the printed volume. Section 64A is nineteen pages further in. Nothing on this site is quoting a summary of it."
    },
    runDay: {
      alt: "A crowd at the start of a run in New Delhi, a yellow World Drug Day flag being raised over a low stage, runners in numbered bibs waiting behind a barrier.",
      cap: "A real Government of India event — but not this one. This is the Narcotics Control Bureau’s World Drug Day run in Delhi in 2010, ten years before the campaign on this page. No freely licensed photograph of that campaign exists, and captioning this one as if it were would be the thing this site refuses to do."
    },
    runGate: {
      alt: "People gathered under India Gate in New Delhi at the start of a mass run, one of them holding a yellow flag.",
      cap: "India Gate, 26 June 2011. Whatever else is true about the programmes on this page, they are not a rumour: they have dates, budgets and photographs in the public record."
    },
    phcTn: {
      alt: "A single-storey government primary health centre in Tamil Nadu, pale green walls and a board in Tamil and English, empty road in front of it.",
      cap: "A government primary health centre in the Nilgiris. This is the register of building the rest of this page is talking about — ordinary, low, and open to anybody who walks up to it."
    },
    phc: {
      alt: "A small rural primary health centre with ochre walls and a red-tiled forecourt, a motorcycle parked outside, a dirt road running past.",
      cap: "A primary health centre in a village in Odisha. Nobody is turned away from a building like this for asking a question, and nobody at the gate asks why you came."
    }
  },
  /* The companion frames inside the content sections — see Anchor.astro.
     A picture has to earn half a band, and `cap` is the test: it says why
     the frame is on the page, not what is in it. */
  anchors: {
    talking: {
      alt: "Two ordinary plastic chairs on a verandah in morning light, turned slightly towards each other, both empty.",
      cap: "Two chairs, turned towards each other. The first appointment is a conversation — the question is who else gets to hear it."
    },
    records: {
      alt: "Shelves of paper files tied shut with cotton tape in an old record room, one shaft of dusty sunlight from a high window.",
      cap: "Section 64A is not a promise this site invented. It is a numbered section of a bound Act, on shelves like these since 1989."
    },
    path: {
      alt: "A footpath worn bare through dry grass, curving away behind a low lime-washed wall in early morning light.",
      cap: "Nobody built this path. It is there because people walked the same line again, and again, and again."
    },
    classroom: {
      alt: "An empty government-school classroom, wooden desks and benches, morning sun lying in bars across a red-oxide floor.",
      cap: "The second Act is written around where you are in this picture, rather than around anything you did."
    },
    bicycles: {
      alt: "Two bicycles leaning together against a compound wall in the early morning, nobody with them.",
      cap: "This question is not really about you. It is about the second bicycle, and this page does not pretend that is easy."
    },
    made: {
      alt: "Rooftops of a small Tamil Nadu city just after sunrise — water tanks on steel legs, thin aerials, paper kites in a pale sky.",
      cap: "This one, for instance. It opens the home page, and there is no such rooftop — it was made for this site, like every other frame on it."
    },
    ledge: {
      alt: "A low concrete ledge running along a row of shuttered shops at night, one sodium lamp lighting a stretch of it, nobody on it.",
      cap: "This is where the rest of tonight probably happens, and nothing on this page pretends otherwise. It is written for the version of the night that does not end in a decision."
    },
    phone: {
      alt: "An old cream landline telephone with a coiled cord on a small wooden table against an ochre wall, lit by one lamp, the handset in its cradle.",
      cap: "The number below rings something. This is what the far end of a helpline actually is — a room, a table, and a person who picks up."
    },
    bolt: {
      alt: "A simple iron sliding bolt on the inside of a door, drawn back and unlocked, flaking pale green paint, raking morning light.",
      cap: "Drawn back, not locked. This page tells you what this site does not keep and also what it cannot stop your own phone from keeping, because only one of those is a promise it can make."
    },
    rows: {
      alt: "Rows of empty white plastic chairs under a pale cloth canopy on swept ground at sunrise, a long shadow from every leg.",
      cap: "Chairs set out before anybody has arrived. This is what the programme on this page looks like on the morning of, in one district."
    }
  },
  /* The small wide frames in a chapter margin, for the two chapters that
     carry no pull quote. See src/components/Chapter.astro. */
  chapterAsides: {
    steps: {
      alt: "A flight of worn red-oxide steps seen from the side, a bright band of morning sun along the lip of every tread.",
      cap: "Eight steps, and the light finds every one of them separately."
    },
    line: {
      alt: "Overhead telephone and electric wires sagging between two leaning poles against a pale gold pre-sunrise sky.",
      cap: "The line is already there, and it costs nothing to use it."
    }
  },
  flow: {
    nextUp: "Next",
    folio: "Chapter",
    motionPause: "Pause film",
    motionPlay: "Play film"
  },
  help: {
    bar: "Talk to someone now",
    open: "Show helplines",
    close: "Hide helplines",
    heading: "Free. Any hour. You do not have to give your name.",
    intro: "You can call and ask what would happen, without agreeing to anything. That is a normal reason to call. You do not have to have decided anything first.",
    emergencyLabel: "If someone is in danger right now",
    emergency: [
      {
        number: "112",
        name: "One number for any emergency",
        who: "Ministry of Home Affairs · every state and union territory",
        what: "Ambulance, police or fire, from the same number, on any phone. Say where you are before anything else."
      },
      {
        number: "108",
        name: "Ambulance",
        who: "National Health Mission · running in most states",
        what: "The ambulance line directly. It is for critical care, accidents and emergencies, and it is free."
      }
    ],
    lines: [
      {
        number: "14446",
        name: "National Drug De‑addiction Helpline",
        who: "Ministry of Social Justice & Empowerment",
        hours: "The Ministry describes it as a round-the-clock line",
        forWhom: "The main one. Counselling, and they tell you where your nearest centre is. The hours above are written as a claim and not a fact: no government page this site could load prints them."
      },
      {
        number: "14416",
        name: "Tele‑MANAS",
        who: "Ministry of Health & Family Welfare",
        hours: "24 hours, every day · Tamil and Hindi available",
        forWhom: "For the nights when it is not about using at all, and you just cannot sleep."
      },
      {
        number: "1098",
        name: "Childline",
        who: "Ministry of Women & Child Development",
        hours: "24 hours, every day",
        forWhom: "If you are under 18 and someone is hurting you, or you have nowhere safe to be tonight. It is not an ambulance — for that, call 112."
      }
    ],
    dialNote: "It answers with a short menu. Press 1 — that is the counsellor. Press 2 is for reporting trafficking, and it is not the one you want. If nobody answers you in a language you can speak, try Tele-MANAS on 14416: it publishes its language list, Tamil and Hindi are both on it, and its counsellors can tell you where to call next.",
    exit: "Quick exit",
    exitHint: "Quick exit leaves this site straight away. Or press Escape twice."
  },
  title: {
    eyebrow: "Nothing here is saved",
    line: "You are not the first, and you are not in trouble.",
    lede: "You do not have to admit anything, to anyone, to read this. There is one thing here almost nobody in India knows, and it is about what the law does when you ask for help.",
    enter: "Read it",
    enterQuiet: "Just give me the number"
  },
  chapters: [
    {
      id: "not-only-you",
      folio: "01",
      kicker: "First",
      title: "Somebody built these on purpose.",
      body: [
        "There are 76 places in India you can walk into and leave again the same day. 155 units inside ordinary government hospitals, which look like any other department. 145 district centres doing all of it under one roof. And 344 places you can stay at while you stop. Those are the Ministry’s own counts, given to Parliament in July 2026.",
        "Nobody builds 344 of something for a problem nobody has. And nobody nearly triples the number of district centres in two years for a programme that does not work. They were built because the number of people who needed them was large, it was counted, and this was the answer.",
        "You are not the first person to open a page like this at this hour."
      ],
      pull: "Nobody builds 344 of something for a problem nobody has.",
      caption: "Rooftops, just after sunrise."
    },
    {
      id: "not-too-late",
      folio: "02",
      kicker: "Second",
      title: "Stopping is not one decision.",
      body: [
        "It is not a door you walk through once. People go back. Going back is common enough that treatment is built expecting it, which is why a counsellor is not surprised by it the way you are dreading.",
        "Going back is not the end of the attempt. It is a normal part of one."
      ],
      caption: "A school verandah, early, before anyone is in it."
    },
    {
      id: "the-fear",
      folio: "03",
      kicker: "The thing itself",
      title: "You think asking for help is the same as confessing.",
      body: [
        "There are probably several, and one of them is your mother, and this page is not going to tell you that one does not count. But one stops people before they get that far: that the moment you say it out loud to anybody official, it becomes a police matter and it is written down about you forever.",
        "It is a reasonable fear. It is also, on this one point, wrong — and it is wrong in a way that is written down, in an Act, and has been for thirty years.",
        "There is a section of the Narcotic Drugs and Psychotropic Substances Act, 1985 that exists for exactly this. It is section 64A. Volunteer for treatment at a place the Government runs or recognises, go through with it, and you are not liable to be prosecuted for using. It has limits, they are real, and the next page prints all of them beside the good news rather than under it."
      ],
      pull: "Volunteer at a place the Government recognises, go through with it, and you are not liable to be prosecuted for using.",
      caption: "Light through a jaali screen, on an empty wall."
    },
    {
      id: "what-happens",
      folio: "04",
      kicker: "Then what",
      title: "It starts with a phone call, and it is free.",
      body: [
        "The first step is not a hospital and it is not a form. It is 14446 — a number run by a government ministry, answered at any hour, and it costs nothing.",
        "You can call it to ask what would happen. You do not have to give a name, and you do not have to agree to anything at the end of it."
      ],
      caption: "Looking out, through a window that has been there a long time."
    }
  ],
  close: {
    /* Was "That is the whole page", which was right while this plate was the
       last screen of an argument. It is a page of its own since Round 30 and
       the reader arriving on it has skipped the argument on purpose. */
    eyebrow: "If you skip everything else",
    title: "This is the number.",
    body: "Free, every hour of every day, run by the Ministry of Social Justice and Empowerment. Ask them what would happen. That is a complete reason to call.",
    number: "14446",
    numberLabel: "National Drug De‑addiction Helpline",
    note: "If someone will not wake up, none of this page applies yet. Call 112, or 108 for the ambulance. That is the whole of what this site can tell you about an emergency, and it is a phone call, not a page."
  },
  now: {
    /* Was "The next ten minutes", which was true while the first thing on the
       page was a person who had stopped breathing. Nothing on the page is a
       ten-minute matter now. */
    eyebrow: "Tonight, not some day when the offices are open",
    title: "Right now, tonight.",
    lede: "Every other page here is about a decision you would make in the daytime. This one is for the hour you are reading it in, and it does not ask you to have decided anything.",
    notReadyLabel: "Where most people actually start",
    notReadyTitle: "Safer than last week is a real thing to aim at.",
    notReadyBody: "Most people reading this have not decided to stop, and this page is not going to make you say it first. Using less is not a smaller version of quitting. It is its own thing, it is where nearly everybody starts, and it counts on its own — including if you never get to nothing. None of what follows is permission and none of it is a plan.",
    notReadyPoints: [
      "Less is a real number. Most days to some days is a change in your life, and nobody has to agree that it counts for it to count.",
      "The cut that holds is smaller and more boring than the one you announce. A week you actually did beats a month you meant to.",
      "Do not stop everything at once without asking somebody first. For some kinds of dependence the dangerous part is not carrying on — it is stopping suddenly, and the World Health Organization’s own withdrawal guidance says it can occasionally be life-threatening and need emergency treatment. Whether that is true for you is a question for a doctor, or for the number at the bottom of this screen, and you can ask it without giving your name.",
      "A gap changes what your body can take. After a stretch off — weeks, an illness, a stay somewhere — you are not where you were before it, and the WHO lists starting again after a break among the things that most often go wrong. That matters most in the middle of cutting down, because cutting down is what makes the gaps.",
      "Mixing is the other one on that list. Including things that are legal, ordinary medicine from a chemist, and especially anything that makes you sleepy on top of something else that does.",
      "One person who knows roughly where you are. Not a confession and not a conversation — someone who could come and find you. And have 112 in your head now, while nothing is happening, because nobody looks up a number well at three in the morning."
    ],
    notReadySource: "The break, the mixing and the warning about stopping suddenly are the World Health Organization’s, not this page’s. All three are linked on the sources page.",
    tonightLabel: "And if tonight is just tonight",
    tonightTitle: "There is nothing you have to do tonight.",
    tonightBody: "Nobody says that part out loud, so this page will. You do not have to phone anybody tonight, and you do not have to tell anybody tonight. You are not behind. That number will still answer tomorrow, still be free, and still not ask your name. If you can sleep, sleep."
  },
  law: {
    eyebrow: "India · the actual provision",
    title: "What happens if I ask for help.",
    lede: "This is the part almost nobody is told. A real section of a real Act, added in 1989, so it has been law for more than thirty years — and it was written for exactly the situation you are in.",
    fear: "If I tell a doctor, does that mean the police find out?",
    actLabel: "The provision",
    actName: "Narcotic Drugs and Psychotropic Substances Act, 1985 — Section 64A",
    actPlain: "A person who is dependent, and who is charged with using, or with an offence involving a small quantity, and who volunteers for de‑addiction treatment at a hospital or institution run or recognised by the Government or a local authority, and who goes through with that treatment, is not liable to be prosecuted for it.",
    actNote: "That is a plain restatement, not the law itself. The operative text is the English of the Act, quoted in full on the sources page. If anything here differs from the Act, the Act is what is true.",
    coverLabel: "At a glance",
    coversLabel: "Section 64A covers",
    covers: [
      "Using. That is the offence under section 27.",
      "An offence involving a small quantity."
    ],
    notCoversLabel: "It does not cover",
    notCovers: [
      "More than a small quantity.",
      "Selling, or carrying it for somebody else.",
      "Who gets told. It is about prosecution, and nothing else.",
      "Being stopped, searched, or taken to a station. None of those is prosecution, and this page cannot promise they will not happen.",
      "Anything before a charge. The section is written about a person already charged — a shield you raise, not a certificate you collect in advance."
    ],
    condLabel: "And all of these have to be true",
    conds: [
      "The treatment is at a hospital or centre the Government runs or recognises. A private arrangement is not the same thing.",
      "You complete it. The Act says the protection may be withdrawn if the treatment is not completed.",
      "The section is written about a person who is dependent. Whether that word describes you is not something this page can tell you, and not something you have to work out before you call."
    ],
    coverNote: "If you are not sure which side of that line you are on, that is completely normal, and it is a question you can ask the helpline without giving your name.",
    relapseLabel: "The thing you have probably already worked out",
    relapseTitle: "If going back is normal, and not finishing cancels it, then what is this worth?",
    relapseBody: [
      "Almost nobody asks it out loud. The home page says people go back, because they do. This page says the protection can be withdrawn if the treatment is not completed, because the Act says so. Together those sound like the thing most likely to happen to you is the thing that switches the protection off.",
      'Read the words though. The immunity "may be withdrawn if the addict does not undergo the complete treatment for de-addiction". May, not will. And it names walking out of treatment halfway through — not using again some months after finishing it. No page can promise you how a court would read that on the day. But the sentence you were afraid of is narrower than it looks.'
    ],
    whoGaveLabel: "And the part that actually stops people",
    whoGaveTitle: "If I tell them, does the person who gave it to me go to jail?",
    whoGaveBody: [
      "Plainly: yes. Section 77 is a real offence and it is aimed at whoever gave it to you. If you name that person to somebody official, you have put them in front of it. This page is not going to talk you out of caring about that.",
      'But those are two different things. Asking for help for yourself does not require you to name anybody. The helpline is a counselling line, not an investigation. A doctor needs to know what is in you, not who handed it over. "I do not want to say" is a complete answer, and you can give it and carry on with the rest of the conversation.',
      "It gets genuinely hard in one case: when the person giving it to you is also the person hurting you. That is what 1098 is for."
    ],
    minorLabel: "If you are under 18",
    minorTitle: "There is a second Act, and for you it comes first.",
    minorLede: "Section 64A is written about people being prosecuted, and most of them are adults. If you are under 18, a different Act reaches you first: the Juvenile Justice (Care and Protection of Children) Act, 2015. Two of its sections are worth knowing by name.",
    minorPoints: [
      {
        id: "care",
        title: "Section 2(14) is a list of children who need protecting. Drugs are on it.",
        body: 'Sub-clause (ix) covers a child "who is found vulnerable and is likely to be inducted into drug abuse or trafficking". No website can promise how a committee would read that in your case. What it shows is where Parliament filed this — among children who need care and protection, not in the chapter about offences.'
      },
      {
        id: "gave",
        title: "Section 77 is about whoever gave it to you.",
        body: "Giving a child liquor, a narcotic drug, a tobacco product or a psychotropic substance, other than on the order of a qualified doctor, carries up to seven years and a fine of up to one lakh rupees. Section 78 covers anyone who uses a child to carry or pass those things on. Both point away from you."
      },
      {
        id: "both",
        title: "And neither of them cancels the other.",
        body: 'Section 64A still exists and still has every one of its limits. None of this stacks up into a guarantee. What it does mean is that "I am a child who is using" and "I am a criminal" are not the same sentence in Indian law, and almost nobody your age has been told that.'
      }
    ],
    aidLabel: "A lawyer costs you nothing",
    aidBody: "If it ever gets as far as a case, section 12(c) of the Legal Services Authorities Act, 1987 entitles a woman or a child who has to file or defend one to free legal services. There is no income test in it. NALSA runs a free helpline on 15100, and there is a District Legal Services Authority in your own district. It is not charity — it is what the Act gives you.",
    minorNote: "This is not legal advice and it was not written by a lawyer. It describes what three Acts say, each section named so you, or an adult, can read the words yourself on the sources page. If you are standing in front of a police officer or a court, get the free lawyer above and do what they tell you, not what this page says.",
    /* Four AUTHORED lines, not one paragraph. Round 37: as a single string at
       40ch this broke over five lines with a sentence snapped mid-phrase and
       "a rumour." orphaned at the end. The breaks are chosen here rather than
       left to the browser, because a browser picks them from whatever width
       and font it has. Keep each line under about 57 characters. */
    notPromise: [
      "None of this is a promise that nothing will happen.",
      "It is the opposite of a promise.",
      "It is the actual rule, with its limits printed beside it,",
      "so that you are deciding on something true",
      "instead of on a rumour."
    ]
  },
  /* ── The long version ──────────────────────────────────────────────
     Everything on this page is provenance: what the pictures are, what
     the site does not know, and what it does and does not keep. Nothing
     that changes what a reader should DO is behind this click — see
     lab/r31-t7.mjs for the rule and why the ledger did not move. */
  moreDetail: {
    eyebrow: "The long version",
    title: "In more detail.",
    lede: "The rest of the site is written to be read in a hurry. This page is not. It is what is true about the site itself rather than about your situation — what its pictures are, what it does not know, and what it does and does not keep — and none of it changes what you should do tonight.",
    linkLabel: "In more detail",
    linkBody: "What the pictures are, the seven things this page does not know, what this site keeps, and who wrote it."
  },
  campaigns: {
    eyebrow: "India · who built this",
    title: "The campaign behind it.",
    lede: "None of what is on the other pages appeared on its own. There is a named government programme behind it, with a start date and a figure you can look up. That is the point of printing it here: so you can check that this site is not making it up.",
    /* ── The reach chart ──────────────────────────────────────────────
       38 squares, not 38.5, and the real figures are printed beside it so
       the rounding is visible. `reachGap` is the part that matters most:
       what this release does NOT publish. */
    reachLabel: "Who it has actually reached",
    reachStatement: "Nearly four in every ten people this campaign has reached were young.",
    reachFigure: "11.43 crore of 29.68 crore — 38 in every 100",
    reachCaption: "Government of India figures, given to Parliament on 23 July 2026. Thirty-eight squares of a hundred, rounded down from 38.5. If you are reading this and feel like the only one, the arithmetic disagrees with you.",
    reachGap: "What that release does not say, and what no government page this site could find says either: how many people finish treatment, or stay stopped, or are counted as recovered. There is no figure for that here because there is no figure for it there. Anybody who shows you one has either found a source this site could not, or made it up.",
    searchLabel: "Search for",
    sinceLabel: "Since",
    runLabel: "Run by",
    items: [
      {
        id: "nmba",
        name: "Nasha Mukt Bharat Abhiyaan",
        search: "Nasha Mukt Bharat Abhiyaan",
        since: "Launched 15 August 2020",
        run: "Ministry of Social Justice and Empowerment",
        what: "The nationwide campaign. It began in 272 districts picked as the most affected, and it now runs in every district in the country. It is the part of the government effort that is about reaching people rather than about policing them.",
        figure: "Every district",
        figureLabel: "in India, since 15 August 2023"
      }
    ],
    note: "The figure is as the Ministry of Social Justice and Empowerment published it, and it is on the sources page with the release it came from. It will be out of date eventually. A page that prints a number with no date attached is a page that will quietly become wrong."
  },
  places: {
    eyebrow: "India · what exists",
    title: "Where you would actually go.",
    lede: "Not a hotline in another country and not a clinic you pay for. These are the real kinds of place, run or funded by the Government of India, with the real number of each.",
    /* The questions come before the places. Every entry restates something
       the site already establishes and already cites, so none of it needs a
       new row in CITATIONS.md: ODIC from the facilities list below, the
       recognised-centre condition from the Coverage table on /what-happens,
       cost from costBody, and the last two from law.steps and
       law.minorPoints. They are questions, not claims. */
    askLabel: "What to ask",
    askLede: "None of these is a rude question, and asking one does not commit you to anything. This is what the call is for — the answers are how you find out whether the place in front of you is the right one.",
    asks: [
      {
        q: "Is this an ODIC — can I walk in and leave the same day?",
        why: "It is usually the right kind of place to start with, and it does not mean staying anywhere."
      },
      {
        q: "Is this centre run or recognised by the Government?",
        why: "Section 64A only covers treatment at a hospital or centre the Government runs or recognises. A private arrangement is not the same thing."
      },
      {
        q: "What will this cost me?",
        why: "The helpline is free and these centres are run or funded by the Government. Ask anyway, and ask early."
      },
      {
        q: "Do you keep my number?",
        why: "This site cannot tell you — it is not published anywhere it could check. They are used to being asked."
      },
      {
        q: "Who else gets told, and does my age change that?",
        why: "It varies by your age, your state and the service. Ask the service in front of you rather than trusting a website about it."
      }
    ],
    facilitiesLabel: "The five kinds of place",
    facilitiesLede: "Current counts, from a written reply in Parliament on 23 July 2026. They were 599 places in February 2024 and they are 765 now; the chart below shows where the difference went. Both figures are on the sources page with their citations.",
    facilities: [
      {
        abbr: "ODIC",
        count: "76",
        name: "Outreach and Drop‑In Centre",
        what: "Walk in and leave the same day. Screening, an assessment, someone to talk to, a referral onward if you want one. If one of these is where to start, it is this one."
      },
      {
        abbr: "IRCA",
        count: "344",
        name: "Integrated Rehabilitation Centre for Addicts",
        what: "The largest group by far. In‑patient: you stay there. Counselling, medical de‑addiction, and support afterwards."
      },
      {
        abbr: "DDAC",
        count: "145",
        name: "District De‑Addiction Centre",
        what: "One per district where they exist, doing what the other three do under one roof."
      },
      {
        abbr: "ATF",
        count: "155",
        name: "Addiction Treatment Facility",
        what: "Inside ordinary government hospitals. If walking into a building that is only for this is too much, this one looks like any other department."
      },
      {
        abbr: "CPLI",
        count: "45",
        name: "Community Peer‑Led Intervention",
        what: "Run for people under 18, by people closer to your own age. Prevention and life skills rather than treatment."
      }
    ],
    /* ── The growth chart ──────────────────────────────────────────────
       `then` and `now` are the two cited figures, not a trend line drawn
       through them. Two dated points are two dated points. */
    growthLabel: "And how many of them there are now",
    growthLede: "The same five kinds of place, counted twice: once in February 2024 and once in a written reply in Parliament in July 2026. Both counts are on the sources page.",
    growthThen: "Feb 2024",
    growthNow: "Jul 2026",
    growthTotal: "599 places in February 2024. 765 in July 2026.",
    growthCaption: "The two that moved are the two that matter most if you do not want to be seen going somewhere: units inside ordinary hospitals, which look like any other department, and district centres. Those nearly doubled and nearly tripled.",
    geoNote: "All of these have been geo‑tagged by the Ministry. That is why the helpline can tell you the nearest one over the phone.",
    findLabel: "Finding the one nearest you",
    findBody: "This site does not print addresses, and that is a decision rather than an omission. The Ministry’s own list is a scanned document with no readable text in it, so nothing here could be copied out of it and checked. A wrong address is not a typo — it is somebody travelling to a building that is not there. Here is what works instead.",
    /* Re-ordered in Round 29. Step 01 used to be "Call 14446", so the first
       instruction on the page was to dial — before the reader had been told
       what to ask or what they were dialling about. The search step is now
       first because it requires nothing of anybody, and the call is last
       because it is the step everything else prepares for. "Ask whether it is
       an ODIC" moved up into `asks`, where the questions now live. */
    findSteps: [
      'Search the exact words "Nasha Mukt Bharat Abhiyaan" with your district name. It finds the real programme, and it does not require you to contact anybody about yourself.',
      "Look for an ODIC first. It is the one you can walk into and leave the same day, and almost always the right place to start.",
      "Then call, and ask for the nearest recognised centre to your area."
    ],
    callLabel: "And the number, when you are ready for it",
    callBody: "One number covers all of this. It is free, it is answered at any hour, and you do not have to give a name to ask a question. Press 1 for the counsellor.",
    callNumber: "14446",
    callNumberLabel: "National Drug De-addiction Helpline",
    costLabel: "What it costs",
    costBody: "The helpline is free. The centres above are run or funded by the Government, which is why they are on this page and a private clinic is not. Ask about cost on the call — it is a normal question, and better asked early."
  },
  privacy: {
    eyebrow: "Before you start",
    title: "Nothing you do here leaves your phone.",
    points: [
      "There is no account and no sign‑in. Nothing to make, and nothing to forget.",
      "Nothing you type is saved or sent. Close the tab and it is gone.",
      "There is no tracking on this site. No analytics, no cookies, no pixels."
    ],
    note: "That is not a promise about how careful we are. The site has no way to send anything anywhere. That part was never built.",
    honestLabel: "And the part a privacy page usually leaves out",
    honest: [
      "This page can be private. Your phone is a different question, and not one this site gets to answer for you.",
      "A call shows up in the call log, and on the bill, whoever pays it. 14446 and 112 are free to dial; free is not the same as invisible.",
      "This page will be in your browser history unless you delete it, or you opened it in a private tab.",
      "If somebody has put monitoring on your phone, nothing any website does can undo that.",
      "A library, a school computer, or a friend’s phone gets around most of the above. So does asking a friend to make the call while you sit next to them."
    ]
  },
  sources: {
    eyebrow: "Check it",
    title: "Where every word of this came from.",
    lede: "This site asks you to change what you believe about a law, on the strength of a page written by a school student. That is a lot to ask. So here is everything it stands on, with the section numbers and the addresses, so you can go and disagree with it if it is wrong.",
    statuteLabel: "The provision itself, in the English of the Act",
    statuteNote: 'The Act says "addict". This site does not use that word anywhere else, because it is a label. But quoting a law means quoting it, so it stays here exactly as written.',
    groups: [
      {
        id: "law",
        title: "The law",
        rows: [
          {
            claim: "NDPS Act 1985, section 64A — immunity from prosecution for volunteering for treatment.",
            source: "Bare Act text, Section 64A, Narcotic Drugs and Psychotropic Substances Act, 1985",
            url: "https://indiankanoon.org/doc/1226122/",
            note: "Quoted in full above. Everything on the What happens page is a restatement of it."
          },
          {
            claim: "JJ Act 2015, section 2(14)(ix) — a child found vulnerable and likely to be inducted into drug abuse or trafficking is a child in need of care and protection.",
            source: "Section 2, Juvenile Justice (Care and Protection of Children) Act, 2015",
            url: "https://indiankanoon.org/doc/106619443/",
            note: "Quoted verbatim by the Supreme Court in Bachpan Bachao Andolan v. Union of India, 14 December 2016."
          },
          {
            claim: "JJ Act 2015, section 77 — giving a child liquor, a narcotic drug, a tobacco product or a psychotropic substance carries rigorous imprisonment up to seven years and a fine up to one lakh rupees.",
            source: "Section 77, Juvenile Justice (Care and Protection of Children) Act, 2015",
            url: "https://indiankanoon.org/doc/9677640/",
            note: "Section 78, on the same page, covers using a child to carry, supply or peddle those things."
          },
          {
            claim: "Legal Services Authorities Act 1987, section 12(c) — a woman or a child who has to file or defend a case is entitled to free legal services.",
            source: "Section 12, Legal Services Authorities Act, 1987",
            url: "https://indiankanoon.org/doc/81155499/",
            note: "Read the opening line as well as clause (c): the entitlement is framed around a person who has to file or defend a case."
          }
        ]
      },
      {
        id: "numbers",
        title: "The numbers",
        rows: [
          {
            claim: "15100 is NALSA’s free legal-services helpline.",
            source: "National Legal Services Authority",
            url: "https://nalsa.gov.in/",
            note: "There is also a District Legal Services Authority in every district."
          },
          {
            claim: "112 is one national number for police, health and fire emergencies.",
            source: "Emergency Response Support System (ERSS), Ministry of Home Affairs",
            url: "https://www.mha.gov.in/en/commoncontent/emergency-response-support-system-erss",
            note: ""
          },
          {
            claim: "108 is the emergency ambulance line, for critical care, trauma and accidents.",
            source: "Emergency Response Service, National Health Mission",
            url: "https://nhm.gov.in/index1.php?lang=1&level=2&sublinkid=1217&lid=189",
            note: "Tamil Nadu has run it through EMRI since 15 September 2008."
          },
          {
            claim: "14446 is the national drug de-addiction helpline, and its menu has a counsellor on option 1.",
            source: "Ministry of Social Justice and Empowerment, under Nasha Mukt Bharat Abhiyaan",
            url: "https://nmba.dosje.gov.in/toll-free",
            note: "Not read directly: the site returned an expired TLS certificate. Corroborated from the ministry’s own account. Confirm by dialling before you rely on it."
          },
          {
            claim: "14416 is Tele-MANAS, and it is available in Tamil and Hindi.",
            source: "National Tele Mental Health Programme, Ministry of Health and Family Welfare",
            url: "https://telemanas.mohfw.gov.in/",
            note: ""
          },
          {
            claim: "1098 is the childline for a child in distress.",
            source: "Ministry of Women and Child Development",
            url: "https://childlineindia.org/",
            note: "The weakest citation on this page, flagged rather than dressed up. It is here only for the case it is for, and never as the answer to a medical emergency."
          }
        ]
      },
      {
        id: "places",
        title: "The counts and the campaigns",
        rows: [
          {
            claim: "The current facility counts — 344 IRCA, 155 ATF, 145 DDAC, 76 ODIC, 45 CPLI, 765 in total — and the campaign reach of 29.68 crore, of whom 11.43 crore are described as youth.",
            source: "PIB Release 2288262, Ministry of Social Justice and Empowerment, 23 July 2026 — a written reply in Parliament",
            url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2288262",
            note: "Read from the release, word for word. It also publishes no recovery rate, no completion rate and no discharge outcome, and neither does any other government source this site could find — so none is claimed anywhere on it."
          },
          {
            claim: "The earlier counts — 342 IRCA, 83 ATF, 74 ODIC, 53 DDAC, 47 CPLI, 599 in total — as they stood in February 2024.",
            source: "PIB Release 2010097, Ministry of Social Justice and Empowerment, February 2024",
            url: "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2010097",
            note: "Kept rather than replaced. The site printed these until Round 33 and the chart on /where-to-go shows them beside the current ones, because the change between the two is the more useful fact."
          },
          {
            claim: "Nasha Mukt Bharat Abhiyaan runs in every district in India.",
            source: "Ministry of Social Justice and Empowerment, Nasha Mukt Bharat Abhiyaan",
            url: "https://socialjustice.gov.in/common/52569",
            note: "Extended from the original 272 districts to all of them on 15 August 2023. That date, and not February 2024, is the one attached to the figure on the campaign page."
          }
        ]
      },
      {
        id: "safety",
        title: "The safety page",
        rows: [
          {
            claim: "Starting again after a stretch of not using is among the most common ways an overdose happens, and so is mixing with things that slow breathing.",
            source: "World Health Organization, opioid overdose fact sheet",
            url: "https://www.who.int/news-room/fact-sheets/detail/opioid-overdose",
            note: "The WHO list names resumption after a period of abstinence, and combination with other substances that suppress breathing."
          },
          {
            claim: "Frightening people does not stop them using, and can stop them asking for help.",
            source: "Shatterproof, on scare tactics in drug prevention",
            url: "https://www.shatterproof.org/blog/scare-tactics-wont-work-drug-prevention-heres-why",
            note: "This is why there is not a single frightening photograph on this site."
          }
        ]
      }
    ],
    /* Round 31: the three blocks below are rendered on /in-more-detail
       now, not on /sources. They stay in `sources` because they are still
       the sources page`s material — the other page is where it is SET. */
    imageryLabel: "About the pictures",
    imagery: "Five pictures on this site are real photographs, and every other image and clip was generated for it. The six are the ones that show something you can check: the Act itself, two Government of India campaign events, and two government health centres. They are listed below with the photographer and the licence. Everywhere else the captions describe what is in the frame rather than naming a place, because a made picture captioned as a real street would be exactly the kind of small untruth this page exists to make impossible.",
    /* Round 32. Attribution is a licence condition on four of the six and a
       habit worth keeping on all of them. It is printed here rather than
       only in docs/LICENCES.md because this site tells a reader to check
       things from the page they are standing on. */
    photoLabel: "Where the five photographs came from",
    photos: [
      {
        what: "The Narcotic Drugs and Psychotropic Substances Act, 1985, page one, as passed.",
        who: "Parliament of India, via the Internet Archive",
        licence: "Public domain — an edict of government",
        url: "https://commons.wikimedia.org/wiki/File:Narcotic_Drugs_and_Psychotropic_Substances_Act_(India)_1985.djvu"
      },
      {
        what: "The World Drug Day run flagged off by the Narcotics Control Bureau, New Delhi, 26 June 2010.",
        who: "Press Information Bureau, Government of India",
        licence: "Government Open Data License — India",
        url: "https://commons.wikimedia.org/wiki/File:The_people_participating_in_the_run_against_Drug_Abuse_on_the_%E2%80%9CInternational_Day_against_Drug_Abuse_and_Illicit_Trafficking,%E2%80%9D_organized_by_Narcotics_Control_Bureau,_in_New_Delhi_on_June_26,_2010.jpg"
      },
      {
        what: "The mass run against drug abuse at India Gate, New Delhi, 26 June 2011.",
        who: "Press Information Bureau, Government of India",
        licence: "Government Open Data License — India",
        url: "https://commons.wikimedia.org/wiki/File:A_Mass_Run_against_Drug_Abuse,_on_the_occasion_of_the_International_Day_Against_Drug_Abuse_and_Illicit_Trafficking,_at_India_Gate,_in_New_Delhi_on_June_26,_2011.jpg"
      },
      {
        what: "The Government Primary Health Centre at Masinagudi, the Nilgiris, Tamil Nadu.",
        who: "Timothy A. Gonsalves",
        licence: "CC BY-SA 4.0",
        url: "https://commons.wikimedia.org/wiki/File:Public_Health_Centre_Masinagudi_Jun23_A7C_05219.jpg"
      },
      {
        what: "The Primary Health Centre at Sasapasi, Dhenkanal, Odisha.",
        who: "Biswarup Ganguly",
        licence: "CC BY 3.0",
        url: "https://commons.wikimedia.org/wiki/File:Primary_Health_Centre_-_Sasapasi_-_Dhenkanal_2018-01-25_9706.JPG"
      }
    ],
    photoNote: "Three of the five require attribution as a condition of their licence, so it is given here and the derivative crops on this site carry the same terms. Two photographs that were found and would have fitted are deliberately not used: one shows schoolchildren under a banner naming their school, and one carries placards telling readers that drugs will kill them — which is the approach the last row of the table above exists to rule out.",
    unknownLabel: "And here is what this site does not know",
    unknown: [
      "Whether a particular counsellor, at a particular centre, on a particular day, would tell your parents. It varies by your age, your state and the service, and anyone who gives you a single answer on a website is guessing.",
      "What 14446 does with the number you call from, or whether it really answers at three in the morning. Neither is published anywhere this site could read, so neither is claimed here. The round-the-clock line above is the Ministry describing it, marked as a claim.",
      "Whether 14446 will answer you in Tamil. Tele-MANAS on 14416 publishes its language list and Tamil is on it; 14446 does not publish one.",
      "Whether the February 2024 counts are still current. Check the ministry page before you quote them at anybody.",
      /* Moved out of the ledger rows in Round 28, when those rows were cut
         back to a source and a link. Both are doubts about a citation, not
         descriptions of one, and this is the list of doubts. */
      "Whether the toll-free page for 14446 says what this site says it says. The ministry host returned an expired TLS certificate, so it was never read directly — the number is corroborated from the ministry’s own account. Dial it before you rely on it.",
      "Whether 1098 is the right number for your situation. It is the weakest citation on this page and it is flagged rather than dressed up: it is here only for the case it is for, and never as the answer to a medical emergency.",
      "Whether treatment works, and for how many. The Ministry publishes how many centres it funds, how many people the campaign has reached and how many volunteers signed up. It publishes no completion rate, no recovery rate and no discharge outcome, and no other government page this site could find publishes one either. So there is no such number anywhere on this site.",
      "Which number is current. The Ministry promotes 14446. The National Institute of Social Defence, also a Government of India body, still lists the helpline as 1800-11-0031. This site publishes 14446 because that is the one being promoted, and tells you about the other because you should not have to find it out on your own."
    ],
    note: "If something on this site is wrong, it should be possible to prove it wrong from this page, without asking anybody. That is the point of the page. It was built by a school student and it will have mistakes in it, and the honest response to that is to make them findable rather than to sound more certain."
  },
  /* ── /credits ─────────────────────────────────────────────────────────
       Read the note beside this block in types.ts before editing a word of
       it. Every fact about the fest comes off the official deck; nothing
       here is estimated, rounded or remembered.
  
       One author. Round 43, at the owner's direction: this is a solo project,
       and the page credits one person. */
  credits: {
    eyebrow: "STOGO Fest 2026-27 · Stream 02, Substance Safety",
    title: "Who made this, and why.",
    lede: "This is a school project, and the only page here that is about me instead of about you. That is why it is last — there is nothing on it you need.",
    peopleLabel: "Who made it",
    peopleTitle: "One student, on his own.",
    person: {
      name: "Badriprasath K.V",
      stem: "badri",
      alt: "Badriprasath K.V, photographed on the steps of a temple tank.",
      what: "Maker of this website",
      role: [
        "Every page of this site was built by one Grade 8 student in Erode, for a stream that could have been answered with a poster. It was answered with nine pages instead, and every claim on them is linked to where it came from."
      ],
      facts: [
        { k: "Class", v: "VIII-B" },
        { k: "School", v: "Amrita Vidyalayam" },
        { k: "City", v: "Erode, Tamil Nadu" },
        { k: "Entry", v: "STOGO Fest 2026-27" }
      ]
    },
    /* The numbers are counted from the site at build time by credits.astro,
       never typed here, so they cannot drift from what is actually on it. */
    stats: {
      pages: "pages",
      sources: "sources, every one linked",
      photos: "photographs, every one credited"
    },
    festLabel: "What it was made for",
    festTitle: "STOGO Fest V4.0",
    festBody: [
      "STOGO Fest is a school festival that runs to a national and then an international round. This year its theme is Reboot: The Rhythm of Life, and every entry sits inside one of three streams. I took Substance Safety — a stream that could be answered with a poster telling you not to, which has been tried on all of us for years. So I answered it with this instead."
    ],
    fest: [
      { k: "Theme", v: "Reboot: The Rhythm of Life" },
      { k: "Stream", v: "02 — Substance Safety" },
      { k: "Track", v: "01 — Working Model" },
      { k: "Category", v: "2 — Grades 7 to 9" },
      { k: "National round", v: "25 November 2026" },
      { k: "International round", v: "14 January 2027" }
    ],
    festLink: "stogofest.com"
  },
  footer: {
    about: "This site is for the person who is using. Not for anybody watching them.",
    /* Rendered on /in-more-detail only. It sat in the footer of every page
       until Round 26 \u2014 "Erode, Grade 8" narrows the author to about four
       schools, which is credibility to a judge and an identification to
       anybody else holding the reader\u2019s phone. */
    builtBy: "Built by a Grade 8 student in Erode, Tamil Nadu, for STOGO FEST 2026‑27, stream 02 — Substance Safety.",
    sources: "Where everything here comes from",
    notMedical: "This is not medical advice and it is not legal advice. If someone is in danger right now, call 112, or 108 for an ambulance."
  },
  /* ── blocks ────────────────────────────────────────────────────────────
     One entry per block placed by the editor. The key matches the section id
     written into the page, so a block and its words cannot drift apart. */
  blocks: {
    words: {
      eyebrow: "A short label",
      title: "The heading goes here",
      body: "And the words go here. Click any of this to change it. Keep it to a few sentences — a block that runs longer than a screen stops being a block and starts being a page."
    }
  }
};

const LOCALE_TAG = "en-IN";
const WORDMARK = "अभी भी वक़्त है";
const WORDMARK_LANG = "hi";
const STATUTE_64A = "Any addict, who is charged with an offence punishable under section 27 or with offences involving small quantity of narcotic drugs or psychotropic substances, who voluntarily seeks to undergo medical treatment for de-addiction from a hospital or an institution maintained or recognised by the Government or a local authority and undergoes such treatment shall not be liable to prosecution under section 27 or under any other section for offences involving small quantity of narcotic drugs or psychotropic substances: Provided that the said immunity from prosecution may be withdrawn if the addict does not undergo the complete treatment for de-addiction.";
const STATUTE_64A_TITLE = "Immunity from prosecution to addicts volunteering for treatment.";
const STATUTE_64A_URL = "https://indiankanoon.org/doc/1226122/";

function t() {
  return en;
}
function url(page = "") {
  const clean = page.replace(/^\/+|\/+$/g, "");
  return clean ? `/${clean}.html` : "/";
}

const $$Astro$1 = createAstro("https://abhi-bhi-waqt-hai.github.io");
const $$HelpBar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$HelpBar;
  const { d } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="helpbar no-print" data-astro-cid-hwho3arm> <details class="help" name="site-overlay" data-astro-cid-hwho3arm> <summary class="help__toggle" data-astro-cid-hwho3arm> <svg class="help__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" data-astro-cid-hwho3arm> <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.22 2.21Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-astro-cid-hwho3arm></path> </svg> <span class="help__label" data-astro-cid-hwho3arm>${d.help.bar}</span> <svg class="help__chev" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" data-astro-cid-hwho3arm> <path d="m6 15 6-6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-hwho3arm></path> </svg> </summary>  <div class="help__panel" data-lenis-prevent data-astro-cid-hwho3arm> <h2 class="help__heading" data-astro-cid-hwho3arm>${d.help.heading}</h2> <p class="help__intro" data-astro-cid-hwho3arm>${d.help.intro}</p> <div class="emg" data-astro-cid-hwho3arm> <p class="emg__k" data-astro-cid-hwho3arm>${d.help.emergencyLabel}</p> <ul class="emg__list" role="list" data-astro-cid-hwho3arm> ${d.help.emergency.map((e) => renderTemplate`<li class="emg__item" data-astro-cid-hwho3arm> <a class="emg__num"${addAttribute(`tel:${e.number}`, "href")} data-astro-cid-hwho3arm>${e.number}</a> <span class="emg__meta" data-astro-cid-hwho3arm> <span class="emg__name" data-astro-cid-hwho3arm>${e.name}</span> <span class="emg__what" data-astro-cid-hwho3arm>${e.what}</span> </span> </li>`)} </ul> </div> <ul class="help__list" role="list" data-astro-cid-hwho3arm> ${d.help.lines.map((line) => renderTemplate`<li class="help__item" data-astro-cid-hwho3arm> <a class="help__num"${addAttribute(`tel:${line.number}`, "href")} data-astro-cid-hwho3arm> <span class="help__digits" data-astro-cid-hwho3arm>${line.number}</span> <span class="help__call" aria-hidden="true" data-astro-cid-hwho3arm> <svg viewBox="0 0 24 24" width="16" height="16" data-astro-cid-hwho3arm> <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.22 2.21Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" data-astro-cid-hwho3arm></path> </svg> </span> </a> <div class="help__meta" data-astro-cid-hwho3arm> <span class="help__name" data-astro-cid-hwho3arm>${line.name}</span> <span class="help__who" data-astro-cid-hwho3arm>${line.who}</span> <span class="help__hours" data-astro-cid-hwho3arm>${line.hours}</span> <span class="help__for" data-astro-cid-hwho3arm>${line.forWhom}</span> </div> </li>`)} </ul> <p class="help__dial" data-astro-cid-hwho3arm>${d.help.dialNote}</p> </div> </details> </div> `;
}, "E:/Claude Project/Websites/reboot/src/components/HelpBar.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://abhi-bhi-waqt-hai.github.io");
const $$Base = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Base;
  const {
    page = "",
    title,
    description,
    ground = "ink"
  } = Astro2.props;
  const d = t();
  const pageTitle = title ? `${title} \xB7 ${d.meta.title}` : `${d.meta.title} \u2014 ${d.meta.tagline}`;
  const pageDesc = description ?? d.meta.description;
  const home = url();
  const SECTIONS = [
    /* Home FIRST. url("") is "/", and on the home page this entry carries
     is-here and aria-current the same way every other one does. The brand
     wordmark still links home and is still hidden on the home page; the two
     are for two different readers and neither costs a row of height. */
    { slug: "", label: d.nav.home },
    /* /right-now is FIRST, ahead of the law and the programmes. Round 22: the
     site had no content at all for the next ten minutes, and its only
     emergency instruction pointed a medical emergency at a child-protection
     line. A reader who needs that page needs it before anything else, so it
     is not buried in position four out of six. */
    { slug: "right-now", label: d.nav.rightNow },
    { slug: "what-happens", label: d.nav.whatHappens },
    /* Round 23: /where-to-go moved ahead of /campaigns. A reader deciding
     whether to ask for help wants the places before the programmes that
     funded them; the programmes are context, and context does not outrank
     an address. */
    { slug: "where-to-go", label: d.nav.whereToGo },
    { slug: "campaigns", label: d.nav.campaigns },
    /* And /sources LAST, because it is the page you go to in order to disagree
         with the other five. Four separate strings on this site told the reader to
         read it there; until Round 22 there was nowhere to go.
    
         /the-words was removed in Round 26 and this array went from six entries
         to five. If a docblock above still says "four destinations", it was
         already stale before that. */
    { slug: "sources", label: d.nav.sources },
    /* And the number LAST in the list but reachable from every page, because
     it is not part of the argument — it is the thing the argument is for.
     Round 30 moved it off the foot of the home page and onto its own route;
     the masthead is now how a reader who does not want to read anything
     finds it, alongside the fixed help bar. */
    { slug: "the-number", label: d.nav.theNumber },
    /* Round 35, and LAST, after the number. The owner asked for a credits
     page in this bar. It goes at the end because every other entry in this
     array is a promise that there is somewhere worth going FOR THE READER,
     and this one is the single exception: it is about the people who made
     the site. A reader who opens this at one in the morning is not looking
     for it, and the ordering of everything above has been argued for six
     rounds on exactly that principle. */
    { slug: "credits", label: d.nav.credits }
  ];
  return renderTemplate(_a || (_a = __template(["<html", "", ' data-astro-cid-5hce7sga> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>', '</title><meta name="description"', '><meta name="referrer" content="no-referrer"><link rel="preload" href="/fonts/anek-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/noto-devanagari.woff2" as="font" type="font/woff2" crossorigin><meta property="og:type" content="website"><meta property="og:site_name"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:locale" content="en_IN"><meta name="twitter:card" content="summary"><meta name="color-scheme" content="dark"><meta name="theme-color" content="#0B0A08"><meta name="referrer" content="no-referrer"><script src="/sc-boot.js"><\/script><link rel="icon"', ' type="image/svg+xml"><link rel="canonical"', ">", "", "</head> <body data-astro-cid-5hce7sga>  ", '  <div class="curlight" aria-hidden="true" data-astro-cid-5hce7sga></div> <a class="skip" href="#main" data-astro-cid-5hce7sga>Skip to the main content</a>  <button class="exit no-print" type="button" data-quick-exit', "", ' data-astro-cid-5hce7sga> <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" data-astro-cid-5hce7sga> <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M9 16l-4-4 4-4M5 12h11" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5hce7sga></path> </svg> <span data-astro-cid-5hce7sga>', '</span> </button> <header class="mast no-print" data-astro-cid-5hce7sga> <div class="mast__in wrap-full" data-astro-cid-5hce7sga>  ', ' <nav class="mast__nav"', ' data-astro-cid-5hce7sga>  <ul role="list" data-lenis-prevent-horizontal data-astro-cid-5hce7sga> ', ' </ul> </nav> </div> </header> <main id="main" data-astro-cid-5hce7sga> ', ' </main> <footer class="foot" data-astro-cid-5hce7sga> <div class="foot__in wrap-full" data-astro-cid-5hce7sga> <p class="foot__med" data-astro-cid-5hce7sga>', '</p> <p class="foot__about" data-astro-cid-5hce7sga>', '</p>  <p class="foot__sources" data-astro-cid-5hce7sga> <a', " data-astro-cid-5hce7sga>", '</a> </p> <p class="foot__exit no-print" data-astro-cid-5hce7sga>', "</p> </div> </footer> ", ' <script src="/site.js" defer><\/script>  <script src="/scrollcraft.js" defer><\/script> <script src="/sc-mount.js" defer><\/script> ', "  </body> </html>"])), addAttribute(LOCALE_TAG, "lang"), addAttribute(ground === "paper" ? "paper" : void 0, "data-ground"), pageTitle, addAttribute(pageDesc, "content"), addAttribute(d.meta.title, "content"), addAttribute(d.meta.shareTitle, "content"), addAttribute(d.meta.shareDesc, "content"), addAttribute("/favicon.svg", "href"), addAttribute(new URL(url(page), Astro2.site).href, "href"), renderSlot($$result, $$slots["head"]), renderHead(), page && renderTemplate`<div class="journey no-print" data-sc-progress aria-hidden="true" data-astro-cid-5hce7sga></div>`, addAttribute(d.help.exit, "aria-label"), addAttribute(d.help.exitHint, "title"), d.help.exit, page && renderTemplate`<a class="brand"${addAttribute(home, "href")} data-astro-cid-5hce7sga> <span class="brand__name"${addAttribute(WORDMARK_LANG, "lang")} data-astro-cid-5hce7sga> ${WORDMARK} </span> <span class="brand__tag" data-astro-cid-5hce7sga>${d.meta.tagline}</span> </a>`, addAttribute(d.nav.sections, "aria-label"), SECTIONS.map((sec) => renderTemplate`<li data-astro-cid-5hce7sga> <a${addAttribute([
    "mast__link",
    { "is-here": sec.slug === page }
  ], "class:list")}${addAttribute(url(sec.slug), "href")}${addAttribute(
    sec.slug === page ? "page" : void 0,
    "aria-current"
  )} data-astro-cid-5hce7sga> ${sec.label} </a> </li>`), renderSlot($$result, $$slots["default"]), d.footer.notMedical, d.footer.about, addAttribute(url("sources"), "href"), d.footer.sources, d.help.exitHint, renderComponent($$result, "HelpBar", $$HelpBar, { "d": d, "data-astro-cid-5hce7sga": true }), renderScript($$result, "E:/Claude Project/Websites/reboot/src/layouts/Base.astro?astro&type=script&index=0&lang.ts"));
}, "E:/Claude Project/Websites/reboot/src/layouts/Base.astro", void 0);

export { $$Base as $, STATUTE_64A_TITLE as S, WORDMARK as W, WORDMARK_LANG as a, STATUTE_64A as b, STATUTE_64A_URL as c, t, url as u };
