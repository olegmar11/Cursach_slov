import { Group, Select, Stack } from '@mantine/core';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ITag } from '../../types/tag';
import { getRandomBadgeColor } from '../../utils/colors';
import BadgeX from '../common/BadgeX';

interface TagsSelectorProps {
  tagsSelected: Set<ITag>;
  addTag: (tag: ITag | string) => void;
  removeTag: (tag: ITag | string) => void;
  tags: ITag[];
  disabled?: boolean;
  customTags: Set<string>;
}

const TagsSelector: FC<TagsSelectorProps> = ({
  addTag,
  removeTag,
  tagsSelected,
  tags,
  disabled,
  customTags
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  const tagsOptions = useMemo(() => {
    const set = new Set<number>([...tagsSelected].map(t => t.id));

    return tags.filter(tag => !set.has(tag.id));
  }, [tagsSelected, tags]);

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
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            event.stopPropagation();

            if (event.key === 'Enter') {
                const tag = tagsOptions.find(tag => tag.tag === value)

                if (tag) {
                  addTag(tag);
                } else if (!tag && value.length > 0) {
                  addTag(value);
                }
                setValue('');
            }
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

        {[...customTags.values()].map((tag, index) => (
          <BadgeX
            key={tag}
            tag={tag}
            color={getRandomBadgeColor(index)}
            onClick={() => removeTag(tag)}
          />
        ))}
      </Group>
    </Stack>
  );
};

export default TagsSelector;
