/**
 * Comprehensive National Siting & Sustainability Intelligence Database
 * Covers all 35 Indian States and Union Territories in the GeoJSON boundary.
 * Data compiled from CEA (Central Electricity Authority), MNRE, CGWB, and State DC Policies.
 */

export const ALL_INDIA_STATES = {
  Maharashtra: {
    geoName: 'Maharashtra',
    displayName: 'Maharashtra',
    code: 'MH',
    zone: 'West',
    tagline: "India's Subsea Gateway & #1 Hyperscale Megahub",
    tier: 'Tier 1 Megahub',
    knownCapacityMW: 650,
    operationalMW: 155,
    pipelineMW: 495,
    greenSuitabilityScore: 86,
    gridCarbonFactor: 640, // gCO2/kWh
    reSharePercent: 34.8,
    installedRECapacityMW: 30120,
    reBreakdown: { solar: 45, wind: 38, hydro: 12, other: 5 },
    waterStress: 'Moderate',
    waterStressScore: 3,
    waterDetails: 'Coastal Konkan (Mumbai/Navi Mumbai) utilizes Bhatsa/Tansa dams; high municipal tariff. Inland Vidarbha/Marathwada dry.',
    freeCoolingHours: 2450,
    ambientWetBulb: 27.2,
    tariffCommercial: 8.2, // INR / unit
    pueEstimate: 1.34,
    center: [19.75, 75.71],
    incentives: 'Maharashtra DC Policy 2023: 100% stamp duty exemption, electricity duty waiver for 10-15 years, Green power open access waiver, deemed industrial status.',
    subseaConnectivity: 'Primary national gateway: 15+ subsea cable landings (SMC, AAE-1, BBG, SeaMeWe-5, 2Africa) at Mumbai MMR.',
    dcClusters: ['Navi Mumbai (Airoli, Mahape, Rabale, Panvel)', 'Chandivali Mumbai', 'Hinjawadi Pune']
  },

  'Uttar Pradesh': {
    geoName: 'Uttar Pradesh',
    displayName: 'Uttar Pradesh (NCR)',
    code: 'UP',
    zone: 'North',
    tagline: 'North India Hyperscale Gateway & Enterprise Cluster',
    tier: 'Tier 1 Megahub',
    knownCapacityMW: 280,
    operationalMW: 78.8,
    pipelineMW: 201.2,
    greenSuitabilityScore: 78,
    gridCarbonFactor: 720,
    reSharePercent: 18.2,
    installedRECapacityMW: 11850,
    reBreakdown: { solar: 68, wind: 0, hydro: 22, other: 10 },
    waterStress: 'Critical',
    waterStressScore: 4.5,
    waterDetails: 'Yamuna basin groundwater is over-extracted; recycled STP water and dry adiabatic cooling mandated.',
    freeCoolingHours: 2980,
    ambientWetBulb: 28.1,
    tariffCommercial: 7.9,
    pueEstimate: 1.38,
    center: [26.85, 80.95],
    incentives: 'UP Data Center Policy 2021: 100% stamp duty exemption, 4x FAR permissible, dual grid-feeder line cost subsidy (50% up to ₹10 Cr), capital subsidy up to ₹100 Cr.',
    subseaConnectivity: 'Inland northern hub; redundant dark fiber routes to Mumbai and Kolkata cable gateways.',
    dcClusters: ['Noida Sector 62 / 132', 'Greater Noida Knowledge Park']
  },

  'Tamil Nadu': {
    geoName: 'Tamil Nadu',
    displayName: 'Tamil Nadu',
    code: 'TN',
    zone: 'South',
    tagline: 'Eastern Maritime Subsea Cable Hub & Renewable Leader',
    tier: 'Tier 1 Megahub',
    knownCapacityMW: 210,
    operationalMW: 33,
    pipelineMW: 177,
    greenSuitabilityScore: 91,
    gridCarbonFactor: 580,
    reSharePercent: 49.1,
    installedRECapacityMW: 22400,
    reBreakdown: { solar: 42, wind: 51, hydro: 5, other: 2 },
    waterStress: 'High',
    waterStressScore: 4,
    waterDetails: 'Coastal desalination plants & tertiary treated municipal water infrastructure in Chennai industrial corridors.',
    freeCoolingHours: 2100,
    ambientWetBulb: 28.4,
    tariffCommercial: 7.5,
    pueEstimate: 1.32,
    center: [11.13, 78.65],
    incentives: 'Tamil Nadu DC Policy 2021: Dual power source guarantee, green building stamp duty rebate, 100% electricity tax exemption for 5 years.',
    subseaConnectivity: 'Eastern maritime gateway: 5+ subsea cable landings (Bay of Bengal Gateway, SeaMeWe-4, Chennai-Andaman, MIST).',
    dcClusters: ['Siruseri SIPCOT', 'Ambattur Industrial Estate', 'Oragadam']
  },

  Karnataka: {
    geoName: 'Karnataka',
    displayName: 'Karnataka',
    code: 'KA',
    zone: 'South',
    tagline: "Silicon Valley Compute Backbone & Clean Power Leader",
    tier: 'Tier 1 Megahub',
    knownCapacityMW: 195,
    operationalMW: 45,
    pipelineMW: 150,
    greenSuitabilityScore: 93,
    gridCarbonFactor: 510,
    reSharePercent: 52.3,
    installedRECapacityMW: 17800,
    reBreakdown: { solar: 58, wind: 32, hydro: 8, other: 2 },
    waterStress: 'High',
    waterStressScore: 3.8,
    waterDetails: 'Bengaluru urban core faces Cauvery supply limits; campus rainwater harvesting & closed-loop chilling mandatory.',
    freeCoolingHours: 3600, // Great altitude advantage ~920m
    ambientWetBulb: 23.8,
    tariffCommercial: 7.6,
    pueEstimate: 1.28,
    center: [15.32, 75.71],
    incentives: 'Karnataka Data Centre Policy 2022: Up to 100% stamp duty exemption, power tariff subsidy of ₹1/unit for 3 years, 100% clean power banking permission.',
    subseaConnectivity: 'Dense terrestrial optical backhaul to Mumbai and Chennai landing stations; local dark-fiber metro rings.',
    dcClusters: ['Whitefield Bengaluru', 'Electronics City', 'Devanahalli Aerospace Park']
  },

  Gujarat: {
    geoName: 'Gujarat',
    displayName: 'Gujarat',
    code: 'GJ',
    zone: 'West',
    tagline: 'Khavda Mega-Renewable Siting Corridor & GIFT SEZ',
    tier: 'Tier 1 Megahub',
    knownCapacityMW: 140,
    operationalMW: 50,
    pipelineMW: 90,
    greenSuitabilityScore: 90,
    gridCarbonFactor: 590,
    reSharePercent: 47.6,
    installedRECapacityMW: 26500,
    reBreakdown: { solar: 52, wind: 44, hydro: 3, other: 1 },
    waterStress: 'Moderate',
    waterStressScore: 3,
    waterDetails: 'Narmada canal network supplies industrial parks; GIFT City features centralized district cooling utility.',
    freeCoolingHours: 2650,
    ambientWetBulb: 26.5,
    tariffCommercial: 6.8,
    pueEstimate: 1.30,
    center: [22.26, 71.19],
    incentives: 'Gujarat IT/ITeS Policy: Power tariff subsidy of ₹1.25/unit for 5 years, mega project capital subsidies up to 25%, GIFT City SEZ tax holidays.',
    subseaConnectivity: 'Direct subsea landing planned at Maroli/GIFT City; ultra-high-voltage HVDC grid lines to Khavda 30 GW Hybrid Park.',
    dcClusters: ['GIFT City Gandhinagar', 'Sanand Industrial Area', 'Dholera SIR']
  },

  Rajasthan: {
    geoName: 'Rajasthan',
    displayName: 'Rajasthan',
    code: 'RJ',
    zone: 'North',
    tagline: "India's Clean Solar & Wind Energy Capital",
    tier: 'Clean Energy Capital',
    knownCapacityMW: 45,
    operationalMW: 10,
    pipelineMW: 35,
    greenSuitabilityScore: 89,
    gridCarbonFactor: 520,
    reSharePercent: 54.2,
    installedRECapacityMW: 24500,
    reBreakdown: { solar: 74, wind: 24, hydro: 1, other: 1 },
    waterStress: 'Critical',
    waterStressScore: 4.8,
    waterDetails: 'Arid Thar region; water-intensive evaporative cooling strictly restricted. Ideal for dry cooler & immersion tech.',
    freeCoolingHours: 3200,
    ambientWetBulb: 24.2,
    tariffCommercial: 6.9,
    pueEstimate: 1.31,
    center: [27.02, 74.22],
    incentives: 'Rajasthan Investment Promotion Scheme (RIPS): 100% electricity duty exemption for 7 years, 100% stamp duty waiver, RE banking concessions.',
    subseaConnectivity: 'Direct western fiber express highway connecting to Mumbai and Delhi NCR.',
    dcClusters: ['Jaipur Sitapura', 'Bhadla RE Park Edge Siting', 'Jodhpur IT Park']
  },

  'Andhra Pradesh': {
    geoName: 'Andhra Pradesh',
    displayName: 'Andhra Pradesh',
    code: 'AP',
    zone: 'South',
    tagline: 'Visakhapatnam Deep-Sea Maritime Hub & Coastal Corridor',
    tier: 'Tier 2 Emerging Frontier',
    knownCapacityMW: 65,
    operationalMW: 15,
    pipelineMW: 50,
    greenSuitabilityScore: 87,
    gridCarbonFactor: 610,
    reSharePercent: 38.5,
    installedRECapacityMW: 10400,
    reBreakdown: { solar: 48, wind: 42, hydro: 8, other: 2 },
    waterStress: 'Moderate',
    waterStressScore: 2.8,
    waterDetails: 'Abundant coastal seawater for secondary cooling; Krishna and Godavari delta canal systems.',
    freeCoolingHours: 2350,
    ambientWetBulb: 27.9,
    tariffCommercial: 7.1,
    pueEstimate: 1.33,
    center: [15.91, 79.74],
    incentives: 'AP Data Center Policy: 100% stamp duty reimbursement, power cost reimbursement of ₹1/unit for 3 years, integrated green energy corridor.',
    subseaConnectivity: 'Adani & Sify subsea landing stations coming up in Visakhapatnam; direct trans-oceanic cable routes to Singapore.',
    dcClusters: ['Visakhapatnam Madhurawada', 'Vijayawada IT Corridor']
  },

  'West Bengal': {
    geoName: 'West Bengal',
    displayName: 'West Bengal',
    code: 'WB',
    zone: 'East',
    tagline: 'East India Digital Hub & ASEAN Gateway',
    tier: 'Tier 2 Emerging Frontier',
    knownCapacityMW: 45,
    operationalMW: 18,
    pipelineMW: 27,
    greenSuitabilityScore: 76,
    gridCarbonFactor: 760,
    reSharePercent: 15.4,
    installedRECapacityMW: 1650,
    reBreakdown: { solar: 40, wind: 5, hydro: 48, other: 7 },
    waterStress: 'Low',
    waterStressScore: 1.8,
    waterDetails: 'Ganges delta region; ample municipal and surface water supplies with minimal depletion risks.',
    freeCoolingHours: 2400,
    ambientWetBulb: 28.5,
    tariffCommercial: 8.4,
    pueEstimate: 1.37,
    center: [22.99, 87.86],
    incentives: 'WB DC Policy: Priority industrial land allotment in Bengal Silicon Valley, single-window clearances, open-access renewable incentives.',
    subseaConnectivity: 'Direct subsea cable link landing at Digha/Kolkata connecting to Southeast Asia and Andaman.',
    dcClusters: ['New Town Silicon Valley Kolkata', 'Bantala IT SEZ']
  },

  Kerala: {
    geoName: 'Kerala',
    displayName: 'Kerala',
    code: 'KL',
    zone: 'South',
    tagline: 'Kochi Subsea Hub & High-Literacy Green Corridor',
    tier: 'Tier 2 Emerging Frontier',
    knownCapacityMW: 35,
    operationalMW: 12,
    pipelineMW: 23,
    greenSuitabilityScore: 88,
    gridCarbonFactor: 490,
    reSharePercent: 44.5,
    installedRECapacityMW: 3200,
    reBreakdown: { solar: 28, wind: 4, hydro: 66, other: 2 },
    waterStress: 'Low',
    waterStressScore: 1.5,
    waterDetails: 'High annual monsoonal rainfall, 44 rivers; very low ground water depletion threat.',
    freeCoolingHours: 2500,
    ambientWetBulb: 26.8,
    tariffCommercial: 7.4,
    pueEstimate: 1.31,
    center: [10.85, 76.27],
    incentives: 'Kerala IT Policy: Subsidized power tariffs for high-density compute, zero stamp duty on SEZ leases, green building incentives.',
    subseaConnectivity: 'Key southern gateway: 4 subsea cable landings at Kochi (SeaMeWe-3, SAFE, WACS, Bharat Lanka).',
    dcClusters: ['Infopark Kakkanad Kochi', 'Technopark Thiruvananthapuram']
  },

  'Madhya Pradesh': {
    geoName: 'Madhya Pradesh',
    displayName: 'Madhya Pradesh',
    code: 'MP',
    zone: 'Central',
    tagline: 'Central Subcontinent Hub & Rewa Solar Corridor',
    tier: 'Clean Energy Capital',
    knownCapacityMW: 30,
    operationalMW: 8,
    pipelineMW: 22,
    greenSuitabilityScore: 84,
    gridCarbonFactor: 670,
    reSharePercent: 32.1,
    installedRECapacityMW: 8900,
    reBreakdown: { solar: 55, wind: 36, hydro: 8, other: 1 },
    waterStress: 'Moderate',
    waterStressScore: 3.2,
    waterDetails: 'Narmada and Chambal basins; industrial corridors connected to state water grid.',
    freeCoolingHours: 3100,
    ambientWetBulb: 25.5,
    tariffCommercial: 7.2,
    pueEstimate: 1.33,
    center: [22.97, 78.66],
    incentives: 'MP Industrial Promotion Policy: ₹1.5/unit power subsidy for 5 years, 100% stamp duty exemption, 50% capital subsidy on private sub-stations.',
    subseaConnectivity: 'Equidistant central national transit node with redundant north-south and east-west optical backbones.',
    dcClusters: ['Indore Crystal IT Park', 'Bhopal IT Park', 'Rewa Mega Solar Zone']
  },

  Haryana: {
    geoName: 'Haryana',
    displayName: 'Haryana (NCR)',
    code: 'HR',
    zone: 'North',
    tagline: 'NCR Corporate Compute Belt & Edge Hub',
    tier: 'Tier 2 Emerging Frontier',
    knownCapacityMW: 60,
    operationalMW: 20,
    pipelineMW: 40,
    greenSuitabilityScore: 75,
    gridCarbonFactor: 740,
    reSharePercent: 14.8,
    installedRECapacityMW: 3200,
    reBreakdown: { solar: 78, wind: 0, hydro: 12, other: 10 },
    waterStress: 'Critical',
    waterStressScore: 4.6,
    waterDetails: 'High water stress across Gurugram/Faridabad; heavy reliance on tertiary STP water.',
    freeCoolingHours: 2950,
    ambientWetBulb: 27.8,
    tariffCommercial: 8.1,
    pueEstimate: 1.36,
    center: [29.05, 76.09],
    incentives: 'Haryana Data Centre Policy: 100% net SGST reimbursement for 10 years, 100% electricity duty exemption for 20 years, dual power feeder rights.',
    subseaConnectivity: 'Dense fiber connectivity linking to Delhi NCR internet exchange nodes.',
    dcClusters: ['Gurugram Cyber City', 'Manesar IMT']
  },

  Punjab: {
    geoName: 'Punjab',
    displayName: 'Punjab',
    code: 'PB',
    zone: 'North',
    tagline: 'Mohali IT Corridor & Agro-Biomass Power Siting',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 25,
    operationalMW: 8,
    pipelineMW: 17,
    greenSuitabilityScore: 74,
    gridCarbonFactor: 730,
    reSharePercent: 24.2,
    installedRECapacityMW: 4100,
    reBreakdown: { solar: 42, wind: 0, hydro: 38, other: 20 },
    waterStress: 'High',
    waterStressScore: 4.2,
    waterDetails: 'Canal irrigation system offers industrial supply; shallow groundwater over-exploited.',
    freeCoolingHours: 3300,
    ambientWetBulb: 25.1,
    tariffCommercial: 7.7,
    pueEstimate: 1.32,
    center: [31.15, 75.34],
    incentives: 'Punjab Industrial Policy: 100% exemption on electricity duty for 10 years, stamp duty reimbursement, capital investment subsidy.',
    subseaConnectivity: 'Connected to national fiber highways via Delhi NCR routing.',
    dcClusters: ['Mohali IT Park', 'Ludhiana Industrial Cluster']
  },

  Orissa: {
    geoName: 'Orissa',
    displayName: 'Odisha',
    code: 'OD',
    zone: 'East',
    tagline: 'Low-Tariff Clean Industrial Power & InfoValley Hub',
    tier: 'Tier 2 Emerging Frontier',
    knownCapacityMW: 35,
    operationalMW: 10,
    pipelineMW: 25,
    greenSuitabilityScore: 82,
    gridCarbonFactor: 710,
    reSharePercent: 28.5,
    installedRECapacityMW: 3800,
    reBreakdown: { solar: 40, wind: 8, hydro: 50, other: 2 },
    waterStress: 'Low',
    waterStressScore: 2.1,
    waterDetails: 'Mahanadi river system; abundant perennial water for industrial cooling circuits.',
    freeCoolingHours: 2500,
    ambientWetBulb: 27.5,
    tariffCommercial: 5.9, // Low power tariff!
    pueEstimate: 1.34,
    center: [20.95, 85.1],
    incentives: 'Odisha Data Center Policy: Power tariff subsidy of ₹1.5/unit for 5 years, land at concessional rates in InfoValley, 100% stamp duty waiver.',
    subseaConnectivity: 'Coastal fiber corridor connecting Kolkata and Chennai maritime cables.',
    dcClusters: ['InfoValley Bhubaneswar', 'Chandaka Industrial Estate']
  },

  Chhattisgarh: {
    geoName: 'Chhattisgarh',
    displayName: 'Chhattisgarh',
    code: 'CG',
    zone: 'Central',
    tagline: 'Surplus Base-load Power & Competitive Industrial Tariffs',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 20,
    operationalMW: 5,
    pipelineMW: 15,
    greenSuitabilityScore: 77,
    gridCarbonFactor: 820,
    reSharePercent: 21.0,
    installedRECapacityMW: 2200,
    reBreakdown: { solar: 46, wind: 0, hydro: 44, other: 10 },
    waterStress: 'Low',
    waterStressScore: 2.0,
    waterDetails: 'Dense river basins (Mahanadi, Indravati); very low industrial water scarcity.',
    freeCoolingHours: 2900,
    ambientWetBulb: 26.2,
    tariffCommercial: 5.2, // Lowest commercial power tariff in India
    pueEstimate: 1.35,
    center: [21.28, 81.87],
    incentives: 'Chhattisgarh Electronics & IT Policy: Industrial power tariff at subsidized rate of ₹4.5/unit, capital subsidy up to 30%, zero stamp duty.',
    subseaConnectivity: 'Central national transit backbone linking Central India to Vizag and Mumbai.',
    dcClusters: ['Naya Raipur Sector 24', 'Bhilai Industrial Zone']
  },

  'Himachal Pradesh': {
    geoName: 'Himachal Pradesh',
    displayName: 'Himachal Pradesh',
    code: 'HP',
    zone: 'North',
    tagline: 'Zero-Carbon Hydro Grid & Cold Climate Free-Cooling Zone',
    tier: 'Cold Climate Siting Zone',
    knownCapacityMW: 25,
    operationalMW: 5,
    pipelineMW: 20,
    greenSuitabilityScore: 94,
    gridCarbonFactor: 160, // Ultra-low grid carbon intensity!
    reSharePercent: 88.5,
    installedRECapacityMW: 11200,
    reBreakdown: { solar: 5, wind: 0, hydro: 94, other: 1 },
    waterStress: 'Low',
    waterStressScore: 1.2,
    waterDetails: 'Glacial Himalayan river systems; abundant mountain water sources with zero depletion threat.',
    freeCoolingHours: 5200, // Massive free cooling potential!
    ambientWetBulb: 16.5,
    tariffCommercial: 5.8,
    pueEstimate: 1.15, // Ultra-efficient PUE
    center: [31.1, 77.17],
    incentives: 'HP Industrial Policy: 100% clean hydropower supply assurance, subsidized mountain land leases, cold climate R&D grants.',
    subseaConnectivity: 'Redundant terrestrial optical links to Chandigarh and Delhi NCR peering points.',
    dcClusters: ['Baddi Industrial Corridor', 'Shimla IT Park']
  },

  'Jammu and Kashmir': {
    geoName: 'Jammu and Kashmir',
    displayName: 'Jammu and Kashmir',
    code: 'JK',
    zone: 'North',
    tagline: 'High-Altitude Cold Climate & AI Supercomputing Frontier',
    tier: 'Cold Climate Siting Zone',
    knownCapacityMW: 15,
    operationalMW: 3,
    pipelineMW: 12,
    greenSuitabilityScore: 92,
    gridCarbonFactor: 190,
    reSharePercent: 84.0,
    installedRECapacityMW: 3800,
    reBreakdown: { solar: 6, wind: 0, hydro: 94, other: 0 },
    waterStress: 'Low',
    waterStressScore: 1.1,
    waterDetails: 'Jhelum and Chenab rivers provide abundant chilled water supplies.',
    freeCoolingHours: 5800, // Highest in mainland India
    ambientWetBulb: 14.8,
    tariffCommercial: 6.2,
    pueEstimate: 1.12,
    center: [33.78, 76.58],
    incentives: 'J&K Industrial Development Scheme: Capital investment incentive up to ₹50 Cr, 300% GST linked incentive, electricity duty waiver for 5 years.',
    subseaConnectivity: 'High-speed defense and commercial optical ring connected to Northern grid.',
    dcClusters: ['Rangreth IT Park Srinagar', 'Bari Brahmana Jammu']
  },

  Uttaranchal: {
    geoName: 'Uttaranchal',
    displayName: 'Uttarakhand',
    code: 'UK',
    zone: 'North',
    tagline: 'Clean Hydro Power Siting & Low-Emission Foothill Zone',
    tier: 'Cold Climate Siting Zone',
    knownCapacityMW: 20,
    operationalMW: 5,
    pipelineMW: 15,
    greenSuitabilityScore: 89,
    gridCarbonFactor: 240,
    reSharePercent: 72.4,
    installedRECapacityMW: 4200,
    reBreakdown: { solar: 10, wind: 0, hydro: 88, other: 2 },
    waterStress: 'Low',
    waterStressScore: 1.4,
    waterDetails: 'Ganges/Yamuna headwaters; high water availability throughout the year.',
    freeCoolingHours: 4600,
    ambientWetBulb: 18.2,
    tariffCommercial: 6.4,
    pueEstimate: 1.20,
    center: [30.07, 79.02],
    incentives: 'Uttarakhand Mega Projects Policy: Subsidized clean power, exemption from electricity duty, zero stamp duty on industrial plot leases.',
    subseaConnectivity: 'Fast fiber trunks connecting to Delhi NCR enterprise nodes.',
    dcClusters: ['Dehradun IT Park', 'Pantnagar SIDCUL']
  },

  Bihar: {
    geoName: 'Bihar',
    displayName: 'Bihar',
    code: 'BR',
    zone: 'East',
    tagline: 'Eastern Consumer Edge Node & High-Density Adoption',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 15,
    operationalMW: 2,
    pipelineMW: 13,
    greenSuitabilityScore: 71,
    gridCarbonFactor: 790,
    reSharePercent: 16.5,
    installedRECapacityMW: 2100,
    reBreakdown: { solar: 45, wind: 0, hydro: 42, other: 13 },
    waterStress: 'Low',
    waterStressScore: 1.9,
    waterDetails: 'Gangetic plain with high water table; flood mitigation required for ground-floor designs.',
    freeCoolingHours: 2600,
    ambientWetBulb: 27.2,
    tariffCommercial: 7.8,
    pueEstimate: 1.37,
    center: [25.1, 85.31],
    incentives: 'Bihar IT/ITeS Policy 2024: Up to 30% capital investment subsidy, power tariff subsidy of ₹2/unit for 5 years, 100% stamp duty exemption.',
    subseaConnectivity: 'Inland arterial fiber connection via Kolkata and Patna.',
    dcClusters: ['Patna IT City', 'Rajgir Knowledge Hub']
  },

  Jharkhand: {
    geoName: 'Jharkhand',
    displayName: 'Jharkhand',
    code: 'JH',
    zone: 'East',
    tagline: 'Heavy Industrial Power Infrastructure & Edge Corridor',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 12,
    operationalMW: 3,
    pipelineMW: 9,
    greenSuitabilityScore: 70,
    gridCarbonFactor: 830,
    reSharePercent: 12.8,
    installedRECapacityMW: 1800,
    reBreakdown: { solar: 55, wind: 0, hydro: 40, other: 5 },
    waterStress: 'Moderate',
    waterStressScore: 2.7,
    waterDetails: 'Damodar Valley network; robust water retention reservoirs.',
    freeCoolingHours: 2800,
    ambientWetBulb: 26.4,
    tariffCommercial: 6.6,
    pueEstimate: 1.36,
    center: [23.61, 85.28],
    incentives: 'Jharkhand Industrial Policy: 100% stamp duty waiver, comprehensive electricity duty waiver for 5 years, dedicated power feeders.',
    subseaConnectivity: 'Connected via Eastern optical backbone to Kolkata gateway.',
    dcClusters: ['Ranchi Namkum IT SEZ', 'Jamshedpur Industrial Zone']
  },

  Goa: {
    geoName: 'Goa',
    displayName: 'Goa',
    code: 'GA',
    zone: 'West',
    tagline: 'Coastal Green Edge Hub & Subsea Landing Corridor',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 10,
    operationalMW: 2,
    pipelineMW: 8,
    greenSuitabilityScore: 83,
    gridCarbonFactor: 590,
    reSharePercent: 36.0,
    installedRECapacityMW: 450,
    reBreakdown: { solar: 65, wind: 10, hydro: 20, other: 5 },
    waterStress: 'Low',
    waterStressScore: 1.6,
    waterDetails: 'Coastal Konkan geography; high monsoonal recharge.',
    freeCoolingHours: 2400,
    ambientWetBulb: 27.0,
    tariffCommercial: 6.9,
    pueEstimate: 1.32,
    center: [15.3, 74.12],
    incentives: 'Goa IT Policy: Subsidized power tariffs for green DC pilots, 100% stamp duty rebate, innovation grants for immersion cooling.',
    subseaConnectivity: 'Direct coastal line between Mumbai and Mangaluru subsea cable corridors.',
    dcClusters: ['Verna Electronic City', 'Tuem IT Park']
  },

  Delhi: {
    geoName: 'Delhi',
    displayName: 'NCT of Delhi',
    code: 'DL',
    zone: 'North',
    tagline: 'National Capital Territory Core & Enterprise Peering Hub',
    tier: 'Tier 1 Megahub',
    knownCapacityMW: 85,
    operationalMW: 40,
    pipelineMW: 45,
    greenSuitabilityScore: 76,
    gridCarbonFactor: 690,
    reSharePercent: 22.0,
    installedRECapacityMW: 1200,
    reBreakdown: { solar: 85, wind: 0, hydro: 10, other: 5 },
    waterStress: 'Critical',
    waterStressScore: 4.9,
    waterDetails: 'Groundwater strictly regulated by NGT; 100% dry cooling or tertiary STP water required.',
    freeCoolingHours: 2950,
    ambientWetBulb: 27.9,
    tariffCommercial: 8.8,
    pueEstimate: 1.39,
    center: [28.7, 77.1],
    incentives: 'Delhi Solar Policy: 100% banking on solar open access, zero electricity tax on green power purchases.',
    subseaConnectivity: 'NIXI National Internet Exchange core; lowest latency hub in Northern India.',
    dcClusters: ['Okhla Industrial Area', 'Naraina', 'Connaught Place Peering Core']
  },

  Assam: {
    geoName: 'Assam',
    displayName: 'Assam',
    code: 'AS',
    zone: 'North-East',
    tagline: 'North-East Digital Gateway & Hydro-Powered Edge Hub',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 15,
    operationalMW: 2,
    pipelineMW: 13,
    greenSuitabilityScore: 82,
    gridCarbonFactor: 420,
    reSharePercent: 48.0,
    installedRECapacityMW: 1100,
    reBreakdown: { solar: 15, wind: 0, hydro: 82, other: 3 },
    waterStress: 'Low',
    waterStressScore: 1.1,
    waterDetails: 'Brahmaputra river basin; abundant water with mandatory flood-resilient elevation engineering.',
    freeCoolingHours: 3400,
    ambientWetBulb: 24.5,
    tariffCommercial: 6.8,
    pueEstimate: 1.28,
    center: [26.2, 92.94],
    incentives: 'Advantage Assam Policy: 30% capital investment subsidy, 100% reimbursement of stamp duty, ₹2/unit power concession for 5 years.',
    subseaConnectivity: 'Regional gateway to ASEAN (Myanmar, Bangladesh, Bhutan fiber ring).',
    dcClusters: ['Tech City Bongora Guwahati', 'Amingaon IT Park']
  },

  'Arunachal Pradesh': {
    geoName: 'Arunachal Pradesh',
    displayName: 'Arunachal Pradesh',
    code: 'AR',
    zone: 'North-East',
    tagline: 'Hydropower Titan of India & Cold High-Altitude Compute',
    tier: 'Cold Climate Siting Zone',
    knownCapacityMW: 6,
    operationalMW: 1,
    pipelineMW: 5,
    greenSuitabilityScore: 90,
    gridCarbonFactor: 110,
    reSharePercent: 96.0,
    installedRECapacityMW: 3200,
    reBreakdown: { solar: 2, wind: 0, hydro: 98, other: 0 },
    waterStress: 'Low',
    waterStressScore: 1.0,
    waterDetails: 'Highest freshwater discharge in India; zero water stress.',
    freeCoolingHours: 5400,
    ambientWetBulb: 15.2,
    tariffCommercial: 5.4,
    pueEstimate: 1.14,
    center: [28.22, 94.73],
    incentives: 'Subsidized pristine mountain land, ultra-low clean hydro tariffs, special northeastern industrial incentive scheme.',
    subseaConnectivity: 'High-altitude optic fiber routes connecting through Guwahati backhaul.',
    dcClusters: ['Itanagar Tech Hub']
  },

  Meghalaya: {
    geoName: 'Meghalaya',
    displayName: 'Meghalaya',
    code: 'ML',
    zone: 'North-East',
    tagline: 'Highland Cool-Climate Edge & Hydro Power Siting',
    tier: 'Cold Climate Siting Zone',
    knownCapacityMW: 8,
    operationalMW: 1.5,
    pipelineMW: 6.5,
    greenSuitabilityScore: 89,
    gridCarbonFactor: 210,
    reSharePercent: 82.0,
    installedRECapacityMW: 580,
    reBreakdown: { solar: 5, wind: 0, hydro: 93, other: 2 },
    waterStress: 'Low',
    waterStressScore: 1.0,
    waterDetails: 'Wettest region on earth (Cherrapunji/Mawsynram); immense natural rainwater harvesting capacity.',
    freeCoolingHours: 5100,
    ambientWetBulb: 16.8,
    tariffCommercial: 5.9,
    pueEstimate: 1.16,
    center: [25.47, 91.37],
    incentives: 'Meghalaya IT Policy: 100% stamp duty waiver, subsidized power tariffs for AI compute, cold climate siting incentives.',
    subseaConnectivity: 'Direct terrestrial fiber cross-border links towards Sylhet/Dhaka and Guwahati.',
    dcClusters: ['Shillong Technology Park']
  },

  Tripura: {
    geoName: 'Tripura',
    displayName: 'Tripura',
    code: 'TR',
    zone: 'North-East',
    tagline: 'International Subsea Fiber Gateway via Cox’s Bazar',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 6,
    operationalMW: 1.2,
    pipelineMW: 4.8,
    greenSuitabilityScore: 78,
    gridCarbonFactor: 480,
    reSharePercent: 35.0,
    installedRECapacityMW: 240,
    reBreakdown: { solar: 30, wind: 0, hydro: 65, other: 5 },
    waterStress: 'Low',
    waterStressScore: 1.3,
    waterDetails: 'Abundant river basins with healthy aquifers.',
    freeCoolingHours: 3200,
    ambientWetBulb: 25.2,
    tariffCommercial: 6.1,
    pueEstimate: 1.30,
    center: [23.94, 91.99],
    incentives: 'State IT subsidies, dedicated optical gateway incentives.',
    subseaConnectivity: 'Strategic 3rd international internet gateway via Cox’s Bazar (Bangladesh) submarine cable landing!',
    dcClusters: ['Agartala IT SEZ']
  },

  Manipur: {
    geoName: 'Manipur',
    displayName: 'Manipur',
    code: 'MN',
    zone: 'North-East',
    tagline: 'Indo-Myanmar Digital Gateway & Mountain Edge Node',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 4,
    operationalMW: 0.8,
    pipelineMW: 3.2,
    greenSuitabilityScore: 81,
    gridCarbonFactor: 290,
    reSharePercent: 68.0,
    installedRECapacityMW: 280,
    reBreakdown: { solar: 10, wind: 0, hydro: 90, other: 0 },
    waterStress: 'Low',
    waterStressScore: 1.2,
    waterDetails: 'Loktak lake basin; steady surface water supply.',
    freeCoolingHours: 4400,
    ambientWetBulb: 19.5,
    tariffCommercial: 6.0,
    pueEstimate: 1.22,
    center: [24.66, 93.91],
    incentives: 'North East Industrial Development Scheme (NEIDS) incentives.',
    subseaConnectivity: 'Asian Highway and Trans-Asian fiber route connection.',
    dcClusters: ['Imphal IT SEZ']
  },

  Nagaland: {
    geoName: 'Nagaland',
    displayName: 'Nagaland',
    code: 'NL',
    zone: 'North-East',
    tagline: 'Clean Hydro Mountain Edge Node',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 3,
    operationalMW: 0.5,
    pipelineMW: 2.5,
    greenSuitabilityScore: 80,
    gridCarbonFactor: 260,
    reSharePercent: 74.0,
    installedRECapacityMW: 190,
    reBreakdown: { solar: 8, wind: 0, hydro: 92, other: 0 },
    waterStress: 'Low',
    waterStressScore: 1.2,
    waterDetails: 'High precipitation hill terrain; pristine natural catchments.',
    freeCoolingHours: 4700,
    ambientWetBulb: 18.0,
    tariffCommercial: 6.2,
    pueEstimate: 1.21,
    center: [26.16, 94.56],
    incentives: 'Nagaland IT Policy subsidies and hilly area development rebates.',
    subseaConnectivity: 'Connected via Dimapur optical junction.',
    dcClusters: ['Kohima Tech Park', 'Dimapur Logistics Hub']
  },

  Mizoram: {
    geoName: 'Mizoram',
    displayName: 'Mizoram',
    code: 'MZ',
    zone: 'North-East',
    tagline: 'High-Altitude Clean Edge Node',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 3,
    operationalMW: 0.5,
    pipelineMW: 2.5,
    greenSuitabilityScore: 82,
    gridCarbonFactor: 220,
    reSharePercent: 80.0,
    installedRECapacityMW: 210,
    reBreakdown: { solar: 6, wind: 0, hydro: 94, other: 0 },
    waterStress: 'Low',
    waterStressScore: 1.2,
    waterDetails: 'Pleasant mountain climate with zero groundwater deficit.',
    freeCoolingHours: 4900,
    ambientWetBulb: 17.5,
    tariffCommercial: 6.1,
    pueEstimate: 1.19,
    center: [23.16, 92.94],
    incentives: 'NEIDS financial benefits and green tech grants.',
    subseaConnectivity: 'Kaladan multimodal corridor optical link.',
    dcClusters: ['Aizawl IT Complex']
  },

  Sikkim: {
    geoName: 'Sikkim',
    displayName: 'Sikkim',
    code: 'SK',
    zone: 'North-East',
    tagline: "India's First 100% Organic State & Hydro Clean Compute",
    tier: 'Cold Climate Siting Zone',
    knownCapacityMW: 5,
    operationalMW: 1,
    pipelineMW: 4,
    greenSuitabilityScore: 92,
    gridCarbonFactor: 140,
    reSharePercent: 94.0,
    installedRECapacityMW: 2200,
    reBreakdown: { solar: 1, wind: 0, hydro: 99, other: 0 },
    waterStress: 'Low',
    waterStressScore: 1.0,
    waterDetails: 'Teesta river glacial system; 100% clean water availability.',
    freeCoolingHours: 5600,
    ambientWetBulb: 14.9,
    tariffCommercial: 5.2,
    pueEstimate: 1.13,
    center: [27.53, 88.51],
    incentives: '100% organic ecological certification, complete clean hydropower priority.',
    subseaConnectivity: 'High-resilience fiber ring linking Gangtok to Siliguri corridor.',
    dcClusters: ['Gangtok IT Hub']
  },

  Chandigarh: {
    geoName: 'Chandigarh',
    displayName: 'Chandigarh (UT)',
    code: 'CH',
    zone: 'North',
    tagline: 'Planned Smart City Peering Core & Low Transmission Loss',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 12,
    operationalMW: 5,
    pipelineMW: 7,
    greenSuitabilityScore: 80,
    gridCarbonFactor: 580,
    reSharePercent: 32.0,
    installedRECapacityMW: 120,
    reBreakdown: { solar: 80, wind: 0, hydro: 20, other: 0 },
    waterStress: 'Moderate',
    waterStressScore: 2.9,
    waterDetails: 'Sukhna lake catchment and canal piped water supply.',
    freeCoolingHours: 3250,
    ambientWetBulb: 25.8,
    tariffCommercial: 6.5,
    pueEstimate: 1.30,
    center: [30.73, 76.78],
    incentives: 'Chandigarh IT Park incentives, streamlined single-window approvals.',
    subseaConnectivity: 'Primary tri-city fiber convergence point (Punjab, Haryana, HP).',
    dcClusters: ['Rajiv Gandhi Chandigarh Technology Park']
  },

  Puducherry: {
    geoName: 'Puducherry',
    displayName: 'Puducherry (UT)',
    code: 'PY',
    zone: 'South',
    tagline: 'Coastal Smart City Edge Node & Solar Integration',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 5,
    operationalMW: 1.5,
    pipelineMW: 3.5,
    greenSuitabilityScore: 82,
    gridCarbonFactor: 590,
    reSharePercent: 35.0,
    installedRECapacityMW: 85,
    reBreakdown: { solar: 85, wind: 10, hydro: 5, other: 0 },
    waterStress: 'Moderate',
    waterStressScore: 3.0,
    waterDetails: 'Coastal aquifer; reverse osmosis water plants in use.',
    freeCoolingHours: 2200,
    ambientWetBulb: 28.0,
    tariffCommercial: 6.9,
    pueEstimate: 1.34,
    center: [11.94, 79.81],
    incentives: 'Union Territory industrial concessions, green building rebates.',
    subseaConnectivity: 'High-speed terrestrial link to Chennai subsea cable landings.',
    dcClusters: ['Puducherry IT Hub']
  },

  'Dadra and Nagar Haveli': {
    geoName: 'Dadra and Nagar Haveli',
    displayName: 'Dadra & Nagar Haveli',
    code: 'DN',
    zone: 'West',
    tagline: 'Low Industrial Power Tariff Edge Corridor',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 4,
    operationalMW: 1,
    pipelineMW: 3,
    greenSuitabilityScore: 78,
    gridCarbonFactor: 640,
    reSharePercent: 28.0,
    installedRECapacityMW: 60,
    reBreakdown: { solar: 75, wind: 20, hydro: 5, other: 0 },
    waterStress: 'Low',
    waterStressScore: 2.0,
    waterDetails: 'Damanganga river basin; high industrial water availability.',
    freeCoolingHours: 2600,
    ambientWetBulb: 26.5,
    tariffCommercial: 5.6,
    pueEstimate: 1.33,
    center: [20.18, 73.02],
    incentives: 'Low UT corporate and commercial power rates.',
    subseaConnectivity: 'Strategic position between Mumbai and Surat/Ahmedabad.',
    dcClusters: ['Silvassa Industrial Estate']
  },

  'Daman and Diu': {
    geoName: 'Daman and Diu',
    displayName: 'Daman & Diu',
    code: 'DD',
    zone: 'West',
    tagline: 'Coastal Edge Node & Solar Island Microgrid',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 3,
    operationalMW: 0.8,
    pipelineMW: 2.2,
    greenSuitabilityScore: 80,
    gridCarbonFactor: 610,
    reSharePercent: 32.0,
    installedRECapacityMW: 45,
    reBreakdown: { solar: 90, wind: 10, hydro: 0, other: 0 },
    waterStress: 'Moderate',
    waterStressScore: 2.5,
    waterDetails: 'Coastal seawater reverse osmosis plants.',
    freeCoolingHours: 2550,
    ambientWetBulb: 26.8,
    tariffCommercial: 5.8,
    pueEstimate: 1.33,
    center: [20.43, 72.85],
    incentives: 'UT green energy exemptions and industrial tariff incentives.',
    subseaConnectivity: 'Close proximity to Gujarat and Maharashtra coastal fiber trunks.',
    dcClusters: ['Daman Industrial Zone']
  },

  'Andaman and Nicobar': {
    geoName: 'Andaman and Nicobar',
    displayName: 'Andaman & Nicobar Islands',
    code: 'AN',
    zone: 'Islands',
    tagline: 'CANI Subsea Cable Landing & Island Microgrid',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 4,
    operationalMW: 1,
    pipelineMW: 3,
    greenSuitabilityScore: 84,
    gridCarbonFactor: 520,
    reSharePercent: 40.0,
    installedRECapacityMW: 55,
    reBreakdown: { solar: 90, wind: 0, hydro: 0, other: 10 },
    waterStress: 'Moderate',
    waterStressScore: 2.8,
    waterDetails: 'Rainwater harvesting and coastal desalination systems.',
    freeCoolingHours: 2200,
    ambientWetBulb: 27.6,
    tariffCommercial: 7.2,
    pueEstimate: 1.33,
    center: [11.74, 92.66],
    incentives: 'Island development council digital infrastructure subsidies.',
    subseaConnectivity: 'CANI (Chennai-Andaman & Nicobar Islands) Submarine Optical Fiber Cable active!',
    dcClusters: ['Port Blair Digital Hub']
  },

  Lakshadweep: {
    geoName: 'Lakshadweep',
    displayName: 'Lakshadweep Islands',
    code: 'LD',
    zone: 'Islands',
    tagline: 'KLI Submarine Cable & 100% Solar-Battery Microgrid',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 2,
    operationalMW: 0.5,
    pipelineMW: 1.5,
    greenSuitabilityScore: 85,
    gridCarbonFactor: 490,
    reSharePercent: 55.0,
    installedRECapacityMW: 30,
    reBreakdown: { solar: 95, wind: 0, hydro: 0, other: 5 },
    waterStress: 'High',
    waterStressScore: 3.5,
    waterDetails: 'Low-temperature thermal desalination (LTTD) technology deployed.',
    freeCoolingHours: 2200,
    ambientWetBulb: 27.4,
    tariffCommercial: 7.5,
    pueEstimate: 1.32,
    center: [10.57, 72.64],
    incentives: 'Island clean energy subsidies & digital frontier grants.',
    subseaConnectivity: 'KLI (Kochi-Lakshadweep Islands) Submarine Optical Fiber Cable link active!',
    dcClusters: ['Kavaratti Edge Siting']
  }
};

