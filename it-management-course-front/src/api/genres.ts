import { ApiPagination, ApiResponse } from '../types/api';
import { IGenre } from '../types/genre';
import { fetchApi, handleError } from './api';

interface GenresResponse {
  page: ApiPagination;
  stories: IGenre[];
}

export const getGenres = async (): Promise<ApiResponse<GenresResponse> | undefined> => {
  try {
    const res = await fetchApi('/stories/get_genres', {
      method: 'GET',
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};
