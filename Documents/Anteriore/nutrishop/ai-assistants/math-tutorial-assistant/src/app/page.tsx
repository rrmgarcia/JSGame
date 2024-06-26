'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoadingScreen from '@/components/Loading';

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (session) {
      router.push('/chat');
    } else {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  return null; 
};

export default HomePage;
