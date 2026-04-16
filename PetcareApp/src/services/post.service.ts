import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post, CreatePostInput, Comment, CreateCommentInput } from '../types/post.types';
import { getAuthHeader } from './auth.service';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const POSTS_CACHE_KEY = '@petcare_posts';

export async function getFeed(): Promise<Post[]> {
  const headers = await getAuthHeader();
  
  const response = await fetch(`${API_BASE_URL}/api/community/posts`, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch feed');
  }

  const data = await response.json();
  
  if (data.posts) {
    await AsyncStorage.setItem(POSTS_CACHE_KEY, JSON.stringify(data.posts));
  }
  
  return data.posts || [];
}

export async function getPostById(id: string): Promise<Post> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/community/posts/${id}`, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }

  return response.json();
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/community/posts`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create post');
  }

  const newPost = await response.json();
  
  const cachedPosts = await AsyncStorage.getItem(POSTS_CACHE_KEY);
  if (cachedPosts) {
    const posts = JSON.parse(cachedPosts);
    posts.unshift(newPost.post || newPost);
    await AsyncStorage.setItem(POSTS_CACHE_KEY, JSON.stringify(posts));
  }
  
  return newPost.post || newPost;
}

export async function deletePost(id: string): Promise<void> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/community/posts/${id}`, {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
  
  const cachedPosts = await AsyncStorage.getItem(POSTS_CACHE_KEY);
  if (cachedPosts) {
    const posts = JSON.parse(cachedPosts);
    const filtered = posts.filter((p: Post) => p.id !== id);
    await AsyncStorage.setItem(POSTS_CACHE_KEY, JSON.stringify(filtered));
  }
}

export async function likePost(id: string): Promise<{ likes: number; isLiked: boolean }> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/community/posts/${id}/like`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to like post');
  }

  return response.json();
}

export async function getComments(postId: string): Promise<Comment[]> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/community/posts/${postId}/comments`, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  return response.json();
}

export async function addComment(postId: string, input: CreateCommentInput): Promise<Comment> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/community/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add comment');
  }

  return response.json();
}

export async function deleteComment(postId: string, commentId: string): Promise<void> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/community/posts/${postId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete comment');
  }
}

export async function getCachedPosts(): Promise<Post[]> {
  const cached = await AsyncStorage.getItem(POSTS_CACHE_KEY);
  return cached ? JSON.parse(cached) : [];
}

export default {
  getFeed,
  getPostById,
  createPost,
  deletePost,
  likePost,
  getComments,
  addComment,
  deleteComment,
  getCachedPosts,
};