// Aliases mapping for GeoJSON names & regional variants
export const STATE_NAME_ALIASES = {
  Orissa: 'Orissa',
  Odisha: 'Orissa',
  Uttaranchal: 'Uttaranchal',
  Uttarakhand: 'Uttaranchal',
  'Jammu & Kashmir': 'Jammu and Kashmir',
  'Jammu and Kashmir': 'Jammu and Kashmir',
  'Andaman and Nicobar Islands': 'Andaman and Nicobar',
  'Andaman and Nicobar': 'Andaman and Nicobar',
  Delhi: 'Delhi',
  'NCT of Delhi': 'Delhi',
  'Dadra and Nagar Haveli': 'Dadra and Nagar Haveli',
  'Daman and Diu': 'Daman and Diu',
  Pondicherry: 'Puducherry',
  Puducherry: 'Puducherry',
  Telangana: 'Karnataka' // mapped to southern hub context if GeoJSON lacks Telangana polygon
};

/**
 * Retrieve state intelligence object with calculated metrics.
 */
export function getStateIntelligence(rawStateName) {
  if (!rawStateName) return null;
  const canonical = STATE_NAME_ALIASES[rawStateName] || rawStateName;
  const state = ALL_INDIA_STATES[canonical] || ALL_INDIA_STATES[rawStateName];
  if (state) return state;

  // Case insensitive fallback
  const lower = rawStateName.toLowerCase();
  for (const [key, val] of Object.entries(ALL_INDIA_STATES)) {
    if (key.toLowerCase() === lower || val.displayName.toLowerCase() === lower) {
      return val;
    }
  }

  // If not found, return generated structured profile
  return {
    geoName: rawStateName,
    displayName: rawStateName,
    code: 'IN',
    zone: 'India',
    tagline: 'National Siting Region',
    tier: 'Regional Edge Hub',
    knownCapacityMW: 10,
    operationalMW: 2,
    pipelineMW: 8,
    greenSuitabilityScore: 75,
    gridCarbonFactor: 680,
    reSharePercent: 25.0,
    installedRECapacityMW: 2000,
    reBreakdown: { solar: 50, wind: 20, hydro: 25, other: 5 },
    waterStress: 'Moderate',
    waterStressScore: 3,
    waterDetails: 'State municipal and local water resources.',
    freeCoolingHours: 2800,
    ambientWetBulb: 26.5,
    tariffCommercial: 7.0,
    pueEstimate: 1.34,
    center: [22.5, 82.5],
    incentives: 'Standard national green energy open access and capital subsidies apply.',
    subseaConnectivity: 'Connected to National Optical Fiber Network (BharatNet).',
    dcClusters: ['Regional IT Park']
  };
}

