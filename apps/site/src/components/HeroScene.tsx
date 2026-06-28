import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Line } from '@react-three/drei';

function ECGPath() {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const w = 3;
    const h = 0.4;
    const segments = 80;

    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * 2 * Math.PI;
      let x = (t / (2 * Math.PI)) * w - w / 2;
      let y = 0;

      if (t < 0.5) y = 0;
      else if (t < 1.0) y = h * Math.sin((t - 0.5) * Math.PI * 2);
      else if (t < 1.5) y = -h * Math.sin((t - 1.0) * Math.PI * 2);
      else if (t < 2.0) y = h * Math.sin((t - 1.5) * Math.PI * 4);
      else if (t < 2.3) y = -h * 1.2;
      else if (t < 2.6) y = h * 0.8;
      else if (t < 3.0) y = h * 0.3;
      else y = 0;

      pts.push([x, y, 0]);
    }
    return pts;
  }, []);

  return (
    <Line
      points={points}
      color="#3AAFA9"
      lineWidth={2}
      transparent
      opacity={0.9}
    />
  );
}

function FloatingRing() {
  const meshRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0.5, 0, 0]}>
      <torusGeometry args={[1.8, 0.04, 16, 64]} />
      <MeshDistortMaterial
        color="#3AAFA9"
        transparent
        opacity={0.25}
        distort={0.1}
        speed={1}
      />
    </mesh>
  );
}

function OrbitingSpheres() {
  const groupRef = useRef<any>(null);

  const spheres = useMemo(() => {
    const count = 5;
    const positions: { angle: number; radius: number; size: number }[] = [];
    for (let i = 0; i < count; i++) {
      positions.push({
        angle: (i / count) * Math.PI * 2,
        radius: 2.2 + Math.random() * 0.3,
        size: 0.08 + Math.random() * 0.06,
      });
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(s.angle) * s.radius,
            Math.sin(s.angle * 0.7) * 0.3,
            Math.sin(s.angle) * s.radius * 0.5,
          ]}
        >
          <sphereGeometry args={[s.size, 12, 12]} />
          <meshBasicMaterial color="#3AAFA9" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function CenterGlow() {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 24, 24]} />
      <MeshDistortMaterial
        color="#3AAFA9"
        transparent
        opacity={0.15}
        distort={0.3}
        speed={2}
      />
    </mesh>
  );
}

function SceneContent() {
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
      <FloatingRing />
      <OrbitingSpheres />
      <CenterGlow />
      <ECGPath />
    </Float>
  );
}

export function HeroScene() {
  return (
    <div
      style={{
        width: '100%',
        height: 400,
        maxWidth: 500,
        margin: '0 auto',
        position: 'relative',
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[2, 3, 4]} intensity={0.5} />
        <SceneContent />
      </Canvas>
    </div>
  );
}
