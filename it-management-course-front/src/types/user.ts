export interface IUser {
  id: number;
  avatar: string;
  user: IUserSmol;
  is_premium: boolean;
  notifications_num: number;
  reader: IReader;
  writer: IWriter | null;
}

export interface IUserSmol {
  id: number;
  username: string;
}

export interface IReader {
  id: number;
  total_stories_viewed: number;
  total_comments_made: number;
  total_liked_comments: number;
  subscribed_to: IWriter[];
}

export interface IWriter {
  id: number;
  writer_pseudo: string;
  total_stories_made: number;
  total_story_dislikes: number;
  total_story_likes: number;
  total_story_views: number;
  total_subscribers: number;
}
