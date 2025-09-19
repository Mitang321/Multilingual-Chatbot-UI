import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAuth } from './AuthContext';
import { ProfileSettings } from './ProfileSettings';
import { ErrorBoundary } from './ErrorBoundary';
import { ThemeToggle } from './ThemeToggle';
import { LogOut, User, Settings, Shield, Crown, Palette } from 'lucide-react';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-1 sm:gap-2 h-auto p-1.5 sm:p-2">
            <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-left hidden sm:block">
              <div className="text-sm font-medium truncate max-w-24 lg:max-w-none">{user.name}</div>
              <div className="flex items-center gap-2">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                  {user.role === 'admin' ? (
                    <>
                      <Crown className="h-3 w-3 mr-1" />
                      Admin
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3 mr-1" />
                      Student
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56 sm:w-64">
          <DropdownMenuLabel>
            <div>
              <div className="font-medium truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              <div className="flex items-center gap-1 mt-1 sm:hidden">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                  {user.role === 'admin' ? (
                    <>
                      <Crown className="h-3 w-3 mr-1" />
                      Admin
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3 mr-1" />
                      Student
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setShowProfileSettings(true)}>
            <User className="h-4 w-4 mr-2" />
            Profile Settings
          </DropdownMenuItem>
          
          <div className="flex items-center justify-between px-2 py-1.5 cursor-default">
            <div className="flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              <span className="text-sm">Theme</span>
            </div>
            <ThemeToggle compact />
          </div>
          
          {user.role === 'admin' && (
            <DropdownMenuItem>
              <Shield className="h-4 w-4 mr-2" />
              Admin Settings
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={logout} className="text-red-600">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Settings Dialog */}
      <Dialog open={showProfileSettings} onOpenChange={setShowProfileSettings}>
        <DialogContent className="w-[95vw] max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
            <DialogDescription className="text-sm">
              Manage your account settings, preferences, and personal information.
            </DialogDescription>
          </DialogHeader>
          <ErrorBoundary>
            <ProfileSettings onClose={() => setShowProfileSettings(false)} />
          </ErrorBoundary>
        </DialogContent>
      </Dialog>
    </>
  );
}