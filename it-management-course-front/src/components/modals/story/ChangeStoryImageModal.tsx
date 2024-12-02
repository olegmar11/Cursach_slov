import { Box, Button, Group, Modal, Slider, Stack } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { FC, useRef, useState, WheelEvent } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useTranslation } from 'react-i18next';

interface ChangeStoryImageModalProps {
  image: File | null;
  openedModal: boolean;
  closeModal: () => void;
  setImage: (image: File | null) => void;
}

const ChangeStoryImageModal: FC<ChangeStoryImageModalProps> = ({
  closeModal,
  openedModal,
  image,
  setImage,
}) => {
  const { t } = useTranslation();
  const [scale, setScale] = useState(1);
  const editorRef = useRef<AvatarEditor>(null);

  const handleSetImage = () => {
    if (editorRef.current && image) {
      editorRef.current.getImage().toBlob(blob => {
        if (!blob) {
          return;
        }
        const croppedImage = new File([blob], 'story_image', {
          type: blob.type,
          lastModified: new Date().getTime(),
        });

        setImage(croppedImage);
        closeModal();
      });
    }
  };

  if (!image) {
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
      opened={openedModal}
      onClose={closeModal}
      title={t('createStorySetImage')}
      size="lg"
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
            image={image}
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
          <Button onClick={handleSetImage} color="green" flex={1}>
            <IconCheck />
          </Button>

          <Button onClick={closeModal} color="red" flex={1}>
            <IconX />
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ChangeStoryImageModal;
