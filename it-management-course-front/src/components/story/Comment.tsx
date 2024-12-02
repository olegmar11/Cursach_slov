import { Box, Button, Card, Group, Image, Stack, Text, Textarea } from '@mantine/core';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getStaticFile } from '../../api/api';
import { createComment, getComments, reactToComment } from '../../api/comments';
import styles from '../../styles/components/comment.module.scss';
import { IComment } from '../../types/comment';
import { useUserStore } from '../../zustand/userStore';
import ReactionButton from '../common/LikeButton';
import LoadingSpinner from '../common/LoadingSpinner';

interface CommentProps {
  comment: IComment;
  setComments: (newComment: IComment) => void;
  showReplies?: boolean;
}

const Comment: FC<CommentProps> = ({ comment, setComments, showReplies = true }) => {
  const { t } = useTranslation();
  const [isShowingReplies, setIsShowingReplies] = useState(false);
  const { user } = useUserStore();
  const [replies, setReplies] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentBody, setCommentBody] = useState('');

  const handleGetReplies = () => {
    setIsShowingReplies(true);

    if (comment.replies_count === 0) {
      return;
    }

    if (replies.length === 0) {
      setIsLoading(true);
      getComments({ parent_comment_id: `${comment.id}` })
        .then(res => {
          setReplies(res?.data?.data || []);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleReactToComment = (type: 'like' | 'dislike') => {
    reactToComment(`${comment.id}` || '', type)
      .then(res => {
        setComments(res?.data!);
      })
      .catch(console.error);
  };

  const handleChangeReplies = (newComment: IComment) => {
    setReplies(prev => prev.map(comment => (comment.id === newComment.id ? newComment : comment)));
  };

  const submitComment = () => {
    setIsSubmittingComment(true);
    createComment({ comment_body: commentBody, parent_comment_id: `${comment.id}` || '' })
      .then(res => {
        if (!res?.data) {
          return;
        }

        setReplies(prev => [...prev, res.data]);
        setCommentBody('');
      })
      .finally(() => setIsSubmittingComment(false));
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder key={comment.id}>
        <Group align="start">
          <Image
            src={getStaticFile(comment.creator_id.avatar || '')}
            alt={comment.creator_id.username}
            style={{ objectFit: 'cover', borderRadius: '9999px', aspectRatio: '1/1' }}
            w={48}
          />

          <Stack gap={0} align="start">
            <Group align="center" gap={12}>
              <Text size="sm" fw="bold">
                {comment.creator_id.username}
              </Text>

              <Text size="xs" c="gray" pt={4}>
                {comment.created}
              </Text>
            </Group>

            <Text>{comment.comment_body}</Text>

            <Group>
              <ReactionButton
                variant="like"
                value={comment?.likes_count}
                isFilled={comment?.liked}
                onClick={() => handleReactToComment('like')}
              />

              <ReactionButton
                variant="dislike"
                value={comment.dislikes_count}
                isFilled={comment?.disliked}
                onClick={() => handleReactToComment('dislike')}
              />
            </Group>

            {showReplies &&
              (isLoading ? (
                <Box pt={8}>
                  <LoadingSpinner color="#228BE6" />
                </Box>
              ) : isShowingReplies ? (
                <Button
                  onClick={() => setIsShowingReplies(false)}
                  px={0}
                  variant="white"
                  classNames={{ label: styles.repliesBtn }}
                >
                  {t('storyHide')}
                </Button>
              ) : (
                <Button
                  onClick={handleGetReplies}
                  px={0}
                  variant="white"
                  classNames={{ label: styles.repliesBtn }}
                >
                  {comment.replies_count > 0
                    ? `${comment.replies_count} ${t('storyReplies')}`
                    : t('storyReply')}
                </Button>
              ))}
          </Stack>
        </Group>
      </Card>

      {isShowingReplies && (
        <Box ml={32} pl={32} style={{ borderLeft: '1px solid gray' }}>
          <Stack gap={16}>
            {isShowingReplies &&
              replies.map(reply => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  setComments={handleChangeReplies}
                  showReplies={false}
                />
              ))}

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
          </Stack>
        </Box>
      )}
    </>
  );
};

export default Comment;
