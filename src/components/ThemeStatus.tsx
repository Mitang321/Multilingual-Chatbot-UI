import React from 'react';
import { useTheme } from './ThemeProvider';
import { Badge } from './ui/badge';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeStatus() {
  const { theme, actualTheme } = useTheme();

  const getThemeIcon = () => {
    switch (actualTheme) {
      case 'light':
        return <Sun className="h-3 w-3" />;
      case 'dark':
        return <Moon className="h-3 w-3" />;
      default:
        return <Monitor className="h-3 w-3" />;
    }
  };

  const getThemeLabel = () => {
    if (theme === 'system') {
      return `System (${actualTheme})`;
    }
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  return (
    <Badge variant="outline" className="hidden sm:flex items-center gap-1 text-xs">
      {getThemeIcon()}
      <span>{getThemeLabel()}</span>
    </Badge>
  );
}