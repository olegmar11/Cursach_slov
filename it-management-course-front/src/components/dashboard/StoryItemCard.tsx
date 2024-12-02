import {
  Badge,
  Card,
  CardProps,
  Group,
  Image,
  PolymorphicComponentProps,
  Stack,
  Text,
} from '@mantine/core';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getStaticFile } from '../../api/api';
import styles from '../../styles/components/storyItemCard.module.scss';
import { IStory } from '../../types/story';
import { getRandomBadgeColor } from '../../utils/colors';
import { useStoriesStore } from '../../zustand/storiesStore';

interface PoemItemCardProps extends Partial<PolymorphicComponentProps<CardProps>> {
  story: IStory;
  h?: string;
}

const StoryItemCard: FC<PoemItemCardProps> = ({ story, h }) => {
  const { isFetching } = useStoriesStore();
  const { t } = useTranslation();

  return (
    <Link to={`/stories/${story.id}`} style={{ textDecoration: 'none' }}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className={`${styles.item} ${isFetching ? styles.fetching : ''}`}
        {...(h && { h })}
      >
        <Card.Section>
          <Image src={getStaticFile(story.post_image)} height={200} alt={story.post_title} />
        </Card.Section>

        <Stack gap={0} mt="md" mb="xs">
          <Text size="xl" fw={500}>
            {story.post_title}
          </Text>

          <Group justify="space-between">
            <Text size="xs" c="gray">
              {t('storyBy')} {story.creator_id.writer_pseudo}, {story.created}
            </Text>

            <Badge color={getRandomBadgeColor(story.genre.id)} size="md" variant="dot">
              {story.genre.genre}
            </Badge>
          </Group>
        </Stack>

        <Text>{story.post_description}</Text>

        <Group mt="md" mb="xs">
          {story.tags.map(({ tag, id }) => (
            <Badge color={getRandomBadgeColor(id)} key={id}>
              {tag}
            </Badge>
          ))}
        </Group>
      </Card>
    </Link>
  );
};

export default StoryItemCard;
