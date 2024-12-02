import { Divider, Group, Text } from '@mantine/core';
import { FC } from 'react';

interface SettingsLabelProps {
  title: string;
}

const SettingsLabel: FC<SettingsLabelProps> = ({ title }) => {
  return (
    <Group align="center" mb={12} w="100%">
      <Divider flex={1} />

      <Text size="sm" style={{ fontWeight: 'bold' }}>
        {title}
      </Text>

      <Divider flex={1} />
    </Group>
  );
};

export default SettingsLabel;
