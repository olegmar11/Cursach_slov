import { create } from 'zustand';
import { ApiPagination } from '../types/api';
import { SortBy } from '../types/sort';
import { IStory } from '../types/story';

interface IStoryStore {
  sortBy: SortBy;
  sortType: string;
  genres: Set<number>;
  tags: Set<number>;
  search: string;
  isFetching: boolean;
  stories: IStory[];
  page: number;
  pagination: ApiPagination | null;
}

interface IStoryStoreActions {
  resetFilters: () => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortType: (sortType: string) => void;
  addGenre: (genreId: number) => void;
  removeGenre: (genreId: number) => void;
  setGenres: (genres: number[]) => void;
  addTag: (tag: number) => void;
  removeTag: (tag: number) => void;
  setTags: (tags: number[]) => void;
  setSearch: (search: string) => void;
  setFetching: (isFetching: boolean) => void;
  setStories: (stories: IStory[]) => void;
  setPage: (page: number) => void;
  setPagination: (pagination: ApiPagination | null) => void;
}

const defaultFilters: IStoryStore = {
  sortBy: SortBy.POPULARITY,
  sortType: '-',
  genres: new Set<number>(),
  tags: new Set<number>(),
  search: '',
  isFetching: false,
  stories: [],
  page: 1,
  pagination: null,
};

export const useStoriesStore = create<IStoryStore & IStoryStoreActions>(set => ({
  ...defaultFilters,
  resetFilters: () => set(defaultFilters),
  setSortBy: (sortBy: SortBy) => set({ sortBy }),
  setSortType: (sortType: string) => set({ sortType }),
  addGenre: (genreId: number) =>
    set(state => {
      const genres = new Set(state.genres);
      genres.add(genreId);

      return { genres };
    }),
  removeGenre: (genreId: number) =>
    set(state => {
      const genres = new Set(state.genres);
      genres.delete(genreId);

      return { genres };
    }),
  setGenres: (genres: number[]) => set({ genres: new Set(genres) }),
  addTag: (tagId: number) =>
    set(state => {
      const tags = new Set(state.tags);
      tags.add(tagId);

      return { tags };
    }),
  removeTag: (tagId: number) =>
    set(state => {
      const tags = new Set(state.tags);
      tags.delete(tagId);

      return { tags };
    }),
  setTags: (tags: number[]) => set({ tags: new Set(tags) }),
  setSearch: (search: string) => set({ search }),
  setFetching: (isFetching: boolean) => set({ isFetching }),
  setStories: (stories: IStory[]) => set({ stories }),
  setPage: (page: number) => set({ page }),
  setPagination: (pagination: ApiPagination | null) => set({ pagination }),
}));
