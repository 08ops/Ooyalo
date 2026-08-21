import React from 'react';
import { NotificationItem } from '../types/shuttle';
import { 
  Bell, 
  Check, 
  Trash2, 
  Sparkles, 
  Volume2, 
  AlertCircle, 
  Megaphone,
  Radio
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onTriggerTestAlert: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
  onTriggerTestAlert,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-zinc-900 border-l border-zinc-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Notifications & Alerts</h3>
                <p className="text-xs text-zinc-400">Live transit proximity and arrival pings</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white text-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Action Ribbon */}
          <div className="flex items-center justify-between py-3">
            <button
              onClick={onTriggerTestAlert}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test Arrival Chime</span>
            </button>

            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-zinc-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Notifications Feed */}
          <div className="space-y-3 mt-2 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="py-16 text-center text-zinc-500 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-zinc-600 opacity-60" />
                <p className="text-xs font-medium">No alerts received yet</p>
                <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
                  When a shuttle approaches your stop or matches your proximity criteria, real-time alerts appear here.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onMarkAsRead(notif.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-zinc-950/40 border-zinc-800/60 opacity-70'
                      : 'bg-zinc-950 border-emerald-500/40 shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {notif.type === 'broadcast' ? (
                        <Megaphone className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : notif.type === 'arrival' ? (
                        <Radio className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-sky-400 shrink-0" />
                      )}
                      <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 shrink-0">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-1 pl-6">{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
