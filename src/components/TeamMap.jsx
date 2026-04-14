import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { geoOrthographic, geoPath, geoGraticule } from 'd3-geo';
import { feature } from 'topojson-client';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const teamColors = {
  'EMEA': '#7E80EE',
  'ATZ': '#F2A573',
  'APJ': '#F45A9B',
};

const members = [
  { name: 'Cheri Harvey', city: 'Highland, Texas', team: 'ATZ', coords: [-97.06, 32.35], tz: 'America/Chicago' },
  { name: 'Derick Berry', city: 'Cleveland, Ohio', team: 'ATZ', coords: [-81.69, 41.50], tz: 'America/New_York' },
  { name: 'Jason Ng', city: 'Vancouver, Canada', team: 'ATZ', coords: [-123.12, 49.28], tz: 'America/Vancouver' },
  { name: 'Brittany Travitz', city: 'Loveland, Ohio', team: 'ATZ', coords: [-84.26, 39.27], tz: 'America/New_York' },
  { name: 'Akwasi Fosuhene', city: 'Amsterdam', team: 'EMEA', coords: [4.90, 52.37], tz: 'Europe/Amsterdam' },
  { name: 'Josephine Scholtes', city: 'Amsterdam', team: 'EMEA', coords: [4.88, 52.36], tz: 'Europe/Amsterdam' },
  { name: 'Chloe Hales', city: 'Belfast, UK', team: 'EMEA', coords: [-5.93, 54.60], tz: 'Europe/London' },
  { name: 'Dedun Oyenuga', city: 'London, UK', team: 'EMEA', coords: [-0.13, 51.51], tz: 'Europe/London' },
  { name: 'Paul Tallett', city: 'London, UK', team: 'EMEA', coords: [-0.11, 51.52], tz: 'Europe/London' },
  { name: 'Michael Tsikkos', city: 'London, UK', team: 'EMEA', coords: [-0.09, 51.50], tz: 'Europe/London' },
  { name: 'Adam Black', city: 'Belfast, UK', team: 'EMEA', coords: [-5.95, 54.59], tz: 'Europe/London' },
  { name: 'Axel Wolters', city: 'Hamburg, Germany', team: 'EMEA', coords: [9.99, 53.55], tz: 'Europe/Berlin' },
  { name: 'Hans Hertel', city: 'Berlin, Germany', team: 'EMEA', coords: [13.40, 52.52], tz: 'Europe/Berlin' },
  { name: 'Michael Hartmann', city: 'Cologne, Germany', team: 'EMEA', coords: [6.96, 50.94], tz: 'Europe/Berlin' },
  { name: 'Steve Nessen', city: 'Cologne, Germany', team: 'EMEA', coords: [6.94, 50.93], tz: 'Europe/Berlin' },
  { name: 'Filip Grgic', city: 'Frankfurt, Germany', team: 'EMEA', coords: [8.68, 50.11], tz: 'Europe/Berlin' },
  { name: 'Nienke Hollenberg', city: 'Enkhuizen', team: 'EMEA', coords: [5.29, 52.70], tz: 'Europe/Amsterdam' },
  { name: 'Guilhem Gantois', city: 'Warsaw, Poland', team: 'EMEA', coords: [21.01, 52.23], tz: 'Europe/Warsaw' },
  { name: 'Alina Gawlitta', city: 'Munich, Germany', team: 'EMEA', coords: [11.58, 48.14], tz: 'Europe/Berlin' },
  { name: 'Jesus Serrano Castro', city: 'Madrid, Spain', team: 'EMEA', coords: [-3.70, 40.42], tz: 'Europe/Madrid' },
  { name: 'Adam Porecki', city: 'Warsaw, Poland', team: 'EMEA', coords: [21.03, 52.24], tz: 'Europe/Warsaw' },
  { name: 'Sam Gates', city: 'United Kingdom', team: 'EMEA', coords: [-1.17, 52.36], tz: 'Europe/London' },
  { name: 'Amir Karim', city: 'Dubai, UAE', team: 'EMEA', coords: [55.27, 25.20], tz: 'Asia/Dubai' },
  { name: 'Mary Burke', city: 'New York, USA', team: 'ATZ', coords: [-74.01, 40.71], tz: 'America/New_York' },
  { name: 'Mallikharjuna Rao S.', city: 'Dallas, USA', team: 'ATZ', coords: [-96.80, 32.78], tz: 'America/Chicago' },
  { name: 'Frankie Garcia', city: 'Los Angeles, USA', team: 'ATZ', coords: [-118.24, 34.05], tz: 'America/Los_Angeles' },
  { name: 'Ganesh Gajjela', city: 'New Jersey, USA', team: 'ATZ', coords: [-74.41, 40.06], tz: 'America/New_York' },
  { name: 'Danielle Molinar', city: 'Austin, Texas', team: 'ATZ', coords: [-97.74, 30.27], tz: 'America/Chicago' },
  { name: 'Jess Hines', city: 'Tucson, Arizona', team: 'ATZ', coords: [-110.93, 32.22], tz: 'America/Phoenix' },
  { name: 'ShanmugaDas C S.', city: 'Hyderabad, India', team: 'APJ', coords: [78.47, 17.38], tz: 'Asia/Kolkata' },
  { name: 'Asha Sanathana', city: 'Hyderabad, India', team: 'APJ', coords: [78.49, 17.39], tz: 'Asia/Kolkata' },
  { name: 'Satyanarayana Rao B', city: 'Hyderabad, India', team: 'APJ', coords: [78.45, 17.37], tz: 'Asia/Kolkata' },
  { name: 'Prathyusha Malle', city: 'Hyderabad, India', team: 'APJ', coords: [78.48, 17.40], tz: 'Asia/Kolkata' },
  { name: 'Hemant Duvey', city: 'Hyderabad, India', team: 'APJ', coords: [78.46, 17.36], tz: 'Asia/Kolkata' },
  { name: 'Ankit Anurag', city: 'Hyderabad, India', team: 'APJ', coords: [78.50, 17.41], tz: 'Asia/Kolkata' },
  { name: 'Rosemary Rao', city: 'Hyderabad, India', team: 'APJ', coords: [78.44, 17.35], tz: 'Asia/Kolkata' },
  { name: 'Naveen Kumar Korvi', city: 'Hyderabad, India', team: 'APJ', coords: [78.51, 17.42], tz: 'Asia/Kolkata' },
  { name: 'Mohammed Thaskeen', city: 'Hyderabad, India', team: 'APJ', coords: [78.43, 17.34], tz: 'Asia/Kolkata' },
  { name: 'Ryo Yoshida', city: 'Tokyo, Japan', team: 'APJ', coords: [139.69, 35.69], tz: 'Asia/Tokyo' },
];

