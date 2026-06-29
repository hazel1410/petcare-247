import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

/* Interactive 3D globe telling the time-zone story:
   US/Canada at night -> glowing pulses flow to awake vets in India.
   Owned by the lead (apps/site/src/components/3d). */

const R = 1.6;
const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function latLng(lat: number, lng: number, r = R) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

const CITIES = [
  { name: 'San Francisco', lat: 37.77, lng: -122.42, label: '🌙 3am', color: '#5b63e6' },
  { name: 'Toronto', lat: 43.65, lng: -79.38, label: '🌙 2am', color: '#5b63e6' },
  { name: 'Mumbai', lat: 19.07, lng: 72.87, label: '☀️ vets awake', color: '#22c55e' },
];

function makeArc(a: THREE.Vector3, b: THREE.Vector3) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(R * (1 + 0.45 * (a.distanceTo(b) / (2 * R))));
  return new THREE.QuadraticBezierCurve3(a, mid, b);
}

function Pulse({ curve, offset }: { curve: THREE.QuadraticBezierCurve3; offset: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = reduceMotion ? 0.5 : (clock.elapsedTime * 0.22 + offset) % 1;
    ref.current.position.copy(curve.getPointAt(t));
    const s = 0.7 + Math.sin(t * Math.PI) * 0.9;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.045, 12, 12]} />
      <meshBasicMaterial color="#22c55e" />
    </mesh>
  );
}

function Globe() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current && !reduceMotion) group.current.rotation.y = clock.elapsedTime * 0.12 + 0.4;
  });

  const arcs = useMemo(() => {
    const india = latLng(CITIES[2].lat, CITIES[2].lng);
    return [
      makeArc(latLng(CITIES[0].lat, CITIES[0].lng), india),
      makeArc(latLng(CITIES[1].lat, CITIES[1].lng), india),
    ];
  }, []);

  return (
    <group ref={group}>
      {/* base sphere */}
      <mesh>
        <sphereGeometry args={[R, 48, 48]} />
        <meshStandardMaterial color="#eceefc" roughness={0.9} metalness={0} transparent opacity={0.5} />
      </mesh>
      {/* wireframe overlay for the "globe lines" */}
      <mesh>
        <icosahedronGeometry args={[R * 1.003, 4]} />
        <meshBasicMaterial color="#5b63e6" wireframe transparent opacity={0.16} />
      </mesh>

      {/* city markers + labels */}
      {CITIES.map((c) => (
        <group key={c.name} position={latLng(c.lat, c.lng, R * 1.02)}>
          <mesh>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color={c.color} />
          </mesh>
          <Html distanceFactor={9} style={{ pointerEvents: 'none' }} center>
            <div
              style={{
                whiteSpace: 'nowrap',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 11,
                fontWeight: 700,
                color: '#1f2937',
                background: 'rgba(255,255,255,0.9)',
                borderRadius: 8,
                padding: '2px 8px',
                boxShadow: '0 2px 10px rgba(31,41,55,0.12)',
              }}
            >
              {c.label}
            </div>
          </Html>
        </group>
      ))}

      {/* arcs + flowing pulses */}
      {arcs.map((curve, i) => (
        <group key={i}>
          <Line points={curve.getPoints(60)} color="#5b63e6" lineWidth={1.6} transparent opacity={0.45} />
          <Pulse curve={curve} offset={i * 0.5} />
        </group>
      ))}
    </group>
  );
}

export default function TimezoneGlobe() {
  return (
    <Canvas camera={{ position: [0, 0.5, 4.4], fov: 45 }} dpr={[1, 2]} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 3, 4]} intensity={0.5} />
      <Globe />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} rotateSpeed={0.5} />
    </Canvas>
  );
}
