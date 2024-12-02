import { Group, Text } from '@mantine/core';
import { IconThumbDown, IconThumbUp } from '@tabler/icons-react';
import { FC } from 'react';

import likeStyles from '../../styles/components/likeButton.module.scss';

interface LikeButtonProps {
  variant: 'like' | 'dislike';
  value?: number;
  isFilled?: boolean;
  onClick?: () => void;
}

const ReactionButton: FC<LikeButtonProps> = ({ value, isFilled, onClick, variant }) => {
  return (
    <Group gap={8} onClick={onClick}>
      <Text>{value}</Text>

      {variant === 'like' ? (
        <IconThumbUp
          className={likeStyles.like}
          fill={isFilled ? '#31c40c' : 'none'}
          color="#31c40c"
        />
      ) : (
        <IconThumbDown
          className={likeStyles.dislike}
          fill={isFilled ? 'red' : 'none'}
          color="red"
        />
      )}
    </Group>
  );
};

export default ReactionButton;
