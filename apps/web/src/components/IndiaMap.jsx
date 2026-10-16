import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Search,
  RotateCcw,
  Filter,
  MapPin,
  Building2,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  ExternalLink,
  Navigation,
  Compass,
  ArrowRight,
  Boxes,
  Map as MapIcon,
  Eye,
  Camera,
  Wind
} from 'lucide-react';
import indiaStatesGeo from '../data/indiaStatesGeo.json';
import { FACILITIES, STATE_SUMMARIES } from '../data/facilitiesData';
import StateDetailPanel from './StateDetailPanel';
import India3DCanvas, { CAMERA_PRESETS } from './India3DCanvas';

// Key Indian Data Center Hubs for quick navigation
const DC_HUBS = [
  { name: 'All India', coords: [22.5, 82.0], zoom: 5, cam3D: 'overview' },
  { name: 'Mumbai MMR', coords: [19.0760, 73.0135], zoom: 10, state: 'Maharashtra', cam3D: 'mumbai' },
  { name: 'Delhi-NCR', coords: [28.5355, 77.3910], zoom: 10, state: 'Uttar Pradesh', cam3D: 'ncr' },
  { name: 'Bengaluru', coords: [12.8452, 77.6602], zoom: 11, state: 'Karnataka', cam3D: 'south' },
  { name: 'Hyderabad', coords: [17.4474, 78.3762], zoom: 11, state: 'Telangana', cam3D: 'south' },
  { name: 'Chennai', coords: [12.8258, 80.2185], zoom: 11, state: 'Tamil Nadu', cam3D: 'south' },
  { name: 'GIFT City', coords: [23.1610, 72.6840], zoom: 11, state: 'Gujarat', cam3D: 'gujarat' },
  { name: 'Guwahati', coords: [26.1158, 91.5868], zoom: 10, state: 'Assam', cam3D: 'overview' }
];

function MapController({ targetCenter, targetZoom, selectedState, geoJsonData }) {
  const map = useMap();

  useEffect(() => {
    if (targetCenter && targetZoom) {
      map.flyTo(targetCenter, targetZoom, { duration: 1.2, easeLinearity: 0.25 });
      return;
    }

    if (!selectedState) {
      map.flyTo([22.5, 82.0], 5, { duration: 1.2 });
      return;
    }

    const feature = geoJsonData.features.find(
      (f) => f.properties.name.toLowerCase() === selectedState.toLowerCase()
    );

    if (feature) {
      try {
        const layer = L.geoJSON(feature);
        const bounds = layer.getBounds();
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7, animate: true });
      } catch (e) {
        console.error('Error fitting bounds:', e);
      }
    }
  }, [targetCenter, targetZoom, selectedState, geoJsonData, map]);

  return null;
}

