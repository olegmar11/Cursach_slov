export interface IComment {
  id: number;
  created: string;
  comment_body: string;
  likes_count: number;
  dislikes_count: number;
  replies_count: number;
  creator_id: ICommentAuthor;
  story_id: number;
  parent_comment_id: number | null;
  liked: boolean;
  disliked: boolean;
}

export interface ICommentAuthor {
  id: number;
  is_premium: boolean;
  avatar: string;
  username: string;
}
