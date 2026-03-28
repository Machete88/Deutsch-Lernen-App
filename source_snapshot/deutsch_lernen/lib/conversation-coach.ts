export interface ConversationScenario {
  id: string;
  title: string;
  level: 'A1' | 'A2' | 'B1';
  setting: string;
  openingLine: string;
  goal: string;
  hints: string[];
}

export interface ConversationReply {
  answer: string;
  correction: string;
  betterOption: string;
  encouragement: string;
}

export const conversationScenarios: ConversationScenario[] = [
  {
    id: 'cafe',
    title: 'Im Café',
    level: 'A1',
    setting: 'Du bestellst ein Getränk in einem Café.',
    openingLine: 'Guten Tag! Was möchten Sie bestellen?',
    goal: 'Bestelle höflich ein Getränk und etwas Kleines zu essen.',
    hints: ['Ich möchte ...', 'Bitte', 'Noch etwas'],
  },
  {
    id: 'doctor',
    title: 'Beim Arzt',
    level: 'A2',
    setting: 'Du beschreibst einfache Beschwerden in einer Praxis.',
    openingLine: 'Guten Tag. Was fehlt Ihnen?',
    goal: 'Nenne dein Problem und seit wann es da ist.',
    hints: ['Ich habe ...', 'seit zwei Tagen', 'Es tut weh'],
  },
  {
    id: 'intro',
    title: 'Vorstellung',
    level: 'A1',
    setting: 'Du stellst dich kurz vor.',
    openingLine: 'Hallo! Stell dich bitte kurz vor.',
    goal: 'Nenne Name, Herkunft und warum du Deutsch lernst.',
    hints: ['Ich heiße ...', 'Ich komme aus ...', 'Ich lerne Deutsch, weil ...'],
  },
];

export function createConversationReply(scenario: ConversationScenario, learnerMessage: string): ConversationReply {
  const short = learnerMessage.trim();
  const lower = short.toLowerCase();
  const polite = lower.includes('bitte') || lower.includes('guten');

  return {
    answer: `Gut gemacht. Wir bleiben im Szenario "${scenario.title}" und üben weiter.`,
    correction: polite ? 'Deine Antwort ist höflich formuliert.' : 'Versuche eine höflichere Form mit Bitte oder einer Begrüßung.',
    betterOption: scenario.id === 'cafe'
      ? 'Guten Tag, ich möchte bitte einen Kaffee und ein Brötchen.'
      : scenario.id === 'doctor'
      ? 'Guten Tag, ich habe seit zwei Tagen starke Kopfschmerzen.'
      : 'Hallo, ich heiße Alex, komme aus Russland und lerne Deutsch für den Alltag.',
    encouragement: short.length > 20 ? 'Sehr gut, deine Antwort ist schon recht vollständig.' : 'Gut gestartet. Antworte beim nächsten Mal mit einem ganzen Satz.',
  };
}
