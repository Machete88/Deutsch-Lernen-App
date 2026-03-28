import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useMemo, useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { conversationScenarios, createConversationReply } from '@/lib/conversation-coach';

type ChatMessage = { id: string; role: 'assistant' | 'user'; text: string };

export default function AIConversationScreen() {
  const [scenarioId, setScenarioId] = useState(conversationScenarios[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', text: conversationScenarios[0].openingLine },
  ]);
  const [input, setInput] = useState('');

  const scenario = useMemo(
    () => conversationScenarios.find(item => item.id === scenarioId) || conversationScenarios[0],
    [scenarioId]
  );

  const switchScenario = (nextId: string) => {
    const next = conversationScenarios.find(item => item.id === nextId) || conversationScenarios[0];
    setScenarioId(next.id);
    setMessages([{ id: `start-${next.id}`, role: 'assistant', text: next.openingLine }]);
    setInput('');
  };

  const sendReply = () => {
    if (!input.trim()) return;
    const userMessage: ChatMessage = { id: `${Date.now()}-u`, role: 'user', text: input.trim() };
    const feedback = createConversationReply(scenario, input.trim());
    const assistantMessage: ChatMessage = {
      id: `${Date.now()}-a`,
      role: 'assistant',
      text: `${feedback.answer}\n\nKorrektur: ${feedback.correction}\nBessere Antwort: ${feedback.betterOption}\nMotivation: ${feedback.encouragement}`,
    };
    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, gap: 16 }}>
        <Text className="text-foreground text-4xl font-bold">KI-Unterhaltung</Text>
        <Text className="text-muted">Wähle ein Szenario und antworte auf Deutsch.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            {conversationScenarios.map(item => (
              <Pressable key={item.id} onPress={() => switchScenario(item.id)} className={`rounded-2xl px-4 py-3 ${item.id === scenario.id ? 'bg-primary' : 'bg-card'}`}>
                <Text className={`${item.id === scenario.id ? 'text-background' : 'text-foreground'} font-semibold`}>{item.title}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {messages.map(message => (
          <View key={message.id} className={`rounded-2xl p-4 ${message.role === 'assistant' ? 'bg-card' : 'bg-primary'}`}>
            <Text className={message.role === 'assistant' ? 'text-foreground' : 'text-background'}>{message.text}</Text>
          </View>
        ))}

        <TextInput value={input} onChangeText={setInput} placeholder="Schreibe deine Antwort auf Deutsch" className="bg-card rounded-2xl p-4 text-foreground" multiline />
        <Pressable onPress={sendReply} className="bg-success rounded-2xl p-4 items-center">
          <Text className="text-background font-bold">Antwort senden</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
