import { Group, Text } from '@mantine/core';
import { IconThumbDown, IconThumbUp } from '@tabler/icons-react';
import { FC } from 'react';

import likeStyles from '../../styles/components/likeButton.module.scss';

interface LikeButtonProps {
  variant: 'like' | 'dislike';
  value?: number;
  isFilled?: boolean;
  isAuthor?: boolean;
  onClick?: () => void;
}

const ReactionButton: FC<LikeButtonProps> = ({ value, isFilled, onClick, variant, isAuthor }) => {
  return (
    <Group gap={8} onClick={onClick}>
      <Text>{value}</Text>

      {variant === 'like' ? (
        <IconThumbUp
          className={`${likeStyles.like} ${isAuthor ? likeStyles.author : ''}`}
          fill={isFilled ? '#31c40c' : 'none'}
          color="#31c40c"
        />
      ) : (
        <IconThumbDown
          className={`${likeStyles.dislike} ${isAuthor ? likeStyles.author : ''}`}
          fill={isFilled ? 'red' : 'none'}
          color="red"
        />
      )}
    </Group>
  );
};

export default ReactionButton;
