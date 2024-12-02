import { Tabs, Text } from '@mantine/core';
import { IconDots, IconFeather, IconUser } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useWindowSize } from '../../hooks/useWindowSize';
import { WindowBreakpoints } from '../../types/breakpoints';
import MiscTab from './settings/MiscTab';
import ProfileTab from './settings/ProfileTab';
import WritershipTab from './settings/WritershipTab';
import { useTranslation } from 'react-i18next';

const ProfileSettingsModal = () => {
  const { t } = useTranslation();
  const size = useWindowSize();

  const orientation = useMemo(
    () => (size[0] > WindowBreakpoints.SM ? 'vertical' : 'horizontal'),
    [size]
  );

  return (
    <Tabs
      orientation={orientation}
      defaultValue="profile"
      styles={{
        panel: {
          paddingBlock: 16,
        },
      }}
    >
      <Tabs.List>
        <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
          <Text>{t('settingsTabProfile')}</Text>
        </Tabs.Tab>

        <Tabs.Tab value="writership" leftSection={<IconFeather size={16} />}>
          <Text>{t('settingsTabWritership')}</Text>
        </Tabs.Tab>

        <Tabs.Tab value="misc" leftSection={<IconDots size={16} />}>
          <Text>{t('settingsTabMisc')}</Text>
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="profile">
        <ProfileTab />
      </Tabs.Panel>

      <Tabs.Panel value="writership">
        <WritershipTab />
      </Tabs.Panel>

      <Tabs.Panel value="misc">
        <MiscTab />
      </Tabs.Panel>
    </Tabs>
  );
};

export default ProfileSettingsModal;
