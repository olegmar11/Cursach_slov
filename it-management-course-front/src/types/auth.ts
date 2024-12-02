import { IUser } from './user';

export interface ISignupFormValues {
  username: string;
  password: string;
  password2: string;
}

export interface ISigninFormValues {
  username: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  message: string;
  refresh: string;
  success: boolean;
  data: IUser;
}
