import React, { useState } from 'react';
import { 
  Smartphone,
  Hash,
  Wifi,
  Signal,
  Battery,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { ShuttleVehicle } from '../types/shuttle';

interface UssdSimulatorProps {
  shuttles: ShuttleVehicle[];
}

export const UssdSimulator: React.FC<UssdSimulatorProps> = ({ shuttles }) => {
  const [ussdInput, setUssdInput] = useState('');
  const [sessionActive, setSessionActive] = useState(false);
  const [screen, setScreen] = useState<'idle' | 'main' | 'track' | 'accessibility' | 'sos' | 'success'>('idle');
  const [message, setMessage] = useState('');

  const handleDial = () => {
    if (ussdInput === '*123#') {
      setSessionActive(true);
      setScreen('main');
    } else {
      setMessage('Unknown USSD code. Try *123#');
      setScreen('success');
      setSessionActive(true);
    }
  };

  const handleReply = (input: string) => {
    if (!sessionActive) return;

    if (screen === 'main') {
      if (input === '1') setScreen('track');
      else if (input === '2') {
        setMessage('Active routes:\n1. Blue Loop\n2. Red Express\n3. Night Owl\n\n0. Back');
        setScreen('success');
      }
      else if (input === '3') setScreen('accessibility');
      else if (input === '4') setScreen('sos');
      else {
        setSessionActive(false);
        setScreen('idle');
      }
    } else if (screen === 'track') {
      if (input === '1') {
        const shuttle = shuttles.find(s => s.routeId === 'route-blue-loop');
        setMessage(shuttle 
          ? `Blue Loop Shuttle ${shuttle.name} is approaching next stop in ${Math.ceil(shuttle.etaSecondsToNextStop/60)} mins.`
          : 'No active shuttles on Blue Loop right now.'
        );
      } else if (input === '2') {
        setMessage('Red Express is 4 mins away from Balme Library.');
      } else {
        setScreen('main');
      }
      setScreen('success');
    } else if (screen === 'accessibility') {
      if (input === '1') {
        setMessage('Priority boarding requested for next arriving shuttle. Driver has been notified.');
        setScreen('success');
      } else {
        setScreen('main');
      }
    } else if (screen === 'sos') {
      if (input === '1') {
        setMessage('SOS Alert sent to campus security with your location. Please stay safe.');
        setScreen('success');
      } else {
        setScreen('main');
      }
    } else if (screen === 'success') {
      if (input === '0') setScreen('main');
      else {
        setSessionActive(false);
        setScreen('idle');
      }
    }
    
    setUssdInput('');
  };

  const handleCancel = () => {
    setSessionActive(false);
    setScreen('idle');
    setUssdInput('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Context & Info */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">USSD & Accessibility Options</h1>
            <p className="text-sm text-zinc-400 mt-1">Universal access for feature phones and passengers with disabilities</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-zinc-300">
                <Hash className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold">Offline USSD Architecture</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Ooyalo ensures no student is left behind. The platform exposes a USSD gateway bridging GSM networks to our Node.js backend APIs. Students without smartphones or data bundles can dial <strong className="text-white">*123#</strong> to track shuttles, get text ETAs, and trigger SOS alerts.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-zinc-300">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold">Accessibility Workflow</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Registered users with documented disabilities (verified via the Admin Dashboard) gain access to priority features. They can request ramp deployment or priority boarding via USSD or the web app before a shuttle arrives.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-medium">Wheelchair Access</span>
                <span className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-medium">Visual Impairment TTS</span>
                <span className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-bold">Emergency SOS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Feature Phone Simulator */}
        <div className="w-full max-w-sm flex-shrink-0 mx-auto">
          <div className="bg-zinc-950 rounded-[3rem] border-8 border-zinc-800 p-4 shadow-2xl relative overflow-hidden flex flex-col h-[600px]">
            {/* Status Bar */}
            <div className="flex justify-between items-center text-zinc-500 mb-4 px-2">
              <div className="text-[10px] font-bold">MTN GH</div>
              <div className="flex items-center gap-1">
                <Signal className="w-3 h-3" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Screen Area */}
            <div className="bg-[#a3b899] flex-1 rounded-xl border-4 border-zinc-900 p-3 flex flex-col font-mono text-zinc-900 relative shadow-inner">
              {!sessionActive ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="text-4xl">{ussdInput || '...'}</div>
                  <div className="text-xs opacity-70">Dial *123#</div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 text-sm whitespace-pre-wrap leading-tight">
                    {screen === 'main' && (
                      <>
                        Ooyalo Shuttle Tracker<br/>
                        1. Track Shuttle<br/>
                        2. Route Info<br/>
                        3. Priority Boarding<br/>
                        4. SOS Alert<br/>
                        <br/>
                        Reply with number:
                      </>
                    )}
                    {screen === 'track' && (
                      <>
                        Select Route:<br/>
                        1. Blue Loop<br/>
                        2. Red Express<br/>
                        <br/>
                        0. Back
                      </>
                    )}
                    {screen === 'accessibility' && (
                      <>
                        Accessibility Auth<br/>
                        1. Request Priority Boarding<br/>
                        <br/>
                        0. Back
                      </>
                    )}
                    {screen === 'sos' && (
                      <>
                        ! EMERGENCY !<br/>
                        1. Dispatch Security to my location<br/>
                        <br/>
                        0. Cancel
                      </>
                    )}
                    {screen === 'success' && (
                      <>
                        {message}<br/>
                        <br/>
                        0. Main Menu<br/>
                        Any key to exit
                      </>
                    )}
                  </div>
                  <div className="border-t border-zinc-900/20 pt-2 mt-2">
                    <div className="text-xs opacity-50 mb-1">Send Reply:</div>
                    <div className="text-lg bg-white/30 px-2 py-1 min-h-[32px]">{ussdInput}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3 mt-6 px-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => setUssdInput(prev => prev + num)}
                  className="bg-zinc-900 active:bg-zinc-800 rounded-full h-12 flex items-center justify-center font-bold text-lg text-zinc-300 shadow-sm transition-colors"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setUssdInput(prev => prev + '*')}
                className="bg-zinc-900 active:bg-zinc-800 rounded-full h-12 flex items-center justify-center font-bold text-xl text-zinc-300 shadow-sm transition-colors"
              >
                *
              </button>
              <button
                onClick={() => setUssdInput(prev => prev + '0')}
                className="bg-zinc-900 active:bg-zinc-800 rounded-full h-12 flex items-center justify-center font-bold text-lg text-zinc-300 shadow-sm transition-colors"
              >
                0
              </button>
              <button
                onClick={() => setUssdInput(prev => prev + '#')}
                className="bg-zinc-900 active:bg-zinc-800 rounded-full h-12 flex items-center justify-center font-bold text-xl text-zinc-300 shadow-sm transition-colors"
              >
                #
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between px-8 mt-6 mb-2">
              <button
                onClick={sessionActive ? handleCancel : () => setUssdInput('')}
                className="bg-rose-500 hover:bg-rose-600 active:bg-rose-700 w-16 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
              >
                <div className="w-6 h-1 bg-white rounded-full"></div>
              </button>
              <button
                onClick={() => sessionActive ? handleReply(ussdInput) : handleDial()}
                className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 w-16 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
              >
                <Smartphone className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
