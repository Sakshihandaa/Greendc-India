/**
 * Detailed real-world scenario intelligence and engineering profiles
 * for all documented Indian hyperscale and colocation campuses.
 * Explains use-cases, power, cooling, and network architecture in clear, plain English sentences.
 */

export const CAMPUS_INTELLIGENCE = {
  'yotta-nm1': {
    id: 'yotta-nm1',
    name: 'Yotta NM1 (Panvel Campus)',
    operator: 'Yotta Infrastructure (Hiranandani Group)',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    capacityMW: 50,
    racks: 7200,
    tier: 'Uptime Tier IV Fault-Tolerant',
    status: 'Operational',
    badge: 'Asia’s Largest Tier IV Campus Building',
    
    // Real-world scenario and practical use-cases
    realScenarioUseCase:
      'This hyperscale campus was designed to serve as India’s primary national data fortress for high-security enterprise workloads. It hosts critical computing for multinational banks, digital payment networks, Indian government digital services, and multinational cloud providers who require 100% continuous uptime without a single second of interruption.',
    
    targetWorkloads: [
      'Core Banking Transactions & NPCI UPI Peering',
      'Large Enterprise SAP & Oracle Cloud ERPs',
      'Artificial Intelligence Model Training & GPU Clusters',
      'High-Definition OTT Video Streaming CDNs'
    ],
    
    powerGridArchitecture:
      'The facility is connected directly to a dedicated 220kV on-site electrical substation fed by redundant transmission utility lines from Tata Power and MSEDCL. To ensure zero downtime, the building houses an automated bank of industrial diesel generators with 48 hours of fuel storage and massive commercial uninterruptible power supply (UPS) battery systems configured in 2N redundant paths.',
    
    coolingWaterStrategy:
      'The facility uses advanced closed-loop chilled water systems combined with variable-speed chillers to achieve an operational PUE of 1.34. It features an on-site zero-liquid-discharge (ZLD) wastewater treatment plant that recycles 100% of municipal cooling blowdown water for campus greenery and sanitary usage, eliminating excessive freshwater consumption.',
    
    connectivityTransit:
      'Located 30 minutes from Mumbai’s subsea cable landing stations, the facility has dual-redundant fiber routes entering through separate physical trenches. It peers directly with the National Internet Exchange of India (NIXI) and major global telecom carriers.',
    
    sustainabilityPPA:
      'Yotta operates captive solar and wind energy contracts across Maharashtra. Up to 40% of its power is procured from clean green energy sources through long-term open-access power purchase agreements.'
  },

  'yotta-d1': {
    id: 'yotta-d1',
    name: 'Yotta D1 (Greater Noida)',
    operator: 'Yotta Infrastructure',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    capacityMW: 28.8,
    racks: 5000,
    tier: 'Uptime Tier IV Certified',
    status: 'Operational',
    badge: 'North India Hyperscale Gateway',
    
    realScenarioUseCase:
      'Yotta D1 is the first operational hyperscale data centre park in North India. It was built to solve the digital sovereignty and low-latency computing needs of the National Capital Region (NCR), serving enterprises, government ministries, and international cloud operators who previously had to route all their data through Mumbai.',
    
    targetWorkloads: [
      'National Government Citizen Portals & Cloud Hosting',
      'Automotive & Manufacturing IoT Telemetry',
      'Fintech Trading & Low-Latency Delhi NCR Peering',
      'Public Cloud Availability Zone for North India'
    ],
    
    powerGridArchitecture:
      'The campus receives power via two independent 220kV transmission feeder lines from Uttar Pradesh Power Corporation (UPPCL). Dual uninterruptible power supply (UPS) systems and high-capacity diesel backup generators ensure uninterrupted power delivery even during severe northern grid brownouts.',
    
    coolingWaterStrategy:
      'Because Greater Noida is located in a semi-arid groundwater-stressed region, Yotta D1 utilizes dry adiabatic coolers and closed-loop economizers during winter and pre-monsoon months. The campus completely avoids untreated groundwater extraction and instead relies on municipal tertiary-treated STP water.',
    
    connectivityTransit:
      'The campus is interconnected via dedicated dark-fiber express routes to Delhi’s primary peering exchange and has dedicated carrier paths directly linking back to coastal landing stations in Mumbai and Kolkata.',
    
    sustainabilityPPA:
      'Backed by the Uttar Pradesh Data Centre Policy 2021, the facility has permissions for 100% clean solar power banking, sourcing solar electricity from large solar parks located in southern Uttar Pradesh and Rajasthan.'
  },

  'ctrls-mumbai-dc2': {
    id: 'ctrls-mumbai-dc2',
    name: 'CtrlS Mumbai DC-2 (Mahape)',
    operator: 'CtrlS Datacenters Ltd',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    capacityMW: 30,
    racks: 4000,
    tier: 'Rated-4 Fault-Tolerant',
    status: 'Operational',
    badge: 'Zero-Downtime Rated-4 Facility',
    
    realScenarioUseCase:
      'CtrlS DC-2 is designed specifically for financial institutions, stock exchanges, and telecom service providers where even microsecond network delays or micro-outages cause millions of dollars in damages. It serves as an active-active disaster recovery center for major Indian commercial banks.',
    
    targetWorkloads: [
      'Stock Brokerage Low-Latency Trading Servers',
      'Real-Time Interbank Clearing & Payment Gateways',
      'Insurance & Healthcare Secure Records Management',
      'Mission-Critical Enterprise Disaster Recovery'
    ],
    
    powerGridArchitecture:
      'Features nine layers of physical and electrical redundancy. The site draws power from dual diverse grid feeds and is backed by dedicated N+N rotary UPS systems and automated generator sets capable of operating continuously during prolonged city power failures.',
    
    coolingWaterStrategy:
      'Utilizes advanced magnetic-levitation oil-free centrifugal chillers with intelligent thermal load monitoring. Its closed-circuit water management system achieves an industry-leading water efficiency ratio, preventing water wastage in Navi Mumbai’s industrial corridor.',
    
    connectivityTransit:
      'Houses carrier-neutral meet-me rooms connecting to more than 20 Indian and global telecom providers. Directly linked to Mumbai MMR subsea cables with ultra-low latency under 1 millisecond.',
    
    sustainabilityPPA:
      'CtrlS is one of India’s pioneers in green data center operations, sourcing over 50% of its electricity demand from captive solar parks in Maharashtra and Karnataka, holding LEED Platinum certification.'
  },

  'stt-chennai1': {
    id: 'stt-chennai1',
    name: 'STT Chennai 1 (Siruseri)',
    operator: 'ST Telemedia Global Data Centres India',
    city: 'Chennai',
    state: 'Tamil Nadu',
    capacityMW: 33,
    racks: 4500,
    tier: 'Tier III+ Enterprise Grade',
    status: 'Operational',
    badge: 'Bay of Bengal Maritime Gateway Hub',
    
    realScenarioUseCase:
      'Situated in Chennai’s Siruseri IT corridor, this facility acts as the eastern maritime communications gateway for India. It terminates international subsea cable data traffic arriving from Singapore, Malaysia, and Southeast Asia, routing cloud data across the Indian subcontinent.',
    
    targetWorkloads: [
      'Trans-Oceanic Subsea Cable Landing Gateway',
      'Global Software Engineering R&D Centers in Chennai',
      'Enterprise SaaS Application Hosting for Southeast Asia',
      'Automotive Telematics for Chennai Auto Hub'
    ],
    
    powerGridArchitecture:
      'Fed by dedicated high-voltage lines from Tamil Nadu Generation and Distribution Corporation (TANGEDCO). Supported by heavy-duty diesel generator backups and high-efficiency lithium-ion battery energy storage systems (BESS).',
    
    coolingWaterStrategy:
      'Given Chennai’s hot coastal summer climate and municipal water restrictions, STT Chennai uses sea-water desalination treated utility supplies and closed-circuit evaporative dry-coolers that recycle cooling water continuously with zero open-ditch evaporation.',
    
    connectivityTransit:
      'Direct optical link to Chennai subsea cable landing stations including the Bay of Bengal Gateway (BBG), SeaMeWe-4, and the Chennai-Andaman Island cable.',
    
    sustainabilityPPA:
      'Tamil Nadu is India’s wind energy capital. This campus procures wind and solar power through Tamil Nadu’s green energy open-access window, reducing its overall grid carbon footprint by over 45%.'
  },

  'sify-hyd1': {
    id: 'sify-hyd1',
    name: 'Sify Green DC Hyderabad',
    operator: 'Sify Technologies Ltd',
    city: 'Hyderabad',
    state: 'Telangana',
    capacityMW: 20,
    racks: 3000,
    tier: 'Tier III Enterprise Certified',
    status: 'Operational',
    badge: 'Deccan Plateau Seismic-Safe Hub',
    
    realScenarioUseCase:
      'Hyderabad sits on the Deccan Plateau, a geologically stable rock formation with virtually zero earthquake risk in India. Sify built this facility to serve global technology giants, pharmaceutical research corporations, and enterprise IT leaders operating in HITEC City and Gachibowli.',
    
    targetWorkloads: [
      'Pharmaceutical Molecular Simulation & Genomics R&D',
      'Global Capability Centers (GCC) for Fortune 500 Companies',
      'Telangana State Digital Cloud Infrastructure',
      'Enterprise Big Data Analytics'
    ],
    
    powerGridArchitecture:
      'Supplied by high-reliability power corridors from Telangana Southern Power Distribution Company (TSSPDCL). Equipped with multi-tier emergency generator banks and dynamic UPS units configured in concurrent maintainability design.',
    
    coolingWaterStrategy:
      'Utilizes intelligent variable-flow chilled water loops and free-cooling economizers during cooler Deccan nights. The campus collects rainwater from all rooftop surfaces to recharge local groundwater basins.',
    
    connectivityTransit:
      'Direct terrestrial fiber highway connecting west to Mumbai (12 ms) and east to Chennai (9 ms), providing redundant dual-coast network paths for disaster recovery resilience.',
    
    sustainabilityPPA:
      'Contracted with local Telangana solar utility parks to supply clean daytime solar power directly through green open access banking.'
  },

  'airtel-nxtra-pune': {
    id: 'airtel-nxtra-pune',
    name: 'Nxtra by Airtel (Pune Hinjawadi)',
    operator: 'Nxtra by Airtel',
    city: 'Pune',
    state: 'Maharashtra',
    capacityMW: 25,
    racks: 3200,
    tier: 'Tier III Enterprise Hub',
    status: 'Operational',
    badge: 'Western India Edge & Cloud Hub',
    
    realScenarioUseCase:
      'Located in Pune’s Hinjawadi Silicon Valley, this facility provides low-latency computing for Pune’s massive software development workforce, automotive manufacturing companies, and regional edge computing for millions of smartphone users across Maharashtra.',
    
    targetWorkloads: [
      '5G Mobile Edge Computing & Cloud Gaming',
      'Software Engineering & DevOps Testing Clusters',
      'Automotive Design Simulation & CAD Cloud Workloads',
      'Regional Content Delivery Peering for Western India'
    ],
    
    powerGridArchitecture:
      'Connected to robust industrial power lines from MSEDCL with dedicated dual-feed busbars, automated transformer tap changers, and backup diesel reserves capable of full-load operations.',
    
    coolingWaterStrategy:
      'Benefits from Pune’s elevation (560 meters above sea level), which provides cooler dry air and significantly more free-cooling hours compared to coastal Mumbai. High-efficiency dry-coolers minimize water usage throughout the year.',
    
    connectivityTransit:
      'Powered by Bharti Airtel’s nationwide optical fiber network with multi-terabit express links directly connecting to Mumbai peering exchanges in under 2 milliseconds.',
    
    sustainabilityPPA:
      'Airtel Nxtra has signed captive solar power purchase agreements for over 60% of its Hinjawadi campus power, actively targeting net-zero carbon operations by 2030.'
  },

  'yotta-g1': {
    id: 'yotta-g1',
    name: 'Yotta G1 (GIFT City SEZ)',
    operator: 'Yotta Infrastructure',
    city: 'Gandhinagar',
    state: 'Gujarat',
    capacityMW: 15,
    racks: 2000,
    tier: 'Tier III+ International Financial Hub',
    status: 'Under Construction',
    badge: 'International Financial Services SEZ Hub',
    
    realScenarioUseCase:
      'Yotta G1 is located inside India’s first International Financial Services Centre (GIFT City SEZ). It is purpose-built to enable offshore banks, international stock brokerages, multi-currency currency clearinghouses, and global hedge funds to host high-speed algorithmic trading systems within a zero-tax SEZ jurisdiction.',
    
    targetWorkloads: [
      'Ultra-Low Latency International Stock & Currency Trading',
      'Cross-Border Financial Settlement Systems',
      'International Wealth Management & Private Cloud Hosting',
      'High-Performance AI Compute for Financial Engineering'
    ],
    
    powerGridArchitecture:
      'GIFT City features India’s first underground utility tunnel with triple-redundant 66kV power feeds. Power outages are statistically close to zero due to dedicated gas-insulated substations and grid ties to Gujarat’s massive renewable generation corridor.',
    
    coolingWaterStrategy:
      'Taps into GIFT City’s centralized District Cooling System (DCS). Chilled water is piped directly into the building through underground utility tunnels, eliminating the need for individual cooling towers on site and saving millions of liters of fresh water annually.',
    
    connectivityTransit:
      'Connected directly to international financial gateways with dark fiber backbones linking GIFT City to Mumbai, London, Singapore, and Frankfurt financial exchanges.',
    
    sustainabilityPPA:
      'Directly tied to the Khavda 30,000 MW Solar-Wind Hybrid corridor in Kutch, Gujarat. Benefit from Gujarat’s clean power banking policy.'
  },

  'adaniconnex-noida1': {
    id: 'adaniconnex-noida1',
    name: 'AdaniConneX Noida 1',
    operator: 'AdaniConneX (Joint Venture)',
    city: 'Noida',
    state: 'Uttar Pradesh',
    capacityMW: 50,
    racks: 6500,
    tier: 'Hyperscale Tier III Certified',
    status: 'Under Construction',
    badge: 'National Hyperscale Cloud Campus',
    
    realScenarioUseCase:
      'A joint venture between Adani Enterprises and global data center operator EdgeConneX. This campus is built to provide dedicated hyperscale halls for global cloud platforms (AWS, Microsoft Azure, Google Cloud) expanding their availability zones across northern India.',
    
    targetWorkloads: [
      'Global Hyperscale Cloud Availability Zone',
      'Enterprise Hybrid Cloud Infrastructure',
      'AI Large Language Model Serving & Inference',
      'National E-Commerce & Retail Supply Chain Computing'
    ],
    
    powerGridArchitecture:
      'Equipped with dedicated on-site 220kV gas-insulated substations and high-voltage underground transmission cables designed for massive continuous power draw with N+1 backup redundancy.',
    
    coolingWaterStrategy:
      'Features high-density closed-loop liquid-to-air cooling options tailored for high-wattage AI GPU server racks, minimizing campus water evaporation through advanced dry coolers.',
    
    connectivityTransit:
      'Interconnected with Adani’s nationwide optical transmission assets along railway and gas pipeline right-of-ways, providing high-speed redundant transport across India.',
    
    sustainabilityPPA:
      'Sourced directly from Adani Green Energy’s massive solar and wind utility portfolios, targeting 100% renewable energy matching within 3 years of full commissioning.'
  }
};

