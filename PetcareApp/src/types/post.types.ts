export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  petId?: string;
  petName?: string;
  imageUrl: string;
  caption: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  createdAt: string;
}

export interface CreatePostInput {
  petId?: string;
  imageUrl: string;
  caption: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface CreateCommentInput {
  content: string;
}

export interface LikeResponse {
  likes: number;
  isLiked: boolean;
}