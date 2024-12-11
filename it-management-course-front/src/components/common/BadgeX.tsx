import { Badge } from '@mantine/core';
import { FC } from 'react';
import { ITag } from '../../types/tag';

interface BadgeXProps {
  tag: ITag | string;
  color: string;
  onClick: () => void;
}
import styles from '../../styles/components/filterBadge.module.scss';

const BadgeX: FC<BadgeXProps> = ({ tag, color, onClick }) => {
  return (
    <Badge
      color={color}
      onClick={onClick}
      classNames={{
        root: styles.badge,
        label: styles.badgeLabel,
      }}
    >
      <p className={styles.badgeValue}>{typeof tag !== 'string' ? tag.tag : tag}</p>

      <p className={styles.badgeX}>X</p>
    </Badge>
  );
};

export default BadgeX;
