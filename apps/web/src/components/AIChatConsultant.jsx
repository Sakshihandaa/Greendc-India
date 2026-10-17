import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  Compass,
  Zap,
  Droplets,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  MapPin,
  Cpu,
  Wind,
  Layers,
  Thermometer,
  BookOpen
} from 'lucide-react';
import { ALL_INDIA_STATES, getStateIntelligence } from '../data/allIndiaStateData';
import { ALL_INDIA_CITIES, getTopCoolingCities, getSubseaHubs, getLowWaterRiskCities } from '../data/allIndiaCitiesData';
import { FACILITIES } from '../data/facilitiesData';

// Initial welcoming message with rich options
const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    sender: 'bot',
    text: `### 🇮🇳 Namaste! Main hoon aapka GreenDC AI Siting & Clean Compute Advisor

Main India ke **120+ Cities & Industrial Corridors** ke real infrastructure telemetry (CEA 2024 Grid Baselines, CGWB 2023 Groundwater, IMD Climatology, aur State Data Centre Policies) se directly connected hoon.

Aap mujhse **Hindi, English, ya Hinglish** mein naturally pooch sakte hain:

• *"100 MW AI Cluster ke liye lowest carbon aur cheapest tariff kahan milega?"*
• *"Kaunsi cities mein 4,500+ hours ki free natural cooling milti hai?"*
• *"Navi Mumbai vs GIFT City compare karke batao"*
• *"Zero water risk aur cheap solar power wali top locations kaunsi hain?"*
• *"Pura 120+ cities catalog dikhao"*

Niche diye gaye quick chips par tap karein ya apna custom question type karein:`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actions: [
      { label: '📖 Pura 120+ Cities Catalog', query: 'Show me the complete 120+ cities catalog' },
      { label: '❄️ Top Free Cooling (>4,500 hrs)', query: 'Which cities have the highest free cooling hours?' },
      { label: '⚡ 100 MW Low Carbon AI Hub', query: 'Best location for 100 MW AI cluster with lowest carbon' },
      { label: '💰 Lowest Power Tariffs (Sasti Bijli)', query: 'Which states have the lowest electricity tariffs?' },
      { label: '🌊 Coastal Subsea Cable Hubs', query: 'Which cities have international subsea cable landings?' },
      { label: '💧 Lowest Water Risk Cities', query: 'Which locations have lowest water risk in India?' },
      { label: '🏛️ State DC Subsidies & Policies', query: 'Which states offer the best data center subsidies and tax incentives?' },
      { label: '⚖️ Compare Navi Mumbai vs GIFT City', query: 'Compare Navi Mumbai vs GIFT City' }
    ]
  }
];

/**
 * Custom Rich Markdown Text & Table Formatter
 */
