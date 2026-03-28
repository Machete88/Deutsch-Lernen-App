import { grammarLessons, sentenceChallenges } from './language-lessons';

export interface LearningRecommendation {
  focus: string;
  reason: string;
  action: string;
}

export function buildDailyRecommendations(streak = 0, accuracy = 0.7): LearningRecommendation[] {
  const base: LearningRecommendation[] = [
    {
      focus: 'Wiederholung',
      reason: 'Kurze tägliche Wiederholung stabilisiert den Wortschatz.',
      action: 'Wiederhole heute 10 bekannte Wörter im Review-Modus.',
    },
    {
      focus: grammarLessons[0].title,
      reason: 'Grammatik vertieft das Verständnis hinter den Vokabeln.',
      action: `Bearbeite die Lektion "${grammarLessons[0].title}" und sprich die Beispiele laut.`,
    },
    {
      focus: 'Satzbau',
      reason: 'Sätze helfen dir, Wörter aktiv zu benutzen.',
      action: `Löse ${sentenceChallenges[0].topic.toLowerCase()} mit 3 kurzen Sätzen.`,
    },
  ];

  if (accuracy < 0.6) {
    base.unshift({
      focus: 'Fehleranalyse',
      reason: 'Deine letzte Genauigkeit war eher niedrig.',
      action: 'Öffne zuerst deine schwierigen Wörter und wiederhole nur Problemkarten.',
    });
  }

  if (streak >= 5) {
    base.push({
      focus: 'Streak ausbauen',
      reason: 'Du lernst bereits konstant.',
      action: 'Schließe heute zusätzlich eine Sprechübung ab, um die Serie zu stärken.',
    });
  }

  return base;
}
