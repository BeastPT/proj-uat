import { View, Text, StyleSheet, FlatList } from "react-native";
import { Stack } from "expo-router";

// Sample chat data
const chatData = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, how are you doing?',
    time: '10:30 AM',
    unread: 2,
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage: 'Are you coming to the event?',
    time: 'Yesterday',
    unread: 0,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    lastMessage: 'The project looks great!',
    time: 'Yesterday',
    unread: 0,
  },
  {
    id: '4',
    name: 'Sarah Williams',
    lastMessage: 'Thanks for your help!',
    time: 'Monday',
    unread: 0,
  },
];

export default function Chat() {
  return (
    <>
      <Stack.Screen options={{ title: "Chat", headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Messages</Text>
          <FlatList
            data={chatData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.chatItem}>
                <View style={styles.avatar} />
                <View style={styles.chatInfo}>
                  <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.chatTime}>{item.time}</Text>
                  </View>
                  <View style={styles.chatFooter}>
                    <Text style={styles.chatMessage} numberOfLines={1}>
                      {item.lastMessage}
                    </Text>
                    {item.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{item.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090B",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1D",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#333",
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  chatName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  chatTime: {
    color: "#999",
    fontSize: 12,
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatMessage: {
    color: "#999",
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: "#5D5FEF",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});