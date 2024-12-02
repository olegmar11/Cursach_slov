import { Button, Card, Container, Grid, Group, Image, Stack, Text, Textarea } from '@mantine/core';
import { IconEye, IconPencil } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getStaticFile } from '../../api/api';
import { createComment, getComments } from '../../api/comments';
import { getStory, reactToStory, StoryResponse } from '../../api/stories';
import ReactionButton from '../../components/common/LikeButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Comment from '../../components/story/Comment';
import styles from '../../styles/components/editStoryLinkButton.module.scss';
import { IComment } from '../../types/comment';
import { useUserStore } from '../../zustand/userStore';

export interface StoryInfo {
  story: StoryResponse | null;
  comments: IComment[]; // TODO: Replace with comments type later
}

const Story = () => {
  const { t } = useTranslation();
  const { storyId } = useParams();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [storyData, setStoryData] = useState<StoryInfo>({
    story: null,
    comments: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentBody, setCommentBody] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const res = await Promise.all([
          getStory(storyId || ''),
          getComments({ story_id: storyId }),
        ]);

        setStoryData(prev => ({
          ...prev,
          story: res[0]?.data || null,
          comments: res[1]?.data.data || [],
        }));
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [storyId]);

  const handleChangeComments = (newComment: IComment) => {
    setStoryData(prev => ({
      ...prev,
      comments: prev.comments.map(comment => (comment.id === newComment.id ? newComment : comment)),
    }));
  };

  const handleReactToStory = (type: 'like' | 'dislike') => {
    reactToStory(storyId || '', type)
      .then(res => {
        setStoryData(
          prev =>
            ({
              ...prev,
              story: {
                ...prev.story,
                story: res?.data,
              },
            } as StoryInfo)
        );
      })
      .catch(console.error);
  };

  const submitComment = () => {
    setIsSubmittingComment(true);
    createComment({ comment_body: commentBody, story_id: storyId || '' })
      .then(res => {
        if (!res?.data) {
          return;
        }

        setStoryData(prev => ({
          ...prev,
          comments: [res?.data, ...prev.comments],
        }));
        setCommentBody('');
      })
      .finally(() => setIsSubmittingComment(false));
  };

  return (
    <Container size="xl" mb="lg">
      {isLoading ? (
        <Group justify="center">
          <LoadingSpinner size={64} />
        </Group>
      ) : (
        <>
          <Grid mb={32}>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack>
                  <Image
                    src={getStaticFile(storyData?.story?.story?.post_image || '')}
                    alt="story cover image"
                  />

                  <Stack gap={8} align="center">
                    <Text fw="bold">{storyData.story?.story?.post_title}</Text>

                    <Text fs="italic">{storyData.story?.story?.post_description}</Text>
                  </Stack>

                  <Grid align="end">
                    <Grid.Col span={8}>
                      <Stack gap={4}>
                        <Text fw="bold">{t('storyWrittenBy')}:</Text>

                        <Group align="end">
                          <Image
                            src={getStaticFile(storyData?.story?.story?.creator_id.avatar || '')}
                            alt="writer avatar"
                            style={{
                              objectFit: 'cover',
                              borderRadius: '9999px',
                              aspectRatio: '1/1',
                            }}
                            w={48}
                          />

                          <Stack gap={0}>
                            <Text>{storyData.story?.story?.creator_id.writer_pseudo}</Text>

                            <Text c="gray">{storyData.story?.story?.created}</Text>
                          </Stack>
                        </Group>
                      </Stack>
                    </Grid.Col>

                    <Grid.Col span={4}>
                      <Stack gap={0} align="end">
                        <ReactionButton
                          variant="like"
                          value={storyData.story?.story?.likes_count}
                          isFilled={storyData.story?.liked}
                          onClick={() => handleReactToStory('like')}
                        />

                        <ReactionButton
                          variant="dislike"
                          value={storyData.story?.story?.dislikes_count}
                          isFilled={storyData.story?.disliked}
                          onClick={() => handleReactToStory('dislike')}
                        />

                        <Group gap={8}>
                          <Text>{storyData.story?.story?.views_count}</Text>

                          <IconEye color="#228BE6" />
                        </Group>
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 8 }}>
              <Stack>
                {storyData.story?.owner && (
                  <Link
                    to={`/stories/${storyData.story?.story?.id}/edit`}
                    className={styles.btnMobile}
                  >
                    <Button fullWidth leftSection={<IconPencil />}>
                      {t('storyEdit')}
                    </Button>
                  </Link>
                )}

                <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                  <Stack>
                    <Group justify="center">
                      <Text fw="bold" size="xl">
                        {storyData.story?.story.post_title}
                      </Text>

                      {storyData.story?.owner && (
                        <Link
                          to={`/stories/${storyData.story?.story?.id}/edit`}
                          style={{ position: 'absolute', right: '16px' }}
                          className={styles.btnDesktop}
                        >
                          <Button leftSection={<IconPencil />}>{t('storyEdit')}</Button>
                        </Link>
                      )}
                    </Group>

                    <div
                      dangerouslySetInnerHTML={{
                        __html: storyData.story?.story?.post_text || '',
                      }}
                    />
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>

          <Stack>
            <Text size="28px" fw="bold">
              {t('storyComments')}
            </Text>

            <Group align="start">
              <Image
                w={48}
                h={48}
                src={getStaticFile(user?.avatar || '')}
                style={{ objectFit: 'cover', borderRadius: '9999px', aspectRatio: '1/1' }}
              />

              <Stack flex={1}>
                <Textarea
                  value={commentBody}
                  onChange={e => setCommentBody(e.target.value)}
                  placeholder={t('storyCommentPlaceholder')}
                  rows={2}
                />

                <Button
                  onClick={submitComment}
                  loading={isSubmittingComment}
                  style={{ width: 'fit-content' }}
                >
                  {t('storyCommentPost')}
                </Button>
              </Stack>
            </Group>

            {storyData.comments.map(comment => (
              <Comment key={comment.id} comment={comment} setComments={handleChangeComments} />
            ))}
          </Stack>
        </>
      )}
    </Container>
  );
};

export default Story;
