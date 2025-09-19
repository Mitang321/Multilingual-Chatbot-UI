import React from 'react';
import { useAuth } from './AuthContext';
import { Alert, AlertDescription } from './ui/alert';
import { Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRole = 'user',
  fallback 
}: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return fallback || (
      <Alert>
        <Lock className="h-4 w-4" />
        <AlertDescription>
          You must be logged in to access this content.
        </AlertDescription>
      </Alert>
    );
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return fallback || (
      <Alert>
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Access denied. This section is only available to administrators.
          Please contact your system administrator if you need elevated permissions.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}