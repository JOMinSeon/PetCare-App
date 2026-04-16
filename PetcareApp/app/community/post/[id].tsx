import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePost } from '../../../src/contexts/PostContext';
import { Post, Comment } from '../../../src/types/post.types';

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  return date.toLocaleDateString('ko-KR');
}

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { posts, toggleLike, addComment, deletePost } = usePost();
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const post = posts.find(p => p.id === id);

  useEffect(() => {
    if (!post && id) {
    }
  }, [id, post]);

  const handleLike = async () => {
    if (!id) return;
    try {
      await toggleLike(id);
    } catch (err) {
      Alert.alert('오류', '좋아요 처리 중 오류가 발생했습니다');
    }
  };

  const handleSubmitComment = async () => {
    if (!id || !commentText.trim()) return;
    
    setSubmitting(true);
    try {
      await addComment(id, commentText.trim());
      setCommentText('');
    } catch (err) {
      Alert.alert('오류', '댓글 작성에 실패했습니다');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!id) return;
    Alert.alert(
      '게시물 삭제',
      '이 게시물을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(id);
              router.back();
            } catch (err) {
              Alert.alert('오류', '게시물 삭제에 실패했습니다');
            }
          },
        },
      ]
    );
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentAvatar}>
        {item.userAvatar ? (
          <Image source={{ uri: item.userAvatar }} style={styles.commentAvatarImage} />
        ) : (
          <View style={[styles.commentAvatarImage, styles.commentAvatarPlaceholder]}>
            <Text style={styles.commentAvatarInitial}>{item.userName[0]}</Text>
          </View>
        )}
      </View>
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUserName}>{item.userName}</Text>
          <Text style={styles.commentTime}>{timeAgo(item.createdAt)}</Text>
        </View>
        <Text style={styles.commentText}>{item.content}</Text>
      </View>
    </View>
  );

  if (!post) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <FlatList
        data={post.comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                {post.userAvatar ? (
                  <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarInitial}>{post.userName[0]}</Text>
                  </View>
                )}
                <View>
                  <Text style={styles.userName}>{post.userName}</Text>
                  {post.petName && <Text style={styles.petName}>🐾 {post.petName}</Text>}
                </View>
              </View>
              <Text style={styles.timeAgo}>{timeAgo(post.createdAt)}</Text>
            </View>

            <Image source={{ uri: post.imageUrl }} style={styles.postImage} />

            <View style={styles.postContent}>
              <Text style={styles.caption}>{post.caption}</Text>
            </View>

            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                <Text style={styles.actionEmoji}>{post.isLiked ? '❤️' : '🤍'}</Text>
                <Text style={styles.actionText}>{post.likes} 좋아요</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionEmoji}>💬</Text>
                <Text style={styles.actionText}>{post.comments.length} 댓글</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>댓글</Text>
            </View>
          </>
        }
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="댓글을 입력하세요..."
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmitComment}
          disabled={submitting || !commentText.trim()}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>전송</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 80,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  petName: {
    fontSize: 12,
    color: '#666666',
  },
  timeAgo: {
    fontSize: 12,
    color: '#999999',
  },
  postImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  postContent: {
    padding: 16,
  },
  caption: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  postActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionEmoji: {
    fontSize: 20,
    marginRight: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#666666',
  },
  commentsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  commentItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentAvatar: {
    marginRight: 12,
  },
  commentAvatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentAvatarPlaceholder: {
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarInitial: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: '#999999',
  },
  commentText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#f5f5f5',
    maxHeight: 80,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#99ccff',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});