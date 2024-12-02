import { ApiPagination, ApiResponse } from '../types/api';
import { IComment } from '../types/comment';
import { transformToQuery } from '../utils/query';
import { fetchApi, handleError } from './api';

export enum CommentsQueryParams {
  STORY_ID = 'story_id',
  PARENT_COMMENT_ID = 'parent_comment_id',
}

export interface CommentsResponse {
  page: ApiPagination;
  data: IComment[];
}

export const getComments = async (
  query?: Partial<Record<CommentsQueryParams, string>>
): Promise<ApiResponse<CommentsResponse> | undefined> => {
  try {
    const res = await fetchApi(`/comments/all?${query ? transformToQuery(query) : ''}`, {
      method: 'GET',
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};

export const reactToComment = async (
  commentId: string,
  type: 'like' | 'dislike' = 'like'
): Promise<ApiResponse<IComment> | undefined> => {
  try {
    const res = await fetchApi('/comments/react', {
      method: 'POST',
      data: { comment_id: commentId, type },
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};

export const createComment = async (
  data: Partial<Record<CommentsQueryParams, string>> & {
    comment_body: string;
  }
): Promise<ApiResponse<IComment> | undefined> => {
  try {
    const res = await fetchApi('/comments/manipulate', {
      method: 'POST',
      data,
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};
