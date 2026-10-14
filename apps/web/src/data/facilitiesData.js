import rawData from './facilitiesData.json';

export const FACILITIES = rawData.facilities;
export const STATE_SUMMARIES = rawData.stateSummaries;
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
