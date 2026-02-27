import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { 
  User, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Shield, 
  Settings,
  Edit,
  Save,
  Camera,
  Link,
  Award,
  Activity,
  DollarSign,
  Clock
} from 'lucide-react';
import { useApp } from '../App';

export function UserProfile() {
  const { user, setUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>User Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and trading preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="trading">Trading Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl">{user.avatar}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 p-0">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl">{user.name}</h2>
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900">
                      <Award className="h-3 w-3 mr-1" />
                      {user.accountType}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(user.joinDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-4 w-4" />
                      {user.tradingExperience} Trader
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Portfolio Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">${user.portfolioValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                  +{user.totalReturn}% total return
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Active Strategies</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{user.activeStrategies}</div>
                <p className="text-xs text-muted-foreground">
                  {user.totalStrategies} total created
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Risk Tolerance</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{user.riskTolerance}</div>
                <p className="text-xs text-muted-foreground">
                  Conservative approach
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Connected Brokers</CardTitle>
                <Link className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{user.brokerConnections.length}</div>
                <p className="text-xs text-muted-foreground">
                  Broker integrations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest trading actions and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { icon: TrendingUp, text: 'Created new RSI Momentum strategy', time: '2 hours ago', type: 'success' },
                  { icon: Activity, text: 'Completed backtesting for Mean Reversion strategy', time: '1 day ago', type: 'info' },
                  { icon: Award, text: 'Earned "Risk Manager" achievement', time: '3 days ago', type: 'achievement' },
                  { icon: DollarSign, text: 'Portfolio reached new high of $125,847', time: '1 week ago', type: 'success' },
                ].map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'success' ? 'bg-green-100 text-green-600' :
                        activity.type === 'achievement' ? 'bg-purple-100 text-purple-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={isEditing ? editedUser.name : user.name}
                    onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? editedUser.email : user.email}
                    onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4>Account Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{user.accountType}</Badge>
                      <Button variant="outline" size="sm">Upgrade</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <p className="text-sm text-muted-foreground">{new Date(user.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading Profile</CardTitle>
              <CardDescription>Configure your trading preferences and risk settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Trading Experience</Label>
                    <Select 
                      value={isEditing ? editedUser.tradingExperience : user.tradingExperience}
                      onValueChange={(value) => setEditedUser({...editedUser, tradingExperience: value})}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="risk">Risk Tolerance</Label>
                    <Select 
                      value={isEditing ? editedUser.riskTolerance : user.riskTolerance}
                      onValueChange={(value) => setEditedUser({...editedUser, riskTolerance: value})}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Conservative">Conservative</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Preferred Timeframes</Label>
                    <div className="flex flex-wrap gap-2">
                      {['1m', '5m', '15m', '1h', '4h', '1d', '1w'].map((tf) => (
                        <Badge 
                          key={tf} 
                          variant={user.preferredTimeframes.includes(tf) ? "default" : "outline"}
                          className="cursor-pointer"
                        >
                          {tf}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Connected Brokers</Label>
                    <div className="space-y-2">
                      {user.brokerConnections.map((broker, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{broker}</span>
                          <Badge variant="outline" className="text-green-600 border-green-600">Connected</Badge>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Link className="h-4 w-4 mr-2" />
                      Add Broker
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4>Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4>Login Notifications</h4>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4>API Access</h4>
                    <p className="text-sm text-muted-foreground">Enable API access for third-party applications</p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4>Password</h4>
                <Button variant="outline">Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4>Trade Notifications</h4>
                    <p className="text-sm text-muted-foreground">Get notified when your strategies execute trades</p>
                  </div>
                  <Switch 
                    checked={user.notifications.trades}
                    onCheckedChange={(checked) => setUser({
                      ...user, 
                      notifications: {...user.notifications, trades: checked}
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4>Risk Alerts</h4>
                    <p className="text-sm text-muted-foreground">Alerts for portfolio risk and drawdown warnings</p>
                  </div>
                  <Switch 
                    checked={user.notifications.alerts}
                    onCheckedChange={(checked) => setUser({
                      ...user, 
                      notifications: {...user.notifications, alerts: checked}
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4>Educational Content</h4>
                    <p className="text-sm text-muted-foreground">Updates about new courses and educational materials</p>
                  </div>
                  <Switch 
                    checked={user.notifications.educational}
                    onCheckedChange={(checked) => setUser({
                      ...user, 
                      notifications: {...user.notifications, educational: checked}
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4>Marketing & Updates</h4>
                    <p className="text-sm text-muted-foreground">Product updates and promotional content</p>
                  </div>
                  <Switch 
                    checked={user.notifications.marketing}
                    onCheckedChange={(checked) => setUser({
                      ...user, 
                      notifications: {...user.notifications, marketing: checked}
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}