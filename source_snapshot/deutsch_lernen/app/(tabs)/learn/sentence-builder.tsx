import { View, Text, ScrollView, Pressable } from 'react-native';
import { useMemo, useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { sentenceChallenges } from '@/lib/language-lessons';

export default function SentenceBuilderScreen() {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const current = sentenceChallenges[challengeIndex];
  const remaining = useMemo(
    () => current.fragments.filter(fragment => {
      const usedCount = selected.filter(s => s === fragment).length;
      const totalCount = current.fragments.filter(f => f === fragment).length;
      return usedCount < totalCount;
    }),
    [current, selected]
  );
  const solved = selected.join(' ') === current.solution.join(' ');

  const addFragment = (fragment: string) => setSelected(prev => [...prev, fragment]);
  const reset = () => setSelected([]);
  const next = () => {
    setScore(prev => prev + 15 + streak * 5);
    setStreak(prev => prev + 1);
    setSelected([]);
    setChallengeIndex(prev => (prev + 1) % sentenceChallenges.length);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, gap: 16 }}>
        <Text className="text-foreground text-4xl font-bold">Satzbau</Text>
        <Text className="text-muted">Ordne Wörter zu korrekten deutschen Sätzen.</Text>

        <View className="flex-row gap-3">
          <View className="bg-card rounded-2xl px-4 py-3"><Text className="text-foreground font-semibold">Punkte: {score}</Text></View>
          <View className="bg-card rounded-2xl px-4 py-3"><Text className="text-foreground font-semibold">Serie: {streak}</Text></View>
        </View>

        <View className="bg-card rounded-3xl p-5 gap-4">
          <Text className="text-foreground text-2xl font-bold">{current.topic}</Text>
          <Text className="text-muted">{current.prompt}</Text>

          <View className="bg-background rounded-2xl p-4 min-h-[90px] justify-center">
            <Text className="text-foreground text-lg">
              {selected.length ? selected.join(' ') : 'Tippe unten auf die Bausteine.'}
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {remaining.map((fragment, index) => (
              <Pressable key={`${fragment}-${index}`} onPress={() => addFragment(fragment)} className="bg-primary rounded-2xl px-4 py-3">
                <Text className="text-background font-semibold">{fragment}</Text>
              </Pressable>
            ))}
          </View>

          <View className="border border-border rounded-2xl p-4">
            <Text className="text-muted">Übersetzung</Text>
            <Text className="text-foreground mt-1">{current.translation}</Text>
          </View>

          <View className="flex-row gap-3">
            <Pressable onPress={reset} className="bg-muted rounded-2xl px-4 py-3">
              <Text className="text-foreground font-semibold">Zurücksetzen</Text>
            </Pressable>
            {solved && (
              <Pressable onPress={next} className="bg-success rounded-2xl px-4 py-3">
                <Text className="text-background font-semibold">Richtig - nächste Aufgabe</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
