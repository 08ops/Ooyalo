import React, { useState } from 'react';
import { ShuttleVehicle } from '../types/shuttle';
import { 
  Cpu, 
  Radio, 
  Sun, 
  BatteryMedium, 
  Terminal, 
  Activity, 
  Send, 
  Copy, 
  Check, 
  RefreshCw, 
  Wifi, 
  Zap, 
  AlertTriangle,
  HardDrive,
  Compass,
  Gauge
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface HardwareTelemetryHubProps {
  shuttles: ShuttleVehicle[];
  onManualInjectTelemetry: (data: {
    shuttleId: string;
    lat: number;
    lng: number;
    speed: number;
    batteryVoltage: number;
    solarWatts: number;
  }) => void;
}

export const HardwareTelemetryHub: React.FC<HardwareTelemetryHubProps> = ({
  shuttles,
  onManualInjectTelemetry,
}) => {
  const [selectedShuttleId, setSelectedShuttleId] = useState<string>(shuttles[0]?.id || 'shuttle-01');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'serial-terminal' | 'api-tester'>('diagnostics');

  // Manual Inject Form State
  const activeShuttle = shuttles.find((s) => s.id === selectedShuttleId) || shuttles[0];
  const [injectLat, setInjectLat] = useState(activeShuttle ? activeShuttle.currentLocation.lat.toString() : '5.6515');
  const [injectLng, setInjectLng] = useState(activeShuttle ? activeShuttle.currentLocation.lng.toString() : '-0.1870');
  const [injectSpeed, setInjectSpeed] = useState('24');
  const [injectBat, setInjectBat] = useState('3.95');
  const [injectSolar, setInjectSolar] = useState('2.4');
  const [injectSuccess, setInjectSuccess] = useState(false);

  const hw = activeShuttle?.hardware;

  const handleCopyCurl = () => {
    const curlCmd = `curl -X POST "https://ooyalo-api.campus.edu/api/telemetry" \\
  -H "Content-Type: application/json" \\
  -H "X-Device-Key: ${hw?.deviceId}" \\
  -d '{
    "device_id": "${hw?.deviceId}",
    "firmware": "${hw?.firmwareVersion}",
    "lat": ${activeShuttle?.currentLocation.lat.toFixed(6)},
    "lng": ${activeShuttle?.currentLocation.lng.toFixed(6)},
    "speed_kmh": ${activeShuttle?.speedKmh},
    "heading": ${activeShuttle?.heading},
    "battery_v": ${hw?.batteryVoltage},
    "solar_w": ${hw?.solarPowerWatts},
    "gsm_rssi_dbm": ${hw?.gsmRssi},
    "satellites": ${hw?.satellites},
    "timestamp": "${new Date().toISOString()}"
  }'`;

    navigator.clipboard.writeText(curlCmd);
    setCopied(true);
    soundEffects.playTelemetryTick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShuttle) return;

    onManualInjectTelemetry({
      shuttleId: activeShuttle.id,
      lat: parseFloat(injectLat) || activeShuttle.currentLocation.lat,
      lng: parseFloat(injectLng) || activeShuttle.currentLocation.lng,
      speed: parseInt(injectSpeed, 10) || 0,
      batteryVoltage: parseFloat(injectBat) || 3.9,
      solarWatts: parseFloat(injectSolar) || 2.0,
    });

    soundEffects.playTelemetryTick();
    setInjectSuccess(true);
    setTimeout(() => setInjectSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Device Selector Ribbon & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 p-4 sm:p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white font-mono">IoT Telemetry & Hardware Hub</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ESP32-C3 • SIM800L • NEO-6M
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time diagnostics from roof-mounted solar GPS tracker units on the campus transit fleet
          </p>
        </div>

        {/* Vehicle / Tracker Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-zinc-400 whitespace-nowrap">Tracker Unit:</label>
          <select
            value={selectedShuttleId}
            onChange={(e) => setSelectedShuttleId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
          >
            {shuttles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name.split('—')[0]} ({s.hardware.deviceId})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'diagnostics'
              ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Live Hardware Telemetry</span>
        </button>
        <button
          onClick={() => setActiveTab('serial-terminal')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'serial-terminal'
              ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>UART & NMEA Serial Stream</span>
        </button>
        <button
          onClick={() => setActiveTab('api-tester')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'api-tester'
              ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>API Telemetry Ingestion Tester</span>
        </button>
      </div>

      {activeTab === 'diagnostics' && hw && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Core MCU (ESP32-C3) */}
          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                ESP32-C3 MCU
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Device ID</span>
                <span className="text-zinc-200">{hw.deviceId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Firmware</span>
                <span className="text-zinc-300">{hw.firmwareVersion}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Free Heap</span>
                <span className="text-emerald-400">{(hw.esp32FreeHeap / 1024).toFixed(1)} KB</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">MCU Temp</span>
                <span className="text-zinc-300">{hw.temperatureC}°C</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">UARTs</span>
                <span className="text-zinc-300">UART1 (GPS) / UART2 (GSM)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Cellular Modem (SIM800L) */}
          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-sky-400" />
                SIM800L Cellular
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                2G GPRS
              </span>
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Carrier Network</span>
                <span className="text-zinc-200">MTN Ghana</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Signal RSSI</span>
                <span className={`font-bold ${hw.gsmRssi > -75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {hw.gsmRssi} dBm (Good)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">HTTP Ingest Ping</span>
                <span className="text-zinc-300">{hw.uploadLatencyMs} ms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Buffer Cap</span>
                <span className="text-emerald-400">1000µF Buffer OK</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">POST Interval</span>
                <span className="text-zinc-300">5.0 sec cadence</span>
              </div>
            </div>
          </div>

          {/* Card 3: GPS Engine (NEO-6M) */}
          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-400" />
                NEO-6M GPS Engine
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                3D FIX
              </span>
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Satellites</span>
                <span className="text-emerald-400 font-bold">{hw.satellites} Locked</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">HDOP Accuracy</span>
                <span className="text-zinc-200">{hw.hdop} (High)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Speed Over Ground</span>
                <span className="text-zinc-300">{activeShuttle?.speedKmh} km/h</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Compass Course</span>
                <span className="text-zinc-300">{activeShuttle?.heading}°</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Coordinates</span>
                <span className="text-zinc-300 truncate max-w-[120px]">
                  {activeShuttle?.currentLocation.lat.toFixed(4)}, {activeShuttle?.currentLocation.lng.toFixed(4)}
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Solar & LiPo Battery */}
          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                Solar & Power Rail
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                CN3065
              </span>
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">LiPo Voltage</span>
                <span className="text-emerald-400 font-bold">{hw.batteryVoltage} V ({hw.batteryPercentage}%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Solar Generation</span>
                <span className="text-amber-400 font-bold">{hw.solarPowerWatts} W ({hw.solarCurrentMa} mA)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Solar Voltage</span>
                <span className="text-zinc-300">{hw.solarVoltage} V</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Charging State</span>
                <span className="text-emerald-400">{hw.chargingState}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Net Power</span>
                <span className="text-emerald-400">+1.6W Surplus</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'serial-terminal' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-mono">Live Serial UART1 & UART2 Terminal Log</h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">115200 Baud • Direct Hardware Pipeline</span>
          </div>

          {/* Terminal Box */}
          <div className="bg-zinc-900/90 rounded-xl p-4 font-mono text-xs text-zinc-300 space-y-2 border border-zinc-800 max-h-96 overflow-y-auto leading-relaxed">
            <div className="text-zinc-500">// Bootstrapping ESP32-C3 SuperMini Hardware UARTs...</div>
            <div className="text-emerald-400">[ESP32] Init UART1 (GPIO4/5) at 9600 baud for NEO-6M GPS... OK</div>
            <div className="text-emerald-400">[ESP32] Init UART2 (GPIO6/7) at 115200 baud for SIM800L Modem... OK</div>
            <div className="text-sky-400">[SIM800L] AT+CPIN? → +CPIN: READY</div>
            <div className="text-sky-400">[SIM800L] AT+CREG? → +CREG: 0,1 (Registered on MTN Ghana Home Network)</div>
            <div className="text-sky-400">[SIM800L] AT+SAPBR=3,1,"APN","internet" → OK</div>
            <div className="text-sky-400">[SIM800L] AT+SAPBR=1,1 → OK (Bearer opened, IP: 10.142.68.219)</div>
            
            <div className="my-2 border-t border-zinc-800 pt-2 text-zinc-400">
              <span className="text-amber-400">[NEO-6M NMEA]</span> $GPRMC,{new Date().toISOString().replace(/[-:T]/g, '').slice(8, 14)}.00,A,0539.0900,N,00011.2200,W,{((activeShuttle?.speedKmh || 20) * 0.539957).toFixed(1)},{(activeShuttle?.heading || 45).toFixed(1)},210826,,,A*7F
            </div>
            <div className="text-zinc-400">
              <span className="text-amber-400">[NEO-6M NMEA]</span> $GPGGA,{new Date().toISOString().replace(/[-:T]/g, '').slice(8, 14)}.00,0539.0900,N,00011.2200,W,1,{hw?.satellites || 8},{hw?.hdop || 1.1},124.2,M,18.3,M,,*47
            </div>

            <div className="my-2 border-t border-zinc-800 pt-2 text-emerald-400">
              [TELEMETRY DISPATCH] Formatting JSON packet for {hw?.deviceId}:
            </div>
            <pre className="text-[11px] text-zinc-300 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
{`{
  "device_id": "${hw?.deviceId}",
  "lat": ${activeShuttle?.currentLocation.lat.toFixed(6)},
  "lng": ${activeShuttle?.currentLocation.lng.toFixed(6)},
  "speed": ${activeShuttle?.speedKmh},
  "heading": ${activeShuttle?.heading},
  "battery_v": ${hw?.batteryVoltage},
  "solar_w": ${hw?.solarPowerWatts},
  "rssi": ${hw?.gsmRssi},
  "satellites": ${hw?.satellites},
  "ts": "${new Date().toISOString()}"
}`}
            </pre>
            <div className="text-sky-400">[SIM800L] AT+HTTPACTION=1 → +HTTPACTION: 1,200,38 (HTTP POST 200 OK received in {hw?.uploadLatencyMs}ms)</div>
          </div>
        </div>
      )}

      {activeTab === 'api-tester' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Manual Telemetry Injection Form */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Manual Ingest / Mock Telemetry</h3>
            </div>
            <p className="text-xs text-zinc-400">
              Send a test GPS telemetry payload into the live tracking engine as if an actual ESP32-C3 hardware tracker reported it over GPRS.
            </p>

            <form onSubmit={handleInjectSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 font-semibold block mb-1">Latitude</label>
                  <input
                    type="text"
                    value={injectLat}
                    onChange={(e) => setInjectLat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-semibold block mb-1">Longitude</label>
                  <input
                    type="text"
                    value={injectLng}
                    onChange={(e) => setInjectLng(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 font-semibold block mb-1">Speed (km/h)</label>
                  <input
                    type="number"
                    value={injectSpeed}
                    onChange={(e) => setInjectSpeed(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-semibold block mb-1">Battery (V)</label>
                  <input
                    type="text"
                    value={injectBat}
                    onChange={(e) => setInjectBat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-semibold block mb-1">Solar (W)</label>
                  <input
                    type="text"
                    value={injectSolar}
                    onChange={(e) => setInjectSolar(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
                <span>Inject GPS Telemetry Packet</span>
              </button>

              {injectSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Telemetry packet successfully ingested into fleet engine!</span>
                </div>
              )}
            </form>
          </div>

          {/* cURL & Ingest Endpoint Spec */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Production Ingestion API Spec</h3>
              <button
                onClick={handleCopyCurl}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied cURL!' : 'Copy cURL'}</span>
              </button>
            </div>
            <p className="text-xs text-zinc-400">
              Hardware units transmit HTTP POST requests over cellular data to the backend endpoint:
            </p>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto">
              <span className="text-emerald-400 font-bold">POST</span> /api/telemetry<br/>
              <span className="text-zinc-500">Content-Type: application/json</span><br/>
              <span className="text-zinc-500">X-Device-Key: ESP32C3-OOYALO-001</span>
            </div>

            <div className="text-xs text-zinc-400 space-y-1">
              <p>• <strong>Interval:</strong> 5 seconds while vehicle in motion; 60s when parked in depot</p>
              <p>• <strong>Bandwidth:</strong> ~184 bytes per packet (~25 MB / month on 2G MTN SIM)</p>
              <p>• <strong>Failover:</strong> On-device SPI flash ring-buffer holds 500 offline points if GSM drops</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
