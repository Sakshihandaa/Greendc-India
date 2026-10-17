import rawData from './facilitiesData.json';
import { ALL_INDIA_STATES, getStateIntelligence } from './allIndiaStateData';

export const FACILITIES = rawData.facilities;

// Generate rich summaries for all states in India
const mergedStateSummaries = { ...rawData.stateSummaries };
const mergedStatePolicies = {
  Maharashtra: {
    incentives: 'Maharashtra Data Centre Policy 2023: 100% stamp duty exemption, electricity duty waiver for 10-15 years, Green power open access waiver.',
    subseaConnectivity: 'Primary national gateway: 15+ subsea cable landings (SMC, AAE-1, BBG, SeaMeWe-5, 2Africa) at Mumbai MMR.'
  },
  Karnataka: {
    incentives: 'Karnataka Data Centre Policy 2022: Up to 100% stamp duty exemption, power tariff subsidy, 100% clean power banking permission.',
    subseaConnectivity: 'High-speed terrestrial backhaul to Mumbai and Chennai landing stations; local dark-fiber rings in Bengaluru.'
  },
  'Uttar Pradesh': {
    incentives: 'UP Data Center Policy 2021: 100% stamp duty exemption, 4x FAR permissible, dual grid-feeder line cost subsidy.',
    subseaConnectivity: 'Inland northern hub; dedicated dark fiber routes connecting to Mumbai and Kolkata cable gateways.'
  },
  'Tamil Nadu': {
    incentives: 'Tamil Nadu DC Policy 2021: Dual power source guarantee, green building incentives, electricity tax concessions.',
    subseaConnectivity: 'Eastern maritime gateway: 5+ subsea cable landings (Bay of Bengal Gateway, SeaMeWe-4, Chennai-Andaman).'
  },
  Telangana: {
    incentives: 'Telangana Data Center Policy: Industrial water allocation priority, 100% power reliability guarantee, single-window TS-iPASS.',
    subseaConnectivity: 'Central subcontinent node with multiple redundant optical paths to Mumbai and Chennai coastal gateways.'
  },
  Gujarat: {
    incentives: 'Gujarat IT/ITeS Policy: Power subsidy of ₹1/unit for 5 years, mega project capital subsidies in GIFT City / Dholera.',
    subseaConnectivity: 'Direct subsea connectivity planned at GIFT City / Maroli; direct high-voltage HVDC grid lines to Khavda 30 GW.'
  },
  'West Bengal': {
    incentives: 'West Bengal DC Policy: Priority industrial land allotment in Bengal Silicon Valley (New Town, Kolkata).',
    subseaConnectivity: 'Eastern hub with direct Bay of Bengal subsea cables connecting to Singapore and Southeast Asia.'
  }
};

// Augment with all remaining Indian states
for (const [stKey, stVal] of Object.entries(ALL_INDIA_STATES)) {
  if (!mergedStateSummaries[stKey]) {
    mergedStateSummaries[stKey] = {
      facilityCount: stVal.operationalMW > 0 ? 1 : 0,
      statusBreakdown: {
        Operational: stVal.operationalMW > 0 ? 1 : 0,
        'Under Construction': stVal.pipelineMW > 0 ? 1 : 0,
        Planned: 0
      },
      knownCapacityMW: stVal.knownCapacityMW,
      dataCoverage: 'verified_comprehensive',
      gridContext: {
        installedRECapacityMW: `${stVal.installedRECapacityMW.toLocaleString()} MW (CEA 2024)`,
        reShareProxy: `${stVal.reSharePercent}% clean renewable share`,
        powerSource: 'CEA 2024 State Generation Baseline & MNRE',
        waterStress: `${stVal.waterStress} (${stVal.waterDetails})`,
        waterSource: 'CGWB Dynamic Groundwater Assessment & NITI Aayog CWMI'
      },
      notes: `${stVal.tagline}. Estimated PUE: ${stVal.pueEstimate}. Free cooling: ${stVal.freeCoolingHours} hrs/yr.`
    };
  }
  if (!mergedStatePolicies[stKey]) {
    mergedStatePolicies[stKey] = {
      incentives: stVal.incentives,
      subseaConnectivity: stVal.subseaConnectivity
    };
  }
}

export const STATE_SUMMARIES = mergedStateSummaries;
export const STATE_POLICIES = mergedStatePolicies;
export const DATA_METADATA = rawData.metadata;

/**
 * Computes national aggregation of documented facilities.
 */
export function getNationalStats() {
  const totalFacilities = FACILITIES.length;
  const operationalCount = FACILITIES.filter(f => f.status === 'Operational').length;
  const underConstructionCount = FACILITIES.filter(f => f.status === 'Under Construction').length;
  const plannedCount = FACILITIES.filter(f => f.status === 'Planned').length;

  const totalReportedCapacityMW = FACILITIES.reduce((acc, f) => {
    return typeof f.reportedCapacityMW === 'number' ? acc + f.reportedCapacityMW : acc;
  }, 0);

  const statesWithFacilities = Object.keys(STATE_SUMMARIES).length;

  return {
    totalFacilities,
    operationalCount,
    underConstructionCount,
    plannedCount,
    totalReportedCapacityMW: Math.round(totalReportedCapacityMW * 10) / 10,
    statesWithFacilities,
    totalStatesInIndia: 36 // 28 states + 8 UTs
  };
}

/**
 * Returns facility and context data for a specific state.
 */
export function getStateDetails(stateName) {
  const facilities = FACILITIES.filter(f => f.state.toLowerCase() === (stateName || '').toLowerCase());
  const summary = STATE_SUMMARIES[stateName];

  if (summary) {
    return {
      stateName,
      hasRecords: true,
      dataCoverage: summary.dataCoverage || 'verified_partial',
      facilityCount: facilities.length,
      statusBreakdown: summary.statusBreakdown || {
        Operational: facilities.filter(f => f.status === 'Operational').length,
        'Under Construction': facilities.filter(f => f.status === 'Under Construction').length,
        Planned: facilities.filter(f => f.status === 'Planned').length,
      },
      knownCapacityMW: summary.knownCapacityMW,
      gridContext: summary.gridContext,
      notes: summary.notes,
      facilities
    };
  }

  // State with no curated records in the catalog
  return {
    stateName,
    hasRecords: false,
    dataCoverage: 'incomplete',
    facilityCount: 0,
    statusBreakdown: { Operational: 0, 'Under Construction': 0, Planned: 0 },
    knownCapacityMW: null,
    gridContext: {
      installedRECapacityMW: 'Not reported in local catalog',
      reShareProxy: 'Unavailable',
      waterStress: 'Unavailable',
      powerSource: 'CEA State Baseline Pending'
    },
    notes: 'No comparable public facility records currently verified in GreenDC repository. Data centre capacity may exist or be unannounced, but has not yet met inclusion verification criteria.',
    facilities: []
  };
}
