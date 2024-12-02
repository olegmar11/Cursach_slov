import { useEffect } from 'react';

export const useDebounce = (cb: any, deps: any, delay: any) => {
  useEffect(() => {
    const handler = setTimeout(() => cb(), delay);
    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
};
