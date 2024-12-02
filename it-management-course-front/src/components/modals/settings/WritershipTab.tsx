import { Button, Container, Group, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconDeviceFloppy, IconSettings, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { updateUser } from '../../../api/user';
import { useUserStore } from '../../../zustand/userStore';
import SettingsLabel from '../../common/SettingsLabel';
import BecomeWriterModal from './BecomeWriterModal';
import { useTranslation } from 'react-i18next';

const WritershipTab = () => {
  const { t } = useTranslation();
  const { user, setUser } = useUserStore();
  const [openedWriterModal, { open: openWriterModal, close: closeWriterModal }] =
    useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      pseudo: user?.writer?.writer_pseudo || '',
    },

    validate: {
      pseudo: value => (value.length > 0 ? null : t('settingsWriterBecomeError')),
    },
  });

  const handleSubmitPseudo = (values: { pseudo: string }) => {
    const formData = new FormData();
    formData.append('author_pseudo', values.pseudo);

    setIsLoading(true);
    updateUser(formData)
      // TODO: Notification would be nice here
      .then(res => {
        if (res?.success) {
          setUser(res.data.profile);
          setIsEditing(false);
        } else {
          form.setErrors({ pseudo: res?.message });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleDiscardChanges = () => {
    setIsEditing(false);
    form.setValues({ pseudo: user?.writer?.writer_pseudo || '' });
  };

  useEffect(() => {
    form.setValues({ pseudo: user?.writer?.writer_pseudo || '' });
  }, [user?.writer?.writer_pseudo]);

  return (
    <Container>
      <Stack align="center">
        <SettingsLabel title={t('settingsWriterInfo')} />

        {user?.writer ? (
          <form onSubmit={form.onSubmit(handleSubmitPseudo)} style={{ width: '100%' }}>
            <Text fw="bold" size="sm">
              {t('settingsWriterPseudoname')}:
            </Text>

            <Group align="start">
              <TextInput
                key={form.key('pseudo')}
                flex={1}
                disabled={isLoading || !isEditing}
                {...form.getInputProps('pseudo')}
              />

              {isEditing ? (
                <>
                  <Button color="green" loading={isLoading} type="submit">
                    <IconDeviceFloppy />
                  </Button>

                  <Button color="red" onClick={handleDiscardChanges}>
                    <IconX />
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <IconSettings />
                </Button>
              )}
            </Group>
          </form>
        ) : (
          <Stack>
            <Text size="sm">{t('settingsWriterNotWriter')}</Text>

            <Button onClick={openWriterModal}>{t('settingsWriterBecome')}</Button>
          </Stack>
        )}
      </Stack>

      <BecomeWriterModal
        openedWriterModal={openedWriterModal}
        closeWriterModal={closeWriterModal}
      />
    </Container>
  );
};

export default WritershipTab;
