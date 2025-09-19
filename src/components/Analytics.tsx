import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { MessageSquare, Users, Clock, TrendingUp, Download, Calendar, Globe, HelpCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

const conversationData = [
  { name: 'Mon', conversations: 45, resolved: 42, escalated: 3 },
  { name: 'Tue', conversations: 52, resolved: 48, escalated: 4 },
  { name: 'Wed', conversations: 38, resolved: 35, escalated: 3 },
  { name: 'Thu', conversations: 65, resolved: 58, escalated: 7 },
  { name: 'Fri', conversations: 78, resolved: 71, escalated: 7 },
  { name: 'Sat', conversations: 23, resolved: 21, escalated: 2 },
  { name: 'Sun', conversations: 18, resolved: 17, escalated: 1 }
];

const languageData = [
  { name: 'English', value: 45, color: '#8884d8' },
  { name: 'Hindi', value: 35, color: '#82ca9d' },
  { name: 'Marathi', value: 12, color: '#ffc658' },
  { name: 'Telugu', value: 6, color: '#ff7c7c' },
  { name: 'Tamil', value: 2, color: '#8dd1e1' }
];

const categoryData = [
  { name: 'Fees', queries: 156, satisfaction: 4.2 },
  { name: 'Scholarships', queries: 89, satisfaction: 4.5 },
  { name: 'Admissions', queries: 67, satisfaction: 4.1 },
  { name: 'Academics', queries: 45, satisfaction: 4.3 },
  { name: 'Campus Life', queries: 23, satisfaction: 4.0 }
];

const recentConversations = [
  {
    id: '1',
    user: 'Student_123',
    language: 'Hindi',
    category: 'Fees',
    duration: '3:45',
    resolved: true,
    timestamp: '2 hours ago',
    satisfaction: 5
  },
  {
    id: '2',
    user: 'Student_456',
    language: 'English',
    category: 'Scholarships',
    duration: '5:20',
    resolved: true,
    timestamp: '3 hours ago',
    satisfaction: 4
  },
  {
    id: '3',
    user: 'Student_789',
    language: 'Marathi',
    category: 'Admissions',
    duration: '12:15',
    resolved: false,
    timestamp: '4 hours ago',
    satisfaction: null
  }
];

export function Analytics() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('conversations');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor chatbot performance and user interactions • Logged in as {user?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">319</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.4s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-0.3s</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.3/5</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.2</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Conversation Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conversationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="resolved" stackId="a" fill="#82ca9d" name="Resolved" />
                    <Bar dataKey="escalated" stackId="a" fill="#ff7c7c" name="Escalated" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Query Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map(category => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{category.name}</div>
                        <Badge variant="outline">{category.queries} queries</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">
                          ★ {category.satisfaction}
                        </div>
                        <div className="w-20 h-2 bg-gray-200 rounded">
                          <div
                            className="h-2 bg-blue-500 rounded"
                            style={{ width: `${(category.satisfaction / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Conversation Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={conversationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="conversations" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="resolved" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="languages" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Language Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Language Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {languageData.map(lang => (
                    <div key={lang.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <span className="font-medium">{lang.name}</span>
                        </div>
                        <Badge variant="outline">{lang.value}% usage</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>Accuracy: 94%</div>
                        <div>Avg. Time: 1.2s</div>
                        <div>Satisfaction: 4.1</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>API Response Time</span>
                  <Badge variant="secondary">Excellent</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Memory Usage</span>
                  <Badge variant="outline">Normal</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Error Rate</span>
                  <Badge variant="secondary">Low</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Uptime</span>
                  <Badge>99.9%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Queries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">1. Fee payment deadline - 89 times</div>
                  <div className="text-sm">2. Scholarship application - 67 times</div>
                  <div className="text-sm">3. Exam schedule - 45 times</div>
                  <div className="text-sm">4. Admission process - 34 times</div>
                  <div className="text-sm">5. Library hours - 23 times</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Escalation Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Escalations</span>
                  <span>26 (8.1%)</span>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">Top reasons:</div>
                  <div className="text-xs text-muted-foreground">• Complex fee calculations</div>
                  <div className="text-xs text-muted-foreground">• Document verification issues</div>
                  <div className="text-xs text-muted-foreground">• Specific admission queries</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Conversations</CardTitle>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="fees">Fees</SelectItem>
                      <SelectItem value="scholarships">Scholarships</SelectItem>
                      <SelectItem value="admissions">Admissions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Satisfaction</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentConversations.map(conv => (
                      <TableRow key={conv.id}>
                        <TableCell className="font-mono text-sm">{conv.user}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{conv.language}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{conv.category}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {conv.duration}
                        </TableCell>
                        <TableCell>
                          {conv.resolved ? (
                            <Badge>Resolved</Badge>
                          ) : (
                            <Badge variant="outline">Escalated</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {conv.satisfaction ? (
                            <div className="flex items-center">
                              {'★'.repeat(conv.satisfaction)}
                              <span className="text-xs ml-1">({conv.satisfaction})</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Pending</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {conv.timestamp}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}