import { Select } from '@mantine/core';
import { FC, useMemo, useState } from 'react';
import { IGenre } from '../../types/genre';
import { useTranslation } from 'react-i18next';

interface GenresSelectorProps {
  selectedGenre: IGenre | null;
  setSelectedGenre: (genre: IGenre | null) => void;
  genres: IGenre[];
  disabled?: boolean;
}

const GenresSelector: FC<GenresSelectorProps> = ({
  selectedGenre,
  setSelectedGenre,
  genres,
  disabled,
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  const handleSelectGenre = (genreId: number) => {
    if (genreId === selectedGenre?.id) {
      setSelectedGenre(null);
    }

    setSelectedGenre(genres.find(genre => genre.id === genreId) || selectedGenre);
  };

  const genresOptions = useMemo(
    () =>
      [...genres]
        .sort((a, b) => a.genre.localeCompare(b.genre))
        .map(genre => ({ value: genre.id.toString(), label: genre.genre })),
    [genres]
  );

  return (
    <Select
      disabled={disabled}
      withAsterisk
      label={t('createStoryGenre')}
      placeholder={t('createStoryGenrePlaceholder')}
      data={genresOptions}
      onChange={(_value, option) => {
        handleSelectGenre(+option.value);
      }}
      searchValue={value}
      onSearchChange={setValue}
      value={genresOptions.find(genre => genre.value === selectedGenre?.id?.toString())?.value}
    />
  );
};

export default GenresSelector;
