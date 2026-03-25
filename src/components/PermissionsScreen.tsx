import { motion } from 'motion/react';
import { Layers, Activity, Fingerprint, ShieldAlert } from 'lucide-react';

type PermissionsScreenProps = {
  onGrant: () => void;
};

export function PermissionsScreen({ onGrant }: PermissionsScreenProps) {
  return (
    <div className="flex flex-col h-full bg-background p-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8">
          <ShieldAlert className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="text-2xl font-semibold text-center mb-2">Permissions Required</h1>
        <p className="text-muted-foreground text-center mb-10">
          Privacy Lock needs the following Android permissions to function correctly.
        </p>

        <div className="space-y-6 w-full mb-12">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium">Appear on top</h3>
              <p className="text-sm text-muted-foreground">
                <code className="text-xs bg-muted px-1 rounded">SYSTEM_ALERT_WINDOW</code><br/>
                Allows the lock screen to display over other apps when they are launched.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-medium">Usage Data Access</h3>
              <p className="text-sm text-muted-foreground">
                <code className="text-xs bg-muted px-1 rounded">PACKAGE_USAGE_STATS</code><br/>
                Required to detect when a locked app is opened in the foreground.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <Fingerprint className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium">Biometrics</h3>
              <p className="text-sm text-muted-foreground">
                <code className="text-xs bg-muted px-1 rounded">USE_BIOMETRIC</code><br/>
                Allows unlocking apps using your Fingerprint or Face.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onGrant}
          className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg hover:bg-primary/90 transition-colors active:scale-[0.98]"
        >
          Grant Permissions
        </button>
      </div>
    </div>
  );
}
