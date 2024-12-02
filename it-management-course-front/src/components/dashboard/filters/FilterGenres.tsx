import { Checkbox, SimpleGrid } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getGenres } from '../../../api/genres';
import { IGenre } from '../../../types/genre';
import { useStoriesStore } from '../../../zustand/storiesStore';

const FilterGenres = () => {
  const { genres: genresSelected, addGenre, removeGenre } = useStoriesStore();
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getGenres()
      .then(res => {
        setGenres(res?.data.stories || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <SimpleGrid cols={2}>
      {isLoading
        ? 'Loading...'
        : genres.map(genre => (
            <Checkbox
              key={genre.id}
              label={genre.genre}
              checked={genresSelected.has(genre.id)}
              onChange={event =>
                event.currentTarget.checked ? addGenre(genre.id) : removeGenre(genre.id)
              }
              styles={{
                input: {
                  cursor: 'pointer',
                },
                label: {
                  cursor: 'pointer',
                },
              }}
            />
          ))}
    </SimpleGrid>
  );
};

export default FilterGenres;
