import { useLocation } from 'wouter';
import { Home, Zap, Scan, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/triage', label: 'Triage', icon: Zap },
  { path: '/scanner', label: 'Scan', icon: Scan },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/find-pro', label: 'Find Pro', icon: Users },
];

export default function AppNav() {
  const [location, navigate] = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-card border-t border-border z-50">
      <div className="flex">
        {TABS.map(({ path, label, icon: Icon }) => {
          const active = location === path;
          const isScan = path === '/scanner';
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                active
                  ? isScan
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
