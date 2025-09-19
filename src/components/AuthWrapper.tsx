import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Login } from './Login';
import { Signup } from './Signup';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return isLoginMode ? (
      <Login onSwitchToSignup={() => setIsLoginMode(false)} />
    ) : (
      <Signup onSwitchToLogin={() => setIsLoginMode(true)} />
    );
  }

  return <>{children}</>;
}