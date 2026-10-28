// Shared "AI tool badge" presentation data — icon glyph, background/text
// color and a one-line category — used anywhere a tool name from a movie's
// `aiTools` list (or a creator's aggregated "Creative stack") needs the
// icon-badge treatment from the film-page and creator-page mockups.
//
// This is presentational metadata about the *tool itself* (what Runway is
// used for in general), not something stored per-movie — matching how the
// mockups hard-coded a fixed description per tool rather than per film.
// Matching is substring-based (`Kling 3.0`, `Runway Studios`, `Suno 6`,
// `Invideo AI` / `invideo` all resolve to their base entry) so new version
// suffixes in the data don't need this file updated.
//
// Colors reconcile the two mockups' slightly different per-tool choices
// (movie-page sidebar vs creator-page "Creative stack" carousel each picked
// their own) onto one consistent set, same approach as the site's color
// token reconciliation.

export interface ToolMeta {
  icon: string;
  category: string;
  bg: string;
  fg: string;
  border?: string;
  // Real brand mark, when we have one saved locally (e.g. from the tool's
  // own app icon) — rendered instead of the plain letter glyph, which
  // stays as the fallback for every tool we haven't sourced a logo for.
  image?: string;
}

const FALLBACK: ToolMeta = { icon: '◆', category: 'AI tool', bg: '#101319', fg: '#fff' };

// Keys are matched case-insensitively against the start of the stored tool
// name. Longer/more specific keys are checked first.
const TOOL_META: [string, ToolMeta][] = [
  ['runway', { icon: 'R', category: 'Image & Video Generation', bg: '#101319', fg: '#fff' }],
  ['midjourney', { icon: '✦', category: 'Concept Art', bg: '#fff', fg: '#101319', border: '#101319' }],
  ['kling', { icon: '◈', category: 'Video Generation', bg: '#0cb5cd', fg: '#fff' }],
  ['elevenlabs', { icon: 'Ⅲ', category: 'Voice & Dialogue', bg: '#101319', fg: '#fff' }],
  ['davinci resolve', { icon: '●', category: 'Editing & Color Grading', bg: '#1d2635', fg: '#9be4c5' }],
  ['blender', { icon: '◉', category: '3D & Environments', bg: '#fff', fg: '#f47720', border: '#eceef1' }],
  ['comfyui', { icon: '⬡', category: 'Pipeline & Compositing', bg: '#eef4ff', fg: '#18559b' }],
  ['capcut', { icon: '✂', category: 'Video Editing', bg: '#101319', fg: '#fff' }],
  ['invideo', { icon: '▶', category: 'Video Editing', bg: '#101319', fg: '#fff' }],
  ['openart', { icon: 'O', category: 'Image Generation', bg: '#101319', fg: '#fff' }],
  ['arcana', { icon: 'A', category: 'Video Generation', bg: '#101319', fg: '#fff' }],
  ['dreamina', { icon: 'D', category: 'Image & Video Generation', bg: '#101319', fg: '#fff', image: '/images/tools/dreamina.webp' }],
  ['gpt image', { icon: 'G', category: 'Image Generation', bg: '#101319', fg: '#fff' }],
  ['grok', { icon: 'G', category: 'AI Generation', bg: '#101319', fg: '#fff' }],
  ['nano banana', { icon: 'N', category: 'Image Generation', bg: '#101319', fg: '#fff' }],
  ['google flow', { icon: 'F', category: 'Video Generation', bg: '#101319', fg: '#fff' }],
  ['higgsfield', { icon: 'H', category: 'Video Generation', bg: '#101319', fg: '#fff' }],
  ['pippit', { icon: 'P', category: 'Video Editing', bg: '#101319', fg: '#fff' }],
  ['seedance', { icon: 'S', category: 'Video Generation', bg: '#101319', fg: '#fff' }],
  ['suno', { icon: '♪', category: 'Music Generation', bg: '#101319', fg: '#fff' }],
  ['topaz', { icon: 'T', category: 'Upscaling & Restoration', bg: '#101319', fg: '#fff' }],
];

export function getToolMeta(name: string): ToolMeta {
  const n = name.toLowerCase();
  for (const [key, meta] of TOOL_META) {
    if (n.startsWith(key)) return meta;
  }
  return FALLBACK;
}
