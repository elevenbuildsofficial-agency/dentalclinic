/** Rebrand here. All contact data, colors, clinicians, treatments and prices live in this file. */
export const clinic = {
  name: 'Marlowe Dental Studio',
  shortName: 'marlowe',
  logo: '/images/marlowe-mark.svg',
  tagline: 'Modern dentistry. More personal care.',
  description:
    'Thoughtful general, restorative and cosmetic dentistry in a calmer kind of studio. Meet Marlowe, a fictional Brooklyn dental practice.',
  siteUrl: 'https://marlowe.example',
  demo: true,
  foundingYear: 2014,
  colors: {
    porcelain: '#F7FAF9',
    white: '#FFFFFF',
    ink: '#0B2B33',
    teal: '#0E7C86',
    mist: '#CDEBEA',
    mint: '#8FD8C4',
    sand: '#EFE6DA',
    forest: '#143F3B',
    warm: '#F5F3ED',
    'soft-green': '#E6EEE6',
  },
  phone: '+1 (347) 555-0148',
  phoneHref: '+13475550148',
  whatsapp: '13475550148',
  email: 'hello@marlowe.example',
  address: {
    street: '77 Marlowe Street',
    city: 'Brooklyn',
    region: 'NY',
    postcode: '11201',
    country: 'US',
    area: 'Brooklyn, New York',
  },
  timezone: 'America/New_York',
  hours: [
    { day: 'Sunday', open: '', close: '' },
    { day: 'Monday', open: '08:00', close: '18:00' },
    { day: 'Tuesday', open: '08:00', close: '18:00' },
    { day: 'Wednesday', open: '08:00', close: '18:00' },
    { day: 'Thursday', open: '08:00', close: '19:00' },
    { day: 'Friday', open: '08:00', close: '16:00' },
    { day: 'Saturday', open: '09:00', close: '14:00' },
  ],
  social: [
    { label: 'Instagram', url: 'https://www.instagram.com/' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
  ],
  stats: [
    { value: '4.9', label: 'out of 5, patient rating', suffix: '' },
    { value: '12', label: 'years of thoughtful care', suffix: '+' },
    { value: '3200', label: 'smiles, and counting', suffix: '+' },
  ],
  doctors: [
    {
      slug: 'elena-marlowe',
      name: 'Dr. Elena Marlowe',
      role: 'Founder · General & Cosmetic Dentist',
      credentials: 'DDS · New York University',
      specialty: 'Restorative care, veneers & nervous patients',
      image: '/images/team-v2.webp',
      imageLayout: 'triptych',
      imageOffset: '0%',
      imagePosition: '0% 50%',
      quote: 'Good dentistry starts with a conversation, not a treatment plan.',
      bio: 'Elena imagined a practice where the first appointment felt like a fresh start. Her approach pairs carefully planned restorative work with an unhurried conversation about what matters to you. She has a particular interest in preserving natural tooth structure and making space for people who have put off care.',
      detail:
        'Outside the studio, you will usually find her at a pottery wheel or walking along the waterfront with her family.',
    },
    {
      slug: 'james-park',
      name: 'Dr. James Park',
      role: 'General Dentist · Aligner Care',
      credentials: 'DMD · University of Pennsylvania',
      specialty: 'Clear aligners, prevention & digital planning',
      image: '/images/team-v2.webp',
      imageLayout: 'triptych',
      imageOffset: '-100%',
      imagePosition: '50% 50%',
      quote: 'Small, considered changes can make an everyday difference.',
      bio: 'James enjoys turning complex questions into understandable choices. He takes a measured approach to aligner care, looking at gum health, bite and long-term maintenance before discussing the appearance of a smile.',
      detail:
        'A patient teacher and enthusiastic home cook, James brings the same attention to detail to a consultation as he does to a new recipe.',
    },
    {
      slug: 'sofia-rivera',
      name: 'Dr. Sofia Rivera',
      role: 'General Dentist · Family Care',
      credentials: 'DDS · Columbia University',
      specialty: 'Children, gentle visits & preventive dentistry',
      image: '/images/team-v2.webp',
      imageLayout: 'triptych',
      imageOffset: '-200%',
      imagePosition: '100% 50%',
      quote: 'A child’s first visit should leave room for curiosity.',
      bio: 'Sofia builds trust one small step at a time. Her family appointments are shaped around explanation, familiarity and practical habits that fit real life. Children can meet the instruments, ask questions and take a pause whenever they need.',
      detail:
        'Away from the clinic, Sofia volunteers at community reading sessions and explores the neighborhood’s independent bookstores.',
    },
  ],
  prices: {
    newPatient: '$185–$275',
    cleaning: '$120–$220',
    emergency: '$95–$180',
    financing: 'Illustrative 6–12 month payment plans',
    note: 'Illustrative USD ranges. Examination, imaging, additional treatment and eligibility may change the total. A written estimate always comes first.',
  },
  insurance: ['Delta Dental', 'Aetna', 'Cigna', 'MetLife', 'Guardian', 'UnitedHealthcare'],
};

export const services = [
  {
    slug: 'dental-implants',
    name: 'Dental Implants',
    short: 'A steadier foundation.',
    category: 'Restore',
    number: '01',
    icon: 'implant',
    price: '$3,500–$6,000',
    duration: 'Several visits over 3–9 months',
    description:
      'A carefully planned replacement for a missing tooth, designed around the way you eat, speak and smile.',
    forWho:
      'Adults with one or more missing teeth, healthy gums and suitable bone support. An examination and imaging help determine whether an implant is appropriate.',
    procedure: [
      'Understand the whole picture with an examination and digital imaging.',
      'Plan the implant position and discuss the full estimate, alternatives and healing stages.',
      'Place the implant under local anesthetic, allowing time for the bone to heal around it.',
      'Fit a custom-made crown once the implant is ready, then check the bite and ongoing care.',
    ],
    aftercare:
      'Follow your clinician’s individual instructions, attend review visits and keep up careful brushing and interdental cleaning. Smoking can affect healing and implant health.',
    faq: [
      [
        'Is an implant right for everyone?',
        'No. Gum health, bone support, medical history and habits all matter. A bridge or removable replacement may be a better fit.',
      ],
      [
        'Does the price include the crown?',
        'This demo range represents an uncomplicated single implant and crown. Grafting, imaging and complex care require a separate estimate.',
      ],
    ],
  },
  {
    slug: 'clear-aligners',
    name: 'Clear Aligners',
    short: 'Small shifts. Real confidence.',
    category: 'Align',
    number: '02',
    icon: 'aligner',
    price: '$3,000–$6,500',
    duration: 'Typically 6–18 months; individual plans vary',
    description:
      'Discreet, removable aligners with a considered plan and a dentist keeping an eye on the details.',
    forWho:
      'People with mild to moderate spacing, crowding or certain bite concerns. Suitability depends on a full dental assessment, rather than appearance alone.',
    procedure: [
      'Start with a dental health check and digital scan.',
      'Review the proposed movements, limits and likely treatment length together.',
      'Wear each set of custom aligners according to your clinician’s instructions.',
      'Return for progress checks and finish with a retainer plan.',
    ],
    aftercare:
      'Clean aligners as directed, remove them for meals and drinks other than water, and follow your agreed wear schedule. Retainers help maintain the result after active treatment.',
    faq: [
      [
        'Can I take them out?',
        'Yes, for meals and cleaning. Consistent wear as prescribed is essential to keeping treatment on track.',
      ],
      [
        'Will I need a retainer?',
        'Usually, yes. Your dentist will explain a retention plan because teeth can move after treatment.',
      ],
    ],
  },
  {
    slug: 'teeth-whitening',
    name: 'Teeth Whitening',
    short: 'Your smile, a little brighter.',
    category: 'Brighten',
    number: '03',
    icon: 'sparkle',
    price: '$350–$650',
    duration: 'A consultation, then a tailored whitening course',
    description:
      'A brighter shade, thoughtfully chosen. Professional whitening that begins with the health of your teeth.',
    forWho:
      'Adults with healthy teeth and gums who would like to reduce natural tooth staining. Crowns, fillings and veneers do not whiten like natural teeth.',
    procedure: [
      'Check oral health and discuss the shade change you hope for.',
      'Record your starting shade and choose a suitable supervised option.',
      'Use fitted trays or an in-studio system as prescribed.',
      'Review comfort, results and realistic maintenance.',
    ],
    aftercare:
      'Temporary sensitivity can occur. Use products only as directed and contact the clinic if discomfort continues. Keep up your regular dental hygiene and discuss any top-ups before repeating treatment.',
    faq: [
      [
        'Will it make my teeth sensitive?',
        'Temporary sensitivity can happen. Your dentist can adjust the plan or recommend a pause if needed.',
      ],
      [
        'Will whitening change a crown?',
        'No. Existing restorations keep their color, so we discuss this before starting.',
      ],
    ],
  },
  {
    slug: 'root-canal',
    name: 'Root Canal',
    short: 'Relief, with a plan.',
    category: 'Restore',
    number: '04',
    icon: 'tooth',
    price: '$850–$1,600',
    duration: 'Often 2 or more treatment visits',
    description:
      'Treating infection inside a tooth with patience, precision and a focus on keeping your natural tooth.',
    forWho:
      'People whose dental examination shows inflammation or infection within the pulp of a tooth. Assessment determines whether the tooth can be restored.',
    procedure: [
      'Examine the tooth and take the imaging needed to understand the problem.',
      'Numb the area and isolate the tooth before treatment.',
      'Clean and shape the root canals, then seal the space.',
      'Restore and protect the tooth; some teeth need a crown afterwards.',
    ],
    aftercare:
      'Avoid biting hard foods on the tooth until its final restoration is complete. Follow the care instructions you receive and contact the clinic about increasing pain, swelling or a returning symptom.',
    faq: [
      [
        'Is treatment painful?',
        'Local anesthetic is used for comfort. Tell your dentist if you feel discomfort so the approach can be adjusted.',
      ],
      [
        'Will I need a crown?',
        'Some teeth do, especially back teeth with substantial loss of structure. Your dentist will discuss this separately.',
      ],
    ],
  },
  {
    slug: 'veneers-and-cosmetic',
    name: 'Veneers & Cosmetic',
    short: 'Still unmistakably you.',
    category: 'Refine',
    number: '05',
    icon: 'smile',
    price: '$1,200–$2,200 per veneer',
    duration: 'Usually 2–3 visits after planning',
    description:
      'Subtle refinements to shape, proportion and color, guided by your features and a less-is-more philosophy.',
    forWho:
      'People considering a change to tooth shape, chips or color after oral health has been assessed. We discuss bonding, whitening and orthodontic options before veneers.',
    procedure: [
      'Talk about the changes you want and assess your teeth and gums.',
      'Explore alternatives, photographs and a proposed design.',
      'Prepare and scan teeth if veneers are chosen; preparation may be irreversible.',
      'Fit the final restorations, refine the bite and arrange a review.',
    ],
    aftercare:
      'Keep up brushing and interdental cleaning, avoid using teeth to open packaging, and attend regular reviews. A night guard may be recommended for clenching or grinding.',
    faq: [
      [
        'Do veneers require tooth preparation?',
        'Often they do, and that change may be irreversible. We explain how much preparation is proposed and why.',
      ],
      [
        'Are there less invasive options?',
        'Sometimes. Bonding, whitening or aligners may achieve your goals with less tooth preparation.',
      ],
    ],
  },
  {
    slug: 'kids-dentistry',
    name: 'Kids’ Dentistry',
    short: 'Big care for little teeth.',
    category: 'Prevent',
    number: '06',
    icon: 'heart',
    price: '$95–$180',
    duration: 'Around 30–45 minutes for a routine visit',
    description:
      'An easy introduction to the dentist, with familiar faces, small steps and time to ask every question.',
    forWho:
      'Children and their parents looking for regular check-ups, preventive support or a gentle first introduction to dental care.',
    procedure: [
      'Let your child get to know the room and the team.',
      'Check the teeth, gums and development at a pace they can manage.',
      'Discuss brushing, snacks and suitable preventive care.',
      'Agree the next visit and any care that needs more time.',
    ],
    aftercare:
      'Support twice-daily brushing with an age-appropriate fluoride toothpaste and the advice given by your dentist. Build regular appointments into your child’s routine.',
    faq: [
      [
        'Can I stay with my child?',
        'Yes. We discuss what helps your child feel safe and comfortable before we begin.',
      ],
      [
        'What if my child feels nervous?',
        'We take it slowly, explain each step and agree a pause signal. A first visit can simply be a chance to get familiar.',
      ],
    ],
  },
];

export const faqs = [
  [
    'I haven’t been to the dentist in years. Is that okay?',
    'Absolutely. There is no lecture waiting for you here. We start by listening, take a look at your oral health and agree on the next step together.',
  ],
  [
    'What happens at my first appointment?',
    'Allow around an hour for a conversation, a dental and gum assessment, and any imaging that is clinically needed. You leave with a clear plan and a written estimate before deciding on treatment.',
  ],
  [
    'Do you accept my insurance?',
    'This showcase includes sample insurance partners. At a real clinic, the team would verify your plan, benefits and expected out-of-pocket costs before treatment.',
  ],
  [
    'Can you help if I feel anxious?',
    'Tell us when you book. We can allow extra time, explain each step and agree a simple signal to pause. You are always part of the decision.',
  ],
  [
    'Can I spread the cost of treatment?',
    'The demo illustrates payment plans. In practice, availability, eligibility, interest and total repayment would be clearly explained before you agree.',
  ],
  [
    'Do you see children?',
    'Yes. Our fictional family care team offers gentle introductions, regular checks and preventive advice at a child-friendly pace.',
  ],
  [
    'What if I have a dental emergency?',
    'Contact a real local dental provider promptly. Severe swelling affecting breathing or swallowing, uncontrolled bleeding or a serious facial injury needs emergency medical care.',
  ],
  [
    'Can I book online?',
    'You can try the complete demo booking flow. It creates an on-screen preview only; it does not reserve a time or send your personal details.',
  ],
];

export const stories = [
  {
    name: 'Amelia R.',
    type: 'Clear aligners',
    quote:
      'For the first time, I understood every step before we started. That made all the difference.',
    detail: 'A plan that fitted around work, with regular check-ins and room to ask questions.',
  },
  {
    name: 'Marcus T.',
    type: 'A fresh start',
    quote:
      'I had put off an appointment for six years. There was no judgment. Just a conversation and a sensible place to begin.',
    detail: 'An unhurried first visit and a phased care plan, with each cost explained in advance.',
  },
  {
    name: 'Nina L.',
    type: 'Family dentistry',
    quote:
      'My daughter asked when we could come back. I wasn’t expecting that after a trip to the dentist.',
    detail:
      'A gentle introduction to the chair, the mirror and the familiar faces at the next visit.',
  },
];

export const articles = [
  {
    slug: 'a-calmer-first-visit',
    category: 'Your first visit',
    title: 'A calmer first visit starts before the chair.',
    excerpt: 'What to tell your dentist, what to bring, and why it is okay to ask for a pause.',
    time: '4 min read',
    image: '/images/studio-detail.svg',
  },
];