function getLocalTime(tz) {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch { return ''; }
}


const SIZE = 500;

export default function TeamMap() {
  const [geoData, setGeoData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [rotation, setRotation] = useState([0, -20, 0]);
  const animRef = useRef(null);
  const dragging = useRef(false);
  const lastMouse = useRef([0, 0]);
  const autoRotate = useRef(true);

  const projection = useMemo(() =>
    geoOrthographic()
      .scale(230)
      .translate([SIZE / 2, SIZE / 2])
      .rotate(rotation)
      .clipAngle(90)
  , [rotation]);

  const pathGen = useMemo(() => geoPath().projection(projection), [projection]);
  const graticule = useMemo(() => geoGraticule().step([20, 20])(), []);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(topo => setGeoData(feature(topo, topo.objects.countries)));
  }, []);

  useEffect(() => {
    const spin = () => {
      if (autoRotate.current && !dragging.current) {
        setRotation(r => [r[0] + 0.15, r[1], r[2]]);
      }
      animRef.current = requestAnimationFrame(spin);
    };
    animRef.current = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleMouseDown = useCallback((e) => {
    dragging.current = true;
    autoRotate.current = false;
    lastMouse.current = [e.clientX, e.clientY];
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastMouse.current[0];
    const dy = e.clientY - lastMouse.current[1];
    lastMouse.current = [e.clientX, e.clientY];
    setRotation(r => [r[0] + dx * 0.3, r[1] - dy * 0.3, r[2]]);
  }, []);

  const handleMouseUp = useCallback(() => { dragging.current = false; }, []);

  const isVisible = useCallback((coords) => {
    const d = projection.rotate();
    const center = [-d[0], -d[1]];
    const dist = Math.acos(
      Math.sin(center[1] * Math.PI / 180) * Math.sin(coords[1] * Math.PI / 180) +
      Math.cos(center[1] * Math.PI / 180) * Math.cos(coords[1] * Math.PI / 180) *
      Math.cos((coords[0] - center[0]) * Math.PI / 180)
    );
    return dist < Math.PI / 2;
  }, [projection]);

  // Cluster nearby visible markers
  const clusters = useMemo(() => {
    const result = [];
    const used = new Set();
    members.forEach((m, i) => {
      if (used.has(i) || !isVisible(m.coords)) return;
      const pt = projection(m.coords);
      if (!pt) return;
      const cluster = { x: pt[0], y: pt[1], members: [i], color: teamColors[m.team] };
      members.forEach((m2, j) => {
        if (i === j || used.has(j) || !isVisible(m2.coords)) return;
        const pt2 = projection(m2.coords);
        if (!pt2) return;
        const dx = cluster.x - pt2[0];
        const dy = cluster.y - pt2[1];
        if (Math.sqrt(dx * dx + dy * dy) < 18) {
          cluster.members.push(j);
          used.add(j);
        }
      });
      used.add(i);
      result.push(cluster);
    });
    return result;
  }, [projection, isVisible]);

  const [expandedCluster, setExpandedCluster] = useState(null);
  const selectedMember = selected !== null ? members[selected] : null;

  return (
    <div className="team-map-wrap">
      <div className="team-map-header">
        <h3 className="team-map-title">Where we are</h3>
        <div className="team-map-legend">
          {Object.entries(teamColors).map(([team, color]) => (
            <span key={team} className="team-map-legend__item">
              <span className="team-map-legend__dot" style={{ background: color }} />
              {team}
            </span>
          ))}
        </div>
      </div>

      <div className="team-map-layout">
        <motion.div
          className="team-map-container team-map-container--globe"
          animate={{ x: (selected !== null || expandedCluster !== null) ? -40 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => { setSelected(null); setExpandedCluster(null); autoRotate.current = true; }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg viewBox={"0 0 " + String(SIZE) + " " + String(SIZE)} style={{ width: '100%', height: '100%' }}>
            <circle cx={SIZE / 2} cy={SIZE / 2} r={230} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
            <path d={pathGen(graticule)} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
            {geoData && geoData.features.map((geo, i) => (
              <path key={i} d={pathGen(geo)} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth={0.4} />
            ))}
            {clusters.map((c, ci) => {
              if (c.members.length === 1) {
                const m = members[c.members[0]];
                const mi = c.members[0];
                return (
                  <g key={ci} onClick={(e) => { e.stopPropagation(); setSelected(mi); autoRotate.current = false; }} style={{ cursor: 'pointer' }}>
                    <circle cx={c.x} cy={c.y} r={4} fill={teamColors[m.team]} opacity={0.9} stroke="rgba(0,0,0,0.3)" strokeWidth={0.5} />
                    {selected === mi && <circle cx={c.x} cy={c.y} r={9} fill="none" stroke={teamColors[m.team]} strokeWidth={1.5} opacity={0.6} />}
                  </g>
                );
              }
              return (
                <g key={ci} onClick={(e) => { e.stopPropagation(); setExpandedCluster(ci); autoRotate.current = false; }} style={{ cursor: 'pointer' }}>
                  <circle cx={c.x} cy={c.y} r={14} fill={c.color} opacity={0.15} />
                  <circle cx={c.x} cy={c.y} r={9} fill={c.color} opacity={0.9} stroke="rgba(0,0,0,0.3)" strokeWidth={0.5} />
                  <text x={c.x} y={c.y + 3.5} textAnchor="middle" fill="#fff" fontSize={9} fontWeight="700" style={{ pointerEvents: 'none' }}>
                    {c.members.length}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>

        <AnimatePresence>
          {(selectedMember || (expandedCluster !== null && clusters[expandedCluster])) && (
            <motion.div
              className="map-side-panel"
              key="panel"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                className="map-side-panel__close"
                onClick={() => { setSelected(null); setExpandedCluster(null); autoRotate.current = true; }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>

              {expandedCluster !== null && clusters[expandedCluster] ? (
                <>
                  <span className="map-side-panel__team" style={{ color: clusters[expandedCluster].color }}>
                    {clusters[expandedCluster].members.length} team members
                  </span>
                  <div className="map-cluster-members">
                    {clusters[expandedCluster].members.map((mi) => {
                      const m = members[mi];
                      return (
                        <div key={mi} className="map-cluster-member">
                          <span className="map-cluster-member__dot" style={{ background: teamColors[m.team] }} />
                          <div>
                            <span className="map-cluster-member__name">{m.name}</span>
                            <span className="map-cluster-member__city">{m.city}</span>
                            <span className="map-cluster-member__time">{getLocalTime(m.tz)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : selectedMember ? (
                <>
                  <div className="map-side-panel__dot" style={{ background: teamColors[selectedMember.team] }} />
                  <span className="map-side-panel__team" style={{ color: teamColors[selectedMember.team] }}>{selectedMember.team}</span>
                  <h4 className="map-side-panel__name">{selectedMember.name}</h4>
                  <p className="map-side-panel__city">{selectedMember.city}</p>
                  <p className="map-side-panel__time">{getLocalTime(selectedMember.tz)}</p>
                </>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
