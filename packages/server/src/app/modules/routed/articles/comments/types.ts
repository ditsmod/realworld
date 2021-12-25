export interface DbComment {
  commentId: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  username: string;
  bio: string;
  image: string;
  following: 1 | 0;
}