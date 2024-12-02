import {
  Button,
  Container,
  FileButton,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { RichTextEditor as MantineRichTextEditor } from '@mantine/tiptap';
import { IconX } from '@tabler/icons-react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGenres } from '../../api/genres';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ChangeStoryImageModal from '../../components/modals/story/ChangeStoryImageModal';
import GenresSelector from '../../components/story/GenresSelector';
import TagsSelector from '../../components/story/TagsSelector';
import { IGenre } from '../../types/genre';
import { ITag } from '../../types/tag';
import { useUserStore } from '../../zustand/userStore';

import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { createStory } from '../../api/stories';
import { fetchTags } from '../../api/tags';
import '../../styles/components/richProviderStylles.scss';
import { useTranslation } from 'react-i18next';

export interface StoryFormData {
  title: string;
  description: string;
  genre: IGenre | null;
  tags: Set<ITag>;
  body: string;
  image: File | null;
}

const CreateNewStory = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const navigate = useNavigate();

  const [genres, setGenres] = useState<IGenre[]>([]);
  const [tags, setTags] = useState<ITag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const resetRef = useRef<() => void>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<StoryFormData>({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      description: '',
      body: '',
      genre: null,
      image: null,
      tags: new Set(),
    },

    validate: {
      title: value => (value.length > 0 ? null : t('createStoryErrTitle')),
      body: value => (value.length > 0 ? null : t('createStoryErrBody')),
      genre: value => (value ? null : t('createStoryErrGenre')),
    },
  });
  const [isImageModalOpened, setIsImageModalOpened] = useState(false);
  const [tempImage, setTempImage] = useState<File | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: t('createStoryContentPlaceholder') }),
    ],
    content: form.getValues().body,
    onUpdate: ({ editor }) => {
      form.setFieldValue('body', editor.getHTML());
    },
  });

  useEffect(() => {
    if (!user || !user.writer) {
      navigate('/');
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const res = await Promise.all([getGenres(), fetchTags()]);

        setGenres(res[0]?.data.stories || []);
        setTags(res[1]?.data.stories || []);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangeImage = (image: File | null) => {
    if (image) {
      form.setFieldValue('image', image);
    }
  };

  const openImageModal = (image: File | null) => {
    setTempImage(image);
    resetRef.current?.();
    setIsImageModalOpened(true);
  };

  const addTag = (tag: ITag) => {
    form.setFieldValue('tags', prev => {
      const tags = new Set(prev);
      tags.add(tag);
      return tags;
    });
  };

  const removeTag = (tag: ITag) => {
    form.setFieldValue('tags', prev => {
      const tags = new Set(prev);
      tags.delete(tag);
      return tags;
    });
  };

  const handleSubmit = (values: StoryFormData) => {
    const formData = new FormData();

    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('body', values.body);
    formData.append(
      'tags',
      Array.from(values.tags).reduce((acc, curr) => `${acc}${curr.tag},`, '')
    );
    formData.append('genre', values.genre?.genre || '');

    if (values.image) {
      formData.append('image', values.image);
    }

    setIsSubmitting(true);
    createStory(formData)
      .then(res => {
        navigate(`/stories/${res?.data.id}`);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <Container size="xl" mb="xl">
      {isLoading ? (
        <Stack align="center" mt={48}>
          <LoadingSpinner size={48} />
        </Stack>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Text size="32px" fw="bold">
              {t('createStoryPageTitle')}
            </Text>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 4 }} order={{ base: 2, sm: 1 }}>
                <Stack>
                  {form.getValues().image ? (
                    <Image
                      style={{
                        border: '1px solid black',
                      }}
                      src={
                        form.getValues().image ? URL.createObjectURL(form.getValues().image!) : ''
                      }
                      radius="md"
                    />
                  ) : (
                    <Stack
                      style={{
                        borderRadius: '8px',
                        border: '1px solid black',
                        aspectRatio: '1/1',
                        backgroundColor: 'lightgray',
                      }}
                      justify="center"
                      align="center"
                    >
                      <IconX size="50%" color="gray" />
                    </Stack>
                  )}

                  <FileButton
                    onChange={openImageModal}
                    accept="image/png, image/jpeg, image/gif"
                    resetRef={resetRef}
                    disabled={isSubmitting}
                  >
                    {props => <Button {...props}>{t('createStorySetImage')}</Button>}
                  </FileButton>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 8 }} order={{ base: 1, sm: 2 }}>
                <Stack>
                  <TextInput
                    withAsterisk
                    label={t('createStoryTitle')}
                    placeholder={t('createStoryTitlePlaceholder')}
                    key={form.key('title')}
                    disabled={isSubmitting}
                    {...form.getInputProps('title')}
                  />

                  <TextInput
                    label={t('createStoryDescription')}
                    placeholder={t('createStoryDescriptionPlaceholder')}
                    key={form.key('description')}
                    disabled={isSubmitting}
                    {...form.getInputProps('description')}
                  />

                  <GenresSelector
                    selectedGenre={form.getValues().genre}
                    setSelectedGenre={genre => form.setFieldValue('genre', genre)}
                    genres={genres}
                    disabled={isSubmitting}
                  />

                  <TagsSelector
                    addTag={addTag}
                    removeTag={removeTag}
                    tagsSelectedIds={form.getValues().tags}
                    tags={tags}
                    disabled={isSubmitting}
                  />
                </Stack>
              </Grid.Col>
            </Grid>

            <Group justify="center">
              <Text fw="bold" size="xl">
                {t('createStoryContent')}
              </Text>
            </Group>

            <MantineRichTextEditor editor={editor}>
              <MantineRichTextEditor.Toolbar>
                <MantineRichTextEditor.ControlsGroup>
                  <MantineRichTextEditor.Bold />
                  <MantineRichTextEditor.Italic />
                  <MantineRichTextEditor.Underline />
                </MantineRichTextEditor.ControlsGroup>

                <MantineRichTextEditor.ControlsGroup>
                  <MantineRichTextEditor.AlignLeft />
                  <MantineRichTextEditor.AlignCenter />
                  <MantineRichTextEditor.AlignRight />
                  <MantineRichTextEditor.AlignJustify />
                </MantineRichTextEditor.ControlsGroup>
              </MantineRichTextEditor.Toolbar>

              <MantineRichTextEditor.Content />
            </MantineRichTextEditor>

            <Button loading={isSubmitting} type="submit" color="green">
              {t('createStorySubmit')}
            </Button>
          </Stack>
        </form>
      )}

      <ChangeStoryImageModal
        image={tempImage}
        closeModal={() => setIsImageModalOpened(false)}
        openedModal={isImageModalOpened}
        setImage={handleChangeImage}
      />
    </Container>
  );
};

export default CreateNewStory;
