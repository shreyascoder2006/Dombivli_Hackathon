import React from 'react';
import { cn } from './ui/utils';
import { 
  BarChart3, 
  TrendingUp, 
  Shield, 
  PlaySquare, 
  Store, 
  GraduationCap, 
  Zap,
  LayoutDashboard,
  User,
  Settings,
  Bell,
  LogOut,
  Activity
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { useApp } from '../App';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'builder', label: 'Strategy Builder', icon: Zap },
  { id: 'backtesting', label: 'Backtesting', icon: PlaySquare },
  { id: 'risk', label: 'Risk Management', icon: Shield },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'live-trading', label: 'Live Trading', icon: Activity },
  { id: 'marketplace', label: 'Marketplace', icon: Store },
  { id: 'education', label: 'Education', icon: GraduationCap },
];

export function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const { user, notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-xl">Stratify</h1>
        </div>
        
        {/* User Profile Section */}
        <div 
          className="flex items-center gap-3 p-3 rounded-lg bg-accent hover:bg-accent/80 cursor-pointer transition-colors"
          onClick={() => setActiveTab('profile')}
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback>{user?.avatar || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm">{user?.name || 'User'}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">{user?.accountType || 'Free'}</Badge>
              <span className="text-xs text-muted-foreground">${user?.portfolioValue?.toLocaleString() || '0'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                activeTab === item.id && "bg-primary text-primary-foreground"
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
        
        <div className="pt-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 relative"
            onClick={() => setActiveTab('profile')}
          >
            <User className="h-4 w-4" />
            Profile
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 relative"
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 relative"
          >
            <Bell className="h-4 w-4" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="absolute right-2 h-5 w-5 p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </nav>
      
      <div className="p-4 border-t border-border space-y-3">
        <div className="bg-accent p-3 rounded-lg">
          <p className="text-sm">💡 Pro Tip</p>
          <p className="text-xs text-muted-foreground mt-1">
            Start with paper trading to test your strategies risk-free
          </p>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}