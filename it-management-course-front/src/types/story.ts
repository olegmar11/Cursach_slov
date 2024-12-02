import { IGenre } from './genre';
import { ITag } from './tag';

export interface IStory {
  id: number;
  creator_id: {
    id: number;
    avatar: string;
    writer_pseudo: string;
  };
  created: string;
  genre: IGenre;
  tags: ITag[];
  views_count: number;
  comments_count: number;
  dislikes_count: number;
  likes_count: number;
  post_description: string;
  post_image: string;
  post_text: string;
  post_title: string;
}
