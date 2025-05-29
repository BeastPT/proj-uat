import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { apiService } from "@/src/services/api.service";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  ListRenderItemInfo,
  Pressable,
  Image,
  Dimensions,
  useWindowDimensions
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { SPACING, RADIUS } from "@/src/constants/Spacing";
import { useTheme } from "@/src/context/ThemeContext";
import { Colors } from "@/src/constants/Colors";

// TypeScript interfaces
interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  time: string;
  isAdmin: boolean;
}

interface ChatConversation {
  id: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
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

interface ConversationItemProps {
  conversation: ChatConversation;
  isSelected: boolean;
  onSelect: () => void;
}

// Sample chat data
const initialChatData: ChatConversation[] = [
  {
    id: '1',
    userName: 'John Doe',
    lastMessage: 'When will my car be ready?',
    lastMessageTime: '10:30',
    unreadCount: 2,
    messages: [
      {
        id: '1-1',
        sender: 'John Doe',
        message: 'Hello, I booked a car for tomorrow.',
        time: '10:25',
        isAdmin: false,
      },
      {
        id: '1-2',
        sender: 'John Doe',
        message: 'When will my car be ready?',
        time: '10:30',
        isAdmin: false,
      },
    ],
  },
  {
    id: '2',
    userName: 'Jane Smith',
    lastMessage: 'Can I extend my rental period?',
    lastMessageTime: '09:45',
    unreadCount: 1,
    messages: [
      {
        id: '2-1',
        sender: 'Jane Smith',
        message: 'Hi, I have a question about my rental.',
        time: '09:40',
        isAdmin: false,
      },
      {
        id: '2-2',
        sender: 'Jane Smith',
        message: 'Can I extend my rental period?',
        time: '09:45',
        isAdmin: false,
      },
    ],
  },
  {
    id: '3',
    userName: 'Mike Johnson',
    lastMessage: 'Thanks for your help!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: '3-1',
        sender: 'Mike Johnson',
        message: 'I need to change my pickup location.',
        time: 'Yesterday',
        isAdmin: false,
      },
      {
        id: '3-2',
        sender: 'Admin',
        message: 'Sure, I can help you with that. Where would you like to pick up the car?',
        time: 'Yesterday',
        isAdmin: true,
      },
      {
        id: '3-3',
        sender: 'Mike Johnson',
        message: 'Thanks for your help!',
        time: 'Yesterday',
        isAdmin: false,
      },
    ],
  },
];

// Component for the chat header
const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = useMemo(() => createStyles(colors, isMobile), [colors, isMobile]);
  return (
    <Text style={styles.headerTitle}>{title}</Text>
  );
};

