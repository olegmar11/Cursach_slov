import {
  Avatar,
  Button,
  Container,
  Group,
  Image,
  Menu,
  rem,
  Select,
  SelectProps,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  IconChevronDown,
  IconFilePlus,
  IconLogout,
  IconNotes,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import cx from 'clsx';
import { ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getStaticFile } from '../api/api';
import { useWindowSize } from '../hooks/useWindowSize';
import classes from '../styles/components/header.module.scss';
import { WindowBreakpoints } from '../types/breakpoints';
import { useUserStore } from '../zustand/userStore';
import LoginModal from './modals/LoginModal';
import ProfileSettingsModal from './modals/ProfileSettingsModal';
import SignupModal from './modals/SignupModal';

const flags: Record<string, ReactNode> = {
  ua: <Image src="ua-flag.png" w={30} h={20} />,
  en: <Image src="us-flag.png" w={30} h={20} />,
};

const renderLangOption: SelectProps['renderOption'] = ({ option }) => (
  <Group flex="1" gap="xs" justify="center">
    {flags[option.value]}
  </Group>
);

const Header = () => {
  const size = useWindowSize();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { user, logout } = useUserStore();
  const { t, i18n } = useTranslation();

  const openLoginModal = () => {
    modals.open({
      title: t('headerLogin'),
      children: <LoginModal />,
    });
  };

  const openSignupModal = () => {
    modals.open({
      title: t('headerSignup'),
      children: <SignupModal />,
    });
  };

  const openSettingsModal = () => {
    modals.open({
      title: t('headerSettings'),
      children: <ProfileSettingsModal />,
      size: 'xl',
    });
  };

  const menuWidth = useMemo(() => (size[0] > WindowBreakpoints.XS ? 260 : '100%'), [size]);

  return (
    <Container size="lg" className={classes.container}>
      <Group>
        <Link to="/">
          <Image src="logoipsum-330.svg" />
        </Link>

        <Select
          value={i18n.language}
          data={[
            { value: 'en', label: 'EN' },
            { value: 'ua', label: 'UA' },
          ]}
          onChange={value => i18n.changeLanguage(value || 'ua')}
          renderOption={renderLangOption}
          w={60}
          rightSection
          styles={{
            input: {
              textAlign: 'center',
              paddingRight: 12,
            },
          }}
          classNames={{ input: classes.locale }}
        />
      </Group>

      {user ? (
        <Menu
          width={menuWidth}
          position="bottom-end"
          transitionProps={{ transition: 'pop-top-right' }}
          onClose={() => setUserMenuOpened(false)}
          onOpen={() => setUserMenuOpened(true)}
          withinPortal
        >
          <Menu.Target>
            <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
              <Group gap={7}>
                <Avatar
                  src={getStaticFile(user?.avatar)}
                  alt={user?.user?.username}
                  radius="xl"
                  size={20}
                />

                <Text fw={500} size="sm" lh={1} mr={3}>
                  {user?.user?.username}
                </Text>

                <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={
                <IconNotes
                  color="#2796d6"
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
            >
              <Link to="/stories" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Text size="sm">{t('headerStories')}</Text>
              </Link>
            </Menu.Item>

            {user.writer && (
              <Menu.Item
                leftSection={
                  <IconFilePlus
                    color="#27d656"
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
              >
                <Link to="/stories/new" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Text size="sm">{t('headerCreateStory')}</Text>
                </Link>
              </Menu.Item>
            )}

            <Menu.Divider />

            <Menu.Item
              leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            >
              <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Text size="sm">{t('headerProfile')}</Text>
              </Link>
            </Menu.Item>

            <Menu.Item
              leftSection={
                <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              }
              onClick={openSettingsModal}
            >
              <Text size="sm">{t('headerSettings')}</Text>
            </Menu.Item>

            <Menu.Item
              leftSection={
                <IconLogout color="red" style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              }
              onClick={logout}
              c="red"
            >
              <Text size="sm">{t('headerLogout')}</Text>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ) : (
        <Group>
          <Button variant="outline" color="orange" onClick={openLoginModal}>
            {t('headerLogin')}
          </Button>

          <Button variant="outline" color="green" onClick={openSignupModal}>
            {t('headerSignup')}
          </Button>
        </Group>
      )}
    </Container>
  );
};

export default Header;
