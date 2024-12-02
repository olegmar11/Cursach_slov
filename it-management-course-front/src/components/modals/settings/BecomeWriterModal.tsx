import { Button, Group, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck } from '@tabler/icons-react';
import { FC, useState } from 'react';
import { becomeWriter } from '../../../api/user';
import { useUserStore } from '../../../zustand/userStore';
import { useTranslation } from 'react-i18next';

interface BecomeWriterModalProps {
  openedWriterModal: boolean;
  closeWriterModal: () => void;
}

const BecomeWriterModal: FC<BecomeWriterModalProps> = ({ closeWriterModal, openedWriterModal }) => {
  const { t } = useTranslation();
  const { setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      pseudo: '',
    },

    validate: {
      pseudo: value => (value.length > 0 ? null : t('settingsWriterBecomeError')),
    },
  });

  const handleButtonClick = (values: { pseudo: string }) => {
    setIsLoading(true);
    becomeWriter({
      author_pseudo: values.pseudo,
    })
      // TODO: Notification would be nice here
      .then(res => {
        if (res?.data.profile) {
          setUser(res?.data.profile);
          closeWriterModal();
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal
      zIndex={1000}
      opened={openedWriterModal}
      onClose={closeWriterModal}
      title={t('settingsWriterBecome')}
    >
      <form onSubmit={form.onSubmit(handleButtonClick)}>
        <Group>
          <TextInput
            placeholder={t('settingsWriterBecomePlaceholder')}
            key={form.key('pseudo')}
            flex={1}
            disabled={isLoading}
            {...form.getInputProps('pseudo')}
          />

          <Button color="green" loading={isLoading} type="submit">
            <IconCheck />
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default BecomeWriterModal;
