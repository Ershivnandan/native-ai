import { FlatList, View } from "react-native";
import { memo, useCallback, useRef, useEffect } from "react";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import type { Message } from "@/types/chat";

interface ChatListProps {
  messages: Message[];
  isGenerating: boolean;
  onMessageLongPress?: (messageId: string) => void;
}

const ITEM_SEPARATOR_HEIGHT = 0;

export const ChatList = memo(
  ({ messages, isGenerating, onMessageLongPress }: ChatListProps) => {
    const flatListRef = useRef<FlatList<Message>>(null);
    const lastMessageCount = useRef(messages.length);

    useEffect(() => {
      if (messages.length > lastMessageCount.current) {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }
      lastMessageCount.current = messages.length;
    }, [messages.length]);

    const renderItem = useCallback(
      ({ item, index }: { item: Message; index: number }) => {
        const isLastAssistant =
          index === 0 && item.role === "assistant" && isGenerating;
        return (
          <ChatBubble
            message={item}
            onLongPress={onMessageLongPress}
            isStreaming={isLastAssistant}
          />
        );
      },
      [onMessageLongPress, isGenerating],
    );

    const keyExtractor = useCallback((item: Message) => item.id, []);

    const ListHeaderComponent = useCallback(() => {
      if (!isGenerating) return null;
      if (messages.length > 0 && messages[0]?.role === "assistant") {
        return null;
      }
      return <TypingIndicator />;
    }, [isGenerating, messages]);

    const ItemSeparator = useCallback(
      () => <View style={{ height: ITEM_SEPARATOR_HEIGHT }} />,
      [],
    );

    return (
      <View className="flex-1">
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          inverted
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={15}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          windowSize={7}
          removeClippedSubviews
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
        />
      </View>
    );
  },
);
