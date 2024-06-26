'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { FC, ReactNode } from 'react';

interface AuthSessionProviderProps {
  children: ReactNode;
}

const AuthSessionProvider: FC<AuthSessionProviderProps> = ({ children }) => {
  return (
    <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
  );
};

export default AuthSessionProvider;
