import { Card, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import FilterGenres from './FilterGenres';
import FiltersTags from './FiltersTags';
import SortFilters from './SortFilters';

const Filters = () => {
  const { t } = useTranslation();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{t('sortBy')}:</Text>

        <SortFilters />
      </Stack>

      <Stack justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{t('filterGenres')}:</Text>

        <FilterGenres />
      </Stack>

      <Stack justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{t('filterTags')}:</Text>

        <FiltersTags />
      </Stack>
    </Card>
  );
};

export default Filters;
