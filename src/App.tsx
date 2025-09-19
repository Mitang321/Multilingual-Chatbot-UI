import React, { useState } from 'react';
import { AuthProvider } from './components/AuthContext';
import { AuthWrapper } from './components/AuthWrapper';
import { ThemeProvider } from './components/ThemeProvider';
import { ChatInterface } from './components/ChatInterface';
import { AdminPanel } from './components/AdminPanel';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { UserMenu } from './components/UserMenu';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeStatus } from './components/ThemeStatus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Alert, AlertDescription } from './components/ui/alert';
import { Toaster } from './components/ui/sonner';
import { useAuth } from './components/AuthContext';
import { MessageCircle, Settings as SettingsIcon, BarChart3, Shield, Lock } from 'lucide-react';

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');
  
  const adminOnlyTabs = ['admin', 'analytics', 'settings'];
  
  // Redirect non-admin users away from admin-only tabs
  const handleTabChange = (value: string) => {
    if (adminOnlyTabs.includes(value) && user?.role !== 'admin') {
      return; // Don't allow non-admin users to access these tabs
    }
    setActiveTab(value);
  };
  
  // Reset to chat tab if user loses admin privileges
  React.useEffect(() => {
    if (adminOnlyTabs.includes(activeTab) && user?.role !== 'admin') {
      setActiveTab('chat');
    }
  }, [user?.role]); // Only depend on user role, not activeTab

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-2 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="mb-1 sm:mb-2 text-lg sm:text-xl lg:text-2xl truncate">
              Campus Multilingual Assistant
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
              AI-powered chatbot supporting Hindi, English, and regional languages for campus queries
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className={`grid w-full ${
            user?.role === 'admin' 
              ? 'grid-cols-2 sm:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            <TabsTrigger value="chat" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Chat Interface</span>
              <span className="xs:hidden sm:hidden">Chat</span>
            </TabsTrigger>
            
            {user?.role === 'admin' && (
              <>
                <TabsTrigger value="admin" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline sm:inline">Admin Panel</span>
                  <span className="xs:hidden sm:hidden">Admin</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline sm:inline">Analytics</span>
                  <span className="xs:hidden sm:hidden">Stats</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <SettingsIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline sm:inline">Settings</span>
                  <span className="xs:hidden sm:hidden">Config</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>
          
          <TabsContent value="chat">
            <ChatInterface />
          </TabsContent>
          
          {user?.role === 'admin' && (
            <>
              <TabsContent value="admin">
                <AdminPanel />
              </TabsContent>
              
              <TabsContent value="analytics">
                <Analytics />
              </TabsContent>
              
              <TabsContent value="settings">
                <Settings />
              </TabsContent>
            </>
          )}
          
          {/* Show access denied message for non-admin users who somehow try to access admin content */}
          {user?.role !== 'admin' && adminOnlyTabs.map(tab => (
            <TabsContent key={tab} value={tab}>
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  Access denied. This section is only available to administrators.
                  Please contact your system administrator if you need elevated permissions.
                </AlertDescription>
              </Alert>
            </TabsContent>
          ))}
        </Tabs>

        {/* Student Account Info */}
        {user?.role !== 'admin' && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/50 rounded-lg border border-dashed">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm font-medium">Student Account</span>
            </div>
            <p className="text-xs text-muted-foreground">
              You're using a student account with access to the chat interface. 
              Contact your administrator for additional permissions if needed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="campus-chatbot-theme">
      <AuthProvider>
        <AuthWrapper>
          <AppContent />
          <Toaster />
        </AuthWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}