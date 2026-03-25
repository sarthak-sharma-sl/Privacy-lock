import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, Delete, X, ScanFace, KeyRound } from 'lucide-react';
import { AppItem } from '../App';
import * as Icons from 'lucide-react';

type LockScreenProps = {
  app: AppItem | null;
  correctPin: string;
  biometricsEnabled: boolean;
  onSuccess: () => void;
  onCancel: () => void;
};

type UnlockMethod = 'select' | 'pin' | 'fingerprint' | 'face';

export function LockScreen({ app, correctPin, biometricsEnabled, onSuccess, onCancel }: LockScreenProps) {
  const [method, setMethod] = useState<UnlockMethod>(biometricsEnabled ? 'select' : 'pin');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === correctPin) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setPin(''), 500);
    }
  };

  const simulateBiometricSuccess = () => {
    onSuccess();
  };

  const IconComponent = app ? ((Icons as any)[app.icon] || Icons.HelpCircle) : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute inset-0 z-50 bg-background/95 backdrop-blur-3xl flex flex-col items-center justify-between py-12 px-6"
    >
      <button 
        onClick={onCancel}
        className="absolute top-6 right-6 p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex flex-col items-center mt-12 w-full">
        {app && IconComponent && (
          <div className={`w-20 h-20 rounded-3xl ${app.color} flex items-center justify-center mb-6 shadow-xl`}>
            <IconComponent className="w-10 h-10 text-white" />
          </div>
        )}
        
        <h2 className="text-2xl font-semibold mb-2">
          {method === 'select' && 'Choose access method'}
          {method === 'pin' && 'Enter PIN'}
          {method === 'fingerprint' && 'Fingerprint'}
          {method === 'face' && 'Face Recognition'}
        </h2>
        <p className="text-muted-foreground">{app?.name}</p>

        <AnimatePresence mode="wait">
          {/* METHOD SELECTION PANEL */}
          {method === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-xs mt-12 space-y-4"
            >
              <button
                onClick={() => setMethod('fingerprint')}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl shadow-sm border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Fingerprint className="w-6 h-6 text-green-500" />
                </div>
                <span className="font-medium text-lg">Fingerprint</span>
              </button>

              <button
                onClick={() => setMethod('face')}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl shadow-sm border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <ScanFace className="w-6 h-6 text-blue-500" />
                </div>
                <span className="font-medium text-lg">Face Unlock</span>
              </button>

              <button
                onClick={() => setMethod('pin')}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl shadow-sm border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-purple-500" />
                </div>
                <span className="font-medium text-lg">Use PIN</span>
              </button>
            </motion.div>
          )}

          {/* PIN PAD */}
          {method === 'pin' && (
            <motion.div
              key="pin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center"
            >
              <div className="flex gap-4 mt-8 mb-8 h-4">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`w-4 h-4 rounded-full border-2 transition-colors ${
                      pin.length > i 
                        ? 'bg-primary border-primary' 
                        : error ? 'border-red-500' : 'border-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              {error && <p className="text-red-500 text-sm mb-4">Incorrect PIN</p>}

              <div className="w-full max-w-xs grid grid-cols-3 gap-y-6 gap-x-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleNumberClick(num.toString())}
                    className="w-20 h-20 mx-auto rounded-full bg-muted/30 flex items-center justify-center text-3xl font-light active:bg-muted/80 transition-colors"
                  >
                    {num}
                  </button>
                ))}
                <div className="w-20 h-20 mx-auto flex items-center justify-center">
                  {biometricsEnabled && (
                    <button onClick={() => setMethod('select')} className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                      Options
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleNumberClick('0')}
                  className="w-20 h-20 mx-auto rounded-full bg-muted/30 flex items-center justify-center text-3xl font-light active:bg-muted/80 transition-colors"
                >
                  0
                </button>
                <button
                  onClick={handleDelete}
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-muted-foreground active:bg-muted/50 transition-colors"
                >
                  <Delete className="w-8 h-8" />
                </button>
              </div>
            </motion.div>
          )}

          {/* FINGERPRINT SCANNER */}
          {method === 'fingerprint' && (
            <motion.div
              key="fingerprint"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center mt-20"
            >
              <div className="relative w-32 h-32 rounded-full bg-primary/5 flex items-center justify-center mb-12">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-full bg-primary/20"
                />
                <Fingerprint className="w-16 h-16 text-primary relative z-10" />
              </div>
              
              <div className="flex gap-4 w-full max-w-xs">
                <button 
                  onClick={() => setMethod('select')}
                  className="flex-1 py-4 rounded-xl font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={simulateBiometricSuccess}
                  className="flex-1 py-4 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Simulate Scan
                </button>
              </div>
            </motion.div>
          )}

          {/* FACE SCANNER */}
          {method === 'face' && (
            <motion.div
              key="face"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center mt-20"
            >
              <div className="relative w-32 h-32 rounded-full bg-blue-500/5 flex items-center justify-center mb-12 overflow-hidden">
                <motion.div 
                  animate={{ y: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"
                />
                <ScanFace className="w-16 h-16 text-blue-500 relative z-10" />
              </div>
              
              <div className="flex gap-4 w-full max-w-xs">
                <button 
                  onClick={() => setMethod('select')}
                  className="flex-1 py-4 rounded-xl font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={simulateBiometricSuccess}
                  className="flex-1 py-4 rounded-xl font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Simulate Scan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

