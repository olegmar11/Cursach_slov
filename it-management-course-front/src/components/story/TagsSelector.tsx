import { Group, Select, Stack } from '@mantine/core';
import { FC, useMemo, useState } from 'react';
import { ITag } from '../../types/tag';
import { getRandomBadgeColor } from '../../utils/colors';
import BadgeX from '../common/BadgeX';
import { useTranslation } from 'react-i18next';

interface TagsSelectorProps {
  tagsSelectedIds: Set<ITag>;
  addTag: (tag: ITag) => void;
  removeTag: (tag: ITag) => void;
  tags: ITag[];
  disabled?: boolean;
}

const TagsSelector: FC<TagsSelectorProps> = ({
  addTag,
  removeTag,
  tagsSelectedIds,
  tags,
  disabled,
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  const tagsOptions = useMemo(() => {
    const set = new Set<number>([...tagsSelectedIds].map(t => t.id));

    return tags.filter(tag => !set.has(tag.id));
  }, [tagsSelectedIds, tags]);

  const tagsSelected = useMemo(() => {
    const set = new Set<number>([...tagsSelectedIds].map(t => t.id));

    return tags.filter(tag => set.has(tag.id));
  }, [tagsSelectedIds, tags]);

  return (
    <Stack>
      <Select
        disabled={disabled}
        label={t('createStoryTags')}
        placeholder={t('createStoryTagsPlaceholder')}
        withAsterisk
        data={tagsOptions.map(tag => ({ value: tag.id.toString(), label: tag.tag }))}
        searchable
        clearable
        rightSection
        onChange={(_value, option) => {
          addTag(tagsOptions.find(tag => tag.id === +option.value)!);
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
            onClick={() => removeTag(tag)}
          />
        ))}
      </Group>
    </Stack>
  );
};

export default TagsSelector;
