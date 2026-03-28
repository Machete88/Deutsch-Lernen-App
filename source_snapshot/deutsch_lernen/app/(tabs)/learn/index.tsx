import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';

export default function LearnScreen() {
  const router = useRouter();

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, gap: 16 }}>
        <View className="gap-2">
          <Text className="text-foreground text-4xl font-bold">Lernen</Text>
          <Text className="text-muted text-base">Wähle deinen Lernmodus oder starte direkt mit einem Set.</Text>
        </View>

        <View className="gap-3">
          <Pressable onPress={() => router.push('./grammar')} className="bg-card rounded-2xl p-5">
            <Text className="text-foreground text-xl font-bold">Grammatik</Text>
            <Text className="text-muted mt-1">Regeln, Beispiele und Mini-Quiz.</Text>
          </Pressable>

          <Pressable onPress={() => router.push('./sentence-builder')} className="bg-card rounded-2xl p-5">
            <Text className="text-foreground text-xl font-bold">Satzbau</Text>
            <Text className="text-muted mt-1">Baue korrekte deutsche Sätze aus Bausteinen.</Text>
          </Pressable>

          <Pressable onPress={() => router.push('./study-plan')} className="bg-card rounded-2xl p-5">
            <Text className="text-foreground text-xl font-bold">Tagesplan</Text>
            <Text className="text-muted mt-1">Personalisierte Empfehlungen für heute.</Text>
          </Pressable>

          <Pressable onPress={() => router.push('./exam-mode')} className="bg-success rounded-2xl p-5">
            <Text className="text-background text-xl font-bold">Prüfungsmodus</Text>
            <Text className="text-background mt-1">Starte eine zeitbasierte Prüfungssession.</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
