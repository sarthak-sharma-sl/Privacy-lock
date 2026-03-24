import { Shield, Settings as SettingsIcon } from 'lucide-react';

type BottomNavProps = {
  activeTab: 'apps' | 'settings';
  setActiveTab: (tab: 'apps' | 'settings') => void;
};

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 pb-safe pt-2 px-6 flex justify-around items-center z-40">
      <button
        onClick={() => setActiveTab('apps')}
        className={`flex flex-col items-center p-3 rounded-2xl transition-colors ${
          activeTab === 'apps' ? 'text-primary' : 'text-muted-foreground hover:bg-muted/50'
        }`}
      >
        <Shield className={`w-6 h-6 mb-1 ${activeTab === 'apps' ? 'fill-primary/20' : ''}`} />
        <span className="text-[10px] font-medium">Apps</span>
      </button>
      
      <button
        onClick={() => setActiveTab('settings')}
        className={`flex flex-col items-center p-3 rounded-2xl transition-colors ${
          activeTab === 'settings' ? 'text-primary' : 'text-muted-foreground hover:bg-muted/50'
        }`}
      >
        <SettingsIcon className={`w-6 h-6 mb-1 ${activeTab === 'settings' ? 'fill-primary/20' : ''}`} />
        <span className="text-[10px] font-medium">Settings</span>
      </button>
    </div>
  );
}
