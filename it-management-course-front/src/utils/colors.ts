const colors = [
  'blue',
  'pink',
  'green',
  'grape',
  'orange',
  'lime',
  'red',
  'teal',
  'violet',
  'yellow',
];

export const getRandomBadgeColor = (num: number) => {
  return colors[num % colors.length];
};
