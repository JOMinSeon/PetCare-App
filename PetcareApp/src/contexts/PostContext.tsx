import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Post, CreatePostInput } from '../types/post.types';
import * as postService from '../services/post.service';

interface PostContextType {
  posts: Post[];
  selectedPost: Post | null;
  isLoading: boolean;
  error: string | null;
  fetchFeed: () => Promise<void>;
  createPost: (input: CreatePostInput) => Promise<Post>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  clearError: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await postService.getFeed();
      setPosts(data);
    } catch (err) {
      const cachedPosts = await postService.getCachedPosts();
      if (cachedPosts.length > 0) {
        setPosts(cachedPosts);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch feed');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPost = useCallback(async (input: CreatePostInput): Promise<Post> => {
    setError(null);
    const newPost = await postService.createPost(input);
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  }, []);

  const toggleLike = useCallback(async (postId: string) => {
    try {
      const result = await postService.likePost(postId);
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, likes: result.likes, isLiked: result.isLiked }
          : p
      ));
      if (selectedPost?.id === postId) {
        setSelectedPost(prev => prev ? { ...prev, likes: result.likes, isLiked: result.isLiked } : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like post');
    }
  }, [selectedPost]);

  const addComment = useCallback(async (postId: string, content: string) => {
    try {
      await postService.addComment(postId, { content });
      const updatedPost = await postService.getPostById(postId);
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      if (selectedPost?.id === postId) {
        setSelectedPost(updatedPost);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    }
  }, [selectedPost]);

  const deletePost = useCallback(async (postId: string) => {
    setError(null);
    await postService.deletePost(postId);
    setPosts(prev => prev.filter(p => p.id !== postId));
    if (selectedPost?.id === postId) {
      setSelectedPost(null);
    }
  }, [selectedPost]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <PostContext.Provider
      value={{
        posts,
        selectedPost,
        isLoading,
        error,
        fetchFeed,
        createPost,
        toggleLike,
        addComment,
        deletePost,
        clearError,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePost(): PostContextType {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within PostProvider');
  }
  return context;
}

export default PostContext;