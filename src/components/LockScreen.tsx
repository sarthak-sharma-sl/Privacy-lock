import { useState } from 'react';
import { motion } from 'motion/react';
import { Fingerprint, Delete, X } from 'lucide-react';
import { AppItem } from '../App';
import * as Icons from 'lucide-react';

type LockScreenProps = {
  app: AppItem | null;
  correctPin: string;
  biometricsEnabled: boolean;
  onSuccess: () => void;
  onCancel: () => void;
};

export function LockScreen({ app, correctPin, biometricsEnabled, onSuccess, onCancel }: LockScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(biometricsEnabled);

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
    setShowBiometricPrompt(false);
    onSuccess();
  };

  const simulateBiometricFail = () => {
    setShowBiometricPrompt(false);
    // Just hide prompt, user can use PIN
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

      <div className="flex flex-col items-center mt-12">
        {app && IconComponent && (
          <div className={`w-20 h-20 rounded-3xl ${app.color} flex items-center justify-center mb-6 shadow-xl`}>
            <IconComponent className="w-10 h-10 text-white" />
          </div>
        )}
        <h2 className="text-2xl font-semibold mb-2">Use PIN to unlock</h2>
        <p className="text-muted-foreground">{app?.name}</p>

        {/* PIN Dots */}
        <div className="flex gap-4 mt-12 mb-8 h-4">
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
        {error && <p className="text-red-500 text-sm mt-2">Incorrect PIN</p>}
      </div>

      {/* Number Pad */}
      <div className="w-full max-w-xs grid grid-cols-3 gap-y-6 gap-x-4 mb-12">
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
          {/* Empty space for alignment */}
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

      {/* Simulated Biometric Prompt Overlay */}
      <AnimatePresence>
        {showBiometricPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-0 left-0 right-0 bg-card rounded-t-[2rem] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-border/50 flex flex-col items-center"
          >
            <h3 className="text-xl font-semibold mb-2">Verify it's you</h3>
            <p className="text-muted-foreground text-center mb-8">
              Use your fingerprint or face to unlock {app?.name}
            </p>
            
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-8 animate-pulse">
              <Fingerprint className="w-10 h-10 text-primary" />
            </div>

            <div className="flex gap-4 w-full">
              <button 
                onClick={simulateBiometricFail}
                className="flex-1 py-4 rounded-xl font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                Use PIN
              </button>
              <button 
                onClick={simulateBiometricSuccess}
                className="flex-1 py-4 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Simulate Success
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
