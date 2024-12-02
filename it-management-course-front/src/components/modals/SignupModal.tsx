import { Button, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { signUp } from '../../api/auth';
import styles from '../../styles/components/authModal.module.scss';
import { ISignupFormValues } from '../../types/auth';
import { useUserStore } from '../../zustand/userStore';
import LoginModal from './LoginModal';

const SignupModal = () => {
  const { t } = useTranslation();

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      return t('authModalSignupErrPasswordLength');
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value)) {
      return t('authModalSignupErrPasswordComplexity');
    }

    return null;
  };

  const validateUsername = (value: string) => {
    if (value.length < 6) {
      return t('authModalSignupErrUsernameLength');
    }

    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return t('authModalSignupErrUsernameSymbols');
    }

    return null;
  };

  const form = useForm<ISignupFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
      password2: '',
    },

    validate: {
      username: validateUsername,
      password: validatePassword,
      password2: (value, values) =>
        value !== values.password ? t('authModalSignupErrPasswordNoMatch') : null,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useUserStore();

  const handleSubmit = (values: ISignupFormValues) => {
    setIsSubmitting(true);
    signUp(values)
      .then(res => {
        localStorage.setItem('token', res?.access || '');
        localStorage.setItem('refresh', res?.refresh || '');
        setUser(res?.data || null);

        modals.closeAll();
      })
      .catch(form.setErrors)
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const openLoginModal = () => {
    modals.closeAll();
    modals.open({
      title: t('headerLogin'),
      children: <LoginModal />,
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        withAsterisk
        label={t('authModalUsername')}
        placeholder="user123"
        key={form.key('username')}
        disabled={isSubmitting}
        {...form.getInputProps('username')}
      />

      <TextInput
        withAsterisk
        label={t('authModalPassword')}
        placeholder="********"
        key={form.key('password')}
        type="password"
        disabled={isSubmitting}
        {...form.getInputProps('password')}
      />

      <TextInput
        withAsterisk
        label={t('authModalRepeatPassword')}
        placeholder="********"
        type="password"
        key={form.key('password2')}
        disabled={isSubmitting}
        {...form.getInputProps('password2')}
      />

      <Stack justify="center" mt="md" align="center">
        <Button type="submit" loading={isSubmitting}>
          {t('headerSignup')}
        </Button>

        <Text span>
          {t('authModalHaveAccount')}{' '}
          <Text
            span
            c="blue"
            w="fit-content"
            classNames={{
              root: styles.signUp,
            }}
            onClick={openLoginModal}
          >
            {t('headerLogin')}
          </Text>
        </Text>
      </Stack>
    </form>
  );
};

export default SignupModal;
