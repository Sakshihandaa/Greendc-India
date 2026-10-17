import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Camera, Compass, Eye, RotateCw, ZoomIn, ZoomOut, Zap, Server, Shield, Wind, Sparkles, Play, Pause, Layers } from 'lucide-react';
import { FACILITIES, STATE_SUMMARIES } from '../data/facilitiesData';
import indiaStatesGeo from '../data/indiaStatesGeo.json';

// Geographic center and bounds for India
const MIN_LNG = 67.0;
const MAX_LNG = 98.5;
const MIN_LAT = 6.5;
const MAX_LAT = 37.5;

const CENTER_LAT = 22.5;
const CENTER_LNG = 82.5;
const SCALE = 0.55;

export function geoTo3D(lat, lng) {
  const x = (lng - CENTER_LNG) * SCALE;
  const z = -(lat - CENTER_LAT) * SCALE;
  return { x, z };
}

// Major Clean Energy Hubs in India
const RENEWABLE_HUBS = [
  { id: 'khavda', name: 'Khavda Hybrid Renewable Park (30 GW)', state: 'Gujarat', lat: 23.95, lng: 69.83, type: 'Solar + Wind' },
  { id: 'bhadla', name: 'Bhadla Mega Solar Park (2.24 GW)', state: 'Rajasthan', lat: 27.53, lng: 71.91, type: 'Solar PV' },
  { id: 'pavagada', name: 'Pavagada Solar Park (2.05 GW)', state: 'Karnataka', lat: 14.28, lng: 77.27, type: 'Solar PV' },
  { id: 'muppandal', name: 'Muppandal Onshore Wind Farm (1.5 GW)', state: 'Tamil Nadu', lat: 8.25, lng: 77.54, type: 'Wind Turbine' }
];

export const CAMERA_PRESETS = [
  { id: 'cinematic', label: 'Cinematic Orbit', eye: [0, 16, 21], target: [0, 0, 0] },
  { id: 'overview', label: 'Tactical Overview', eye: [0, 24, 4], target: [0, 0, -0.5] },
  { id: 'rajasthan', label: 'Solar Capital (Rajasthan 2.2 GW)', eye: [-4.2, 9.5, -2.8], target: [-4.0, 0, -2.5] },
  { id: 'gujarat', label: 'Renewable Belt (GIFT / Kutch)', eye: [-6.5, 8.5, 2.5], target: [-5.2, 0, -0.4] },
  { id: 'mumbai', label: 'West Corridor (Mumbai 155 MW)', eye: [-4.5, 7.5, 6.5], target: [-4.2, 0, 1.8] },
  { id: 'south', label: 'South Triangle (BLR-CHE-HYD)', eye: [1.8, 8.5, 9.5], target: [0, 0, 4.5] },
  { id: 'ncr', label: 'North Corridor (NCR 78 MW)', eye: [-0.6, 7.5, -4.5], target: [-2.2, 0, -3.2] },
  { id: 'himachal', label: 'Cold Hydro AI Edge (HP PUE 1.15)', eye: [-1.8, 8.0, -6.5], target: [-2.0, 0, -4.8] }
];