// Component for individual chat messages
const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = useMemo(() => createStyles(colors, isMobile), [colors, isMobile]);
  return (
    <View
      style={[
        styles.messageContainer,
        message.isAdmin ? styles.messageAdmin : styles.messageUser,
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
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = useMemo(() => createStyles(colors, isMobile), [colors, isMobile]);
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

// Component for conversation list item
const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, isSelected, onSelect }) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = useMemo(() => createStyles(colors, isMobile), [colors, isMobile]);
  return (
    <TouchableOpacity 
      style={[styles.conversationItem, isSelected && styles.conversationItemSelected]} 
      onPress={onSelect}
    >
      <View style={styles.conversationAvatar}>
        <Text style={styles.conversationAvatarText}>
          {conversation.userName.charAt(0)}
        </Text>
      </View>
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{conversation.userName}</Text>
          <Text style={styles.conversationTime}>{conversation.lastMessageTime}</Text>
        </View>
        <View style={styles.conversationFooter}>
          <Text style={styles.conversationLastMessage} numberOfLines={1}>
            {conversation.lastMessage}
          </Text>
          {conversation.unreadCount > 0 && (
            <View style={styles.conversationBadge}>
              <Text style={styles.conversationBadgeText}>{conversation.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function AdminChat() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const showChatParam = params.showChat === 'true';
  
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [message, setMessage] = useState<string>("");
  const [showConversations, setShowConversations] = useState(!showChatParam);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const chatListRef = useRef<FlatList<ChatMessage>>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = useMemo(() => createStyles(colors, isMobile), [colors, isMobile]);

  // Fetch all chats on component mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Fetch chats from API
  const fetchChats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const chatsData = await apiService.getAdminChats();
      
      // Transform API data to match our component's expected format
      const formattedChats: ChatConversation[] = await Promise.all(
        chatsData.map(async (chat: any) => {
          // Fetch user details
          const userDetails = await apiService.getUserProfile();
          
          // Fetch messages for this chat
          const messages = await apiService.getChatMessages(chat.id);
          
          // Calculate unread count (messages not from admin that haven't been read)
          const unreadCount = messages.filter((msg: any) => !msg.isAdmin).length;
          
          // Get the last message
          const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
          
          return {
            id: chat.id,
            userName: userDetails.name || 'User',
            lastMessage: lastMessage ? lastMessage.content : 'No messages yet',
            lastMessageTime: lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'New',
            unreadCount,
            messages: messages.map((msg: any) => ({
              id: msg.id,
              sender: msg.isAdmin ? 'Admin' : userDetails.name || 'User',
              message: msg.content,
              time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isAdmin: msg.isAdmin,
            })),
          };
        })
      );
      
      setConversations(formattedChats);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError('Failed to load chats. Please try again.');
      setLoading(false);
    }
  };

  // Set the first conversation as selected by default
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      const firstConversation = conversations[0];
      setSelectedConversation(firstConversation);
    }
  }, [conversations, selectedConversation]);

  // Scroll to end whenever chat data changes
  useEffect(() => {
    if (selectedConversation && selectedConversation.messages.length > 0 && chatListRef.current) {
      setTimeout(() => {
        chatListRef.current?.scrollToEnd({ animated: true });
      }, 100); // Small delay to ensure render is complete
    }
  }, [selectedConversation]);

  // Function to handle sending the message
  const sendMessage = async () => {
    if (message.trim() && selectedConversation) {
      try {
        // Send message to API
        const sentMessage = await apiService.sendMessage(
          selectedConversation.id,
          message,
          true // isAdmin = true
        );
        
        // Create a new message object for the UI
        const newMessage: ChatMessage = {
          id: sentMessage.id,
          sender: 'Admin',
          message: sentMessage.content,
          time: new Date(sentMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAdmin: true,
        };

        // Update the selected conversation with the new message
        const updatedConversation = {
          ...selectedConversation,
          lastMessage: message,
          lastMessageTime: newMessage.time,
          messages: [...selectedConversation.messages, newMessage],
        };

        // Update the conversations array
        const updatedConversations = conversations.map(conv =>
          conv.id === selectedConversation.id ? updatedConversation : conv
        );

        setConversations(updatedConversations);
        setSelectedConversation(updatedConversation);
        setMessage("");
      } catch (err) {
        console.error('Error sending message:', err);
        alert('Failed to send message. Please try again.');
      }
    }
  };

  // Handle selecting a conversation
  const handleSelectConversation = async (conversation: ChatConversation) => {
    try {
      // Fetch the latest messages for this chat
      const messages = await apiService.getChatMessages(conversation.id);
      
      // Get user details
      const userDetails = await apiService.getUserProfile();
      
      // Format messages for the UI
      const formattedMessages = messages.map((msg: any) => ({
        id: msg.id,
        sender: msg.isAdmin ? 'Admin' : userDetails.name || 'User',
        message: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAdmin: msg.isAdmin,
      }));
      
      // Update the selected conversation with fresh data
      const updatedConversation = {
        ...conversation,
        messages: formattedMessages,
        unreadCount: 0, // Mark as read
      };

      // Update the conversations array
      const updatedConversations = conversations.map(conv =>
        conv.id === conversation.id ? updatedConversation : conv
      );

      setConversations(updatedConversations);
      setSelectedConversation(updatedConversation);
      
      // Automatically switch to chat view when a conversation is selected
      if (isMobile) {
        setShowConversations(false);
      }
    } catch (err) {
      console.error('Error fetching conversation details:', err);
      alert('Failed to load conversation. Please try again.');
    }
  };
  
  // Toggle between conversations list and chat view on mobile
  const toggleView = useCallback(() => {
    setShowConversations(!showConversations);
  }, [showConversations]);

  // Render each conversation item
  const renderConversationItem = ({ item }: ListRenderItemInfo<ChatConversation>) => (
    <ConversationItem 
      conversation={item} 
      isSelected={selectedConversation?.id === item.id}
      onSelect={() => handleSelectConversation(item)}
    />
  );

  // Render each chat message
  const renderMessageItem = ({ item }: ListRenderItemInfo<ChatMessage>) => (
    <ChatMessage message={item} />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ title: "Admin Chat", headerShown: false }} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.wrapper}>
          <ChatHeader title="Admin Chat Center" />
          
          {isMobile && (
            <View style={styles.mobileNavBar}>
              <TouchableOpacity
                style={[styles.mobileNavButton, showConversations && styles.mobileNavButtonActive]}
                onPress={() => setShowConversations(true)}
              >
                <Text style={styles.mobileNavButtonText}>Conversations</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.mobileNavButton, !showConversations && styles.mobileNavButtonActive]}
                onPress={() => setShowConversations(false)}
                disabled={!selectedConversation}
              >
                <Text
                  style={[
                    styles.mobileNavButtonText,
                    !selectedConversation && styles.mobileNavButtonTextDisabled
                  ]}
                >
                  Chat
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.content}>
            {/* Conversations List */}
            {(!isMobile || (isMobile && showConversations)) && (
              <View style={styles.conversationsContainer}>
              <Text style={styles.sectionTitle}>Conversations</Text>
              <FlatList
                data={conversations}
                renderItem={renderConversationItem}
                keyExtractor={(item) => item.id}
                style={styles.conversationsList}
                showsVerticalScrollIndicator={false}
              />
              </View>
            )}

            {/* Chat Messages */}
            {(!isMobile || (isMobile && !showConversations)) && (
              <View style={styles.chatContainer}>
              {selectedConversation ? (
                <>
                  <View style={styles.chatHeader}>
                    {isMobile && (
                      <TouchableOpacity
                        style={styles.backButton}
                        onPress={toggleView}
                      >
                        <Text style={styles.backButtonText}>←</Text>
                      </TouchableOpacity>
                    )}
                    <Text style={styles.chatHeaderText}>
                      Chat with {selectedConversation.userName}
                    </Text>
                  </View>
                  <FlatList
                    ref={chatListRef}
                    data={selectedConversation.messages}
                    renderItem={renderMessageItem}
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
                </>
              ) : (
                <View style={styles.noChatSelected}>
                  <Text style={styles.noChatSelectedText}>
                    {isMobile ? "Select a conversation from the list" : "Select a conversation to start chatting"}
                  </Text>
                </View>
              )}
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// Create styles function that takes colors and isMobile as parameters
const createStyles = (colors: any, isMobile: boolean) => StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.bgBase || Colors.light.bgBase,
  },
  wrapper: {
    flex: 1,
    paddingTop: 40, // For status bar
  },
  content: {
    flex: 1,
    flexDirection: isMobile ? 'column' : 'row',
  },
  mobileNavBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.textMuted || Colors.light.textMuted,
    marginBottom: SPACING.sm,
  },
  mobileNavButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  mobileNavButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.brand || Colors.light.brand,
  },
  mobileNavButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textHeading || Colors.light.textHeading,
  },
  mobileNavButtonTextDisabled: {
    color: colors.textMuted || Colors.light.textMuted,
  },
  
  // Header styles
  headerTitle: {
    color: colors.textHeading || Colors.light.textHeading,
    fontSize: 24,
    fontWeight: "bold",
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  
  // Conversations list styles
  conversationsContainer: {
    width: isMobile ? '100%' : '35%',
    borderRightWidth: isMobile ? 0 : 1,
    borderRightColor: colors.textMuted || Colors.light.textMuted,
    flex: isMobile ? 1 : undefined,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textHeading || Colors.light.textHeading,
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: isMobile ? SPACING.md + 2 : SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.textMuted || Colors.light.textMuted,
  },
  conversationItemSelected: {
    backgroundColor: colors.bgElevated || Colors.light.bgElevated,
  },
  conversationAvatar: {
    width: isMobile ? 60 : 50,
    height: isMobile ? 60 : 50,
    borderRadius: isMobile ? 30 : 25,
    backgroundColor: colors.brand || Colors.light.brand,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  conversationAvatarText: {
    color: 'white',
    fontSize: isMobile ? 24 : 20,
    fontWeight: 'bold',
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conversationName: {
    fontWeight: 'bold',
    color: colors.textHeading || Colors.light.textHeading,
    fontSize: isMobile ? 18 : 16,
  },
  conversationTime: {
    color: colors.textMuted || Colors.light.textMuted,
    fontSize: 12,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationLastMessage: {
    color: colors.textBody || Colors.light.textBody,
    fontSize: isMobile ? 16 : 14,
    flex: 1,
  },
  conversationBadge: {
    backgroundColor: colors.brand || Colors.light.brand,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  conversationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Chat container styles
  chatContainer: {
    flex: 1,
    width: isMobile ? '100%' : '65%',
  },
  chatHeader: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.textMuted || Colors.light.textMuted,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: SPACING.md,
    padding: SPACING.xs,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.brand || Colors.light.brand,
  },
  chatHeaderText: {
    fontSize: isMobile ? 20 : 18,
    fontWeight: 'bold',
    color: colors.textHeading || Colors.light.textHeading,
  },
  chatList: {
    flex: 1,
    padding: SPACING.md,
  },
  chatListContent: {
    paddingBottom: SPACING.md,
  },
  noChatSelected: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatSelectedText: {
    color: colors.textMuted || Colors.light.textMuted,
    fontSize: 16,
  },
  
  // Message styles
  messageContainer: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    maxWidth: isMobile ? '90%' : '80%',
  },
  messageAdmin: {
    alignSelf: 'flex-end',
    backgroundColor: colors.brand || Colors.light.brand,
  },
  messageUser: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brandDark || Colors.light.brandDark,
  },
  messageSender: {
    color: 'white',
    fontWeight: "bold",
  },
  messageText: {
    color: 'white',
    marginVertical: SPACING.xs,
  },
  messageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'right',
  },
  
  // Input styles
  inputContainer: {
    flexDirection: "row",
    padding: SPACING.md,
    backgroundColor: colors.bgElevated || Colors.light.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.textMuted || Colors.light.textMuted,
  },
  inputField: {
    flex: 1,
    height: isMobile ? 50 : 40,
    backgroundColor: colors.bgSection || Colors.light.bgSection,
    color: colors.textBody || Colors.light.textBody,
    paddingLeft: SPACING.md,
    borderRadius: RADIUS.md,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: colors.textMuted || Colors.light.textMuted,
    fontSize: isMobile ? 16 : 14,
  },
  inputButton: {
    backgroundColor: colors.brand || Colors.light.brand,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isMobile ? SPACING.md + 4 : SPACING.md,
    borderRadius: RADIUS.md,
  },
  inputButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: isMobile ? 16 : 14,
  }
});