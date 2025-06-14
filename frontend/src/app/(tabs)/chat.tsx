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
import i18n from "../../i18n";

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
        placeholder={i18n.t("chat.typePlaceholder") || "Type a message"}
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
        <Text style={styles.inputButtonText}>{i18n.t("chat.send") || "Send"}</Text>
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
    try {      setLoading(true);
      setError(null);
      
      if (!user || !user.id) {
        setError('Authentication error. Please log out and log in again.');
        setLoading(false);
        return;
      }
        // First try to get user's chats to see if one already exists
      let chatData;
      
      try {
        // Try to get user's chats first
        const userChats = await apiService.getUserChats(user.id);
          // Find the first active chat
        const activeChat = userChats.find((chat: any) => chat.isActive);
        
        if (activeChat) {
          chatData = activeChat;
        } else {
          // If no active chat exists, create a new one
          chatData = await apiService.createChat(user.id);
        }      } catch (getUserChatsError: any) {
        // If we can't get user chats, try to create a new chat
        try {
          // Try to create a new chat
          chatData = await apiService.createChat(user.id);        } catch (createError: any) {
          // If we get a 409 Conflict, it means a chat already exists
          if (createError.response && createError.response.status === 409) {
            // Try to get the chat ID from the error response
            if (createError.response.data && createError.response.data.chatId) {
              const existingChatId = createError.response.data.chatId;
              chatData = { id: existingChatId, isActive: true };
            } else {
              throw new Error('Could not determine existing chat ID from 409 response');
            }
          } else {
            throw createError;
          }
        }
      }
        if (chatData && chatData.id) {
        setChatId(chatData.id);
        
        // Fetch messages for this chat
        const messages = await apiService.getChatMessages(chatData.id);
        
        // Format messages for the UI
        const formattedMessages = messages.map((msg: any) => ({
          id: msg.id,
          sender: msg.isAdmin ? 'Rent A Car Support' : 'Me',
          message: msg.content,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAuthor: !msg.isAdmin,
        }));
          setChatData(formattedMessages);
      } else {
        setError('Could not create or retrieve chat. Please try again.');
      }
      
      setLoading(false);    } catch (err: any) {
      // More detailed error message based on the error type
      if (err.response && err.response.status === 409) {
        // Try to extract the chat ID from the error response
        if (err.response.data && err.response.data.chatId) {          const existingChatId = err.response.data.chatId;
          
          // Try to fetch the chat directly
          try {
            setChatId(existingChatId);
            
            // Fetch messages for this chat
            const messages = await apiService.getChatMessages(existingChatId);
            
            // Format messages for the UI
            const formattedMessages = messages.map((msg: any) => ({
              id: msg.id,
              sender: msg.isAdmin ? 'Rent A Car Support' : 'Me',
              message: msg.content,
              time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isAuthor: !msg.isAdmin,
            }));
            
            setChatData(formattedMessages);
            setLoading(false);            return; // Exit early since we've handled the error
          } catch (fetchError) {
            setError('Error loading existing chat. Please try again.');
          }
        } else {
          setError('A chat already exists but could not be loaded. Please try again.');
        }      } else if (err.response && err.response.status === 403) {
        setError('Authentication error. Please log out and log in again to refresh your session.');
        
        // Clear tokens on 403 error to force re-login
        try {
          await apiService.clearTokens();
        } catch (clearError) {
          // Handle token clearing error silently
        }      } else if (err.response && err.response.status === 401) {
        setError('Your session has expired. Please log out and log in again.');
        
        // Clear tokens on 401 error to force re-login
        try {
          await apiService.clearTokens();
        } catch (clearError) {
          // Handle token clearing error silently
        }
      } else if (err.message && (err.message.includes('Network Error') || err.message.includes('timeout'))) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(`Failed to load chat: ${err.message || 'Unknown error'}`);
      }
      
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
        const tempId = String(Date.now());
        const tempMessage: ChatMessage = {
          id: tempId,
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
          prev.map(msg => msg.id === tempId ? newMessage : msg)
        );
      } catch (err: any) {
        // Remove the optimistic message on error
        setChatData(prev => prev.filter(msg => msg.message !== message));
        
        // Show more specific error message if possible
        if (err.response && err.response.status === 401) {
          alert('Your session has expired. Please log in again.');
          
          // Clear tokens on 401 error to force re-login
          try {
            apiService.clearTokens();
          } catch (clearError) {
            // Handle token clearing error silently
          }
        } else if (err.response && err.response.status === 403) {
          alert('You don\'t have permission to send messages in this chat.');
        } else if (err.response && err.response.status === 404) {
          alert('Chat not found. Please refresh the page.');
        } else if (err.response && err.response.status === 400) {
          // Handle validation errors
          const errorMessage = err.response.data?.details || err.response.data?.error || 'Invalid message format';
          alert(`Error: ${errorMessage}`);
        } else if (err.message && err.message.includes('Network Error')) {
          alert('Network error. Please check your connection and try again.');
        } else {
          alert('Failed to send message. Please try again.');
        }
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
          <ChatHeader title={i18n.t("chat.title") || "Chat with Rent A Car"} />
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.brand} />
              <Text style={styles.loadingText}>{i18n.t("chat.loading") || "Loading chat..."}</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>              <Pressable
                style={styles.retryButton}
                onPress={fetchOrCreateChat}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
              <Text style={styles.errorHelpText}>
                If the problem persists, try restarting the app or checking your internet connection.
              </Text>
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
                      {i18n.t("chat.noMessages") || "No messages yet. Send a message to start a conversation with our support team!"}
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
  errorHelpText: {
    color: colors.textMuted,
    marginTop: SPACING.md,
    fontSize: 14,
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