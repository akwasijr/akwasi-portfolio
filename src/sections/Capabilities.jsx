import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import ScrollReveal from '../components/ScrollReveal';
import Starfield from '../components/Starfield';

const disciplines = [
  { abbr: 'PM',  name: 'Product Management',   color: '#F2A573', orbit: 3.0, speed: 0.3, offset: 0 },
  { abbr: 'UXD', name: 'UX Designers',         color: '#7E80EE', orbit: 3.0, speed: 0.3, offset: Math.PI },
  { abbr: 'UXE', name: 'UX Engineers',         color: '#1376BF', orbit: 4.5, speed: 0.2, offset: Math.PI * 0.4 },
  { abbr: 'DS',  name: 'Data Science',         color: '#1376BF', orbit: 4.5, speed: 0.2, offset: Math.PI * 1.4, dimmed: true },
  { abbr: 'SEC', name: 'Security',             color: '#4AA75F', orbit: 6.0, speed: 0.12, offset: Math.PI * 0.8, dimmed: true },
  { abbr: 'TA',  name: 'Technical Architects', color: '#7E80EE', orbit: 6.0, speed: 0.12, offset: Math.PI * 1.8, dimmed: true },
];

function OrbitRing({ radius, color = '#7E80EE' }) {
  const points = [];
  for (let i = 0; i <= 128; i++) {
    const angle = (i / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line geometry={geo}>
      <lineBasicMaterial color={color} opacity={0.25} transparent />
    </line>
  );
}

function Satellite({ data }) {
  const ref = useRef();
  const angleRef = useRef(data.offset);

  useFrame((_, delta) => {
    angleRef.current += data.speed * delta;
    if (ref.current) {
      const a = angleRef.current;
      ref.current.position.x = Math.cos(a) * data.orbit;
      ref.current.position.z = Math.sin(a) * data.orbit;
    }
  });

  return (
    <group ref={ref}>
      <Html style={{ pointerEvents: 'none', transform: 'translate(-50%, -50%)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          opacity: data.dimmed ? 0.35 : 1,
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            border: '2.5px solid ' + data.color,
            background: 'rgba(255,255,255,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '17px', fontWeight: 700, color: '#0C0E13',
          }}>
            {data.abbr}
          </div>
          <span style={{
            fontSize: '16px', fontWeight: 600,
            color: 'rgba(255,255,255,0.7)',
          }}>
            {data.name}
          </span>
        </div>
      </Html>
    </group>
  );
}

function CenterBadge() {
  return (
    <Html center style={{ pointerEvents: 'none' }}>
      <div style={{ width: '100px', height: '100px' }}>
        <img src="/assets/patch-dark.svg" alt="Studio 42" style={{ width: '100%', height: '100%' }} />
      </div>
    </Html>
  );
}

function Scene() {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0012;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      <group ref={groupRef} rotation={[Math.PI * 0.22, 0.15, 0]}>
        <OrbitRing radius={3.0} color="#F2A573" />
        <OrbitRing radius={4.5} color="#1376BF" />
        <OrbitRing radius={6.0} color="#7E80EE" />

        <group>
          <CenterBadge />
        </group>

        {disciplines.map((d) => (
          <Satellite key={d.abbr} data={d} />
        ))}
      </group>
    </>
  );
}

export default function CapabilitiesSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section section--dark" data-section="3" style={{ padding: 0, display: 'block', position: 'relative' }}>
      <Starfield count={55} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
        <div ref={ref} style={{ width: '100%', height: '100%' }}>
          {visible && (
            <Canvas
              camera={{ position: [0, 10, 20], fov: 40 }}
              style={{ width: '100%', height: '100%', cursor: 'none' }}
            >
              <Scene />
            </Canvas>
          )}
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', paddingTop: '80px' }}>
        <ScrollReveal>
          <h2 className="cap-heading-dark">Bringing global engineering skills</h2>
        </ScrollReveal>
      </div>
    </section>
  );
}
