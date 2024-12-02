import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiAuthError, ApiError } from '../types/api';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const apiCall = (url: string, token?: string, options?: AxiosRequestConfig) => {
  return axios({
    method: 'GET',
    url: `${BACKEND_URL}/api${url}`,
    ...options,
    headers: {
      ...options?.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const fetchApi = async (
  url: string,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<any, any>> => {
  try {
    const token = localStorage.getItem('token') || undefined;
    const response = await apiCall(url, token, options);

    return response;
  } catch (response: any) {
    if (response.status !== 401) {
      throw response;
    }

    const refresh = localStorage.getItem('refresh');
    if (!refresh) {
      localStorage.removeItem('token');
      throw response;
    } else {
      const refreshedToken = await refreshToken();

      if (refreshedToken.status === 401) {
        localStorage.removeItem('refresh');
        localStorage.removeItem('token');
        throw response;
      }

      try {
        localStorage.setItem('token', refreshedToken.data.access);
        return await apiCall(url, refreshedToken.data.access, options);
      } catch (e: any) {
        if (e.status === 401) {
          localStorage.removeItem('refresh');
          localStorage.removeItem('token');
        }

        throw e;
      }
    }
  }
};

const refreshToken = async (): Promise<AxiosResponse<any, any>> => {
  try {
    const refresh = localStorage.getItem('refresh')!;

    return await apiCall('/auth/refresh', '', {
      method: 'POST',
      data: {
        refresh,
      },
    });
  } catch (e) {
    return e as AxiosResponse<any, any>;
  }
};

export const handleError = (error: any) => {
  if (error.response.data.detail) {
    throw error.response.data as ApiError;
  }

  throw { detail: 'Something went wrong. Please try again' } as ApiError;
};

export const handleAuthError = (message: any) => {
  const { success, ...fields } = message;

  const errors = Object.entries(fields).reduce((acc, [key, value]: [string, any]) => {
    acc[key] = value?.[0];
    return acc;
  }, {} as Record<string, string>);

  throw errors as ApiAuthError;
};

export const getStaticFile = (url: string) => {
  return `${BACKEND_URL}${url}`;
};