function FormattedMessageText({ text }) {
  if (!text) return null;

  // Split into lines to detect tables, headers, and bullet points
  const lines = text.split('\n');
  const elements = [];
  let tableRows = [];
  let inTable = false;

  const flushTable = (key) => {
    if (tableRows.length === 0) return null;
    const headerRow = tableRows[0];
    const dataRows = tableRows.slice(2); // Skip separator row

    const parseRow = (r) =>
      r
        .split('|')
        .map((c) => c.trim())
        .filter((c, i, arr) => i > 0 && i < arr.length);

    const headers = parseRow(headerRow);

    const tableEl = (
      <div key={`table-${key}`} className="my-2.5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <table className="w-full text-left text-[11px] border-collapse bg-white dark:bg-slate-900">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">
              {headers.map((h, hIdx) => (
                <th key={hIdx} className="px-2.5 py-1.5 font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {dataRows.map((rowStr, rIdx) => {
              const cells = parseRow(rowStr);
              return (
                <tr
                  key={rIdx}
                  className={rIdx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/70 dark:bg-slate-850/50'}
                >
                  {cells.map((cell, cIdx) => (
                    <td key={cIdx} className="px-2.5 py-1.5 text-slate-700 dark:text-slate-300">
                      {formatInline(cell)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
    return tableEl;
  };

  const formatInline = (str) => {
    if (!str) return '';
    // Handle **bold**
    const parts = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((p, idx) => {
      if (p.startsWith('**') && p.endsWith('**')) {
        return <strong key={idx} className="font-extrabold text-slate-900 dark:text-white">{p.slice(2, -2)}</strong>;
      }
      if (p.startsWith('*') && p.endsWith('*')) {
        return <em key={idx} className="text-slate-600 dark:text-slate-400 italic">{p.slice(1, -1)}</em>;
      }
      return p;
    });
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    // Check if table line
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      tableRows.push(trimmed);
      return;
    }

    if (inTable && (!trimmed.startsWith('|') || trimmed === '')) {
      elements.push(flushTable(i));
    }

    // Header 3
    if (trimmed.startsWith('### ')) {
      elements.push(
        <div key={i} className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white pb-1 pt-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 font-heading">
          {formatInline(trimmed.replace('### ', ''))}
        </div>
      );
      return;
    }

    // Bullet points
    if (trimmed.startsWith('• ') || trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const content = trimmed.substring(2);
      elements.push(
        <div key={i} className="flex items-start gap-1.5 text-[11px] leading-relaxed pl-1 text-slate-700 dark:text-slate-300">
          <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
          <div>{formatInline(content)}</div>
        </div>
      );
      return;
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      elements.push(
        <div key={i} className="flex items-start gap-1.5 text-[11px] leading-relaxed pl-1 text-slate-700 dark:text-slate-300">
          <span className="text-emerald-600 font-extrabold shrink-0 mt-0.5">{trimmed.match(/^\d+\./)[0]}</span>
          <div>{formatInline(trimmed.replace(/^\d+\.\s*/, ''))}</div>
        </div>
      );
      return;
    }

    // Empty line
    if (trimmed === '') {
      elements.push(<div key={i} className="h-1.5" />);
      return;
    }

    // Normal paragraph
    elements.push(
      <p key={i} className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
        {formatInline(trimmed)}
      </p>
    );
  });

  if (inTable) {
    elements.push(flushTable('end'));
  }

  return <div className="space-y-1">{elements}</div>;
}

export default function AIChatConsultant({
  isOpen,
  onClose,
  onFocusLocation,
  onApplySimulationPreset,
  onOpenCityDirectory,
  onOpenSimulationStudio,
  currentSimState
}) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Escape key listener to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSend = (textToSend = null) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Generate intelligent physics-grounded response
    setTimeout(() => {
      const botResponse = generateAdvisorResponse(query);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 450);
  };

  /**
   * Comprehensive Natural Language Infrastructure Intelligence Engine
   */
  const generateAdvisorResponse = (query) => {
    const q = query.toLowerCase();

    // 1. MW Capacity matching
    const mwMatch = q.match(/(\d+)\s*(?:mw|megawatt)/i);
    const requestedMW = mwMatch ? parseInt(mwMatch[1], 10) : (currentSimState?.itLoadMW || 50);

    // ==========================================
    // 2. COMPREHENSIVE 120+ CITIES CATALOG QUERY
    // ==========================================
    if (
      q.includes('catalog') ||
      q.includes('all cities') ||
      q.includes('cities list') ||
      q.includes('bada catalog') ||
      q.includes('directory') ||
      q.includes('kitni cities') ||
      q.includes('show cities')
    ) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `### 📖 All-India 120+ Cities Siting Catalog Directory

Humne **122 authentic Indian Cities & Industrial Nodes** ka verified repository compile kiya hai across all 28 States and 8 Union Territories.

| Zone | Major Siting Clusters | Key Siting Advantage |
| :--- | :--- | :--- |
| **Western Hub** | Mumbai MMR, Navi Mumbai, Pune, GIFT City, Mundra, Dholera | 15+ Subsea Cables, 30 GW Solar corridor, IFSC Tax holidays |
| **Northern Corridor** | Noida, Greater Noida, Gurugram, Baddi, Dehradun, Jaipur | Largest enterprise consumer market, 5,100+ Free cooling hrs |
| **Southern Spine** | Bengaluru, Hyderabad, Chennai, Kochi, Coimbatore, Hosur | Silicon Valley R&D base, Subsea transit, State power subsidies |
| **Eastern & Central** | Kolkata, Bhubaneswar, Indore, Raipur, Ranchi, Siliguri | Power-surplus states, Narmada water security, Zero-catastrophe zone |
| **Himalayan Sanctuaries** | Srinagar, Shimla, Gangtok, Shillong, Kullu, Leh | 6,000–8,500 Free cooling hours, near-zero mechanical chiller PUE |

Aap niche diye gaye button par tap karke **interactive 120+ Cities Catalog** open kar sakte hain jismein real temperatures, CGWB water stress, aur electricity tariffs filterable hain!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            label: '📖 Open Full 120+ Cities Catalog Modal',
            type: 'catalog'
          },
          {
            label: '❄️ Highest Free Cooling Cities',
            query: 'Which cities have the highest free cooling hours?'
          },
          {
            label: '💰 Lowest Power Tariff Cities',
            query: 'Which states have the lowest electricity tariffs?'
          }
        ]
      };
    }

    // ==========================================
    // 3. HIGH FREE COOLING & PUE OPTIMIZATION
    // ==========================================
    if (
      q.includes('cooling') ||
      q.includes('thand') ||
      q.includes('cold') ||
      q.includes('weather') ||
      q.includes('climate') ||
      q.includes('pue') ||
      q.includes('economizer')
    ) {
      const topCooling = getTopCoolingCities(5);
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `### ❄️ Best Locations for Passive Free Cooling & Lowest PUE

High-altitude aur sub-Himalayan zones mein ambient temperature low hone ki wajah se mechanical compressors band rehte hain aur outside air direct servers ko chill karta hai:

| Rank & Location | State | Free Cooling Hrs/yr | Avg Temp | Grid Power Tariff |
| :--- | :--- | :--- | :--- | :--- |
| **1. Leh (Cold Desert)** | Ladakh | **8,500 hrs** | 5.4°C | ₹5.00 / kWh |
| **2. Srinagar (Rangreth)** | J&K | **7,800 hrs** | 13.5°C | ₹5.20 / kWh |
| **3. Kullu-Manali Valley** | Himachal Pradesh | **7,600 hrs** | 13.8°C | ₹5.65 / kWh |
| **4. Shimla (Shoghi IT Park)** | Himachal Pradesh | **7,200 hrs** | 14.8°C | ₹5.70 / kWh |
| **5. Gangtok (Tadong)** | Sikkim | **6,800 hrs** | 15.5°C | ₹5.40 / kWh |
| **6. Baddi / Nalagarh** | Himachal Pradesh | **5,100 hrs** | 20.2°C | **₹5.80 / kWh** |
| **7. Dehradun (IT Park)** | Uttarakhand | **4,650 hrs** | 21.5°C | ₹6.20 / kWh |
| **8. Bengaluru (Whitefield)** | Karnataka (920m) | **4,150 hrs** | 23.8°C | ₹7.75 / kWh |

• **Engineering Rationale**: Baddi (HP) aur Dehradun (UK) mein siting karne par facility PUE **1.15 tak drop** ho jata hai, jisse saalana ₹12–15 Crore ki chiller power bachti hai!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            label: '📍 Focus Baddi, HP on Map',
            type: 'map',
            coords: [30.9578, 76.7914],
            state: 'Himachal Pradesh'
          },
          {
            label: `⚡ Simulate ${requestedMW} MW in Baddi (PUE 1.15)`,
            type: 'sim',
            state: 'Himachal Pradesh',
            mw: requestedMW,
            pue: 1.15,
            coolingTech: 'free_air',
            renewableShare: 0.90,
            openStudio: true
          },
          {
            label: '📍 Focus Bengaluru on Map',
            type: 'map',
            coords: [12.9716, 77.5946],
            state: 'Karnataka'
          }
        ]
      };
    }

    // ==========================================
    // 4. LOWEST POWER TARIFFS / CHEAPEST ELECTRICITY
    // ==========================================
    if (
      q.includes('tariff') ||
      q.includes('bijli') ||
      q.includes('power cost') ||
      q.includes('sasti') ||
      q.includes('cheap power') ||
      q.includes('electricity') ||
      q.includes('cost') ||
      q.includes('rate')
    ) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `### ⚡ Industrial Electricity Tariff Ranking (CEA & Discom Schedules 2024–25)

Data centre operating expense ka **60–70% hissa power bill** hota hai. India mein HT commercial power tariffs mein state-by-state 40% tak difference hai:

| State / UT | Commercial HT Tariff | Grid Carbon (CEA) | Renewable Availability |
| :--- | :--- | :--- | :--- |
| **Jammu & Kashmir** | **₹5.20 / kWh** *(Cheapest)* | 0.110 kg/kWh | 90% Hydro |
| **Himachal Pradesh** | **₹5.80 / kWh** | 0.120 kg/kWh | 95% Hydro |
| **Uttarakhand** | **₹6.20 / kWh** | 0.180 kg/kWh | 85% Hydro |
| **Gujarat (Dholera/GIFT)** | **₹6.80 / kWh** | 0.580 kg/kWh | 45% Solar & Wind |
| **Chhattisgarh (Raipur)** | **₹6.70 / kWh** | 0.790 kg/kWh | Power-Surplus Base |
| **Odisha (Bhubaneswar)** | **₹6.80 / kWh** | 0.750 kg/kWh | Hydro-Thermal Blend |
| **Telangana (Hyderabad)** | **₹7.40 / kWh** *(₹1 subsidy)* | 0.730 kg/kWh | Open-Access Solar |
| **Uttar Pradesh (Noida)** | ₹7.60 / kWh | 0.780 kg/kWh | Coal Dominant |
| **Maharashtra (Mumbai)** | ₹8.20 / kWh | 0.716 kg/kWh | Mixed Thermal |
| **Delhi NCR** | **₹8.50 / kWh** *(Highest)* | 0.750 kg/kWh | Peak Tariff State |

• **Financial Impact**: Agar aap **100 MW** cluster Maharashtra ke bajaye Gujarat ya Himachal mein lagate hain, toh annual electricity saving **₹25 se ₹35 Crore** tak hoti hai!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            label: `⚡ Simulate ${requestedMW} MW in Himachal (₹5.80/u)`,
            type: 'sim',
            state: 'Himachal Pradesh',
            mw: requestedMW,
            pue: 1.15,
            coolingTech: 'free_air',
            renewableShare: 0.90,
            openStudio: true
          },
          {
            label: `⚡ Simulate ${requestedMW} MW in Gujarat (₹6.80/u)`,
            type: 'sim',
            state: 'Gujarat',
            mw: requestedMW,
            pue: 1.25,
            coolingTech: 'adiabatic',
            renewableShare: 0.65,
            openStudio: true
          },
          {
            label: '📖 View Tariffs in 120+ Catalog',
            type: 'catalog'
          }
        ]
      };
    }

    // ==========================================
    // 5. 100 MW / 50 MW LOW CARBON AI HUB
    // ==========================================
    if (
      q.includes('100 mw') ||
      q.includes('ai cluster') ||
      q.includes('low carbon') ||
      q.includes('zero carbon') ||
      q.includes('ai hub') ||
      q.includes('giga') ||
      q.includes('greenfield')
    ) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `### 🎯 Optimal Siting Blueprint for ${requestedMW} MW Low-Carbon AI Cluster

High-density AI training workloads require **massive contiguous power (100–250 MW)**, low PUE, aur round-the-clock green energy matching:

1. **Top Recommendation 1: Gujarat (Dholera SIR / Kutch-Mundra)**
   • *Why*: 30,000 MW Solar-Wind Hybrid corridor, captive 400kV PowerGrid lines, direct seawater desalination.
   • *Carbon Score*: Can achieve **>85% Green Power PPA** matching.
   • *Power Tariff*: ₹6.40 – ₹6.80 / kWh.

2. **Top Recommendation 2: Himachal Pradesh (Baddi / Nalagarh)**
   • *Why*: Clean mountain hydro grid (0.12 kg CO2/kWh vs national 0.72 kg/kWh). 5,100+ Free cooling hours.
   • *Carbon Score*: **Lowest operational Scope 2 carbon in India**.
   • *Power Tariff*: ₹5.80 / kWh.

3. **Top Recommendation 3: Telangana (Chandanvelly / Shamshabad)**
   • *Why*: Dedicated 400kV GIS substation, ₹1/unit power subsidy, 100% stamp duty exemption, tertiary recycled water.
   • *Ecosystem*: AWS, Microsoft, aur Google ke hyperscale AI campuses yahi sited hain.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            label: `⚡ Load ${requestedMW} MW in Gujarat Dholera`,
            type: 'sim',
            state: 'Gujarat',
            mw: requestedMW,
            pue: 1.20,
            coolingTech: 'adiabatic',
            renewableShare: 0.85,
            openStudio: true
          },
          {
            label: `⚡ Load ${requestedMW} MW in Himachal Hydro`,
            type: 'sim',
            state: 'Himachal Pradesh',
            mw: requestedMW,
            pue: 1.15,
            coolingTech: 'free_air',
            renewableShare: 0.95,
            openStudio: true
          },
          {
            label: '📍 Focus Chandanvelly on Map',
            type: 'map',
            coords: [17.1895, 78.2250],
            state: 'Telangana'
          }
        ]
      };
    }

    // ==========================================
    // 6. WATER RISK & HYDROLOGICAL STRATEGY
    // ==========================================
    if (
      q.includes('water') ||
      q.includes('pani') ||
      q.includes('wue') ||
      q.includes('groundwater') ||
      q.includes('stp') ||
      q.includes('desal') ||
      q.includes('aquifer')
    ) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `### 💧 Hydrological Water Risk & Cooling Strategy (CGWB 2023)

Central Ground Water Board (CGWB) aur NITI Aayog CWMI assessment ke mutabik:

| Hydrological Zone | Locations | Assessment & Regulatory Stance |
| :--- | :--- | :--- |
| **Critical Water Stress** | Gurugram, Jaipur, Jodhpur, Western NCR, Chennai inland | **Strict groundwater extraction ban**. Evaporative cooling towers face high scrutiny. |
| **Tertiary STP Sourcing** | Navi Mumbai (TTC), GIFT City, Hyderabad (Chandanvelly) | **100% Recycled Municipal Treated Water** loops available at discounted industrial rates. |
| **Coastal Desalination** | Mundra, Kochi, Chennai coastal, Visakhapatnam | **Direct Seawater / RO Desalination** bypasses inland groundwater exhaustion completely. |
| **Water-Secure Basins** | Pune, Indore (Narmada), Bhubaneswar, Baddi (HP) | Abundant perennial river recharge. Low depletion risk. |

• **Zero-Water Technology Recommendation**: High-stress zones mein **Direct Liquid Immersion (Single-Phase)** deploy karne par facility WUE **0.02 L/kWh** ho jata hai (98% water reduction)!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            label: `⚡ Simulate ${requestedMW} MW Zero-Water Immersion`,
            type: 'sim',
            state: 'Maharashtra',
            mw: requestedMW,
            pue: 1.12,
            coolingTech: 'immersion_1p',
            renewableShare: 0.60,
            openStudio: true
          },
          {
            label: '📍 View Kochi Desalination Hub',
            type: 'map',
            coords: [9.9312, 76.2673],
            state: 'Kerala'
          },
          {
            label: '📖 View Water Risk in 120+ Catalog',
            type: 'catalog'
          }
        ]
      };
    }

    // ==========================================
    // 7. SUBSEA CABLE LANDINGS & OPTICAL BACKHAUL
    // ==========================================
    if (
      q.includes('subsea') ||
      q.includes('cable') ||
      q.includes('landing') ||
      q.includes('transit') ||
      q.includes('fiber') ||
      q.includes('sea') ||
      q.includes('coast')
    ) {
      const subseaHubs = getSubseaHubs();
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `### 🌊 India's International Subsea Optical Gateways

International cloud traffic, low-latency cross-border transit, aur financial trading ke liye India ke top landing hubs:

1. **Mumbai MMR (#1 National Subsea Gateway)**
   • 15+ subsea cable landings (SMC, AAE-1, SeaMeWe-4/5, BBG, 2Africa).
   • Handles >70% of Indian internet international egress. Sub-30ms to Middle East.

2. **Chennai (Coromandel Gateway)**
   • 6+ subsea cable landings (i2i, BBG, SeaMeWe-4, MIST).
   • Direct express optical hop to Singapore, Malaysia, and Southeast Asia.

3. **Kochi (Kerala South Gateway)**
   • SEA-ME-WE 3/4 and SAFE cables.
   • Direct undersea hop across Indian Ocean to Africa and Europe.

4. **Visakhapatnam (Andhra Bay of Bengal)**
   • Emerging subsea landing gateway connecting to East Asia and Australia.

5. **Agartala (Tripura International Gateway via Bangladesh)**
   • India's 3rd International Internet Gateway connected via Cox's Bazar submarine cable.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            label: '📍 Focus Mumbai Subsea Hub',
            type: 'map',
            coords: [19.0760, 72.8777],
            state: 'Maharashtra'
          },
          {
            label: '📍 Focus Chennai Landing Station',
            type: 'map',
            coords: [13.0827, 80.2707],
            state: 'Tamil Nadu'
          },
          {
            label: '📍 Focus Kochi Gateway',
            type: 'map',
            coords: [9.9312, 76.2673],
            state: 'Kerala'
          }
        ]
      };
    }

    // ==========================================
    // 8. STATE POLICIES & CAPITAL SUBSIDIES
    // ==========================================
    if (
      q.includes('policy') ||
      q.includes('subsidy') ||
      q.includes('incentive') ||
      q.includes('tax') ||
      q.includes('stamp duty') ||
      q.includes('subsidies') ||
      q.includes('rebate')
    ) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `### 🏛️ Top State Data Centre Policy Incentives (2024–25)

States across India are competing aggressively with fiscal subsidies for high-density compute infrastructure:

| State | Stamp Duty Waiver | Power Subsidies | Capital / Capex Subsidy |
| :--- | :--- | :--- | :--- |
| **Telangana** | **100% Exemption** on land purchase | **₹1.00 / kWh subsidy** for 5 years | Dedicated infrastructure reimbursement |
| **Uttar Pradesh** | **100% Exemption** (Noida/Gr. Noida) | Electricity duty waiver for 10 yrs | **Up to ₹20 Crore** capital subsidy |
| **Odisha** | **100% Exemption** | Complete duty waiver | **25% Capex Subsidy** up to ₹25 Crore |
| **Maharashtra** | Complete stamp duty rebate | Green energy open access waiver | FSI concessions up to 3.0 |
| **Gujarat** | IFSC GIFT City zero-tax status | 100% Net Metering banking | Cross-subsidy surcharge waiver |

• **Pro Tip**: Telangana aur Uttar Pradesh tier-1 enterprise compute ke liye sabse fast single-window clearance offer karte hain!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            label: '📍 Focus Noida UP Hub',
            type: 'map',
            coords: [28.5355, 77.3910],
            state: 'Uttar Pradesh'
          },
          {
            label: '📍 Focus Hyderabad Hub',
            type: 'map',
            coords: [17.3850, 78.4867],
            state: 'Telangana'
          },
          {
            label: '📖 View All Policies in Catalog',
            type: 'catalog'
          }
        ]
      };
    }

    // ==========================================
    // 9. HEAD-TO-HEAD CITY COMPARISON
    // ==========================================
    if (q.includes('compare') || q.includes('vs') || (q.includes('mumbai') && q.includes('gift'))) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `### ⚖️ Executive Head-to-Head: Navi Mumbai vs GIFT City (Gujarat)

