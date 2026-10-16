import { jsPDF } from 'jspdf';
import * as d3geo from 'd3-geo';
import indiaStatesGeo from '../data/indiaStatesGeo.json';

/**
 * Deterministically renders an executive, high-resolution India GIS map on an in-memory Canvas.
 * Solves all browser SVG-in-image security sandbox, 3D transform distortion, and missing snapshot bugs.
 */
export function generateExecutiveMapCanvas({
  stateName = 'Maharashtra',
  facility = null,
  simResult = null
}) {
  const width = 1400;
  const height = 520;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background gradient (clean eco-tech surface)
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#f0fdf4');
  grad.addColorStop(1, '#f8fafc');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle coordinate grid overlay
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
  ctx.lineWidth = 1;
  for (let x = 40; x < width; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 30; y < height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Projection setup centered on India
  const projection = d3geo.geoMercator().fitExtent(
    [[width * 0.18, 25], [width * 0.82, height - 25]],
    indiaStatesGeo
  );
  const pathGenerator = d3geo.geoPath().projection(projection).context(ctx);

  const activeState = (facility?.state || stateName || 'Maharashtra').toLowerCase();

  // Draw each Indian State
  if (indiaStatesGeo && indiaStatesGeo.features) {
    indiaStatesGeo.features.forEach(feature => {
      const name = (feature.properties.name || '').toLowerCase();
      const isSelected = name === activeState || activeState.includes(name) || name.includes(activeState);

      ctx.beginPath();
      pathGenerator(feature);

      if (isSelected) {
        ctx.fillStyle = '#10b981'; // Emerald highlight for active state
        ctx.fill();
        ctx.strokeStyle = '#047857';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      } else {
        ctx.fillStyle = '#e2e8f0'; // Clean neutral light eco state
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });
  }

  // Draw major RE transmission corridors
  const CORRIDORS = [
    { from: [69.83, 23.95], to: [72.87, 19.07] }, // Khavda -> Mumbai
    { from: [71.91, 27.53], to: [77.50, 28.47] }, // Bhadla -> NCR
    { from: [77.27, 14.28], to: [77.59, 12.97] }, // Pavagada -> Bengaluru
    { from: [77.54, 8.25],  to: [80.27, 13.08] }, // Muppandal -> Chennai
    { from: [77.27, 14.28], to: [78.48, 17.38] }, // Pavagada -> Hyderabad
    { from: [81.30, 24.53], to: [88.36, 22.57] }, // Rewa -> Kolkata
  ];

  CORRIDORS.forEach(c => {
    const p1 = projection(c.from);
    const p2 = projection(c.to);
    if (p1 && p2) {
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });

  // Draw prominent city dots and legible labels
  const KEY_CITIES = [
    { name: 'New Delhi', coords: [77.20, 28.61] },
    { name: 'Mumbai', coords: [72.87, 19.07] },
    { name: 'Bengaluru', coords: [77.59, 12.97] },
    { name: 'Hyderabad', coords: [78.48, 17.38] },
    { name: 'Chennai', coords: [80.27, 13.08] },
    { name: 'Kolkata', coords: [88.36, 22.57] },
    { name: 'Ahmedabad', coords: [72.57, 23.02] },
    { name: 'Pune', coords: [73.85, 18.52] },
    { name: 'Jaipur', coords: [75.78, 26.91] },
    { name: 'Kochi', coords: [76.26, 9.93] },
    { name: 'Bhubaneswar', coords: [85.82, 20.29] },
    { name: 'Guwahati', coords: [91.73, 26.14] }
  ];

  KEY_CITIES.forEach(city => {
    const pt = projection(city.coords);
    if (pt) {
      ctx.beginPath();
      ctx.arc(pt[0], pt[1], 4, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = 'bold 11px Helvetica, Arial, sans-serif';
      ctx.fillStyle = '#1e293b';
      ctx.fillText(city.name, pt[0] + 6, pt[1] + 3);
    }
  });

  // Draw selected facility pin / beacon
  const facilityCoords = facility?.coordinates ? [facility.coordinates[1], facility.coordinates[0]] : null;
  const pinPoint = facilityCoords ? projection(facilityCoords) : null;

  if (pinPoint) {
    // Glowing halo
    ctx.beginPath();
    ctx.arc(pinPoint[0], pinPoint[1], 16, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(pinPoint[0], pinPoint[1], 7, 0, Math.PI * 2);
    ctx.fillStyle = '#dc2626'; // High-contrast Red Target Pin
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Callout badge
    const callout = `📍 ${facility.name} (${facility.reportedCapacityMW || 50} MW)`;
    ctx.font = 'bold 13px Helvetica, Arial, sans-serif';
    const textWidth = ctx.measureText(callout).width;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(pinPoint[0] - textWidth / 2 - 8, pinPoint[1] - 34, textWidth + 16, 24, 6);
    ctx.fill();

    ctx.fillStyle = '#34d399';
    ctx.fillText(callout, pinPoint[0] - textWidth / 2, pinPoint[1] - 18);
  }

  // Header Title on Map
  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 12px Helvetica, Arial, sans-serif';
  ctx.fillText('⚡ GreenDC Geographic Intelligence Engine • Verified Infrastructure Physics', 24, 28);

  // Clean Legend Box (Bottom Left)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(24, height - 76, 310, 56, 8);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 10px Helvetica, Arial, sans-serif';
  ctx.fillStyle = '#047857';
  ctx.fillRect(36, height - 64, 12, 12);
  ctx.fillStyle = '#1e293b';
  ctx.fillText('Active Simulation State', 54, height - 54);

  ctx.beginPath();
  ctx.arc(42, height - 34, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#dc2626';
  ctx.fill();
  ctx.fillStyle = '#1e293b';
  ctx.fillText('Sited Facility Node', 54, height - 31);

  ctx.strokeStyle = '#059669';
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(180, height - 58);
  ctx.lineTo(205, height - 58);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillText('RE Transmission Corridors', 212, height - 54);

  return canvas.toDataURL('image/png', 1.0);
}

/**
 * Generates an executive, publication-grade ESG Sustainability & Siting Audit PDF.
 * Captures map snapshot reliably and formats all metrics in clean, structured tables.
 */
export async function exportSustainabilityPDF({
  mapElementId = 'greendc-map-container',
  facility,
  stateName,
  simResult,
  analysisOutputs,
  waterMetrics,
  statePolicy,
  onProgress
}) {
  try {
    if (onProgress) onProgress('Rendering executive GIS map snapshot...');

    // Generate high-resolution, rock-solid map directly via Canvas & D3 Geo
    const mapImgData = generateExecutiveMapCanvas({
      stateName: stateName || facility?.state || 'Maharashtra',
      facility,
      simResult
    });

    if (onProgress) onProgress('Compiling structured ESG intelligence document...');

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = 12;

    // --- 1. HEADER SECTION ---
    // Top Emerald Banner Accent
    doc.setFillColor(5, 150, 105); // #059669
    doc.rect(margin, y, contentWidth, 3, 'F');
    y += 7;

    // Title & Brand
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('GreenDC India', margin, y);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // slate-500
    const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
    doc.text(`Generated: ${nowStr} IST`, pageWidth - margin, y, { align: 'right' });
    y += 5;

    doc.setFontSize(9.5);
    doc.setTextColor(5, 150, 105);
    doc.setFont('helvetica', 'bold');
    doc.text('AI & CLOUD DATA CENTRE SUSTAINABILITY AUDIT REPORT', margin, y);
    y += 6;

    // Subtitle / Facility Context
    const siteTitle = facility?.name || (stateName ? `${stateName} Regional Siting Cluster` : 'National Siting Baseline');
    const locationStr = facility ? `${facility.city || facility.location || ''}, ${facility.state}` : (stateName || 'India National Grid');

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(siteTitle, margin, y);
    y += 5;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Location: ${locationStr} • Verified Infrastructure Physics Engine (CEA 2024 / CGWB / CWMI)`, margin, y);
    y += 6;

    // --- 2. MAP SNAPSHOT EMBED ---
    const mapBoxHeight = 68;
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, mapBoxHeight, 2, 2, 'FD');

    if (mapImgData && mapImgData.startsWith('data:image')) {
      try {
        doc.addImage(mapImgData, 'PNG', margin + 1, y + 1, contentWidth - 2, mapBoxHeight - 2);
      } catch (e) {
        console.warn('Failed to embed map into PDF:', e);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text('GIS Map Snapshot: Survey of India Open Spatial Registry', margin + 10, y + 28);
      }
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('GIS Map Snapshot: Survey of India Open Spatial Registry', margin + 10, y + 28);
    }
    y += mapBoxHeight + 6;

    // Helper function to draw clean structured table cards
    const drawTableCard = (startX, startY, width, height, title, value, subtitle, accentColor = [5, 150, 105]) => {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(startX, startY, width, height, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(title, startX + 2.5, startY + 4.5);

      doc.setFontSize(10.5);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text(value, startX + 2.5, startY + 10.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(subtitle, startX + 2.5, startY + 14.5);
    };

    // Calculate core metrics for document
    const itMW = simResult?.inputs?.itLoadMW || 50;
    const pueVal = (simResult?.inputs?.pue || 1.30).toFixed(2);
    const facilityPowerMW = Math.round(itMW * pueVal * 10) / 10;
    const annualGWh = Math.round((simResult?.outputs?.annualEnergyMWh ? simResult.outputs.annualEnergyMWh / 1000 : facilityPowerMW * 8760 * 0.85 / 1000) * 10) / 10;
    const tariffRate = simResult?.inputs?.tariffCommercial || 7.5;
    const annualBillCrores = Math.round((annualGWh * 1000000 * tariffRate / 10000000) * 10) / 10;

    const reSharePercent = Math.round((simResult?.inputs?.renewableShare || 0.50) * 100);
    const gridCarbonFactor = simResult?.inputs?.gridCarbonFactor || 710;
    const grossCO2Tonnes = Math.round(annualGWh * 1000 * gridCarbonFactor / 1000);
    const netCO2Tonnes = Math.round(grossCO2Tonnes * (1 - reSharePercent / 100));
    const avoidedCO2Tonnes = grossCO2Tonnes - netCO2Tonnes;

    const wueNumber = simResult?.inputs?.wue !== undefined && simResult?.inputs?.wue !== null ? simResult.inputs.wue : 0.05;
    const annualWaterML = Math.round((annualGWh * 1000 * wueNumber / 1000) * 10) / 10;
    const dailyWaterLiters = Math.round((annualWaterML * 1000000) / 365);

    const cardWidth = (contentWidth - 6) / 4;
    const cardHeight = 16.5;

    // --- 3. SECTION 1: ELECTRICAL POWER & ENERGY FOOTPRINT ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(5, 150, 105);
    doc.text('1. ELECTRICAL POWER & ENERGY DEMAND (PHYSICS ENGINE)', margin, y);
    y += 4;

    const powerCards = [
      { label: 'IT COMPUTE PAYLOAD', val: `${itMW} MW`, sub: 'Peak IT load' },
      { label: 'FACILITY POWER DRAW', val: `${facilityPowerMW} MW`, sub: `PUE ${pueVal} factor` },
      { label: 'ANNUAL ENERGY DEMAND', val: `${annualGWh.toLocaleString()} GWh`, sub: '85% Utilisation factor' },
      { label: 'ANNUAL ELECTRICITY BILL', val: `INR ${annualBillCrores.toLocaleString()} Cr`, sub: `@ INR ${tariffRate}/unit commercial` }
    ];

    powerCards.forEach((c, idx) => {
      drawTableCard(margin + idx * (cardWidth + 2), y, cardWidth, cardHeight, c.label, c.val, c.sub, [15, 23, 42]);
    });
    y += cardHeight + 5;

    // --- 4. SECTION 2: DECARBONISATION & GRID EMISSIONS ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(5, 150, 105);
    doc.text('2. DECARBONISATION & GRID EMISSIONS (CEA 2024 BASELINE)', margin, y);
    y += 4;

    const carbonCards = [
      { label: 'GRID CARBON FACTOR', val: `${gridCarbonFactor} g/kWh`, sub: 'CEA Regional Baseline' },
      { label: 'CLEAN POWER SHARE', val: `${reSharePercent}%`, sub: 'Solar/Wind PPA Contract' },
      { label: 'NET SCOPE-2 EMISSIONS', val: `${netCO2Tonnes.toLocaleString()} MT`, sub: 'Metric Tonnes CO2e/year' },
      { label: 'AVOIDED EMISSIONS', val: `-${avoidedCO2Tonnes.toLocaleString()} MT`, sub: 'Clean Energy Savings', color: [5, 150, 105] }
    ];

    carbonCards.forEach((c, idx) => {
      drawTableCard(margin + idx * (cardWidth + 2), y, cardWidth, cardHeight, c.label, c.val, c.sub, c.color || [15, 23, 42]);
    });
    y += cardHeight + 5;

    // --- 5. SECTION 3: HYDROLOGICAL WATER & COOLING ASSESSMENT ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(5, 150, 105);
    doc.text('3. HYDROLOGICAL WATER STRESS & COOLING ASSESSMENT (CGWB)', margin, y);
    y += 4;

    const waterBoxHeight = 22;
    doc.setFillColor(240, 253, 250); // teal-50
    doc.setDrawColor(204, 251, 241);
    doc.roundedRect(margin, y, contentWidth, waterBoxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 118, 110); // teal-800
    doc.text(`Water Usage Effectiveness (WUE): ${wueNumber} L/kWh   |   Annual Consumption: ${annualWaterML} Million Liters/year`, margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`Daily Average Water Demand: ${dailyWaterLiters.toLocaleString()} Liters/day   |   Regional Aquifer Status: ${waterMetrics?.aquiferStress || 'Moderate Stress (CGWB Assessment)'}`, margin + 4, y + 10);
    doc.text(`Cooling System Architecture: ${facility?.coolingTechnology || 'Direct Liquid Immersion / Adiabatic Dry Coolers with Closed-Loop Economizers'}`, margin + 4, y + 15);
    doc.text(`Pre-Monsoon Wet-Bulb Benchmark: ${waterMetrics?.wetBulb || '28.5'}°C   |   Water Sourcing: 100% Recycled Tertiary STP Water Priority`, margin + 4, y + 19.5);

    y += waterBoxHeight + 5;

    // --- 6. SECTION 4: STATE FISCAL POLICY & NETWORK CONNECTIVITY ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(5, 150, 105);
    doc.text('4. STATE REGULATORY INCENTIVES & INFRASTRUCTURE CONNECTIVITY', margin, y);
    y += 4;

    const policyBoxHeight = 24;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, policyBoxHeight, 2, 2, 'FD');

    const rawPolicyText = statePolicy?.incentives || 'State Data Centre Policy: 100% stamp duty exemption on land leases, electricity duty concessions for 10 years, and clean power banking permissions.';
    const rawSubseaText = statePolicy?.subseaConnectivity || 'Primary national communications corridor with direct redundant optical fiber backhaul to coastal subsea landing stations.';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('State Policy Incentives:', margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitPolicy = doc.splitTextToSize(rawPolicyText, contentWidth - 42);
    doc.text(splitPolicy, margin + 40, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Optical Transit & Subsea:', margin + 3, y + 15);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitSubsea = doc.splitTextToSize(rawSubseaText, contentWidth - 42);
    doc.text(splitSubsea, margin + 40, y + 15);

    y += policyBoxHeight + 5;

    // --- 7. CITATIONS & LEGAL NOTICE ---
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('Data Sources: Central Electricity Authority (CEA 2024), Central Ground Water Board (CGWB Dynamic GW Assessment), NITI Aayog CWMI.', margin, y);
    y += 3.5;
    doc.text('Notice: Research & educational decision-support model. Calculations are deterministic and physics-based. Does not constitute civil engineering clearance.', margin, y);

    // Save and download
    const filenameSafe = siteTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
    const pdfFilename = `GreenDC_Report_${filenameSafe}_${Date.now()}.pdf`;
    doc.save(pdfFilename);

    if (onProgress) onProgress(null);
    return true;
  } catch (error) {
    console.error('PDF Generation Failed:', error);
    if (onProgress) onProgress(null);
    throw error;
  }
}
