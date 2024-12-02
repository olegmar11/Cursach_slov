import { Button, Group, Select } from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { SortBy } from '../../../types/sort';
import { serializedSortBy } from '../../../utils/query';
import { useStoriesStore } from '../../../zustand/storiesStore';
import { useTranslation } from 'react-i18next';

const filters = Object.keys(serializedSortBy);

const SortFilters = () => {
  const { sortBy, setSortBy, sortType, setSortType } = useStoriesStore();
  const { t } = useTranslation();

  return (
    <Group>
      <Select
        data={filters.map(filter => ({ value: filter, label: t(`sort${filter}`) }))}
        value={sortBy}
        onChange={value => setSortBy(value! as SortBy)}
        flex={1}
      />

      <Button variant="default" onClick={() => setSortType(sortType === '-' ? '' : '-')}>
        {sortType === '-' ? <IconSortDescending size={16} /> : <IconSortAscending size={16} />}
      </Button>
    </Group>
  );
};

export default SortFilters;
