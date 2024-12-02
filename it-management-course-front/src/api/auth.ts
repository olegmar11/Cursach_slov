import { AuthResponse, ISigninFormValues, ISignupFormValues } from '../types/auth';
import { fetchApi, handleAuthError, handleError } from './api';

export const signUp = async (data: ISignupFormValues): Promise<AuthResponse> => {
  const res = await fetchApi('/auth/signup', {
    method: 'POST',
    data,
  });

  if (!res?.data?.message?.success && !res.data.success) {
    throw handleAuthError(res.data.message);
  }

  return res.data;
};

export const signIn = async (data: ISigninFormValues): Promise<AuthResponse | undefined> => {
  try {
    const res = await fetchApi('/auth/login', {
      method: 'POST',
      data,
    });

    return res.data;
  } catch (e) {
    handleError(e);
  }
};
