import { Box, Button, Group, Modal, Slider, Stack } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { FC, useRef, useState, WheelEvent } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { updateUser } from '../../../api/user';
import { useUserStore } from '../../../zustand/userStore';
import { useTranslation } from 'react-i18next';

interface EditAvatarModalProps {
  avatar: File | null;
  openedAvatarModal: boolean;
  closeAvatarModal: () => void;
}

const EditAvatarModal: FC<EditAvatarModalProps> = ({
  closeAvatarModal,
  openedAvatarModal,
  avatar,
}) => {
  const { t } = useTranslation();
  const { user, setUser } = useUserStore();
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef<AvatarEditor>(null);

  const handleSubmitAvatar = () => {
    if (editorRef.current && avatar) {
      editorRef.current.getImage().toBlob(blob => {
        if (!blob) {
          return;
        }
        const newAvatar = new File([blob], `avatar_${user?.id}`, {
          type: blob.type,
          lastModified: new Date().getTime(),
        });

        const formData = new FormData();
        formData.append('avatar', newAvatar);

        setIsLoading(true);
        updateUser(formData)
          // TODO: Notification would be nice here
          .then(res => {
            if (res?.success) {
              setUser(res.data.profile);
              closeAvatarModal();
            }
          })
          .finally(() => setIsLoading(false));
      });
    }
  };

  if (!avatar) {
    return null;
  }

  const handleScroll = (e: WheelEvent) => {
    if (e.deltaY > 0 && scale > 1) {
      setScale(Math.round((scale - 0.1) * 10) / 10);
    } else if (e.deltaY < 0 && scale < 3) {
      setScale(Math.round((scale + 0.1) * 10) / 10);
    }
  };

  return (
    <Modal
      zIndex={1000}
      opened={openedAvatarModal}
      onClose={closeAvatarModal}
      title={t('settingsChangeAvatarTitle')}
    >
      <Stack align="center">
        <Box
          style={{
            border: '1px solid black',
            width: '75%',
            aspectRatio: '1 / 1',
          }}
          onWheel={handleScroll}
        >
          <AvatarEditor
            image={avatar}
            border={0}
            scale={scale}
            rotate={0}
            style={{
              width: '100%',
              height: '100%',
            }}
            ref={editorRef}
          />
        </Box>

        <Slider
          color="blue"
          value={scale}
          onChange={setScale}
          min={1}
          max={3}
          step={0.1}
          label={null}
          w="100%"
        />

        <Group w="100%">
          <Button onClick={handleSubmitAvatar} loading={isLoading} color="green" flex={1}>
            <IconCheck />
          </Button>

          <Button onClick={closeAvatarModal} color="red" flex={1}>
            <IconX />
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default EditAvatarModal;
