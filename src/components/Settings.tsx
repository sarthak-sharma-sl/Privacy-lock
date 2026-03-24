import { useState } from 'react';
import { useTheme } from './theme-provider';
import { Moon, Sun, Monitor, Fingerprint, KeyRound, ChevronRight } from 'lucide-react';

type SettingsProps = {
  pin: string;
  setPin: (pin: string) => void;
  biometricsEnabled: boolean;
  setBiometricsEnabled: (enabled: boolean) => void;
};

export function Settings({ pin, setPin, biometricsEnabled, setBiometricsEnabled }: SettingsProps) {
  const { theme, setTheme } = useTheme();
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 4) {
      setNewPin(val);
    }
  };

  const saveNewPin = () => {
    if (newPin.length === 4) {
      setPin(newPin);
      setIsChangingPin(false);
      setNewPin('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Security Section */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground ml-4 mb-2 uppercase tracking-wider">Security</h3>
        <div className="bg-card rounded-[2rem] overflow-hidden shadow-sm border border-border/50">
          
          {/* Change PIN */}
          <div className="p-4 border-b border-border/50">
            {isChangingPin ? (
              <div className="flex items-center gap-4">
                <input
                  type="password"
                  value={newPin}
                  onChange={handlePinChange}
                  placeholder="Enter 4-digit PIN"
                  className="flex-1 bg-muted rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <button 
                  onClick={saveNewPin}
                  disabled={newPin.length !== 4}
                  className="px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50"
                >
                  Save
                </button>
                <button 
                  onClick={() => setIsChangingPin(false)}
                  className="px-4 py-3 bg-muted text-foreground rounded-xl font-medium"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsChangingPin(true)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Change PIN</p>
                    <p className="text-sm text-muted-foreground">Current: {pin}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Biometrics Toggle */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Fingerprint className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium">Biometric Unlock</p>
                <p className="text-sm text-muted-foreground">Use fingerprint or face</p>
              </div>
            </div>
            <button
              onClick={() => setBiometricsEnabled(!biometricsEnabled)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                biometricsEnabled ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  biometricsEnabled ? 'translate-x-6' : 'translate-x-1'
                } shadow-sm`}
              />
            </button>
          </div>

        </div>
      </section>

      {/* Display Section */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground ml-4 mb-2 uppercase tracking-wider">Display</h3>
        <div className="bg-card rounded-[2rem] overflow-hidden shadow-sm border border-border/50 p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-purple-500" /> : 
               theme === 'light' ? <Sun className="w-5 h-5 text-purple-500" /> : 
               <Monitor className="w-5 h-5 text-purple-500" />}
            </div>
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">Choose app appearance</p>
            </div>
          </div>
          
          <div className="flex bg-muted rounded-xl p-1">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === 'light' ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === 'dark' ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === 'system' ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              System
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
