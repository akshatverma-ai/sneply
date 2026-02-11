import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  TextInput,
  Dimensions,
  Modal
} from 'react-native';
import { useAuth } from '../context/AppContext';
import { COLORS } from '../constants';

const { width, height } = Dimensions.get('window');

// Mock creator rooms data
const creatorRooms = [
  {
    id: '1',
    creatorId: 'creator1',
    creatorName: 'TechWizard',
    creatorAvatar: 'https://picsum.photos/seed/tech/100/100',
    name: 'Coding Masters',
    description: 'Learn advanced coding techniques',
    members: 1234,
    isLive: true,
    lastMessage: 'Just discovered an amazing React hook!',
    lastMessageTime: '2m ago',
    category: 'Technology',
  },
  {
    id: '2',
    creatorId: 'creator2',
    creatorName: 'FoodieLife',
    creatorAvatar: 'https://picsum.photos/seed/food/100/100',
    name: 'Recipe Exchange',
    description: 'Share and discover amazing recipes',
    members: 892,
    isLive: true,
    lastMessage: 'Anyone tried the new air fryer recipe?',
    lastMessageTime: '5m ago',
    category: 'Food',
  },
  {
    id: '3',
    creatorId: 'creator3',
    creatorName: 'PhilosopherPro',
    creatorAvatar: 'https://picsum.photos/seed/philosophy/100/100',
    name: 'Deep Thoughts',
    description: 'Philosophical discussions and debates',
    members: 567,
    isLive: false,
    lastMessage: 'Consciousness is such a fascinating topic',
    lastMessageTime: '1h ago',
    category: 'Philosophy',
  },
  {
    id: '4',
    creatorId: 'creator4',
    creatorName: 'FitnessGuru',
    creatorAvatar: 'https://picsum.photos/seed/fitness/100/100',
    name: 'Fitness Motivation',
    description: 'Get fit together with daily challenges',
    members: 2341,
    isLive: true,
    lastMessage: 'Who\'s ready for today\'s workout challenge? 💪',
    lastMessageTime: '10m ago',
    category: 'Fitness',
  },
];

// Mock chat messages for room detail
const mockMessages = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Alex Chen',
    userAvatar: 'https://picsum.photos/seed/alex/50/50',
    content: 'This room is amazing! Love the content',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isCreator: false,
  },
  {
    id: '2',
    userId: 'creator1',
    userName: 'TechWizard',
    userAvatar: 'https://picsum.photos/seed/tech/50/50',
    content: 'Thanks everyone! Today we\'ll discuss React Native performance optimization',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    isCreator: true,
  },
  {
    id: '3',
    userId: 'user2',
    userName: 'Sarah Miller',
    userAvatar: 'https://picsum.photos/seed/sarah/50/50',
    content: 'Can we talk about state management best practices?',
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
    isCreator: false,
  },
];

export default function ChatScreen() {
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<typeof creatorRooms[0] | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return date.toLocaleDateString();
  };

  const sendMessage = () => {
    if (message.trim() && selectedRoom && user) {
      const newMessage = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.displayName,
        userAvatar: user.avatar || '',
        content: message.trim(),
        timestamp: new Date(),
        isCreator: false,
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const renderRoomItem = ({ item }: { item: typeof creatorRooms[0] }) => (
    <TouchableOpacity 
      style={styles.roomCard}
      onPress={() => setSelectedRoom(item)}
    >
      <View style={styles.roomHeader}>
        <View style={styles.creatorInfo}>
          <View style={styles.avatar} />
          <View style={styles.creatorDetails}>
            <Text style={styles.creatorName}>{item.creatorName}</Text>
            <Text style={styles.roomName}>{item.name}</Text>
          </View>
          {item.isLive && (
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>🔴 LIVE</Text>
            </View>
          )}
        </View>
        
        <View style={styles.memberCount}>
          <Text style={styles.memberText}>{item.members} members</Text>
        </View>
      </View>
      
      <Text style={styles.roomDescription}>{item.description}</Text>
      
      <View style={styles.roomFooter}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.lastMessageTime}>{item.lastMessageTime}</Text>
      </View>
      
      <Text style={styles.lastMessage} numberOfLines={1}>
        {item.lastMessage}
      </Text>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: typeof mockMessages[0] }) => (
    <View style={[
      styles.messageContainer,
      item.isCreator && styles.creatorMessage,
    ]}>
      <View style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={[
          styles.userName,
          item.isCreator && styles.creatorName,
        ]}>
          {item.userName} {item.isCreator && '✨'}
        </Text>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
      </View>
    </View>
  );

  if (selectedRoom) {
    return (
      <View style={styles.container}>
        {/* Room Header */}
        <View style={styles.roomDetailHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedRoom(null)}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          
          <View style={styles.roomTitleContainer}>
            <Text style={styles.roomTitle}>{selectedRoom.name}</Text>
            <Text style={styles.roomSubtitle}>by {selectedRoom.creatorName}</Text>
          </View>
          
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinText}>Joined</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
        />

        {/* Message Input */}
        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.textTertiary}
            multiline
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Creator Rooms</Text>
        <Text style={styles.subtitle}>Join live conversations with your favorite creators</Text>
        
        <TouchableOpacity 
          style={styles.createRoomButton}
          onPress={() => setShowNewRoomModal(true)}
        >
          <Text style={styles.createRoomText}>+ Create Room</Text>
        </TouchableOpacity>
      </View>

      {/* Rooms List */}
      <FlatList
        data={creatorRooms}
        renderItem={renderRoomItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.roomsList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* New Room Modal */}
      <Modal
        visible={showNewRoomModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNewRoomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Creator Room</Text>
            <Text style={styles.modalDescription}>
              Start your own live chat room and connect with your audience
            </Text>
            
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowNewRoomModal(false)}
            >
              <Text style={styles.modalButtonText}>Coming Soon</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowNewRoomModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
    textShadowColor: COLORS.secondary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  createRoomButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  createRoomText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  roomsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  roomCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceHover,
    marginRight: 12,
  },
  creatorDetails: {
    flex: 1,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  roomName: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  liveBadge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '700',
  },
  memberCount: {
    backgroundColor: COLORS.surfaceHover,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  memberText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  roomDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '600',
    backgroundColor: COLORS.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lastMessageTime: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.text,
    fontStyle: 'italic',
  },
  roomDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 12,
  },
  backText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  roomTitleContainer: {
    flex: 1,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  roomSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  joinButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  joinText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  creatorMessage: {
    backgroundColor: COLORS.surface + '30',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
  },
  messageContent: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  creatorName: {
    color: COLORS.secondary,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  messageInputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.surfaceHover,
  },
  sendText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    width: width * 0.8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: COLORS.accent,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalCancelButton: {
    padding: 12,
  },
  modalCancelText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
