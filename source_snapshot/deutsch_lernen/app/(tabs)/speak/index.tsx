import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';

export default function SpeakScreen() {
  const router = useRouter();

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, gap: 16 }}>
        <View className="gap-2">
          <Text className="text-foreground text-4xl font-bold">Sprechen</Text>
          <Text className="text-muted">Trainiere Aussprache und führe einfache KI-Gespräche auf Deutsch.</Text>
        </View>

        <Pressable onPress={() => router.push('./speak-practice?setName=Alltag')} className="bg-card rounded-2xl p-5">
          <Text className="text-foreground text-xl font-bold">Aussprache-Coach</Text>
          <Text className="text-muted mt-1">Wörter hören, nachsprechen, aufnehmen und Feedback bekommen.</Text>
        </Pressable>

        <Pressable onPress={() => router.push('./ai-conversation')} className="bg-primary rounded-2xl p-5">
          <Text className="text-background text-xl font-bold">KI-Unterhaltung</Text>
          <Text className="text-background mt-1">Übe Alltagssituationen wie Café, Arzt oder Vorstellung.</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
