import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { communityService } from '../../services';
import { Card, LoadingSpinner, EmptyState, Button } from '../../components';

export default function CommunityScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await communityService.getPosts();
      setPosts(response.posts || response);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const getCategoryColor = (category) => {
    const colors = {
      question: '#007AFF',
      share: '#34C759',
      advice: '#FF9500',
      notice: '#FF3B30',
    };
    return colors[category] || '#8E8E93';
  };

  if (isLoading && posts.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
          >
            <Card style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                {item.is_pinned && <Text style={styles.pinnedBadge}>📌</Text>}
              </View>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postContent} numberOfLines={2}>{item.content}</Text>
              <View style={styles.postFooter}>
                <Text style={styles.author}>By {item.user?.name || 'Anonymous'}</Text>
                <View style={styles.stats}>
                  <Text style={styles.stat}>👁 {item.view_count || 0}</Text>
                  <Text style={styles.stat}>❤️ {item.like_count || 0}</Text>
                  <Text style={styles.stat}>💬 {item.comment_count || 0}</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={posts.length === 0 ? styles.emptyContainer : styles.listContent}
        ListEmptyComponent={
          <EmptyState message="No posts yet. Be the first to share!" icon="💬">
            <Button title="Create Post" onPress={() => navigation.navigate('CreatePost')} size="small" />
          </EmptyState>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  listContent: { padding: 16 },
  emptyContainer: { flex: 1 },
  postCard: { marginBottom: 12 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
  pinnedBadge: { marginLeft: 8 },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  postContent: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: { fontSize: 12, color: '#8E8E93' },
  stats: { flexDirection: 'row', gap: 12 },
  stat: { fontSize: 12, color: '#8E8E93' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 100,
  },
  fabText: { fontSize: 28, color: '#fff', fontWeight: '300' },
});