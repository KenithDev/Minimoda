// ============================================
// SIMPLE ROUTER - Client-side routing
// ============================================

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Simple hash-based router
export const useRouter = () => {
  const [currentPath, setCurrentPath] = useState(
    window.location.hash.slice(1) || '/'
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  return { currentPath, navigate };
};

interface RouteProps {
  path: string;
  children: ReactNode;
}

export const Route = ({ path, children }: RouteProps) => {
  const { currentPath } = useRouter();
  return currentPath === path ? <>{children}</> : null;
};

export const Router = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};
