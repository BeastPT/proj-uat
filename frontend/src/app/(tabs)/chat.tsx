import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ListRenderItemInfo,
  Pressable
} from "react-native";
import { Stack } from "expo-router";
import { useState, useRef, useEffect, useMemo } from "react";
import { SPACING, RADIUS } from "../../constants/Spacing";
import { useTheme } from "../../context/ThemeContext";

// TypeScript interfaces
interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  time: string;
  isAuthor: boolean;
}

interface ChatHeaderProps {
  title: string;
}

interface ChatMessageProps {
  message: ChatMessage;
}

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSend: () => void;
}

// Sample chat data
const initialChatData: ChatMessage[] = [
  {
    id: '1',
    sender: 'John Doe',
    message: 'Hey, how are you doing?',
    time: '10:30',
    isAuthor: false,
  },
  {
    id: '2',
    sender: 'Me',
    message: 'I am good, thanks! How about you?',
    time: '10:32',
    isAuthor: true,
  },
];

// Component for the chat header
const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Text style={styles.headerTitle}>{title}</Text>
  );
};

// Component for individual chat messages
const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View
      style={[
        styles.messageContainer,
        message.isAuthor ? styles.messageAuthor : styles.messageRecipient,
      ]}
    >
      <Text style={styles.messageSender}>{message.sender}</Text>
      <Text style={styles.messageText}>{message.message}</Text>
      <Text style={styles.messageTime}>{message.time}</Text>
    </View>
  );
};

// Component for the chat input
const ChatInput: React.FC<ChatInputProps> = ({ message, setMessage, onSend }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.inputField}
        placeholder="Type a message"
        placeholderTextColor={colors.textMuted}
        value={message}
        onChangeText={setMessage}
        onSubmitEditing={onSend}
        returnKeyType="send"
      />
      <Pressable
        style={styles.inputButton}
        onPress={onSend}
      >
        <Text style={styles.inputButtonText}>Send</Text>
      </Pressable>
    </View>
  );
};

export default function Chat() {
  const { colors } = useTheme();
  const [chatData, setChatData] = useState<ChatMessage[]>(initialChatData);
  const [message, setMessage] = useState<string>("");
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Scroll to end whenever chat data changes
  useEffect(() => {
    if (chatData.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100); // Small delay to ensure render is complete
    }
  }, [chatData]);

  // Function to handle sending the message
  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: String(Date.now()), // Generate a unique ID using timestamp
        sender: 'Me',
        message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAuthor: true,
      };
      setChatData([...chatData, newMessage]);
      setMessage("");
    }
  };

  // Render each chat item
  const renderItem = ({ item }: ListRenderItemInfo<ChatMessage>) => (
    <ChatMessage message={item} />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ title: "Chat", headerShown: false }} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.wrapper}>
          <ChatHeader title="Chat with Rent A Car" />
          <FlatList
            ref={flatListRef}
            data={chatData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.chatList}
            contentContainerStyle={styles.chatListContent}
            showsVerticalScrollIndicator={false}
          />
          <ChatInput
            message={message}
            setMessage={setMessage}
            onSend={sendMessage}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// Create styles function that takes colors as a parameter
const createStyles = (colors: any) => StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  wrapper: {
    flex: 1,
  },
  chatList: {
    flex: 1,
    paddingHorizontal: SPACING.md - 1,
  },
  chatListContent: {
    paddingBottom: SPACING.md - SPACING.xs,
  },
  
  // Header styles
  headerTitle: {
    color: colors.textHeading,
    fontSize: 24,
    fontWeight: "bold",
    marginTop: SPACING.xl + SPACING.lg,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md - 1,
  },
  
  // Message styles
  messageContainer: {
    marginBottom: SPACING.md - SPACING.xs,
    padding: SPACING.md - SPACING.xs,
    borderRadius: RADIUS.md,
    maxWidth: '80%',
  },
  messageAuthor: {
    alignSelf: 'flex-end',
    backgroundColor: colors.brand,
  },
  messageRecipient: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brandDark,
  },
  messageSender: {
    color: colors.textHeading,
    fontWeight: "bold",
  },
  messageText: {
    color: colors.textBody,
    marginVertical: SPACING.xs + 1,
  },
  messageTime: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'right',
  },
  
  // Input styles
  inputContainer: {
    flexDirection: "row",
    padding: SPACING.md - SPACING.xs,
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.textMuted,
  },
  inputField: {
    flex: 1,
    height: 40,
    backgroundColor: colors.bgSection,
    color: colors.textBody,
    paddingLeft: SPACING.md - SPACING.xs,
    borderRadius: RADIUS.md,
    marginRight: SPACING.md - SPACING.xs,
  },
  inputButton: {
    backgroundColor: colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
  },
  inputButtonText: {
    color: colors.textHeading,
    fontWeight: 'bold',
  }
});