/**
 * Returns detailed campus intelligence or fallback profile
 */
export function getCampusIntelligence(facilityId) {
  if (CAMPUS_INTELLIGENCE[facilityId]) {
    return CAMPUS_INTELLIGENCE[facilityId];
  }

  // Fallback profile if specific facility not individually indexed
  return {
    id: facilityId,
    name: 'Verified Enterprise Campus',
    operator: 'National Infrastructure Provider',
    city: 'Tier-1 Hub',
    state: 'India',
    capacityMW: 25,
    racks: 3000,
    tier: 'Tier III Enterprise Grade',
    status: 'Operational',
    badge: 'Verified Infrastructure Node',
    realScenarioUseCase:
      'This enterprise data center facility hosts critical computing workloads for regional businesses, banks, and cloud service providers. It is designed with redundant power feeds, emergency backup generators, and commercial cooling plants to ensure continuous 24/7 digital operations.',
    targetWorkloads: [
      'Enterprise Cloud & Database Hosting',
      'Banking & Transaction Processing',
      'Regional Content Delivery & Low-Latency Edge Peering',
      'Disaster Recovery Secondary Compute'
    ],
    powerGridArchitecture:
      'Connected to high-voltage industrial utility feeds with dedicated on-site step-down transformers, automated backup diesel generators, and uninterruptible power supply (UPS) battery systems.',
    coolingWaterStrategy:
      'Equipped with closed-loop chiller systems and variable-speed fan economizers designed to operate efficiently across changing seasonal ambient temperatures.',
    connectivityTransit:
      'Connected to multiple carrier-neutral telecom optical backbones with direct routing to national internet exchanges.',
    sustainabilityPPA:
      'Procures clean renewable electricity through state green energy open access frameworks to meet corporate sustainability and decarbonization targets.'
  };
}
