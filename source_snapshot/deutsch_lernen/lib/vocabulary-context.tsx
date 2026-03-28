import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word, UserWordState, LearningSet, LastResult } from './types';
import { vocabularyData, vocabularyDataExtra, learningSets } from './vocabulary-data';
import { useSettings } from './settings-context';

interface VocabularyContextType {
  words: Word[];
  learningSets: LearningSet[];
  userWordStates: Map<string, UserWordState>;
  currentSet: LearningSet | null;
  setCurrentSet: (set: LearningSet | null) => Promise<void>;
  recordWordResult: (wordId: string, result: LastResult) => Promise<void>;
  getWordsForReview: () => Word[];
  getNewWords: (count: number) => Word[];
  getWordsByCategory: (category: string) => Word[];
  isLoading: boolean;
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export function VocabularyProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const [words, setWords] = useState<Word[]>([]);
  const [userWordStates, setUserWordStates] = useState<Map<string, UserWordState>>(new Map());
  const [currentSet, setCurrentSetState] = useState<LearningSet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVocabulary = async () => {
      try {
        const allWords = [...vocabularyData, ...vocabularyDataExtra];
        const filteredWords = allWords.filter(w => {
          if (settings.userLevel === 'beginner') return w.minUserLevel === 'beginner';
          if (settings.userLevel === 'intermediate') return w.minUserLevel === 'beginner' || w.minUserLevel === 'intermediate';
          return true;
        });
        setWords(filteredWords);

        const stored = await AsyncStorage.getItem('user_word_states');
        if (stored) {
          const parsed = JSON.parse(stored) as Array<[string, UserWordState]>;
          setUserWordStates(new Map(parsed));
        }

        const storedSet = await AsyncStorage.getItem('current_learning_set');
        if (storedSet) {
          const set = learningSets.find(s => s.id === storedSet);
          setCurrentSetState(set || null);
        }
      } catch (error) {
        console.warn('Error loading vocabulary:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadVocabulary();
  }, [settings.userLevel]);

  const persistStates = async (nextMap: Map<string, UserWordState>) => {
    setUserWordStates(nextMap);
    await AsyncStorage.setItem('user_word_states', JSON.stringify(Array.from(nextMap.entries())));
  };

  const setCurrentSet = async (set: LearningSet | null) => {
    setCurrentSetState(set);
    if (set) {
      await AsyncStorage.setItem('current_learning_set', set.id);
    } else {
      await AsyncStorage.removeItem('current_learning_set');
    }
  };

  const recordWordResult = async (wordId: string, result: LastResult) => {
    const existing = userWordStates.get(wordId);
    const now = Date.now();
    const next: UserWordState = existing
      ? {
          ...existing,
          lastResult: result,
          lastReviewDate: now,
          repetitions: result === 'hard' ? existing.repetitions : existing.repetitions + 1,
          lapses: result === 'hard' ? existing.lapses + 1 : existing.lapses,
          intervalDays: result === 'easy' ? Math.max(3, existing.intervalDays + 2) : result === 'normal' ? Math.max(1, existing.intervalDays + 1) : 1,
          nextReview: now + (result === 'easy' ? 3 : result === 'normal' ? 1 : 0) * 86400000,
        }
      : {
          wordId,
          createdAt: now,
          lastResult: result,
          lastReviewDate: now,
          repetitions: result === 'hard' ? 0 : 1,
          lapses: result === 'hard' ? 1 : 0,
          easeFactor: 2.5,
          intervalDays: result === 'easy' ? 3 : 1,
          nextReview: now + (result === 'easy' ? 3 : 1) * 86400000,
        };

    const nextMap = new Map(userWordStates);
    nextMap.set(wordId, next);
    await persistStates(nextMap);
  };

  const getWordsForReview = () => {
    const now = Date.now();
    return words.filter(word => {
      const state = userWordStates.get(word.id);
      return state && state.nextReview <= now;
    });
  };

  const getNewWords = (count: number) => {
    return words.filter(word => !userWordStates.has(word.id)).slice(0, count);
  };

  const getWordsByCategory = (category: string) => words.filter(word => word.category === category);

  return (
    <VocabularyContext.Provider
      value={{
        words,
        learningSets,
        userWordStates,
        currentSet,
        setCurrentSet,
        recordWordResult,
        getWordsForReview,
        getNewWords,
        getWordsByCategory,
        isLoading,
      }}
    >
      {children}
    </VocabularyContext.Provider>
  );
}

export function useVocabulary() {
  const context = useContext(VocabularyContext);
  if (!context) throw new Error('useVocabulary must be used within VocabularyProvider');
  return context;
}
