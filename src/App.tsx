import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/theme-provider';
import { AppList } from './components/AppList';
import { Settings } from './components/Settings';
import { LockScreen } from './components/LockScreen';
import { BottomNav } from './components/BottomNav';
import { PermissionsScreen } from './components/PermissionsScreen';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

export type AppItem = {
  id: string;
  name: string;
  icon: string;
  locked: boolean;
  color: string;
};

const INITIAL_APPS: AppItem[] = [
  { id: '1', name: 'WhatsApp', icon: 'MessageCircle', locked: true, color: 'bg-green-500' },
  { id: '2', name: 'Gallery', icon: 'Image', locked: false, color: 'bg-purple-500' },
  { id: '3', name: 'Messages', icon: 'MessageSquare', locked: true, color: 'bg-blue-500' },
  { id: '4', name: 'Instagram', icon: 'Camera', locked: false, color: 'bg-pink-500' },
  { id: '5', name: 'Banking', icon: 'Landmark', locked: true, color: 'bg-indigo-500' },
  { id: '6', name: 'Settings', icon: 'Settings', locked: false, color: 'bg-gray-500' },
  { id: '7', name: 'Gmail', icon: 'Mail', locked: false, color: 'bg-red-500' },
  { id: '8', name: 'Chrome', icon: 'Globe', locked: false, color: 'bg-yellow-500' },
];

export default function App() {
  const [permissionsGranted, setPermissionsGranted] = useState<boolean>(() => {
    return localStorage.getItem('privacy-permissions') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'apps' | 'settings'>('apps');
  const [apps, setApps] = useState<AppItem[]>(() => {
    const saved = localStorage.getItem('privacy-apps');
    return saved ? JSON.parse(saved) : INITIAL_APPS;
  });
  
  const [pin, setPin] = useState<string>(() => localStorage.getItem('privacy-pin') || '1234');
  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('privacy-biometrics') === 'true';
  });

  const [activeAppToLaunch, setActiveAppToLaunch] = useState<AppItem | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [launchedApp, setLaunchedApp] = useState<AppItem | null>(null);

  useEffect(() => {
    localStorage.setItem('privacy-permissions', String(permissionsGranted));
  }, [permissionsGranted]);

  useEffect(() => {
    localStorage.setItem('privacy-apps', JSON.stringify(apps));
  }, [apps]);

  useEffect(() => {
    localStorage.setItem('privacy-pin', pin);
  }, [pin]);

  useEffect(() => {
    localStorage.setItem('privacy-biometrics', String(biometricsEnabled));
  }, [biometricsEnabled]);

  const toggleAppLock = (id: string) => {
    setApps(apps.map(app => app.id === id ? { ...app, locked: !app.locked } : app));
  };

  const handleAppClick = (app: AppItem) => {
    if (app.locked) {
      setActiveAppToLaunch(app);
      setIsLocked(true);
    } else {
      setLaunchedApp(app);
    }
  };

  const handleUnlockSuccess = () => {
    setIsLocked(false);
    if (activeAppToLaunch) {
      setLaunchedApp(activeAppToLaunch);
      setActiveAppToLaunch(null);
    }
  };

  const handleUnlockCancel = () => {
    setIsLocked(false);
    setActiveAppToLaunch(null);
  };

  const closeLaunchedApp = () => {
    setLaunchedApp(null);
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-background overflow-hidden relative shadow-2xl sm:rounded-[3rem] sm:h-[850px] sm:my-8 sm:border-8 sm:border-gray-900">
        
        {!permissionsGranted ? (
          <PermissionsScreen onGrant={() => setPermissionsGranted(true)} />
        ) : (
          <>
            {/* Header - One UI Style (Large, collapsible in a real app) */}
            <div className="pt-12 pb-6 px-6 shrink-0">
              <h1 className="text-3xl font-semibold tracking-tight">
                {activeTab === 'apps' ? 'Privacy Lock' : 'Settings'}
              </h1>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24">
              <AnimatePresence mode="wait">
                {activeTab === 'apps' ? (
                  <motion.div
                    key="apps"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AppList apps={apps} onToggle={toggleAppLock} onLaunch={handleAppClick} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Settings 
                      pin={pin} 
                      setPin={setPin} 
                      biometricsEnabled={biometricsEnabled} 
                      setBiometricsEnabled={setBiometricsEnabled} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Lock Screen Overlay */}
            <AnimatePresence>
              {isLocked && (
                <LockScreen 
                  app={activeAppToLaunch}
                  correctPin={pin}
                  biometricsEnabled={biometricsEnabled}
                  onSuccess={handleUnlockSuccess}
                  onCancel={handleUnlockCancel}
                />
              )}
            </AnimatePresence>

            {/* Launched App Simulation Overlay */}
            <AnimatePresence>
              {launchedApp && (
                <motion.div
                  initial={{ opacity: 0, y: '100%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="absolute inset-0 z-50 bg-card flex flex-col items-center justify-center"
                >
                  <div className={`w-24 h-24 rounded-3xl ${launchedApp.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <ShieldCheck className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">{launchedApp.name}</h2>
                  <p className="text-muted-foreground mb-8">App is running securely.</p>
                  <button 
                    onClick={closeLaunchedApp}
                    className="px-8 py-3 bg-muted text-foreground rounded-full font-medium active:scale-95 transition-transform"
                  >
                    Close App
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

