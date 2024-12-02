export interface ApiError {
  detail: string;
}

export interface ApiAuthError {
  [key: string]: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiPagination {
  current: number;
  has_next: boolean;
  has_previous: boolean;
  total: number;
}
