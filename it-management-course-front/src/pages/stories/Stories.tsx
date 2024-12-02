import { Grid, Stack } from '@mantine/core';
import { FC, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Filters from '../../components/dashboard/filters/Filters';
import SearchBar from '../../components/dashboard/filters/SearchBar';
import StoriesList from '../../components/dashboard/StoriesList';
import { SortType } from '../../types/sort';
import { deserializedSortBy } from '../../utils/query';
import { useStoriesStore } from '../../zustand/storiesStore';

const Stories: FC = () => {
  const { setGenres, setPage, setSearch, setSortBy, setSortType, setTags } = useStoriesStore();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    searchParams.forEach((value, key) => {
      switch (key) {
        case 'genres':
          setGenres(value.split(',').map(Number));
          break;
        case 'tags':
          setTags(value.split(',').map(Number));
          break;
        case 'page':
          setPage(+value);
          break;
        case 'search':
          setSearch(value);
          break;
        case 'sortBy':
          setSortBy(deserializedSortBy[value]);
          break;
        case 'sortType':
          setSortType((value as SortType) === SortType.ASC ? '' : '-');
          break;
      }
    });
  }, []);

  return (
    <Stack
      styles={{
        root: {
          minHeight: '95vh',
        },
      }}
    >
      <Grid flex={1} align="stretch">
        <Grid.Col span={{ base: 12, sm: 5, md: 3 }}>
          <Filters />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 7, md: 9 }}>
          <Stack>
            <SearchBar />

            <StoriesList />
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default Stories;