| Metric | Navi Mumbai (Mahape / TTC) | GIFT City (Gandhinagar) |
| :--- | :--- | :--- |
| **Subsea Optical Gateways** | **15+ Direct Cables** *(#1 National Hub)* | Domestic Optical Backhaul to Mumbai |
| **HT Power Tariff** | ₹8.20 / kWh | **₹6.80 / kWh** *(~17% cheaper)* |
| **CEA Grid Carbon Factor** | 0.716 kg CO2/kWh | **0.580 kg CO2/kWh** *(lower carbon)* |
| **Cooling Architecture** | Individual cooling loops (MIDC STP) | **Central District Cooling System (DCS)** |
| **Free Cooling Hours** | ~2,500 hrs/year | ~3,100 hrs/year |
| **State Fiscal Incentives** | Standard industrial rebates | **IFSC SEZ 10-year Tax Holiday** |
| **Best Suited Workload** | Ultra-low latency BFSI, Exchange Trading | **Large-Scale AI Training, Global Enterprise Cloud** |

• **Decision Verdict**: Agar aapka workload international subsea transit aur Bombay Stock Exchange / NSE se <2ms latency mangta hai, choose **Navi Mumbai**. Agar workload massive AI cluster training ya global cloud hosting hai jahan OpEx aur tax optimization primary hai, choose **GIFT City**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            label: '📍 Show Navi Mumbai on Map',
            type: 'map',
            coords: [19.0330, 73.0297],
            state: 'Maharashtra'
          },
          {
            label: '📍 Show GIFT City on Map',
            type: 'map',
            coords: [23.1600, 72.6840],
            state: 'Gujarat'
          },
          {
            label: `⚡ Simulate ${requestedMW} MW in GIFT City`,
            type: 'sim',
            state: 'Gujarat',
            mw: requestedMW,
            pue: 1.20,
            coolingTech: 'adiabatic',
            renewableShare: 0.70,
            openStudio: true
          }
        ]
      };
    }

    // ==========================================
    // 10. SPECIFIC CITY OR STATE SEARCH IN 120+ CATALOG
    // ==========================================
    const foundCity = ALL_INDIA_CITIES.find(
      (c) => q.includes(c.name.toLowerCase()) || q.includes(c.id) || q.includes(c.name.split(' ')[0].toLowerCase())
    );

    if (foundCity) {
      const stateIntel = getStateIntelligence(foundCity.state);
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `### 📍 Infrastructure Dossier: ${foundCity.name} (${foundCity.state})

| Telemetry Parameter | Value | Reference Baseline |
| :--- | :--- | :--- |
| **Ecosystem Tier** | **${foundCity.dcEcosystem}** (${foundCity.tier}) | Ministry of Electronics & IT |
| **Free Cooling Hours** | **${foundCity.freeCoolingHours.toLocaleString()} hrs/year** | IMD Climatological Normals |
| **Annual Avg Temp** | **${foundCity.ambientAvgTemp}°C** | IMD Climatological Normals |
| **Hydrological Water Risk** | **${foundCity.waterRisk}** | Central Ground Water Board (CGWB) |
| **CEA Grid Carbon Factor** | **${foundCity.gridCarbon} kg CO2/kWh** | Central Electricity Authority 2024 |
| **Commercial Power Tariff** | **₹${foundCity.tariff} / kWh** | State Discom Tariff Schedule |
| **Subsea Cable Gateway** | **${foundCity.subseaLanding ? 'Direct Coastal Landing' : 'Terrestrial Optical Backhaul'}** | TRAI Telecom Registry |

• **Infrastructure Notes**: ${foundCity.highlight}
• **State Policy Context**: ${stateIntel?.policyNotes || stateIntel?.policyIncentives || 'Standard state industrial data centre concessions apply.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            label: `📍 Focus ${foundCity.name} on Map`,
            type: 'map',
            coords: [foundCity.lat, foundCity.lng],
            state: foundCity.state
          },
          {
            label: `⚡ Simulate ${requestedMW} MW at ${foundCity.name}`,
            type: 'sim',
            state: foundCity.state,
            mw: requestedMW,
            pue: foundCity.freeCoolingHours > 4000 ? 1.18 : 1.28,
            coolingTech: foundCity.freeCoolingHours > 4000 ? 'free_air' : 'immersion_1p',
            renewableShare: 0.60,
            openStudio: true
          },
          {
            label: '📖 View in 120+ Cities Catalog',
            type: 'catalog'
          }
        ]
      };
    }

    const foundState = Object.keys(ALL_INDIA_STATES).find((st) => q.includes(st.toLowerCase()));
    if (foundState) {
      const intel = getStateIntelligence(foundState);
      const stateCities = ALL_INDIA_CITIES.filter((c) => c.state.toLowerCase() === foundState.toLowerCase());

      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `### 🏛️ State Infrastructure Siting Profile: ${foundState}

| Parameter | State Metric | Baseline Source |
| :--- | :--- | :--- |
| **Green Suitability Score** | **${intel?.greenSuitabilityScore || 85}/100** (${intel?.tier || 'Tier 1'}) | GreenDC Siting Model |
| **CEA Grid Carbon Factor** | **${intel?.gridEmissionsKgCO2PerKWh || 0.72} kg CO2/kWh** | Central Electricity Authority 2024 |
| **Clean Renewable Target** | **${intel?.rePolicyScore || 80}% by 2030** | State Renewable Energy Dept |
| **CGWB Water Stress** | **${intel?.waterStressRisk || 'Moderate'}** | Central Ground Water Board |
| **Average Commercial Tariff** | **₹${intel?.tariffCommercial || 7.50} / kWh** | State ERC Tariff Order |
| **Free Cooling Potential** | **${intel?.freeCoolingHoursYear || 2800} hrs/year** | IMD Wet-Bulb Analysis |

• **Cataloged Cities in ${foundState}**: ${stateCities.map((c) => c.name).join(', ') || 'Registered under state industrial parks.'}
• **State Incentives**: ${intel?.policyNotes || intel?.policyIncentives || '100% stamp duty exemption on land purchase and green power open access wheeling waiver.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          {
            label: `📍 Focus ${foundState} on Map`,
            type: 'map',
            state: foundState
          },
          {
            label: `⚡ Simulate ${requestedMW} MW in ${foundState}`,
            type: 'sim',
            state: foundState,
            mw: requestedMW,
            pue: 1.25,
            coolingTech: 'immersion_1p',
            renewableShare: 0.60,
            openStudio: true
          },
          {
            label: '📖 Open 120+ Cities Catalog',
            type: 'catalog'
          }
        ]
      };
    }

    // ==========================================
    // 11. GENERAL / FALLBACK SITING INTELLIGENCE
    // ==========================================
    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: `### 🎯 Siting Intelligence Recommendation for "${query}"

For a **${requestedMW} MW** high-density compute / AI deployment in India:

1. **Option 1: Maharashtra (Navi Mumbai / Panvel)**
   • *Best for*: Subsea connectivity, financial enterprise clients, multi-tenant colocation.
   • *Key Advantage*: 155+ MW operational base, PUE ~1.28 with liquid loops.

2. **Option 2: Gujarat (GIFT City / Mundra / Dholera)**
   • *Best for*: Gigawatt AI model training clusters with lowest power cost (₹6.80/u) and 30 GW clean solar-wind corridor.

3. **Option 3: Himachal Pradesh (Baddi / Nalagarh)**
   • *Best for*: High-altitude passive free cooling (5,100+ hrs/yr) and lowest grid carbon (0.120 kg CO2/kWh).

Aap kisi bhi specific city, state, cooling method, ya tariff ke baare mein pooch sakte hain, ya niche **120+ Cities Catalog** open kar sakte hain!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        {
          label: '📖 Open Full 120+ Cities Catalog',
          type: 'catalog'
        },
        {
          label: `⚡ Simulate ${requestedMW} MW in Studio`,
          type: 'sim',
          state: 'Maharashtra',
          mw: requestedMW,
          pue: 1.25,
          coolingTech: 'immersion_1p',
          renewableShare: 0.60,
          openStudio: true
        },
        {
          label: '❄️ Highest Free Cooling Cities',
          query: 'Which cities have the highest free cooling hours?'
        }
      ]
    };
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 sm:right-6 z-50 flex flex-col transition-all duration-300 shadow-2xl rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${
        isMinimized
          ? 'w-80 h-14'
          : 'w-[92vw] sm:w-[500px] md:w-[540px] h-[620px] max-h-[88vh]'
      }`}
    >
      {/* Header Bar */}
      <div className="p-3.5 sm:px-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shadow-md shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight font-heading">
                GreenDC AI Advisor
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            </div>
            <p className="text-[10px] text-emerald-100 font-medium">
              120+ Cities Directory & Physics Simulation Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMessages(INITIAL_MESSAGES)}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
            title="Reset Chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
            title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
            title="Close Chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 text-xs text-slate-800 dark:text-slate-200">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white text-xs ${
                      isBot
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-700 shadow-sm'
                        : 'bg-slate-700'
                    }`}
                  >
                    {isBot ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-2 max-w-[88%]">
                    <div
                      className={`p-3.5 rounded-2xl text-xs shadow-sm ${
                        isBot
                          ? 'bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200'
                          : 'bg-emerald-600 text-white font-medium ml-auto whitespace-pre-wrap'
                      }`}
                    >
                      {isBot ? (
                        <FormattedMessageText text={msg.text} />
                      ) : (
                        msg.text
                      )}
                    </div>

                    {/* Interactive Action Chips inside message */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.actions.map((act, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              if (act.query) {
                                handleSend(act.query);
                              } else if (act.type === 'catalog') {
                                if (onOpenCityDirectory) onOpenCityDirectory();
                              } else if (act.type === 'studio') {
                                if (onOpenSimulationStudio) onOpenSimulationStudio();
                              } else if (act.type === 'map') {
                                if (onFocusLocation) {
                                  onFocusLocation({
                                    state: act.state,
                                    coords: act.coords
                                  });
                                }
                              } else if (act.type === 'sim') {
                                if (onApplySimulationPreset) {
                                  onApplySimulationPreset({
                                    state: act.state,
                                    mw: act.mw,
                                    pue: act.pue,
                                    coolingTech: act.coolingTech,
                                    renewableShare: act.renewableShare,
                                    openStudio: act.openStudio || false
                                  });
                                }
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-[11px] flex items-center gap-1 transition shadow-xs cursor-pointer active:scale-95"
                          >
                            <span>{act.label}</span>
                            <ChevronRight className="w-3 h-3 text-emerald-600 shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic pl-9">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-200" />
                <span>GreenDC AI calculating physics & consulting 120+ catalog...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask in Hindi or English (e.g. 100 MW in Gujarat, cold cooling cities, catalog)..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition shadow-sm cursor-pointer"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 px-1 font-mono">
              <span>Supports 120+ All-India Cities • English & Hinglish</span>
              <span>CEA 2024 / CGWB</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
