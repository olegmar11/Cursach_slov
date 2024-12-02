import { ApiResponse } from '../types/api';
import { fetchApi, handleError } from './api';
import { SingleUserResponse } from './user';

export const getProfile = async (
  userId?: string
): Promise<ApiResponse<SingleUserResponse> | undefined> => {
  try {
    const res = await fetchApi(`/auth/profile${userId ? `?user=${userId}` : ''}`, {
      method: 'GET',
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};
