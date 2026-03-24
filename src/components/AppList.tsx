import { AppItem } from '../App';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

type AppListProps = {
  apps: AppItem[];
  onToggle: (id: string) => void;
  onLaunch: (app: AppItem) => void;
};

export function AppList({ apps, onToggle, onLaunch }: AppListProps) {
  return (
    <div className="bg-card rounded-[2rem] p-2 shadow-sm border border-border/50">
      {apps.map((app, index) => {
        const IconComponent = (Icons as any)[app.icon] || Icons.HelpCircle;
        
        return (
          <motion.div 
            key={app.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/50 transition-colors"
          >
            <div 
              className="flex items-center gap-4 flex-1 cursor-pointer"
              onClick={() => onLaunch(app)}
            >
              <div className={`w-12 h-12 rounded-2xl ${app.color} flex items-center justify-center shadow-sm`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-lg">{app.name}</span>
            </div>
            
            <button
              onClick={() => onToggle(app.id)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                app.locked ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  app.locked ? 'translate-x-6' : 'translate-x-1'
                } shadow-sm`}
              />
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
