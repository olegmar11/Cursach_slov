import { Box, Card, Image, Text } from '@mantine/core';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/homeCategory.module.scss';

interface HomeCategoryLinkProps {
  image: string;
  to: string;
  content: string;
}

const HomeCategoryLink: FC<HomeCategoryLinkProps> = ({ image, to, content }) => {
  return (
    <Link to={to} className={styles.link}>
      <Card shadow="md" withBorder flex={1} h={500} p={0} pos="relative">
        <Image src={image} className={styles.img} />

        <Box className={styles.contentWrapper}>
          <Text c="white" fw="lighter" size="xl">
            {content}
          </Text>
        </Box>
      </Card>
    </Link>
  );
};

export default HomeCategoryLink;
