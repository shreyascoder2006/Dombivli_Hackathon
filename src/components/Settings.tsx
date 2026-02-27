import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Settings as SettingsIcon,
  Palette,
  Globe,
  Shield,
  Bell,
  Zap,
  DollarSign,
  Clock,
  Monitor,
  Moon,
  Sun,
  Download,
  Upload,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../App';

export function Settings() {
  const { user } = useApp();
  const [theme, setTheme] = useState('light');
  const [autoSave, setAutoSave] = useState(true);
  const [maxStrategies, setMaxStrategies] = useState([10]);
  const [defaultCapital, setDefaultCapital] = useState('10000');
  
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Settings</h1>
          <p className="text-muted-foreground">Customize your TradeCraft AI experience</p>
        </div>
        <Button size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Settings
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic application preferences and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save Strategies</Label>
                    <p className="text-sm text-muted-foreground">Automatically save strategy changes</p>
                  </div>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Real-time Updates</Label>
                    <p className="text-sm text-muted-foreground">Enable live data updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound Notifications</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for alerts and notifications</p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="est">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="gmt">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Trading Configuration
              </CardTitle>
              <CardDescription>Default settings for strategy creation and execution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="capital">Default Capital</Label>
                    <Input
                      id="capital"
                      value={defaultCapital}
                      onChange={(e) => setDefaultCapital(e.target.value)}
                      placeholder="10000"
                    />
                    <p className="text-xs text-muted-foreground">Default starting capital for new strategies</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Max Active Strategies</Label>
                    <div className="px-3">
                      <Slider
                        value={maxStrategies}
                        onValueChange={setMaxStrategies}
                        max={50}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>1</span>
                        <span>{maxStrategies[0]} strategies</span>
                        <span>50</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="commission">Default Commission</Label>
                    <Input id="commission" placeholder="0.1%" />
                    <p className="text-xs text-muted-foreground">Default commission rate for backtesting</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="slippage">Default Slippage</Label>
                    <Input id="slippage" placeholder="0.05%" />
                    <p className="text-xs text-muted-foreground">Default slippage for realistic backtesting</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Risk Management</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto stop-loss</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Position sizing</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Risk alerts</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Market Data
              </CardTitle>
              <CardDescription>Configure data feeds and market information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Real-time Data</Label>
                    <p className="text-sm text-muted-foreground">Enable live market data feeds</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label>Default Market</Label>
                  <Select defaultValue="us">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">US Markets</SelectItem>
                      <SelectItem value="eu">European Markets</SelectItem>
                      <SelectItem value="asia">Asian Markets</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="forex">Forex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Data Provider</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Yahoo Finance', 'Alpha Vantage', 'Polygon', 'IEX Cloud'].map((provider) => (
                      <div key={provider} className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">{provider}</span>
                        <Badge variant="outline">Free</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Display & Theme
              </CardTitle>
              <CardDescription>Customize the appearance and layout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      className="justify-start gap-2"
                      onClick={() => setTheme('light')}
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      className="justify-start gap-2"
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      className="justify-start gap-2"
                      onClick={() => setTheme('system')}
                    >
                      <Monitor className="h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>High Contrast</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for accessibility</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Chart Color Scheme</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Default', 'Colorblind', 'Monochrome', 'Custom'].map((scheme) => (
                      <Button key={scheme} variant="outline" className="justify-start">
                        {scheme}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Integrations
              </CardTitle>
              <CardDescription>Connect external services and APIs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Broker Connections</Label>
                  {user.brokerConnections.map((broker, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{broker}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600">Connected</Badge>
                        <Button variant="ghost" size="sm">Configure</Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Add New Broker
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label>API Keys</Label>
                  <div className="space-y-2">
                    {[
                      { name: 'Alpha Vantage', status: 'active' },
                      { name: 'Polygon.io', status: 'inactive' },
                      { name: 'IEX Cloud', status: 'active' },
                    ].map((api, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <span>{api.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={api.status === 'active' ? 'default' : 'secondary'}>
                            {api.status}
                          </Badge>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Advanced Settings
              </CardTitle>
              <CardDescription>Advanced configuration options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Developer Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable advanced features and debugging</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Beta Features</Label>
                    <p className="text-sm text-muted-foreground">Access experimental features</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">Help improve TradeCraft AI by sharing usage data</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label>Data Management</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <Download className="h-4 w-4" />
                      Export Data
                    </div>
                    <p className="text-xs text-muted-foreground">Download all your strategies and data</p>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <Upload className="h-4 w-4" />
                      Import Data
                    </div>
                    <p className="text-xs text-muted-foreground">Import strategies from another platform</p>
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <Label>Danger Zone</Label>
                </div>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm text-red-900">Reset All Settings</h4>
                      <p className="text-xs text-red-700">This will reset all settings to their default values</p>
                      <Button variant="outline" size="sm" className="mt-2 border-red-300 text-red-700 hover:bg-red-100">
                        Reset Settings
                      </Button>
                    </div>
                    
                    <Separator className="bg-red-200" />
                    
                    <div>
                      <h4 className="text-sm text-red-900">Delete Account</h4>
                      <p className="text-xs text-red-700">Permanently delete your account and all data</p>
                      <Button variant="destructive" size="sm" className="mt-2">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}