import { ApiPagination, ApiResponse } from '../types/api';
import { ITag } from '../types/tag';
import { fetchApi, handleError } from './api';

interface TagsResponse {
  page: ApiPagination;
  stories: ITag[];
}

export const fetchTags = async (): Promise<ApiResponse<TagsResponse> | undefined> => {
  try {
    const res = await fetchApi('/stories/get_tags', {
      method: 'GET',
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};
