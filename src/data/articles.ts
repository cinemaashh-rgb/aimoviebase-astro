// AIMB Journal articles. There's no CMS/content collection for these yet —
// just three real short items, shared between the listing (news.astro) and
// each article's own permalink page (news/[slug].astro) so both stay in
// sync. `body` holds the actual paragraphs to publish: every one of them
// is real reporting already vetted elsewhere in this project (the same
// text used in the homepage's journal teaser), not expanded with invented
// quotes or section headings the way the reference mockup's own "sample
// article" copy was (explicitly labeled "prototype copy" / "Sample
// article · 6 min read"). An article stays exactly as long as what's
// actually known — no padding to look like a longer piece.
export interface Article {
  id: string;
  label: string;
  date: string;
  datetime: string;
  title: string;
  excerpt: string;
  image?: string;
  body: string[];
  // The movie this article is about, when there is one in the catalog —
  // renders the "Featured film" aside linking to its real page/poster.
  featuredMovieSlug?: string;
}

export const articles: Article[] = [
  {
    id: 'reset-solo-crew',
    label: 'Editorial',
    date: 'Sep 22, 2026',
    datetime: '2026-09-22',
    title: 'RESET makes the case for the one-person AI film crew',
    excerpt: "Max Barskih's RESET — written, directed, and entirely produced solo using Higgsfield AI — is the clearest sign yet that a single filmmaker can now credibly deliver a multi-location sci-fi short without a crew.",
    image: '/images/posters/reset-wide.webp',
    body: [
      "Max Barskih's RESET — written, directed, and entirely produced solo using Higgsfield AI — is the clearest sign yet that a single filmmaker can now credibly deliver a multi-location sci-fi short without a crew. Its selection at the Higgsfield Global Film Festival says less about novelty and more about craft: the lunar throne-room confrontation holds up as a piece of staging, not just a technical demo.",
    ],
    featuredMovieSlug: 'reset',
  },
  {
    id: 'echo-hunter-sag-aftra',
    label: 'News',
    date: 'Jun 2, 2025',
    datetime: '2025-06-02',
    title: "What Echo Hunter's SAG-AFTRA sign-off actually means",
    excerpt: "Echo Hunter was produced with explicit performer consent and guild sign-off for re-rendering a live performance with Arcana AI's video model.",
    image: '/images/posters/echo-hunter-wide.webp',
    body: [
      "Echo Hunter was produced with explicit performer consent and guild sign-off for re-rendering a live performance with Arcana AI's video model — a template other AI productions using a real actor's likeness are likely to follow as the space matures. We break down what was agreed to, and what it doesn't cover.",
    ],
    featuredMovieSlug: 'echo-hunter',
  },
  {
    id: 'toys-r-us-sora',
    label: 'News',
    date: 'May 10, 2024',
    datetime: '2024-05-10',
    title: 'Toys "R" Us and the first wave of AI brand films',
    excerpt: 'The Sora-produced Toys "R" Us spot was one of the first major brand commercials built with a text-to-video model.',
    image: undefined,
    body: [
      'The Sora-produced Toys "R" Us spot was one of the first major brand commercials built with a text-to-video model, and it\'s aged into a useful reference point for how fast — and unevenly — the technology has moved since.',
    ],
  },
];
