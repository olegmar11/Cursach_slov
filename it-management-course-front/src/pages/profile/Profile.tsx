import { Carousel } from '@mantine/carousel';
import { Card, Container, Divider, Grid, Group, Image, Stack, Text } from '@mantine/core';
import { IconCat } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getStaticFile } from '../../api/api';
import { getLikedStories, getViewedStories, getWriterStories } from '../../api/stories';
import LabelValue from '../../components/common/LabelValue';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StoryItemCard from '../../components/dashboard/StoryItemCard';
import { useWindowSize } from '../../hooks/useWindowSize';
import { WindowBreakpoints } from '../../types/breakpoints';
import { IStory } from '../../types/story';
import { useUserStore } from '../../zustand/userStore';

interface IProfileStories {
  writerStories: IStory[];
  viewedStories: IStory[];
  likedStories: IStory[];
}

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const size = useWindowSize();

  const [stories, setStories] = useState<IProfileStories>({
    writerStories: [],
    viewedStories: [],
    likedStories: [],
  });
  const [isLoadingStories, setIsLoadingStories] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchStories = async () => {
      try {
        setIsLoadingStories(true);

        const requests = [getViewedStories, getLikedStories];

        if (user?.writer) {
          requests.push(getWriterStories);
        }

        const responses = await Promise.all(requests.map(r => r()));

        setStories({
          viewedStories: responses?.[0]?.data.stories || [],
          likedStories: responses?.[1]?.data.stories || [],
          writerStories: user.writer ? responses?.[2]?.data.stories || [] : [],
        });
      } catch {
      } finally {
        setIsLoadingStories(false);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
  }, [user]);

  const sliderConfig = useMemo(() => {
    if (size[0] > WindowBreakpoints.XL) {
      return {
        slideSize: '33.33333%',
        slidesToScroll: 3,
      };
    }

    if (size[0] > WindowBreakpoints.MD) {
      return {
        slideSize: '50%',
        slidesToScroll: 2,
      };
    }

    if (size[0] > WindowBreakpoints.SM) {
      return {
        slideSize: '100%',
        slidesToScroll: 1,
      };
    }

    if (size[0] > WindowBreakpoints.XS) {
      return {
        slideSize: '50%',
        slidesToScroll: 2,
      };
    }

    return {
      slideSize: '100%',
      slidesToScroll: 1,
    };
  }, [size]);

  return (
    <Container size="xl" mb={32}>
      <Stack gap={32}>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 5, md: 4 }}>
            <Card style={{ height: '100%' }} shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap={0}>
                <Stack align="center" gap={0}>
                  <Image
                    style={{
                      border: '1px solid #8b8b8b',
                      borderRadius: 9999,
                    }}
                    src={getStaticFile(user?.avatar || '')}
                    w={256}
                    h={256}
                  />

                  <Text fw="bold" size="xl">
                    {user?.user.username}
                  </Text>

                  <Text c="gray">
                    {user?.writer ? user.writer.writer_pseudo : t('profileReader')}
                  </Text>
                </Stack>

                <Divider my="md" w="100%" />

                {user?.writer ? (
                  <>
                    <LabelValue
                      label={t('profileStories')}
                      value={`${stories.writerStories?.length || 0}`}
                    />

                    <LabelValue
                      label={t('profileStoryViews')}
                      value={`${user.writer.total_story_views}`}
                    />

                    <LabelValue
                      label={t('profileLikes')}
                      value={`${user.writer.total_story_likes}`}
                    />
                  </>
                ) : (
                  <LabelValue
                    label={t('profileStoriesViewed')}
                    value={`${user?.reader.total_stories_viewed}`}
                  />
                )}
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 7, md: 8 }}>
            <Stack h="100%">
              <Text ml={32} size="32px" fw="bold">
                {t('profileWrittenStories')}
              </Text>

              {isLoadingStories ? (
                <Group justify="center" align="center" mih={200}>
                  <LoadingSpinner size={64} />
                </Group>
              ) : stories.writerStories?.length > 0 ? (
                <Carousel
                  {...sliderConfig}
                  slideGap="md"
                  align="start"
                  styles={{
                    controls: {
                      paddingInline: 0,
                      marginInline: -32,
                    },
                    root: {
                      marginInline: 32,
                    },
                  }}
                >
                  {stories.writerStories.map(story => (
                    <Carousel.Slide key={story.id}>
                      <StoryItemCard story={story} h="100%" />
                    </Carousel.Slide>
                  ))}
                </Carousel>
              ) : (
                <Stack align="center" justify="center" h="100%">
                  <IconCat size={64} color="gray" />

                  <Text size="xl" c="gray">
                    {t('profileStoriesEmpty')}
                  </Text>
                </Stack>
              )}
            </Stack>
          </Grid.Col>
        </Grid>

        <Stack>
          <Text ml={32} size="32px" fw="bold">
            {t('profileViewedStories')}
          </Text>

          {isLoadingStories ? (
            <Group justify="center" align="center" mih={200}>
              <LoadingSpinner size={64} />
            </Group>
          ) : stories.viewedStories?.length > 0 ? (
            <Carousel
              {...sliderConfig}
              slideGap="md"
              align="start"
              styles={{
                controls: {
                  paddingInline: 0,
                  marginInline: -32,
                },
                root: {
                  marginInline: 32,
                },
              }}
            >
              {stories.viewedStories.map(story => (
                <Carousel.Slide key={story.id}>
                  <StoryItemCard story={story} h="100%" />
                </Carousel.Slide>
              ))}
            </Carousel>
          ) : (
            <Stack align="center">
              <IconCat size={64} color="gray" />

              <Text size="xl" c="gray">
                {t('profileStoriesEmpty')}
              </Text>
            </Stack>
          )}
        </Stack>

        <Stack>
          <Text ml={32} size="32px" fw="bold">
            {t('profileLikedStories')}
          </Text>

          {isLoadingStories ? (
            <Group justify="center" align="center" mih={200}>
              <LoadingSpinner size={64} />
            </Group>
          ) : stories.likedStories?.length > 0 ? (
            <Carousel
              {...sliderConfig}
              slideGap="md"
              align="start"
              styles={{
                controls: {
                  paddingInline: 0,
                  marginInline: -32,
                },
                root: {
                  marginInline: 32,
                },
              }}
            >
              {stories.writerStories.map(story => (
                <Carousel.Slide key={story.id}>
                  <StoryItemCard story={story} h="100%" />
                </Carousel.Slide>
              ))}
            </Carousel>
          ) : (
            <Stack align="center">
              <IconCat size={64} color="gray" />

              <Text size="xl" c="gray">
                {t('profileStoriesEmpty')}
              </Text>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default Profile;
