// Shared logic for the "AIMB Quality Index" / "Slop or Cinema?" widget used
// on AI Short Drama detail pages. Five fixed verdict tiers, each with its
// own label and dot/ring color — mirrors the tiers defined in the original
// mockup's "FIVE VERDICTS" legend exactly (same thresholds, same labels).
export interface QualityVerdict {
  min: number;
  max: number;
  label: string;
  color: string;
}

export const QUALITY_VERDICTS: QualityVerdict[] = [
  { min: 85, max: 100, label: 'AI Cinema', color: '#43865f' },
  { min: 70, max: 84, label: 'Worth Watching', color: '#79a187' },
  { min: 50, max: 69, label: 'Promising, but Flawed', color: '#bc974e' },
  { min: 30, max: 49, label: 'Slop Territory', color: '#c37a53' },
  { min: 0, max: 29, label: 'Pure AI Slop', color: '#b34d4d' },
];

export function getVerdict(score: number): QualityVerdict {
  return QUALITY_VERDICTS.find((v) => score >= v.min && score <= v.max) ?? QUALITY_VERDICTS[QUALITY_VERDICTS.length - 1];
}

// Per-metric bar color (metrics are 0-10, independent of the overall 0-100
// score/verdict above).
export function metricColor(score: number): string {
  if (score >= 7) return '#43865f';
  if (score >= 4) return '#bc974e';
  return '#b34d4d';
}
