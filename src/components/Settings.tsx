import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Settings as SettingsIcon, 
  Globe, 
  MessageSquare, 
  Shield, 
  Users, 
  Bell,
  Database,
  Key,
  AlertCircle,
  CheckCircle,
  Copy,
  Mic
} from 'lucide-react';
import { VoiceDemo } from './VoiceDemo';

export function Settings() {
  const [apiKey, setApiKey] = useState('sk-****************************');
  const [maxResponseTime, setMaxResponseTime] = useState('3');
  const [fallbackEnabled, setFallbackEnabled] = useState(true);
  const [multilingualMode, setMultilingualMode] = useState(true);
  const [contextMemory, setContextMemory] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h2>Settings & Configuration</h2>
        <p className="text-muted-foreground">
          Configure chatbot behavior, integrations, and system preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <SettingsIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">General</span>
            <span className="sm:hidden">Gen</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Voice</span>
            <span className="sm:hidden">Voice</span>
          </TabsTrigger>
          <TabsTrigger value="languages" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Languages</span>
            <span className="sm:hidden">Lang</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Database className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Integrations</span>
            <span className="sm:hidden">API</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Security</span>
            <span className="sm:hidden">Sec</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="sm:hidden">Notify</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bot Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bot-name">Bot Name</Label>
                    <Input id="bot-name" defaultValue="Campus Assistant" />
                  </div>
                  
                  <div>
                    <Label htmlFor="greeting">Welcome Message</Label>
                    <Textarea
                      id="greeting"
                      placeholder="Enter welcome message..."
                      defaultValue="Hello! I'm your campus assistant. How can I help you today?"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fallback-message">Fallback Message</Label>
                    <Textarea
                      id="fallback-message"
                      placeholder="Message when bot cannot understand..."
                      defaultValue="I'm sorry, I didn't understand that. Could you please rephrase your question?"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="max-response-time">Max Response Time (seconds)</Label>
                    <Select value={maxResponseTime} onValueChange={setMaxResponseTime}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 second</SelectItem>
                        <SelectItem value="3">3 seconds</SelectItem>
                        <SelectItem value="5">5 seconds</SelectItem>
                        <SelectItem value="10">10 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                    <Select defaultValue="70">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50% - Low</SelectItem>
                        <SelectItem value="70">70% - Medium</SelectItem>
                        <SelectItem value="80">80% - High</SelectItem>
                        <SelectItem value="90">90% - Very High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="multilingual">Multilingual Support</Label>
                      <Switch
                        id="multilingual"
                        checked={multilingualMode}
                        onCheckedChange={setMultilingualMode}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="context-memory">Context Memory</Label>
                      <Switch
                        id="context-memory"
                        checked={contextMemory}
                        onCheckedChange={setContextMemory}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="fallback-enabled">Human Fallback</Label>
                      <Switch
                        id="fallback-enabled"
                        checked={fallbackEnabled}
                        onCheckedChange={setFallbackEnabled}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Weekdays</Label>
                  <div className="flex gap-2 mt-1">
                    <Select defaultValue="09:00">
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="00:00">00:00</SelectItem>
                        <SelectItem value="09:00">09:00</SelectItem>
                        <SelectItem value="10:00">10:00</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="self-center">to</span>
                    <Select defaultValue="17:00">
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="17:00">17:00</SelectItem>
                        <SelectItem value="18:00">18:00</SelectItem>
                        <SelectItem value="23:59">23:59</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Weekends</Label>
                  <div className="flex gap-2 mt-1">
                    <Select defaultValue="10:00">
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="00:00">00:00</SelectItem>
                        <SelectItem value="10:00">10:00</SelectItem>
                        <SelectItem value="11:00">11:00</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="self-center">to</span>
                    <Select defaultValue="16:00">
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:00">16:00</SelectItem>
                        <SelectItem value="17:00">17:00</SelectItem>
                        <SelectItem value="23:59">23:59</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="after-hours">After Hours Message</Label>
                <Textarea
                  id="after-hours"
                  placeholder="Message to show outside operating hours..."
                  defaultValue="I'm currently offline. Please contact us during office hours: 9 AM - 5 PM (Mon-Fri)"
                  rows={2}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="languages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Language Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Default Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="mr">Marathi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Auto-detect Language</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Switch id="auto-detect" defaultChecked />
                  <Label htmlFor="auto-detect" className="text-sm">
                    Automatically detect user language from input
                  </Label>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label>Supported Languages</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { code: 'en', name: 'English', flag: '🇬🇧' },
                    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
                    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
                    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
                    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
                  ].map(lang => (
                    <div key={lang.code} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span className="text-sm">{lang.name}</span>
                      </div>
                      <Switch defaultChecked={['en', 'hi', 'mr'].includes(lang.code)} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="api-key">OpenAI API Key</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your API key is encrypted and stored securely
                </p>
              </div>
              
              <div>
                <Label htmlFor="model">Language Model</Label>
                <Select defaultValue="gpt-3.5-turbo">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>External Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5" />
                    <div>
                      <div className="font-medium">WhatsApp Business</div>
                      <div className="text-xs text-muted-foreground">
                        Connect to WhatsApp for messaging
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Not Connected</Badge>
                    <Button size="sm">Connect</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Telegram Bot</div>
                      <div className="text-xs text-muted-foreground">
                        Deploy bot on Telegram
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Not Connected</Badge>
                    <Button size="sm">Connect</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5" />
                    <div>
                      <div className="font-medium">College Database</div>
                      <div className="text-xs text-muted-foreground">
                        Connect to student information system
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Connected</Badge>
                    <Button size="sm" variant="outline">Configure</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Privacy Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Don't store personal information
                    </p>
                  </div>
                  <Switch
                    checked={privacyMode}
                    onCheckedChange={setPrivacyMode}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Conversation Logging</Label>
                    <p className="text-xs text-muted-foreground">
                      Store conversations for improvement
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Encryption</Label>
                    <p className="text-xs text-muted-foreground">
                      Encrypt all stored data
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>GDPR Compliance</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable data deletion requests
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label>Data Retention Period</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Conversation data will be automatically deleted after this period
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Admin Users</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">admin@college.edu</span>
                    </div>
                    <Badge>Owner</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">support@college.edu</span>
                    </div>
                    <Badge variant="outline">Editor</Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="mt-2">
                  <Users className="h-4 w-4 mr-1" />
                  Add User
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>High Volume Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Notify when conversation volume is high
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Escalation Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Alert when conversations are escalated
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>System Health Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Notify about system issues
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Reports</Label>
                    <p className="text-xs text-muted-foreground">
                      Send performance summaries
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label htmlFor="notification-email">Notification Email</Label>
                <Input
                  id="notification-email"
                  type="email"
                  defaultValue="admin@college.edu"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Notification Frequency</Label>
                <Select defaultValue="immediate">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}