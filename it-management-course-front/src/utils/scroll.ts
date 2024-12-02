import { MutableRefObject } from 'react';

export const scrollToRef = (ref: MutableRefObject<HTMLDivElement | null>) => {
  ref.current?.scrollIntoView({
    behavior: 'smooth',
  });
};
