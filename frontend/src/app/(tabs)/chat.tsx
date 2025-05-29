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
  Pressable,
  ActivityIndicator
} from "react-native";
import { Stack } from "expo-router";
import { useState, useRef, useEffect, useMemo } from "react";
import { apiService } from "../../services/api.service";
import { useAuth } from "../../context/AuthContext";
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
  const { user } = useAuth();
  const [chatData, setChatData] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Fetch or create chat on component mount
  useEffect(() => {
    if (user) {
      fetchOrCreateChat();
    }
  }, [user]);

  // Fetch existing chat or create a new one
  const fetchOrCreateChat = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user's chats
      const userChats = await apiService.getUserChats(user?.id || '');
      
      let activeChat;
      
      // If user has an active chat, use it
      if (userChats && userChats.length > 0) {
        activeChat = userChats.find((chat: any) => chat.isActive);
      }
      
      // If no active chat, create one
      if (!activeChat && user) {
        activeChat = await apiService.createChat(user.id);
      }
      
      if (activeChat) {
        setChatId(activeChat.id);
        
        // Fetch messages for this chat
        const messages = await apiService.getChatMessages(activeChat.id);
        
        // Format messages for the UI
        const formattedMessages = messages.map((msg: any) => ({
          id: msg.id,
          sender: msg.isAdmin ? 'Rent A Car Support' : 'Me',
          message: msg.content,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAuthor: !msg.isAdmin,
        }));
        
        setChatData(formattedMessages);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching chat:', err);
      setError('Failed to load chat. Please try again.');
      setLoading(false);
    }
  };

  // Scroll to end whenever chat data changes
  useEffect(() => {
    if (chatData.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100); // Small delay to ensure render is complete
    }
  }, [chatData]);

  // Function to handle sending the message
  const sendMessage = async () => {
    if (message.trim() && chatId) {
      try {
        // Optimistically update UI
        const tempMessage: ChatMessage = {
          id: String(Date.now()),
          sender: 'Me',
          message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAuthor: true,
        };
        
        setChatData([...chatData, tempMessage]);
        const currentMessage = message;
        setMessage("");
        
        // Send message to API
        const sentMessage = await apiService.sendMessage(
          chatId,
          currentMessage,
          false // isAdmin = false
        );
        
        // Update with the actual message from the server
        const newMessage: ChatMessage = {
          id: sentMessage.id,
          sender: 'Me',
          message: sentMessage.content,
          time: new Date(sentMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAuthor: true,
        };
        
        // Replace the temporary message with the real one
        setChatData(prev => 
          prev.map(msg => msg.id === tempMessage.id ? newMessage : msg)
        );
      } catch (err) {
        console.error('Error sending message:', err);
        alert('Failed to send message. Please try again.');
        
        // Remove the optimistic message on error
        setChatData(prev => prev.filter(msg => msg.id !== String(Date.now())));
      }
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
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.brand} />
              <Text style={styles.loadingText}>Loading chat...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable style={styles.retryButton} onPress={fetchOrCreateChat}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <FlatList
                ref={flatListRef}
                data={chatData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={styles.chatList}
                contentContainerStyle={styles.chatListContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      No messages yet. Start a conversation with our support team!
                    </Text>
                  </View>
                }
              />
              <ChatInput
                message={message}
                setMessage={setMessage}
                onSend={sendMessage}
              />
            </>
          )}
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
  
  // Loading and error styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textBody,
    marginTop: SPACING.md,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    color: colors.textBody,
    marginBottom: SPACING.md,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.brand,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  retryButtonText: {
    color: colors.textHeading,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    marginTop: SPACING.xl,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 16,
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