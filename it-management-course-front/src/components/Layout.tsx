import { Box, Container } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getProfile } from '../api/profiles';
import { useUserStore } from '../zustand/userStore';
import Header from './Header';

const Layout = () => {
  const { setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh');

    if (!token && !refresh) {
      setIsLoading(false);

      return;
    }

    setIsLoading(true);
    getProfile()
      .then(response => setUser(response?.data.profile || null))
      .finally(() => setIsLoading(false));
  }, []);

  return isLoading ? null : (
    <Box>
      <Header />

      <Container size="92rem">
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
