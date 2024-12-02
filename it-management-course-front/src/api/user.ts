import { ApiResponse } from '../types/api';
import { IUser } from '../types/user';
import { fetchApi, handleError } from './api';

export interface SingleUserResponse {
  profile: IUser;
}

interface BecomeWriterRequest {
  author_pseudo: string;
}

export const deleteUser = async (): Promise<ApiResponse<unknown> | undefined> => {
  // TODO: Implement properly when endpoint is available
  try {
    const res = await fetchApi('/auth/profile', {
      method: 'DELETE',
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};

export const updateUser = async (
  data: FormData
): Promise<ApiResponse<SingleUserResponse> | undefined> => {
  try {
    const res = await fetchApi('/auth/profile', {
      method: 'PATCH',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};

export const becomeWriter = async (
  data: BecomeWriterRequest
): Promise<ApiResponse<SingleUserResponse> | undefined> => {
  try {
    const res = await fetchApi('/auth/writer', {
      method: 'POST',
      data,
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};
