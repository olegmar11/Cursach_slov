import { Group, Text } from '@mantine/core';
import { FC } from 'react';

interface LabelValueProps {
  label: string;
  value?: string;
}

const LabelValue: FC<LabelValueProps> = ({ label, value }) => {
  return (
    <Group justify="space-between">
      <Text
        fw='bold'
        size='sm'
      >
        {label}
      </Text>

      <Text>{value}</Text>
    </Group>
  );
};

export default LabelValue;
