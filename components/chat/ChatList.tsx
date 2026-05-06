import { FlatList, View } from "react-native";
import { memo, useCallback, useRef } from "react";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import type { Message } from "@/types/chat";

interface ChatListProps {
  messages: Message[];
  isGenerating: boolean;
  onMessageLongPress?: (messageId: string) => void;
}

export const ChatList = memo(
  ({ messages, isGenerating, onMessageLongPress }: ChatListProps) => {
    const flatListRef = useRef<FlatList<Message>>(null);

    const renderItem = useCallback(
      ({ item }: { item: Message }) => (
        <ChatBubble message={item} onLongPress={onMessageLongPress} />
      ),
      [onMessageLongPress],
    );

    const keyExtractor = useCallback((item: Message) => item.id, []);

    const ListHeaderComponent = useCallback(() => {
      if (!isGenerating) return null;
      return <TypingIndicator />;
    }, [isGenerating]);

    return (
      <View className="flex-1">
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          inverted
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        />
      </View>
    );
  },
);
