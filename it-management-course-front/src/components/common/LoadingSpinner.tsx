import { Box } from '@mantine/core';
import { IconLoader2 } from '@tabler/icons-react';
import { FC } from 'react';
import styles from '../../styles/components/loadingSpinner.module.scss';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ size, color }) => {
  return (
    <Box>
      <IconLoader2 className={styles.spinner} size={size || 24} color={color || 'orange'} />
    </Box>
  );
};

export default LoadingSpinner;
