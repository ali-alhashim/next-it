'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RootPage = () => {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = Boolean(localStorage.getItem('token')); // Or use your auth logic
    if (isAuthenticated) {
      router.push('/main');
    } else {
      router.push('/login');
    }
  }, []);

  return <div>Redirecting...</div>;
};

export default RootPage;