// Custom Marker generator with green glowing animations
function getFacilityMarkerIcon(status) {
  const isOp = status === 'Operational';
  const isUc = status === 'Under Construction';
  const color = isOp ? '#059669' : isUc ? '#d97706' : '#64748b';
  const glow = isOp ? 'rgba(5, 150, 105, 0.4)' : isUc ? 'rgba(217, 119, 6, 0.4)' : 'rgba(100, 116, 139, 0.3)';

  return L.divIcon({
    className: 'facility-marker-div',
    html: `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: ${color}; opacity: 0.25; animation: ${isOp ? 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none'};"></div>
        <div style="position: relative; width: 14px; height: 14px; border-radius: 50%; background: ${color}; border: 2.5px solid #ffffff; box-shadow: 0 2px 10px ${glow};"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -14]
  });
}

export default function IndiaMap({ onNavigateToSimulatorWithFacility, preselectedFacility }) {
  const [viewMode, setViewMode] = useState('3d');
  const [activeCam3D, setActiveCam3D] = useState('overview');
  const [selectedState, setSelectedState] = useState(preselectedFacility ? preselectedFacility.state : null);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeHub, setActiveHub] = useState('All India');
  const [targetView, setTargetView] = useState({ center: [22.5, 82.0], zoom: 5 });

  const geoJsonRef = useRef(null);

  useEffect(() => {
    if (preselectedFacility) {
      setTargetView({
        center: preselectedFacility.coordinates,
        zoom: 11
      });
      setSelectedState(preselectedFacility.state);
    }
  }, [preselectedFacility]);

  const filteredFacilities = useMemo(() => {
    return FACILITIES.filter((fac) => {
      const matchSearch = !searchQuery ||
        fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = typeFilter === 'All' || fac.facilityType === typeFilter;
      const matchStatus = statusFilter === 'All' || fac.status === statusFilter;
      const matchState = !selectedState || fac.state.toLowerCase() === selectedState.toLowerCase();
      return matchSearch && matchType && matchStatus && matchState;
    });
  }, [searchQuery, typeFilter, statusFilter, selectedState]);

  const handleHubClick = (hub) => {
    setActiveHub(hub.name);
    setTargetView({ center: hub.coords, zoom: hub.zoom });
    if (hub.cam3D) {
      setActiveCam3D(hub.cam3D);
    }
    if (hub.state) {
      setSelectedState(hub.state);
    } else {
      setSelectedState(null);
    }
  };

  // State Polygon Styles (Light & Green)
  const getFeatureStyle = (feature) => {
    const stateName = feature.properties.name;
    const isSelected = selectedState && stateName.toLowerCase() === selectedState.toLowerCase();
    const hasData = STATE_SUMMARIES[stateName];

    return {
      fillColor: isSelected ? '#10b981' : hasData ? '#86efac' : '#f1f5f9',
      weight: isSelected ? 2.5 : 1,
      opacity: 0.9,
      color: isSelected ? '#047857' : '#059669',
      fillOpacity: isSelected ? 0.45 : hasData ? 0.25 : 0.1,
      dashArray: isSelected ? '' : '3'
    };
  };

  const onEachFeature = (feature, layer) => {
    const stateName = feature.properties.name;
    const summary = STATE_SUMMARIES[stateName];

    layer.on({
      click: () => {
        setSelectedState(stateName);
      },
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          fillOpacity: 0.5,
          weight: 2,
          color: '#047857'
        });
      },
      mouseout: (e) => {
        if (geoJsonRef.current) {
          geoJsonRef.current.resetStyle(e.target);
        }
      }
    });

    const tooltipContent = summary
      ? `<strong>${stateName}</strong><br/>${summary.facilityCount} Campuses • ${summary.knownCapacityMW || 0} MW IT Load`
      : `<strong>${stateName}</strong><br/>Baseline Coverage`;

    layer.bindTooltip(tooltipContent, {
      sticky: true,
      className: 'bg-white text-slate-800 text-xs px-2.5 py-1.5 rounded-xl border border-emerald-300 shadow-md font-sans'
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      {/* View Mode & Hubs Toolbar */}
      <div className="eco-card p-4 sm:p-5 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 uppercase tracking-widest font-bold">
              <Compass className="w-4 h-4 text-emerald-600" /> Geospatial Siting Intelligence
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-heading mt-0.5">
              India Geospatial & Environmental Explorer
            </h2>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === '3d'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              3D Spatial Hologram
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === '2d'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              2D Detailed GIS Map
            </button>
          </div>
        </div>

        {/* Focus Hubs Quick Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-slate-100">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 shrink-0 flex items-center gap-1 mr-1">
            <Compass className="w-3 h-3 text-emerald-600" /> Focus Hub:
          </span>
          {DC_HUBS.map((hub) => (
            <button
              key={hub.name}
              onClick={() => handleHubClick(hub)}
              className={`text-[11px] px-2.5 py-1 rounded-xl whitespace-nowrap transition font-medium ${
                activeHub === hub.name
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
              }`}
            >
              {hub.name}
            </button>
          ))}
        </div>

        {/* 2D Filters & Search */}
        {viewMode === '2d' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search campus or city..."
                  className="bg-white border border-slate-200 text-xs text-slate-900 rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 w-44 shadow-sm"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white border border-slate-200 text-xs text-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 shadow-sm"
              >
                <option value="All">All Types</option>
                <option value="Hyperscale">Hyperscale</option>
                <option value="Colocation">Colocation</option>
                <option value="Edge">Edge</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 text-xs text-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 shadow-sm"
              >
                <option value="All">All Statuses</option>
                <option value="Operational">Operational</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Planned">Planned</option>
              </select>

              {selectedState && (
                <button
                  onClick={() => setSelectedState(null)}
                  className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl flex items-center gap-1.5 hover:bg-emerald-100 transition font-semibold"
                >
                  <span>{selectedState}</span>
                  <span className="text-emerald-700 font-bold">×</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono">
              <span className="text-emerald-700 font-bold">{filteredFacilities.length} campuses visible</span>
              <button
                onClick={() => {
                  setSelectedState(null);
                  setSearchQuery('');
                  setTypeFilter('All');
                  setStatusFilter('All');
                  handleHubClick(DC_HUBS[0]);
                }}
                className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map / 3D Canvas */}
        <div className={`transition-all duration-300 ${selectedState ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          {viewMode === '3d' ? (
            <div className="space-y-3">
              <India3DCanvas
                activeCameraPreset={activeCam3D}
                onCameraChange={(camId) => setActiveCam3D(camId)}
                onSelectFacility={(fac) => {
                  setSelectedState(fac.state);
                }}
                height="620px"
                showControls={true}
              />
            </div>
          ) : (
            <div className="eco-card rounded-3xl border border-slate-200 overflow-hidden shadow-md relative h-[620px] bg-white">
              <MapContainer
                center={targetView.center}
                zoom={targetView.zoom}
                scrollWheelZoom={true}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                <MapController
                  targetCenter={targetView.center}
                  targetZoom={targetView.zoom}
                  selectedState={selectedState}
                  geoJsonData={indiaStatesGeo}
                />

                {/* State GeoJSON Polygons in Light Green */}
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
                      <div className="space-y-2 text-slate-800 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">
                            {fac.operator}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                            fac.status === 'Operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {fac.status}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 font-heading">
                          {fac.name}
                        </h4>

                        <p className="text-[11px] text-slate-600">
                          📍 {fac.city}, {fac.state}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-200">
                          <div>
                            <span className="text-[10px] text-slate-500 block">IT Load</span>
                            <span className="font-bold text-emerald-700 font-mono">
                              {fac.reportedCapacityMW ? `${fac.reportedCapacityMW} MW` : 'Undisclosed'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Racks</span>
                            <span className="font-bold text-slate-700 font-mono">
                              {fac.reportedRacks ? fac.reportedRacks.toLocaleString() : '—'}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <button
                            onClick={() => setSelectedState(fac.state)}
                            className="text-slate-600 hover:text-slate-900 font-medium"
                          >
                            State Dossier
                          </button>
                          {onNavigateToSimulatorWithFacility && (
                            <button
                              onClick={() => onNavigateToSimulatorWithFacility(fac)}
                              className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                            >
                              Simulate <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </div>

        {/* State Detail Panel Drawer */}
        {selectedState && (
          <div className="lg:col-span-4 h-[620px]">
            <StateDetailPanel
              stateName={selectedState}
              onClose={() => setSelectedState(null)}
              onNavigateToSimulatorWithFacility={onNavigateToSimulatorWithFacility}
            />
          </div>
        )}
      </div>
    </div>
  );
}
