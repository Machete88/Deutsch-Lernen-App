import { View, Text, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { grammarLessons } from '@/lib/language-lessons';

export default function GrammarScreen() {
  const [selectedId, setSelectedId] = useState(grammarLessons[0].id);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const lesson = grammarLessons.find(item => item.id === selectedId) || grammarLessons[0];

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, gap: 16 }}>
        <Text className="text-foreground text-4xl font-bold">Grammatik</Text>
        <Text className="text-muted text-base">Kurze Lektionen mit Regeln, Beispielen und Mini-Checks.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
          <View className="flex-row gap-3">
            {grammarLessons.map(item => (
              <Pressable
                key={item.id}
                onPress={() => setSelectedId(item.id)}
                className={`rounded-2xl px-4 py-3 ${item.id === lesson.id ? 'bg-primary' : 'bg-card'}`}
              >
                <Text className={`${item.id === lesson.id ? 'text-background' : 'text-foreground'} font-semibold`}>
                  {item.level} · {item.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View className="bg-card rounded-3xl p-5 gap-4">
          <View>
            <Text className="text-foreground text-2xl font-bold">{lesson.title}</Text>
            <Text className="text-muted mt-1">{lesson.topic}</Text>
          </View>

          <Text className="text-foreground text-base leading-6">{lesson.explanation}</Text>

          <View className="gap-2">
            <Text className="text-foreground text-lg font-semibold">Tipps</Text>
            {lesson.tips.map((tip) => (
              <Text key={tip} className="text-muted">• {tip}</Text>
            ))}
          </View>

          <View className="gap-3">
            <Text className="text-foreground text-lg font-semibold">Beispiele</Text>
            {lesson.examples.map((example) => (
              <View key={example.de} className="bg-background rounded-2xl p-4">
                <Text className="text-foreground font-medium">{example.de}</Text>
                <Text className="text-muted mt-1">{example.hint}</Text>
              </View>
            ))}
          </View>

          <View className="gap-3">
            <Text className="text-foreground text-lg font-semibold">Mini-Check</Text>
            {lesson.quickCheck.map((item, index) => {
              const key = `${lesson.id}-${index}`;
              const isOpen = revealed[key];
              return (
                <View key={key} className="border border-border rounded-2xl p-4 gap-2">
                  <Text className="text-foreground">{item.prompt}</Text>
                  <Pressable
                    onPress={() => setRevealed(prev => ({ ...prev, [key]: true }))}
                    className={`rounded-2xl px-4 py-3 ${isOpen ? 'bg-success' : 'bg-primary'}`}
                  >
                    <Text className="text-background font-semibold">
                      {isOpen ? `Lösung: ${item.answer}` : 'Antwort anzeigen'}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
