import { Button, Container, FileButton, Group, Image, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getStaticFile } from '../../../api/api';
import { useUserStore } from '../../../zustand/userStore';
import LabelValue from '../../common/LabelValue';
import SettingsLabel from '../../common/SettingsLabel';
import EditAvatarModal from './EditAvatarModal';

const ProfileTab = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [openedAvatarModal, { open: openAvatarModal, close: closeAvatarModal }] =
    useDisclosure(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      pseudo: user?.writer?.writer_pseudo || '',
    },

    validate: {
      pseudo: value => (value?.length > 0 ? null : 'Please enter your new pseudoname'),
    },
  });

  useEffect(() => {
    form.setValues({ pseudo: user?.writer?.writer_pseudo || '' });
  }, [user?.writer?.writer_pseudo]);

  const handleChangeAvatar = (avatar: File | null) => {
    if (avatar) {
      setAvatar(avatar);
      resetRef.current?.();
      openAvatarModal();
    }
  };

  return (
    <Container>
      <Stack align="center">
        <Group justify="start" align="start" w="100%">
          <Stack>
            <Image
              style={{
                border: '1px solid black',
              }}
              w={150}
              h={150}
              src={getStaticFile(user?.avatar || '')}
              radius="md"
            />

            <FileButton
              onChange={handleChangeAvatar}
              accept="image/png, image/jpeg, image/gif"
              resetRef={resetRef}
            >
              {props => <Button {...props}>{t('settingsChangeAvatar')}</Button>}
            </FileButton>
          </Stack>

          <Stack flex={1} gap={16}>
            <Stack gap={4}>
              <SettingsLabel title={t('settingsProfileInfo')} />

              <LabelValue label={t('settingsProfileUsername')} value={user?.user.username} />

              <LabelValue
                label={t('settingsProfileType')}
                value={
                  user?.is_premium ? t('settingsProfileTypePremium') : t('settingsProfileTypeFree')
                }
              />
            </Stack>

            <Stack gap={4}>
              <SettingsLabel title={t('settingsProfileReader')} />

              <LabelValue
                label={t('settingsProfileWritersSubscribed')}
                value={`${user?.reader.subscribed_to?.length || 0}`}
              />

              <LabelValue
                label={t('settingsProfileCommentsMade')}
                value={`${user?.reader.total_comments_made}`}
              />

              <LabelValue
                label={t('settingsProfileLikedComments')}
                value={`${user?.reader.total_liked_comments || 0}`}
              />

              <LabelValue
                label={t('settingsProfileStoriesViewed')}
                value={`${user?.reader.total_stories_viewed}`}
              />
            </Stack>

            {user?.writer && (
              <Stack gap={4}>
                <SettingsLabel title={t('settingsProfileWriter')} />

                <LabelValue
                  label={t('settingsProfileDislikes')}
                  value={`${user?.writer.total_story_dislikes}`}
                />

                <LabelValue
                  label={t('settingsProfileLikes')}
                  value={`${user?.writer.total_story_likes}`}
                />

                <LabelValue
                  label={t('settingsProfileViews')}
                  value={`${user?.writer.total_story_views}`}
                />
              </Stack>
            )}
          </Stack>
        </Group>
      </Stack>

      <EditAvatarModal
        avatar={avatar}
        openedAvatarModal={openedAvatarModal}
        closeAvatarModal={closeAvatarModal}
      />
    </Container>
  );
};

export default ProfileTab;
