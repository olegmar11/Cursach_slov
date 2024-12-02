import { Container, Group, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { getStaticFile } from '../api/api';
import HomeCategoryLink from '../components/common/HomeCategoryLink';
import { useUserStore } from '../zustand/userStore';

const Home = () => {
  const { user } = useUserStore();
  const { t } = useTranslation();

  return (
    <Container size="xl">
      <Stack align="center" pt={128} pb={64} gap={48}>
        <img src="logoipsum-330.svg" width="100%" style={{ maxWidth: 400 }} />

        <Text size="32px" fw="lighter" ta="center">
          {t('homeTitle')}
        </Text>

        {!user ? (
          <Text size="xl" fw="lighter" ta="center">
            {t('homeLogin')}
          </Text>
        ) : (
          <Group w="100%">
            <HomeCategoryLink
              image={'default_story.jpeg'}
              to="/stories"
              content={t('homeLinkStories')}
            />

            <HomeCategoryLink
              image={getStaticFile(user.avatar)}
              to="/profile"
              content={t('homeLinkProfile')}
            />

            {user.writer && (
              <HomeCategoryLink
                image={'create_story.jpg'}
                to="/stories/new"
                content={t('homeLinkCreate')}
              />
            )}
          </Group>
        )}
      </Stack>
    </Container>
  );
};

export default Home;
