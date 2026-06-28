import { Home, Grid, BarChart2, Trophy, Settings, type LucideIcon } from 'lucide-react';
import { TabName } from '../types';

interface BottomNavProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

const TABS: { id: TabName; label: string; Icon: LucideIcon }[] = [
  { id: 'today', label: 'Today', Icon: Home },
  { id: 'pillars', label: 'Pillars', Icon: Grid },
  { id: 'stats', label: 'Stats', Icon: BarChart2 },
  { id: 'levelup', label: 'Level Up', Icon: Trophy },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
      style={{
        backgroundColor: '#13131A',
        borderTop: '1px solid #1E1E2E',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex flex-col items-center justify-center flex-1 pt-3 pb-1 min-h-[56px] transition-colors"
            style={{
              color: isActive ? '#E63946' : '#6C757D',
              WebkitTapHighlightColor: 'transparent',
              minHeight: '56px',
            }}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            <span
              className="text-xs mt-0.5 font-medium"
              style={{
                fontSize: '10px',
                letterSpacing: '0.03em',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
