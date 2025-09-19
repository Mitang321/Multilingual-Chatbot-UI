import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeProvider';
import { User, Mail, Phone, MapPin, Bell, Globe, Shield, Save, RotateCcw, CheckCircle, AlertCircle, Eye, EyeOff, Sun, Moon, Monitor } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  bio: string;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  theme: string;
}

const defaultProfileData: ProfileData = {
  name: '',
  email: '',
  phone: '',
  department: '',
  year: '',
  bio: '',
  language: 'en',
  timezone: 'Asia/Kolkata',
  emailNotifications: true,
  pushNotifications: true,
  weeklyReports: false,
  theme: 'system'
};

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileSettingsProps {
  onClose?: () => void;
}

export function ProfileSettings({ onClose }: ProfileSettingsProps) {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const [originalData, setOriginalData] = useState<ProfileData>(defaultProfileData);
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setSaveLoading] = useState(false);
  const [isResetting, setResetLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      const userData: ProfileData = {
        name: user.name || '',
        email: user.email || '',
        phone: '',
        department: user.role === 'admin' ? 'Administration' : 'Computer Science',
        year: user.role === 'admin' ? 'Staff' : '3rd Year',
        bio: user.role === 'admin' 
          ? 'System administrator managing campus multilingual assistant' 
          : 'Student using campus chatbot for academic queries',
        language: 'en',
        timezone: 'Asia/Kolkata',
        emailNotifications: true,
        pushNotifications: true,
        weeklyReports: user.role === 'admin',
        theme: theme
      };
      
      // Try to load saved profile data from localStorage
      const savedData = localStorage.getItem(`profile_${user.id}`);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          const mergedData = { ...userData, ...parsed, theme: theme }; // Always use current theme
          setProfileData(mergedData);
          setOriginalData(mergedData);
        } catch (error) {
          setProfileData(userData);
          setOriginalData(userData);
        }
      } else {
        setProfileData(userData);
        setOriginalData(userData);
      }
    }
  }, [user, theme]);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(profileData) !== JSON.stringify(originalData);
    setHasUnsavedChanges(hasChanges);
  }, [profileData, originalData]);

  const handleProfileChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // If theme is changed, immediately apply it
    if (field === 'theme') {
      setTheme(value);
    }
  };

  const handlePasswordChange = (field: keyof PasswordChangeData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePasswordChange = (): boolean => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return false;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return false;
    }

    return true;
  };

  const handleSaveChanges = async () => {
    setSaveLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage (in real app, this would be an API call)
      if (user) {
        localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileData));
        setOriginalData({ ...profileData });
        
        // Update user context with new name if it changed
        if (profileData.name !== user.name) {
          updateUser({ name: profileData.name });
        }
        
        toast.success('Profile updated successfully!');
        
        // Auto-close dialog after successful save
        if (onClose) {
          setTimeout(() => onClose(), 1500);
        }
      }
    } catch (error) {
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!validatePasswordChange()) return;
    
    setSaveLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, this would validate current password and update
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password updated successfully!');
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleResetToDefaults = async () => {
    setResetLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const defaultData = { ...defaultProfileData };
      if (user) {
        defaultData.name = user.name;
        defaultData.email = user.email;
      }
      
      setProfileData(defaultData);
      setOriginalData(defaultData);
      
      // Clear saved data
      if (user) {
        localStorage.removeItem(`profile_${user.id}`);
      }
      
      toast.success('Settings reset to defaults');
    } catch (error) {
      toast.error('Failed to reset settings. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2>Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {hasUnsavedChanges && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Don't forget to save your updates.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-6 p-4 bg-muted/30 rounded-lg border">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {getInitials(profileData.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium">{profileData.name}</h3>
                <p className="text-sm text-muted-foreground">{profileData.email}</p>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="mt-2">
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role === 'admin' ? 'Administrator' : 'Student'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                placeholder="your.email@college.edu"
                disabled // Email typically can't be changed
                className="bg-muted"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Select
                  value={profileData.department}
                  onValueChange={(value) => handleProfileChange('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Civil">Civil Engineering</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="year">Year/Position</Label>
                <Select
                  value={profileData.year}
                  onValueChange={(value) => handleProfileChange('year', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Faculty">Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="language">Preferred Language</Label>
              <Select
                value={profileData.language}
                onValueChange={(value) => handleProfileChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                  <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                  <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                  <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={profileData.timezone}
                onValueChange={(value) => handleProfileChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">Theme Preference</Label>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {profileData.theme === 'light' && <Sun className="h-3 w-3" />}
                  {profileData.theme === 'dark' && <Moon className="h-3 w-3" />}
                  {profileData.theme === 'system' && <Monitor className="h-3 w-3" />}
                  Currently: {profileData.theme === 'system' ? 'System' : profileData.theme === 'light' ? 'Light' : 'Dark'}
                </div>
              </div>
              <Select
                value={profileData.theme}
                onValueChange={(value) => handleProfileChange('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      System (Auto)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Changes take effect immediately. System theme follows your device preference.
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    checked={profileData.emailNotifications}
                    onCheckedChange={(value) => handleProfileChange('emailNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Get instant alerts
                    </p>
                  </div>
                  <Switch
                    checked={profileData.pushNotifications}
                    onCheckedChange={(value) => handleProfileChange('pushNotifications', value)}
                  />
                </div>

                {user.role === 'admin' && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Weekly Reports</p>
                      <p className="text-xs text-muted-foreground">
                        Analytics summaries
                      </p>
                    </div>
                    <Switch
                      checked={profileData.weeklyReports}
                      onCheckedChange={(value) => handleProfileChange('weeklyReports', value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update your password to keep your account secure
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  placeholder="Enter new password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  placeholder="Confirm new password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Button
            onClick={handlePasswordSave}
            disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            className="mt-4"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating Password...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Password
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={handleResetToDefaults}
          disabled={isLoading || isResetting}
        >
          {isResetting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
              Resetting...
            </div>
          ) : (
            <>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </>
          )}
        </Button>

        <div className="flex gap-2">
          {onClose && (
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading || isResetting}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSaveChanges}
            disabled={!hasUnsavedChanges || isLoading || isResetting}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving Changes...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}