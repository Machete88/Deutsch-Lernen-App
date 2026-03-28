import { View, Text, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { buildDailyRecommendations } from '@/lib/recommendation-service';

export default function StudyPlanScreen() {
  const plan = buildDailyRecommendations(6, 0.74);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, gap: 16 }}>
        <Text className="text-foreground text-4xl font-bold">Tagesplan</Text>
        <Text className="text-muted">Dein persönlicher Lernfokus für heute.</Text>

        <View className="gap-4">
          {plan.map((item, index) => (
            <View key={`${item.focus}-${index}`} className="bg-card rounded-3xl p-5 gap-2">
              <Text className="text-foreground text-xl font-bold">{index + 1}. {item.focus}</Text>
              <Text className="text-muted">{item.reason}</Text>
              <Text className="text-foreground">{item.action}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