export default function India3DCanvas({
  activeCameraPreset = 'cinematic',
  onCameraChange,
  onSelectFacility,
  selectedFacilityId,
  interactive = true,
  height = '540px',
  showControls = true
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const objectsGroupRef = useRef(null);

  const [currentCamera, setCurrentCamera] = useState(activeCameraPreset);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const targetCamPos = useRef(new THREE.Vector3(0, 16, 21));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });

  // Sync external camera preset
  useEffect(() => {
    if (activeCameraPreset) {
      const preset = CAMERA_PRESETS.find(p => p.id === activeCameraPreset);
      if (preset) {
        targetCamPos.current.set(...preset.eye);
        targetLookAt.current.set(...preset.target);
        setCurrentCamera(activeCameraPreset);
      }
    }
  }, [activeCameraPreset]);

  // Generate high-definition geographic texture for India
  const mapTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    // 1. Surrounding Ocean Floor Background
    ctx.fillStyle = '#eaf0f6';
    ctx.fillRect(0, 0, 2048, 2048);

    // Soft water bathymetry grid lines
    ctx.strokeStyle = '#d7e3ec';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < 2048; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 2048);
      ctx.stroke();
    }
    for (let y = 0; y < 2048; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(2048, y);
      ctx.stroke();
    }

    // Helper: Longitude/Latitude to Canvas X, Y
    const toCanvasX = (lng) => ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 2048;
    const toCanvasY = (lat) => (1 - (lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * 2048;

    // Palette of vibrant, distinguished eco-green state fills
    const STATE_COLORS = [
      '#ecfdf5', // emerald-50
      '#e6f4ea', // soft mint
      '#dcfce7', // green-100
      '#f0fdf4', // emerald-25
      '#d1fae5', // emerald-100
      '#e0f2fe'  // sky coastal tint
    ];

    // 2. Render State Polygons
    indiaStatesGeo.features.forEach((feature, idx) => {
      const geom = feature.geometry;
      if (!geom) return;

      const polygons = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
      const fillColor = STATE_COLORS[idx % STATE_COLORS.length];

      polygons.forEach((polygon) => {
        const ring = polygon[0];
        if (!ring || ring.length < 3) return;

        ctx.beginPath();
        ring.forEach(([lng, lat], i) => {
          const cx = toCanvasX(lng);
          const cy = toCanvasY(lat);
          if (i === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        });
        ctx.closePath();

        // Fill State with clean eco-green
        ctx.fillStyle = fillColor;
        ctx.fill();

        // Internal State Boundaries (Crisp Emerald Green)
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });
    });

    // 3. Highlight National Perimeter & Coastline with Deep Emerald
    indiaStatesGeo.features.forEach((feature) => {
      const geom = feature.geometry;
      if (!geom) return;
      const polygons = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;

      polygons.forEach((polygon) => {
        const ring = polygon[0];
        if (!ring || ring.length < 3) return;

        ctx.beginPath();
        ring.forEach(([lng, lat], i) => {
          const cx = toCanvasX(lng);
          const cy = toCanvasY(lat);
          if (i === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        });
        ctx.closePath();
        ctx.strokeStyle = '#047857';
        ctx.lineWidth = 4;
        ctx.stroke();
      });
    });

    // 4. Subtle Ambient Vignette
    const radial = ctx.createRadialGradient(1024, 1024, 400, 1024, 1024, 1024);
    radial.addColorStop(0, 'rgba(255, 255, 255, 0)');
    radial.addColorStop(1, 'rgba(16, 185, 129, 0.08)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 2048, 2048);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup (Crisp Eco-Tech Light Atmosphere)
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf8fafc); // Clean light slate
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.018);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 16, 21);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting (Bright natural sunlight with emerald ambient bounce)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(15, 30, 15);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const emeraldBounce = new THREE.DirectionalLight(0x10b981, 0.45);
    emeraldBounce.position.set(-18, 20, -18);
    scene.add(emeraldBounce);

    const group = new THREE.Group();
    objectsGroupRef.current = group;
    scene.add(group);

    // 5. Ocean Base Floor
    const oceanGeo = new THREE.PlaneGeometry(55, 55);
    const oceanMat = new THREE.MeshBasicMaterial({ color: 0xf1f5f9 });
    const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    oceanMesh.rotation.x = -Math.PI / 2;
    oceanMesh.position.y = -0.05;
    scene.add(oceanMesh);

    const gridHelper = new THREE.GridHelper(36, 36, 0xa7f3d0, 0xe2e8f0);
    gridHelper.position.y = -0.03;
    scene.add(gridHelper);

    // 6. PROMINENT SOLID INDIA LANDMASS (Texture-Mapped Relief with Elevated Borders)
    const mapWidth3D = (MAX_LNG - MIN_LNG) * SCALE;
    const mapHeight3D = (MAX_LAT - MIN_LAT) * SCALE;
    const landGeo = new THREE.PlaneGeometry(mapWidth3D, mapHeight3D);
    const landMat = new THREE.MeshStandardMaterial({
      map: mapTexture,
      roughness: 0.65,
      metalness: 0.1
    });

    const landMesh = new THREE.Mesh(landGeo, landMat);
    landMesh.rotation.x = -Math.PI / 2;
    // Align center with coordinates
    const centerOffset = geoTo3D((MIN_LAT + MAX_LAT) / 2, (MIN_LNG + MAX_LNG) / 2);
    landMesh.position.set(centerOffset.x, 0.02, centerOffset.z);
    group.add(landMesh);

    // 7. 3D Elevated Outer Coastline & National Boundary Relief
    const borderMat = new THREE.LineBasicMaterial({
      color: 0x047857,
      linewidth: 3,
      transparent: true,
      opacity: 0.95
    });

    indiaStatesGeo.features.forEach((feature) => {
      const geom = feature.geometry;
      if (!geom) return;
      const polygons = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;

      polygons.forEach((polygonCoords) => {
        const ring = polygonCoords[0];
        if (!ring || ring.length < 3) return;

        const points = ring.map(([lng, lat]) => {
          const { x, z } = geoTo3D(lat, lng);
          return new THREE.Vector3(x, 0.05, z);
        });

        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const borderLine = new THREE.Line(lineGeo, borderMat);
        group.add(borderLine);
      });
    });

    // 8. 3D Data Centre Facility Towers (Emerald / Amber with Pulsing Beacon Gems)
    const nodeMeshes = [];
    FACILITIES.forEach((fac) => {
      const [lat, lng] = fac.coordinates;
      const { x, z } = geoTo3D(lat, lng);
      const capacity = fac.reportedCapacityMW || 15;
      const towerHeight = Math.max(0.8, (capacity / 50) * 2.8);

      const isOp = fac.status === 'Operational';
      const towerColor = isOp ? 0x059669 : 0xd97706;

      // Vertical Tower Pillar
      const pillarGeo = new THREE.CylinderGeometry(0.2, 0.25, towerHeight, 16);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: towerColor,
        roughness: 0.15,
        metalness: 0.7,
        emissive: towerColor,
        emissiveIntensity: 0.35
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, towerHeight / 2 + 0.05, z);
      pillar.userData = { facility: fac, height: towerHeight, x, z };
      group.add(pillar);
      nodeMeshes.push(pillar);

      // Top Pulsing Beacon Crystal
      const beaconGeo = new THREE.SphereGeometry(0.24, 16, 16);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: isOp ? 0x10b981 : 0xf59e0b,
        emissive: isOp ? 0x10b981 : 0xf59e0b,
        emissiveIntensity: 0.85
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(x, towerHeight + 0.28, z);
      group.add(beacon);

      // Radiating Base Concentric Rings
      const ringGeo = new THREE.RingGeometry(0.35, 0.55, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: towerColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(x, 0.06, z);
      group.add(ring);
    });

    // 9. Renewable Mega-Parks (Khavda, Bhadla, Pavagada, Muppandal)
    const reNodes = [];
    RENEWABLE_HUBS.forEach((re) => {
      const { x, z } = geoTo3D(re.lat, re.lng);
      reNodes.push({ x, z, hub: re });

      // Clean Energy Diamond / Octahedron
      const reGeo = new THREE.OctahedronGeometry(0.42);
      const reMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7, // Sky Cyan
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.9,
        metalness: 0.8
      });
      const reMesh = new THREE.Mesh(reGeo, reMat);
      reMesh.position.set(x, 0.6, z);
      reMesh.userData = { hub: re };
      group.add(reMesh);

      // Base Halo
      const haloGeo = new THREE.RingGeometry(0.4, 0.65, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x0284c7,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 2;
      halo.position.set(x, 0.06, z);
      group.add(halo);
    });

    // 10. DYNAMIC GREEN ENERGY TRANSMISSION ARCS & PHOTON PACKETS
    const energyArcs = [];
    const photonPackets = [];

    // Connect Renewable Hubs to Major DC Clusters
    const corridorPairs = [
      { from: reNodes[0], toIdx: 0 }, // Khavda -> Mumbai
      { from: reNodes[0], toIdx: 1 }, // Khavda -> Navi Mumbai 2
      { from: reNodes[1], toIdx: 4 }, // Bhadla -> Greater Noida
      { from: reNodes[1], toIdx: 5 }, // Bhadla -> Noida
      { from: reNodes[2], toIdx: 6 }, // Pavagada -> Bengaluru
      { from: reNodes[2], toIdx: 8 }, // Pavagada -> Hyderabad
      { from: reNodes[3], toIdx: 7 }  // Muppandal -> Chennai
    ];

    corridorPairs.forEach((pair) => {
      if (!pair.from || !nodeMeshes[pair.toIdx]) return;
      const target = nodeMeshes[pair.toIdx];

      const start = new THREE.Vector3(pair.from.x, 0.6, pair.from.z);
      const end = new THREE.Vector3(target.position.x, target.userData.height, target.position.z);
      const dist = start.distanceTo(end);
      const mid = new THREE.Vector3(
        (start.x + end.x) / 2,
        Math.max(2.5, dist * 0.45),
        (start.z + end.z) / 2
      );

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const curvePoints = curve.getPoints(50);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const curveMat = new THREE.LineDashedMaterial({
        color: 0x10b981,
        dashSize: 0.35,
        gapSize: 0.25,
        transparent: true,
        opacity: 0.75
      });
      const arcLine = new THREE.Line(curveGeo, curveMat);
      arcLine.computeLineDistances();
      group.add(arcLine);
      energyArcs.push(curveMat);

      // Add a travelling Photon Energy Packet
      const photonGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const photonMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
      const photonMesh = new THREE.Mesh(photonGeo, photonMat);
      group.add(photonMesh);
      photonPackets.push({ mesh: photonMesh, curve, progress: Math.random() });
    });

    // 11. MONSOONAL WIND VECTOR STREAMLINE SIMULATION (SW TO NE FLOW)
    const windLineCount = 18;
    const windStreamlines = [];

    for (let i = 0; i < windLineCount; i++) {
      // Start in Arabian Sea (SW)
      const startX = -9 + Math.random() * 4;
      const startZ = 4 + Math.random() * 8;
      const length = 12 + Math.random() * 8;
      const points = [];

      for (let p = 0; p < 15; p++) {
        const t = p / 14;
        const curX = startX + t * length + Math.sin(t * Math.PI) * 1.5;
        const curY = 0.5 + Math.sin(t * Math.PI) * 1.8 + (Math.random() - 0.5) * 0.2;
        const curZ = startZ - t * (length * 1.1) + Math.cos(t * Math.PI) * 1.2;
        points.push(new THREE.Vector3(curX, curY, curZ));
      }

      const streamGeo = new THREE.BufferGeometry().setFromPoints(points);
      const streamMat = new THREE.LineDashedMaterial({
        color: 0x059669,
        dashSize: 0.8,
        gapSize: 0.6,
        transparent: true,
        opacity: 0.45
      });
      const streamLine = new THREE.Line(streamGeo, streamMat);
      streamLine.computeLineDistances();
      group.add(streamLine);
      windStreamlines.push({ line: streamLine, mat: streamMat, offset: Math.random() });
    }

    // 12. Floating Atmospheric Micro-Particle Field
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleDrifts = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 22;
      particlePositions[i * 3 + 1] = 0.3 + Math.random() * 3.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 24;
      particleDrifts.push({
        vx: 0.02 + Math.random() * 0.025,
        vz: -(0.015 + Math.random() * 0.02)
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x059669,
      size: 0.18,
      transparent: true,
      opacity: 0.6
    });
    const atmosphericField = new THREE.Points(particleGeo, particleMat);
    scene.add(atmosphericField);

    // 13. Raycasting & Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      if (intersects.length > 0) {
        setHoveredNode(intersects[0].object.userData.facility);
        container.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        container.style.cursor = isDragging.current ? 'grabbing' : 'grab';
      }

      if (isDragging.current && interactive) {
        const deltaX = e.clientX - prevMousePos.current.x;
        group.rotation.y += deltaX * 0.005;
        prevMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerDown = (e) => {
      isDragging.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
      container.style.cursor = 'grabbing';
    };

    const onPointerUp = () => {
      isDragging.current = false;
      container.style.cursor = 'grab';
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      if (intersects.length > 0 && onSelectFacility) {
        onSelectFacility(intersects[0].object.userData.facility);
      }
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('click', onClick);

    // 14. Smooth Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera interpolation
      camera.position.lerp(targetCamPos.current, 0.045);
      camera.lookAt(targetLookAt.current);

      // Subtle auto-orbit when enabled
      if (autoRotate && !isDragging.current && currentCamera === 'cinematic') {
        group.rotation.y = Math.sin(elapsed * 0.15) * 0.18;
      }

      // Animate Renewable Energy Photon Packets along Arcs
      photonPackets.forEach((p) => {
        p.progress = (p.progress + 0.008) % 1.0;
        const pt = p.curve.getPoint(p.progress);
        p.mesh.position.copy(pt);
      });

      // Animate Monsoonal Wind Streamline Dashes
      windStreamlines.forEach((s) => {
        s.mat.dashSize = 0.8 + 0.3 * Math.sin(elapsed * 3 + s.offset * 10);
      });

      // Animate Atmospheric Micro-Particles
      const positions = atmosphericField.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particleDrifts[i].vx;
        positions[i * 3 + 2] += particleDrifts[i].vz;

        if (positions[i * 3] > 12) positions[i * 3] = -12;
        if (positions[i * 3 + 2] < -13) positions[i * 3 + 2] = 13;
      }
      atmosphericField.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('click', onClick);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mapTexture, autoRotate]);

  const handleSelectPreset = (preset) => {
    setCurrentCamera(preset.id);
    targetCamPos.current.set(...preset.eye);
    targetLookAt.current.set(...preset.target);
    if (onCameraChange) onCameraChange(preset.id);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 bg-[#f8fafc] shadow-md select-none" style={{ height }}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Camera Angles HUD (Clean White & Green) */}
      {showControls && (
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm max-w-[95%]">
          <div className="flex items-center gap-1 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            <Camera className="w-3.5 h-3.5 text-emerald-600" /> Angles:
          </div>
          {CAMERA_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className={`text-[11px] px-2.5 py-1 rounded-xl transition font-medium whitespace-nowrap ${
                currentCamera === p.id
                  ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
              }`}
            >
              {p.label}
            </button>
          ))}

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-xl border text-xs transition ml-1 ${
              autoRotate
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-400'
            }`}
            title={autoRotate ? 'Pause Orbit' : 'Resume Orbit'}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* Bottom Environmental Telemetry Legend */}
      <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm text-[11px] font-mono text-slate-700">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span className="font-semibold text-slate-800">DC IT Load</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
          <span className="font-semibold text-slate-800">Clean Energy Hub</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-emerald-500 rounded" />
          <span className="text-emerald-700 font-bold">RE Grid Flow</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1.5 text-slate-500">
          <Wind className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Monsoon Airflow</span>
        </div>
      </div>

      {/* Node Hover Tooltip Dossier */}
      {hoveredNode && (
        <div className="absolute top-16 right-4 z-30 w-72 bg-white/95 backdrop-blur-md border border-emerald-200/90 rounded-2xl p-4 shadow-xl text-xs space-y-2.5 animate-fadeIn">
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider block">
                {hoveredNode.operator}
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                {hoveredNode.name}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {hoveredNode.location}, {hoveredNode.state}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
              {hoveredNode.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="text-[9px] uppercase text-slate-400 block font-sans">Reported Capacity</span>
              <span className="text-emerald-700 font-extrabold text-xs">
                {hoveredNode.reportedCapacityMW ? `${hoveredNode.reportedCapacityMW} MW` : 'Undisclosed'}
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="text-[9px] uppercase text-slate-400 block font-sans">Renewable Share</span>
              <span className="text-teal-700 font-extrabold text-xs">
                {hoveredNode.renewableMatching || '44.5% CEA'}
              </span>
            </div>
          </div>

          <div className="text-[10px] text-slate-600 bg-emerald-50/60 p-2 rounded-xl border border-emerald-100 leading-relaxed">
            <span className="font-bold text-emerald-900">Cooling: </span>
            {hoveredNode.coolingTechnology}
          </div>

          <button
            onClick={() => onSelectFacility && onSelectFacility(hoveredNode)}
            className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm shadow-emerald-600/20"
          >
            <Zap className="w-3.5 h-3.5" />
            Simulate Facility in Studio
          </button>
        </div>
      )}
    </div>
  );
}
