export interface PronunciationAnalysis {
  expected: string;
  actual: string;
  similarity: number;
  rating: 'excellent' | 'good' | 'fair' | 'needs-practice';
  feedback: string;
  tips: string[];
}

export interface PronunciationCoachResult extends PronunciationAnalysis {
  focusSounds: string[];
  rhythmTip: string;
  exercise: string;
  shadowingSteps: string[];
}

export function normalizePronunciationInput(input: string): string {
  return input.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function analyzePronunciation(expected: string, actual: string): PronunciationAnalysis {
  const normalizedExpected = normalizePronunciationInput(expected);
  const normalizedActual = normalizePronunciationInput(actual);
  const exact = normalizedExpected === normalizedActual;
  const similarity = exact ? 1 : normalizedActual.length > 0 ? Math.max(0.35, Math.min(0.92, normalizedActual.length / Math.max(normalizedExpected.length, 1))) : 0.1;

  const rating = similarity > 0.9 ? 'excellent' : similarity > 0.75 ? 'good' : similarity > 0.55 ? 'fair' : 'needs-practice';

  return {
    expected,
    actual,
    similarity,
    rating,
    feedback: exact ? 'Sehr gut ausgesprochen.' : 'Die Aussprache ist schon nah dran, aber noch nicht ganz stabil.',
    tips: [
      'Sprich langsamer und deutlich.',
      'Höre das Wort zuerst einmal komplett.',
      'Wiederhole das Wort in kurzen Einheiten.'
    ],
  };
}

export function coachPronunciation(expected: string, actual: string): PronunciationCoachResult {
  const analysis = analyzePronunciation(expected, actual);
  const lower = expected.toLowerCase();
  const focusSounds = ['ch', 'sch', 'ei', 'ie', 'r', 'z'].filter(sound => lower.includes(sound));

  return {
    ...analysis,
    focusSounds,
    rhythmTip: 'Betone die erste Silbe bewusst und mache danach eine kurze Pause.',
    exercise: `Sprich "${expected}" dreimal langsam, dann zweimal in normalem Tempo.`,
    shadowingSteps: [
      'Höre das Wort einmal komplett.',
      'Sprich gleichzeitig mit der Vorlage.',
      'Sprich das Wort danach alleine nach.',
    ],
  };
}
