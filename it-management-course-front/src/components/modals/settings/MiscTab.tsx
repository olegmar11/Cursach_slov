import { Button, Container, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteUser } from '../../../api/user';
import { useUserStore } from '../../../zustand/userStore';
import SettingsLabel from '../../common/SettingsLabel';

const MiscTab = () => {
  const { t } = useTranslation();
  const { setUser } = useUserStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteButton = () => {
    modals.openConfirmModal({
      title: t('settingsDangerDeleteTitle'),
      children: <Text>{t('settingsDangerDeleteContent')}</Text>,
      labels: {
        confirm: t('settingsDangerDeleteConfirm'),
        cancel: t('settingsDangerDeleteDecline'),
      },
      onConfirm: () => {
        setIsDeleting(true);
        deleteUser()
          // TODO: Notifications would be cool here
          .then(() => {
            setUser(null);
            modals.closeAll();
          })
          .finally(() => setIsDeleting(false));
      },
      confirmProps: {
        color: 'red',
        loading: isDeleting,
      },
    });
  };

  return (
    <Container>
      <Stack align="center">
        <SettingsLabel title={t('settingsDangerZone')} />

        <Button color="red" onClick={handleDeleteButton} w="50%">
          {t('settingsDangerDelete')}
        </Button>
      </Stack>
    </Container>
  );
};

export default MiscTab;
