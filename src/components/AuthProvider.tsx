'use client';

import { usePrivy } from '@privy-io/react-auth';
import type { PropsWithChildren } from 'react';
import { LoginButton } from './LoginButton';
import Preloader from './Preloader';

export default function AuthProvider({ children }: PropsWithChildren) {
  const { ready, authenticated, user } = usePrivy();

  return !ready ? <Preloader /> : !user || !authenticated ? <LoginButton /> : children;
}
