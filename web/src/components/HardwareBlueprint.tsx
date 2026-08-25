import React, { useState } from 'react';
import { HardwareBOMItem } from '../types/shuttle';
import { 
  Wrench, 
  Cpu, 
  Sun, 
  BatteryMedium, 
  Radio, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  DollarSign, 
  FileCode2, 
  Copy, 
  Check, 
  Layers, 
  ExternalLink,
  Info
} from 'lucide-react';
import { INITIAL_BOM_ITEMS } from '../data/mockCampusData';

export const HardwareBlueprint: React.FC = () => {
  const [currency, setCurrency] = useState<'USD' | 'GHS'>('USD');
  const [pilotMultiplier, setPilotMultiplier] = useState<number>(3); // default 3 units pilot
  const [copiedCode, setCopiedCode] = useState(false);

  const exchangeRateGhs = 11.45; // 1 USD = ~11.45 GHS reference

  const totalHardwareCostUsd = INITIAL_BOM_ITEMS
    .filter((item) => item.category !== 'Recurring SIM')
    .reduce((acc, item) => acc + item.unitCostUsd * pilotMultiplier, 0);

  const totalHardwareCostGhs = INITIAL_BOM_ITEMS
    .filter((item) => item.category !== 'Recurring SIM')
    .reduce((acc, item) => acc + item.unitCostGhs * pilotMultiplier, 0);

  const recurringSimMonthlyUsd = 6.00 * pilotMultiplier;
  const recurringSimMonthlyGhs = recurringSimMonthlyUsd * exchangeRateGhs;

  const sampleFirmwareCode = `// Ooyalo Shuttle Tracker — ESP32-C3 SuperMini Firmware (v1.4.2)
// Hardware: ESP32-C3 + NEO-6M GPS (UART1) + SIM800L GPRS (UART2) + CN3065 Solar
#include <HardwareSerial.h>

HardwareSerial gpsSerial(1); // UART1 for NEO-6M GPS (GPIO4 RX, GPIO5 TX)
HardwareSerial gsmSerial(2); // UART2 for SIM800L Modem (GPIO6 RX, GPIO7 TX)

const char* APN = "internet"; // MTN Ghana 2G APN
const char* INGEST_URL = "http://api.ooyalo.campus.edu/api/telemetry";
const char* DEVICE_ID = "ESP32C3-OOYALO-001";

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600, SERIAL_8N1, 4, 5);     // NEO-6M NMEA baud
  gsmSerial.begin(115200, SERIAL_8N1, 6, 7);   // SIM800L AT baud
  
  delay(3000);
  initGSM();
}

void loop() {
  String gpsSentence = readGPS();
  if (gpsSentence.length() > 0) {
    float lat, lng, speed, course;
    if (parseRMC(gpsSentence, lat, lng, speed, course)) {
      float batVolt = readBatteryVoltage();
      sendTelemetryPayload(lat, lng, speed, course, batVolt);
    }
  }
  delay(5000); // 5-second telemetry cadence
}

void initGSM() {
  sendAT("AT", 1000);
  sendAT("AT+CPIN?", 1000);
  sendAT("AT+CREG?", 2000);
  sendAT("AT+SAPBR=3,1,\\"Contype\\",\\"GPRS\\"", 1000);
  sendAT("AT+SAPBR=3,1,\\"APN\\",\\"internet\\"", 1000);
  sendAT("AT+SAPBR=1,1", 3000); // Open GPRS Bearer
  sendAT("AT+HTTPINIT", 1000);
}

void sendTelemetryPayload(float lat, float lng, float speed, float course, float bat) {
  String json = "{\\"device_id\\":\\"" + String(DEVICE_ID) + 
                "\\",\\"lat\\":" + String(lat, 6) + 
                ",\\"lng\\":" + String(lng, 6) + 
                ",\\"speed\\":" + String(speed, 1) + 
                ",\\"heading\\":" + String(course, 1) + 
                ",\\"battery_v\\":" + String(bat, 2) + "}";

  sendAT("AT+HTTPPARA=\\"CID\\",1", 500);
  sendAT("AT+HTTPPARA=\\"URL\\",\\"" + String(INGEST_URL) + "\\"", 500);
  sendAT("AT+HTTPPARA=\\"CONTENT\\",\\"application/json\\"", 500);
  sendAT("AT+HTTPDATA=" + String(json.length()) + ",5000", 1000);
  gsmSerial.println(json);
  delay(500);
  sendAT("AT+HTTPACTION=1", 3000); // POST action
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sampleFirmwareCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Blueprint Header */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white font-mono">Hardware Reference & MVP Build Architecture</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              SOLAR ROOF-MOUNT TRACKER
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Complete technical bill of materials, circuit topology, power management, and firmware for the custom IoT device.
          </p>
        </div>

        {/* Currency & Pilot Multiplier Controls */}
        <div className="flex items-center gap-2">
          <div className="bg-zinc-950 p-1 rounded-xl border border-zinc-800 flex items-center gap-1">
            {[1, 3, 10].map((qty) => (
              <button
                key={qty}
                onClick={() => setPilotMultiplier(qty)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  pilotMultiplier === qty ? 'bg-emerald-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {qty} {qty === 1 ? 'Unit' : 'Units'}
              </button>
            ))}
          </div>

          <div className="bg-zinc-950 p-1 rounded-xl border border-zinc-800 flex items-center gap-1">
            {(['USD', 'GHS'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  currency === c ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {c === 'USD' ? '$ USD' : '₵ GHS'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Circuit Wiring Diagram (ASCII / Vector Graphic) */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            System Circuit & Power Architecture Topology
          </h3>
          <span className="text-xs font-mono text-zinc-500">IP65 Weatherproof Sealed Enclosure</span>
        </div>

        {/* Interactive Schematic Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          {/* Node 1: Solar Panel */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Sun className="w-4 h-4" />
              <span>Solar Panel (5–6W)</span>
            </div>
            <p className="text-[11px] text-zinc-400">Exposed to Sky (Roof)</p>
            <div className="text-[10px] font-mono text-amber-300">Voc: 6.0V • ~450mA</div>
          </div>

          {/* Node 2: Solar Manager */}
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Layers className="w-4 h-4" />
              <span>Solar Power Mgr</span>
            </div>
            <p className="text-[11px] text-zinc-400">CN3065 + Regulated 5V</p>
            <div className="text-[10px] font-mono text-emerald-300">Charges 3.7V LiPo</div>
          </div>

          {/* Node 3: LiPo & Cap Buffer */}
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-sky-400">
              <BatteryMedium className="w-4 h-4" />
              <span>3.7V LiPo + 1000µF</span>
            </div>
            <p className="text-[11px] text-zinc-400">2000mAh Single-Cell</p>
            <div className="text-[10px] font-mono text-sky-300">Raw rail → SIM800L</div>
          </div>

          {/* Node 4: ESP32-C3 MCU */}
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-purple-400">
              <Cpu className="w-4 h-4" />
              <span>ESP32-C3 MCU</span>
            </div>
            <p className="text-[11px] text-zinc-400">Dual Hardware UARTs</p>
            <div className="text-[10px] font-mono text-purple-300">GPIO 4/5 (GPS), 6/7 (GSM)</div>
          </div>

          {/* Node 5: SIM800L & NEO-6M */}
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Radio className="w-4 h-4" />
              <span>SIM800L + NEO-6M</span>
            </div>
            <p className="text-[11px] text-zinc-400">GPRS 2G & GPS Fix</p>
            <div className="text-[10px] font-mono text-emerald-300">MTN Ghana Cellular</div>
          </div>
        </div>

        {/* Pinout & Interconnection Summary */}
        <div className="bg-zinc-900/70 rounded-xl p-4 border border-zinc-800 text-xs text-zinc-300">
          <div className="font-bold text-zinc-200 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400" />
            Critical Hardware Implementation Rules:
          </div>
          <ul className="space-y-1.5 text-[11px] text-zinc-400 list-disc list-inside">
            <li><strong>SIM800L Power Rail:</strong> Wire SIM800L directly to the raw 3.7V–4.2V LiPo battery rail with a <strong>1000µF capacitor</strong> across VCC/GND. Do NOT power via the 3.3V or 5V LDO.</li>
            <li><strong>Dual Hardware UARTs:</strong> ESP32-C3 handles GPS on UART1 and SIM800L AT commands on UART2 natively — zero SoftwareSerial jitter.</li>
            <li><strong>Enclosure Material:</strong> Polycarbonate / ABS plastic only (IP65). Never use metal housing as it shields GPS & GSM RF signals.</li>
          </ul>
        </div>
      </div>

      {/* Bill of Materials Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Bill of Materials (BOM) — For {pilotMultiplier} Tracker Unit{pilotMultiplier > 1 ? 's' : ''}
            </h3>
            <span className="text-xs text-zinc-400">Verified component pricing for pilot build</span>
          </div>

          <div className="text-right">
            <div className="text-lg font-mono font-extrabold text-emerald-400">
              {currency === 'USD' ? `$${totalHardwareCostUsd.toFixed(2)}` : `₵${totalHardwareCostGhs.toFixed(2)}`}
            </div>
            <div className="text-[11px] text-zinc-400">
              One-time hardware + {currency === 'USD' ? `$${recurringSimMonthlyUsd.toFixed(2)}` : `₵${recurringSimMonthlyGhs.toFixed(2)}`}/mo SIM
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-semibold">
                <th className="py-2.5 px-3">Component Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Line Total</th>
                <th className="py-2.5 px-3">Design Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
              {INITIAL_BOM_ITEMS.map((item) => {
                const unitCost = currency === 'USD' ? item.unitCostUsd : item.unitCostGhs;
                const lineTotal = unitCost * pilotMultiplier;
                return (
                  <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-sans font-semibold text-zinc-100">
                      {item.name}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-400 font-sans">
                      {item.category}
                    </td>
                    <td className="py-2.5 px-3 text-center text-zinc-300">
                      {item.qty * (pilotMultiplier / 3)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-zinc-300">
                      {currency === 'USD' ? `$${item.unitCostUsd.toFixed(2)}` : `₵${item.unitCostGhs.toFixed(2)}`}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                      {currency === 'USD' ? `$${lineTotal.toFixed(2)}` : `₵${lineTotal.toFixed(2)}`}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-zinc-400 max-w-xs truncate" title={item.notes}>
                      {item.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Firmware C++ Reference Code Block */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-mono">ESP32-C3 Firmware C++ Reference</h3>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied Firmware!' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto max-h-80 leading-relaxed">
          {sampleFirmwareCode}
        </pre>
      </div>
    </div>
  );
};