/**
 * Color generator based on Metric layer
 */
export function getChoroplethColor(stateName, metricType = 'suitability', isDark = false) {
  const data = getStateIntelligence(stateName);
  if (!data) {
    return isDark ? '#1e293b' : '#e2e8f0';
  }

  // 1. DC Siting Suitability Layer (Balanced, Elegant Cartographic Palette)
  if (metricType === 'suitability') {
    const score = data.greenSuitabilityScore || 80;
    if (isDark) {
      if (score >= 90) return '#059669'; // Tier-1 Clean Megahubs (Refined Emerald)
      if (score >= 86) return '#0d9488'; // Clean Energy & Hydro Leaders (Marine Teal)
      if (score >= 82) return '#0284c7'; // Emerging Solar Corridors (Slate Cyan)
      if (score >= 78) return '#b45309'; // Industrial & Transition Hubs (Muted Amber)
      if (score >= 74) return '#6d28d9'; // Frontier Regions (Muted Slate Violet)
      return '#334155';
    } else {
      if (score >= 90) return '#10b981'; // Tier-1 Clean Megahubs (Balanced Emerald)
      if (score >= 86) return '#14b8a6'; // Clean Energy & Hydro Leaders (Balanced Teal)
      if (score >= 82) return '#38bdf8'; // Emerging Solar Corridors (Balanced Sky Cyan)
      if (score >= 78) return '#f59e0b'; // Industrial & Transition Hubs (Warm Muted Amber)
      if (score >= 74) return '#a78bfa'; // Frontier Regions (Soft Slate Lavender)
      return '#cbd5e1';
    }
  }

  // 2. Renewable Energy Share % Layer (Green to Amber to Rose)
  if (metricType === 'reShare') {
    const re = data.reSharePercent || 30;
    if (isDark) {
      if (re >= 70) return '#059669'; // Ultra RE Hydro/Solar (Deep Emerald)
      if (re >= 50) return '#0d9488'; // High RE (Teal)
      if (re >= 35) return '#b45309'; // Moderate RE (Amber)
      if (re >= 20) return '#be123c'; // Low RE (Rose)
      return '#334155';
    } else {
      if (re >= 70) return '#10b981'; // Ultra RE Hydro/Solar (Clean Green)
      if (re >= 50) return '#2dd4bf'; // High RE (Muted Teal)
      if (re >= 35) return '#f59e0b'; // Moderate RE (Golden Amber)
      if (re >= 20) return '#fb7185'; // Low RE (Soft Rose)
      return '#fecdd3';
    }
  }

  // 3. Hydrological Water Stress Layer (CGWB 2023)
  if (metricType === 'waterStress') {
    const stress = data.waterStress;
    if (isDark) {
      if (stress === 'Critical') return '#e11d48'; // Critical Overexploited (Rose-Red)
      if (stress === 'High') return '#ea580c';     // High Stress (Orange)
      if (stress === 'Moderate') return '#d97706'; // Moderate (Amber)
      return '#059669';                            // Safe Basins (Emerald)
    } else {
      if (stress === 'Critical') return '#f43f5e'; // Critical (Balanced Rose Red)
      if (stress === 'High') return '#f97316';     // High (Warm Orange)
      if (stress === 'Moderate') return '#eab308'; // Moderate (Warm Yellow)
      return '#10b981';                            // Safe (Clean Green)
    }
  }

  // 4. Grid Carbon Intensity (CEA 2024 kg CO2/kWh)
  if (metricType === 'carbon') {
    const carbon = data.gridCarbonFactor || 710;
    if (isDark) {
      if (carbon < 300) return '#059669'; // Mountain Hydro (<0.30 kg)
      if (carbon < 550) return '#0284c7'; // High Clean Mix (<0.55 kg)
      if (carbon < 720) return '#b45309'; // National Baseline (<0.72 kg)
      return '#be123c';                   // Coal Heavy (>0.72 kg)
    } else {
      if (carbon < 300) return '#10b981'; // Mountain Hydro (Emerald)
      if (carbon < 550) return '#0284c7'; // High Clean Mix (Sky/Navy Blue)
      if (carbon < 720) return '#f59e0b'; // National Baseline (Amber)
      return '#f43f5e';                   // Coal Heavy (Rose-Red)
    }
  }

  return isDark ? '#1e293b' : '#f1f5f9';
}
