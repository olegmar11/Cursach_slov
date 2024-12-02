import { create } from 'zustand';
import { IUser } from '../types/user';

interface IUserStore {
  user: IUser | null;
}

interface IUserStoreActions {
  setUser: (user: IUser | null) => void;
  logout: () => void;
}

const defaultUser = {
  user: null,
};

export const useUserStore = create<IUserStore & IUserStoreActions>(set => ({
  ...defaultUser,
  setUser: (user: IUser | null) => set({ user }),
  logout: () => set({ user: null }),
}));
