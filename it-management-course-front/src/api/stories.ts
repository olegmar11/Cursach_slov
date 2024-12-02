import { ApiPagination, ApiResponse } from '../types/api';
import { IStory } from '../types/story';
import { transformToQuery } from '../utils/query';
import { fetchApi, handleError } from './api';

interface StoriesResponse {
  page: ApiPagination;
  stories: IStory[];
}

export interface StoryResponse {
  authenticated: boolean;
  get_notifications: boolean;
  owner: boolean;
  subscribed: boolean;
  story: IStory;
  liked: boolean;
  disliked: boolean;
}

export const getStories = async (
  query?: Record<string, string>
): Promise<ApiResponse<StoriesResponse> | undefined> => {
  try {
    const res = await fetchApi(`/stories/all?${query ? transformToQuery(query) : ''}`, {
      method: 'GET',
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};

export const getStory = async (
  storyId: string
): Promise<ApiResponse<StoryResponse> | undefined> => {
  try {
    const res = await fetchApi(`/stories/single?story_id=${storyId}`, {
      method: 'GET',
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};

export const createStory = async (
  data: FormData
): Promise<ApiResponse<IStory> | undefined> => {
  try {
    const res = await fetchApi('/stories/manipulate', {
      method: 'POST',
      data,
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};

export const editStory = async (data: FormData): Promise<ApiResponse<IStory> | undefined> => {
  try {
    const res = await fetchApi('/stories/manipulate', {
      method: 'PATCH',
      data,
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};

export const deleteStory = async (data: FormData): Promise<ApiResponse<IStory> | undefined> => {
  try {
    const res = await fetchApi('/stories/manipulate', {
      method: 'DELETE',
      data,
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};

export const getWriterStories = async (
  userId?: string
): Promise<ApiResponse<StoriesResponse> | undefined> => {
  try {
    const res = await fetchApi(
      `/stories/get_writer_stories${userId ? `?author_id=${userId}` : ''}`,
      {
        method: 'GET',
      }
    );

    return res.data;
  } catch (e) {
    handleError(e);
  }
};

export const getViewedStories = async (
  userId?: string
): Promise<ApiResponse<StoriesResponse> | undefined> => {
  try {
    const res = await fetchApi(`/stories/get_viewed${userId ? `?user=${userId}` : ''}`, {
      method: 'GET',
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};

export const getLikedStories = async (
  userId?: string
): Promise<ApiResponse<StoriesResponse> | undefined> => {
  try {
    const res = await fetchApi(`/stories/get_liked${userId ? `?user=${userId}` : ''}`, {
      method: 'GET',
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};

export const reactToStory = async (
  storyId: string,
  type: 'like' | 'dislike' = 'like'
): Promise<ApiResponse<IStory> | undefined> => {
  try {
    const res = await fetchApi('/stories/react', {
      method: 'POST',
      data: { story_id: storyId, type },
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};
