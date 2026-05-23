import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import ScrollReveal from '../components/ScrollReveal';
import Starfield from '../components/Starfield';

const disciplines = [
  { abbr: 'AI',  name: 'AI Experience Design',  color: '#c6ef4d', orbit: 3.0, speed: 0.3, offset: 0 },
  { abbr: 'UX',  name: 'Product Design',        color: '#7779f0', orbit: 3.0, speed: 0.3, offset: Math.PI },
  { abbr: 'DEV', name: 'Product Development',    color: '#a5a5f6', orbit: 4.5, speed: 0.2, offset: Math.PI * 0.4 },
  { abbr: 'SYS', name: 'Design Systems',         color: '#a5a5f6', orbit: 4.5, speed: 0.2, offset: Math.PI * 1.4, dimmed: true },
  { abbr: 'WRK', name: 'Workshop Facilitation',  color: '#c6ef4d', orbit: 6.0, speed: 0.12, offset: Math.PI * 0.8, dimmed: true },
  { abbr: 'VIZ', name: 'Data Visualization',     color: '#7779f0', orbit: 6.0, speed: 0.12, offset: Math.PI * 1.8, dimmed: true },
];

function OrbitRing({ radius, color = '#7779f0' }) {
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
            fontSize: '17px', fontWeight: 700, color: '#00330f',
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
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: '#00330f', border: '2px solid #c6ef4d',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700,
        fontSize: '28px', color: '#c6ef4d',
      }}>
        AF
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
        <OrbitRing radius={3.0} color="#c6ef4d" />
        <OrbitRing radius={4.5} color="#a5a5f6" />
        <OrbitRing radius={6.0} color="#7779f0" />

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
    const overlay = el.closest('.overlay');
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { root: overlay || null, threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section section--dark" data-section="3" style={{ padding: 0, display: 'block', position: 'relative' }}>
      <Starfield count={25} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
        <div ref={ref} style={{ width: '100%', height: '100%' }}>
          {visible && (
            <motion.div
              style={{ width: '100%', height: '100%' }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Canvas
                camera={{ position: [0, 10, 20], fov: 40 }}
                style={{ width: '100%', height: '100%', cursor: 'none' }}
              >
                <Scene />
              </Canvas>
            </motion.div>
          )}
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', paddingTop: '80px' }}>
        <ScrollReveal>
          <h2 className="cap-heading-dark">My skills in orbit</h2>
        </ScrollReveal>
      </div>
    </section>
  );
}
