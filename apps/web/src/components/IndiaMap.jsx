import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, RotateCcw, Filter, MapPin, Building2, Zap, CheckCircle2, Clock, CalendarClock, ExternalLink } from 'lucide-react';
import indiaStatesGeo from '../data/indiaStatesGeo.json';
import { FACILITIES, STATE_SUMMARIES } from '../data/facilitiesData';
import StateDetailPanel from './StateDetailPanel';

// Custom Map Controller to handle programmatic pan and zoom
function MapController({ selectedState, geoJsonData }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedState) {
      map.setView([22.5, 82.0], 5);
      return;
    }

    // Find the feature for the selected state and zoom to bounds
    const feature = geoJsonData.features.find(
      (f) => f.properties.name.toLowerCase() === selectedState.toLowerCase()
    );

    if (feature) {
      try {
        const layer = L.geoJSON(feature);
        const bounds = layer.getBounds();
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7, animate: true });
      } catch (e) {
        console.error('Error fitting bounds for state:', selectedState, e);
      }
    }
  }, [selectedState, geoJsonData, map]);

  return null;
}

// Marker icon generator using clean SVG/CSS
function getFacilityMarkerIcon(status) {
  const isOp = status === 'Operational';
  const isUc = status === 'Under Construction';
  const color = isOp ? '#10b981' : isUc ? '#f59e0b' : '#94a3b8';
  const glow = isOp ? 'rgba(16, 185, 129, 0.4)' : isUc ? 'rgba(245, 158, 11, 0.4)' : 'rgba(148, 163, 184, 0.3)';

  return L.divIcon({
    className: 'facility-marker-div',
    html: `
      <div style="
        position: relative;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      ">
        <div style="
          position: absolute;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${color};
          opacity: 0.35;
          animation: ${isOp ? 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none'};
        "></div>
        <div style="
          position: relative;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${color};
          border: 2px solid #090d16;
          box-shadow: 0 0 12px ${glow};
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -14]
  });
}

export default function IndiaMap({ onSelectStateFromOutside }) {
  const [selectedState, setSelectedState] = useState(null);
  const [typeFilter, setTypeFilter] = useState('All'); // All, Hyperscale, Colocation, Edge
  const [statusFilter, setStatusFilter] = useState('All'); // All, Operational, Under Construction, Planned
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredState, setHoveredState] = useState(null);

  const geoJsonRef = useRef(null);

  // Filtered facilities list
  const filteredFacilities = useMemo(() => {
    return FACILITIES.filter((fac) => {
      const matchType = typeFilter === 'All' || fac.facilityType === typeFilter;
      const matchStatus = statusFilter === 'All' || fac.status === statusFilter;
      const matchState = !selectedState || fac.state.toLowerCase() === selectedState.toLowerCase();
      return matchType && matchStatus && matchState;
    });
  }, [typeFilter, statusFilter, selectedState]);

  // List of all unique state names for search dropdown
  const allStateNames = useMemo(() => {
    return indiaStatesGeo.features
      .map((f) => f.properties.name)
      .sort((a, b) => a.localeCompare(b));
  }, []);

  // Filtered state names for search autocomplete
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allStateNames.filter((name) =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allStateNames]);

  // Handle State Selection
  const handleSelectState = (stateName) => {
    setSelectedState(stateName);
    setSearchQuery('');
    if (onSelectStateFromOutside) onSelectStateFromOutside(stateName);
  };

  const handleReset = () => {
    setSelectedState(null);
    setTypeFilter('All');
    setStatusFilter('All');
    setSearchQuery('');
  };

  // GeoJSON styling logic
  const getFeatureStyle = (feature) => {
    const stateName = feature.properties.name;
    const isSelected = selectedState && selectedState.toLowerCase() === stateName.toLowerCase();
    const isHovered = hoveredState && hoveredState.toLowerCase() === stateName.toLowerCase();
    const hasFacilities = Boolean(STATE_SUMMARIES[stateName]);

    if (isSelected) {
      return {
        fillColor: '#059669',
        fillOpacity: 0.45,
        color: '#34d399',
        weight: 2.5,
        dashArray: ''
      };
    }

    if (isHovered) {
      return {
        fillColor: hasFacilities ? '#10b981' : '#334155',
        fillOpacity: hasFacilities ? 0.35 : 0.25,
        color: '#6ee7b7',
        weight: 1.8,
        dashArray: ''
      };
    }

    return {
      fillColor: hasFacilities ? '#064e3b' : '#0f172a',
      fillOpacity: hasFacilities ? 0.25 : 0.08,
      color: hasFacilities ? '#10b981' : '#334155',
      weight: hasFacilities ? 1.2 : 0.8,
      dashArray: hasFacilities ? '' : '3'
    };
  };

  // GeoJSON interaction callbacks
  const onEachFeature = (feature, layer) => {
    const stateName = feature.properties.name;
    const summary = STATE_SUMMARIES[stateName];
    const count = summary ? summary.facilityCount : 0;

    layer.on({
      mouseover: () => setHoveredState(stateName),
      mouseout: () => setHoveredState(null),
      click: () => handleSelectState(stateName)
    });

    layer.bindTooltip(
      `<div class="text-xs font-sans">
        <strong class="text-white">${stateName}</strong>
        <div class="text-slate-300 text-[10px] mt-0.5">
          ${count > 0 ? `${count} facility records` : 'No curated records'}
        </div>
      </div>`,
      { sticky: true, className: 'leaflet-custom-tooltip' }
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        {/* Search & State Filter */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Indian State or UT (e.g. Maharashtra, UP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-h-56 overflow-y-auto z-50 divide-y divide-slate-800/60">
              {searchResults.map((name) => {
                const count = STATE_SUMMARIES[name]?.facilityCount || 0;
                return (
                  <button
                    key={name}
                    onClick={() => handleSelectState(name)}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800/80 flex items-center justify-between transition"
                  >
                    <span className="text-slate-200 font-medium">{name}</span>
                    <span className="text-[10px] text-slate-400">
                      {count > 0 ? `${count} facilities` : 'No records'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Type Filter Pills (Inspired by Yotta's All / Hyperscale / Edge selector) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider px-2 font-medium">Type:</span>
          {['All', 'Hyperscale', 'Colocation', 'Edge'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                typeFilter === type
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider px-2 font-medium">Status:</span>
          {['All', 'Operational', 'Under Construction', 'Planned'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                statusFilter === status
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Reset View Button */}
        {(selectedState || typeFilter !== 'All' || statusFilter !== 'All') && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700/60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Map
          </button>
        )}
      </div>

      {/* Main Map + Intelligence Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Map Container (takes 8 cols on large screen or 12 if no state selected) */}
        <div
          className={`${
            selectedState ? 'lg:col-span-8' : 'lg:col-span-12'
          } bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative transition-all duration-300`}
          style={{ height: '720px' }}
        >
          {/* Active selection banner overlay */}
          <div className="absolute top-4 left-4 z-[400] bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-slate-200 shadow-xl flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            {selectedState ? (
              <span>
                Exploring State: <strong className="text-emerald-400">{selectedState}</strong>
              </span>
            ) : (
              <span>Click any Indian state or facility pin to inspect intelligence</span>
            )}
          </div>

          {/* Floating Map Legend (Bottom Left) */}
          <div className="absolute bottom-4 left-4 z-[400] bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs text-slate-300 shadow-xl space-y-1.5 max-w-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Facility Status & Boundaries
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-slate-900 shadow-sm shadow-emerald-500/50"></span>
              <span className="text-[11px] text-slate-200">Operational Hyperscale / DC</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-slate-900 shadow-sm shadow-amber-500/50"></span>
              <span className="text-[11px] text-slate-200">Under Construction</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400 border border-slate-900"></span>
              <span className="text-[11px] text-slate-200">Planned / Announced</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
              <span className="w-3 h-3 rounded bg-emerald-950 border border-emerald-500/60"></span>
              <span className="text-[10px] text-slate-400">States with Curated Records</span>
            </div>
          </div>

          {/* Leaflet Map */}
          <MapContainer
            center={[22.5, 82.0]}
            zoom={5}
            minZoom={4}
            maxZoom={10}
            scrollWheelZoom={true}
            className="w-full h-full dark-tiles"
          >
            {/* OpenStreetMap Tile Provider */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Programmatic Zoom & Pan Controller */}
            <MapController selectedState={selectedState} geoJsonData={indiaStatesGeo} />

            {/* GeoJSON State Boundaries */}
            <GeoJSON
              ref={geoJsonRef}
              data={indiaStatesGeo}
              style={getFeatureStyle}
              onEachFeature={onEachFeature}
            />

            {/* Facility Markers */}
            {filteredFacilities.map((fac) => (
              <Marker
                key={fac.id}
                position={fac.coordinates}
                icon={getFacilityMarkerIcon(fac.status)}
              >
                <Popup>
                  <div className="p-1 space-y-2">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-1.5">
                      <div>
                        <h4 className="font-bold text-sm text-white">{fac.name}</h4>
                        <p className="text-[11px] text-slate-400">{fac.operator}</p>
                      </div>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          fac.status === 'Operational'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : fac.status === 'Under Construction'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {fac.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      <strong>Location:</strong> {fac.city}, {fac.state}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block">IT Power</span>
                        <strong className="text-emerald-400">
                          {fac.reportedCapacityMW ? `${fac.reportedCapacityMW} MW` : 'Undisclosed'}
                        </strong>
                      </div>
                      {fac.reportedRacks && (
                        <div>
                          <span className="text-[10px] text-slate-400 block">Racks</span>
                          <strong>{fac.reportedRacks.toLocaleString()}</strong>
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] text-slate-400 block">Type</span>
                        <strong>{fac.facilityType}</strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-snug">{fac.address}</p>

                    <div className="pt-1.5 flex items-center justify-between border-t border-slate-800 text-[10px] text-slate-400">
                      <span className="italic">{fac.verificationTier.replace(/_/g, ' ')}</span>
                      {fac.sourceUrl && (
                        <a
                          href={fac.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        >
                          Details <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* State Detail Intelligence Panel */}
        {selectedState && (
          <div className="lg:col-span-4">
            <StateDetailPanel
              stateName={selectedState}
              onClose={() => setSelectedState(null)}
            />
          </div>
        )}
      </div>

      {/* Map Disclaimer Footer */}
      <div className="text-[11px] text-slate-500 bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl flex items-start gap-2">
        <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-400">Geospatial Data & Representation Notice:</span> State boundaries are derived from simplified open geographical data (OpenStreetMap / DataMeet) for responsive web rendering. Facility markers reflect publicly disclosed corporate campuses and do not claim to show every enterprise server room or captive telecom pop in India.
        </div>
      </div>
    </div>
  );
}
