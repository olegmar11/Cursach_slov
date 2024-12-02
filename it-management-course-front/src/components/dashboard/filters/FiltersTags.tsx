import { Group, Select, Stack } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchTags } from '../../../api/tags';
import { ITag } from '../../../types/tag';
import { getRandomBadgeColor } from '../../../utils/colors';
import { useStoriesStore } from '../../../zustand/storiesStore';
import BadgeX from '../../common/BadgeX';

const FiltersTags = () => {
  const { tags: tagsSelectedIds, addTag, removeTag } = useStoriesStore();
  const [value, setValue] = useState('');
  const [tags, setTags] = useState<ITag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const tagsOptions = useMemo(() => {
    return tags.filter(tag => !tagsSelectedIds.has(tag.id));
  }, [tagsSelectedIds, tags]);

  const tagsSelected = useMemo(() => {
    return tags.filter(tag => tagsSelectedIds.has(tag.id));
  }, [tagsSelectedIds, tags]);

  useEffect(() => {
    setIsLoading(true);
    fetchTags()
      .then(res => {
        setTags(res?.data.stories || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return isLoading ? (
    'Loading...'
  ) : (
    <Stack>
      <Select
        data={tagsOptions.map(tag => ({ value: tag.id.toString(), label: tag.tag }))}
        searchable
        clearable
        placeholder={t('filterTagsPlaceholder')}
        rightSection
        onChange={(_value, option) => {
          addTag(+option.value);
        }}
        searchValue={value}
        onSearchChange={setValue}
        onDropdownClose={() => {
          setValue('');
        }}
        limit={6}
      />

      <Group>
        {[...tagsSelected.values()].map(tag => (
          <BadgeX
            key={tag.id}
            tag={tag}
            color={getRandomBadgeColor(tag.id)}
            onClick={() => removeTag(tag.id)}
          />
        ))}
      </Group>
    </Stack>
  );
};

export default FiltersTags;
