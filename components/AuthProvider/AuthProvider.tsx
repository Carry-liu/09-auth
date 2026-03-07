'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import Loader from '@/components/Loader/Loader';
import { checkSession } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);

  const [isLoading, setIsLoading] = useState(true);

  const isPrivateRoute = pathname.startsWith('/profile') || pathname.startsWith('/notes');

  useEffect(() => {
    const verifySession = async () => {
      try {
        const user = await checkSession();

        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();

          if (isPrivateRoute) {
            router.replace('/sign-in');
            return;
          }
        }
      } catch {
        clearIsAuthenticated();

        if (isPrivateRoute) {
          router.replace('/sign-in');
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [pathname, isPrivateRoute, router, setUser, clearIsAuthenticated]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}
