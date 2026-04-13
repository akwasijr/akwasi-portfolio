import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const teamColors = {
  'S42': '#F2A573',
  'EMEA': '#7E80EE',
  'ATZ': '#1376BF',
  'APJ': '#F45A9B',
  'UX': '#4AA75F',
};

const members = [
  { name: 'Cheri Harvey', city: 'Highland, Texas', team: 'S42', coords: [-97.06, 32.35], tz: 'America/Chicago' },
  { name: 'Derick Berry', city: 'Cleveland, Ohio', team: 'S42', coords: [-81.69, 41.50], tz: 'America/New_York' },
  { name: 'Jason Ng', city: 'Vancouver, Canada', team: 'S42', coords: [-123.12, 49.28], tz: 'America/Vancouver' },
  { name: 'Brittany Travitz', city: 'Loveland, Ohio', team: 'S42', coords: [-84.26, 39.27], tz: 'America/New_York' },
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
  { name: 'Jess Hines', city: 'Tucson, Arizona', team: 'UX', coords: [-110.93, 32.22], tz: 'America/Phoenix' },
];

function getLocalTime(tz) {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch { return ''; }
}

const W = 960;
const H = 500;

export default function TeamMap() {
  const [geoData, setGeoData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [userPos, setUserPos] = useState(null);

  const projection = useMemo(() =>
    geoMercator()
      .scale(140)
      .translate([W / 2, H / 1.5])
  , []);

  const pathGen = useMemo(() => geoPath().projection(projection), [projection]);

  useEffect(() => {
    fetch(GEO_URL)
      .then(r => r.json())
      .then(topo => {
        const countries = feature(topo, topo.objects.countries);
        setGeoData(countries);
      });
  }, []);

  const locateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.longitude, pos.coords.latitude]),
      () => {},
      { enableHighAccuracy: false, timeout: 5000 }
    );
  };

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
        <button className="team-map-locate" onClick={locateMe}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/><line x1="8" y1="0" x2="8" y2="4" stroke="currentColor" strokeWidth="1.5"/><line x1="8" y1="12" x2="8" y2="16" stroke="currentColor" strokeWidth="1.5"/><line x1="0" y1="8" x2="4" y2="8" stroke="currentColor" strokeWidth="1.5"/><line x1="12" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5"/></svg>
          Locate me
        </button>
      </div>

      <div className="team-map-container" onClick={() => setSelected(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%' }}>
          {/* Countries */}
          {geoData && geoData.features.map((geo, i) => (
            <path
              key={i}
              d={pathGen(geo)}
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={0.5}
            />
          ))}

          {/* Team markers */}
          {members.map((m, i) => {
            const [x, y] = projection(m.coords);
            return (
              <g key={i} onClick={(e) => { e.stopPropagation(); setSelected(i); }} style={{ cursor: 'pointer' }}>
                <circle cx={x} cy={y} r={4} fill={teamColors[m.team]} opacity={0.85} stroke="rgba(0,0,0,0.3)" strokeWidth={0.5} />
                {selected === i && (
                  <circle cx={x} cy={y} r={8} fill="none" stroke={teamColors[m.team]} strokeWidth={1.5} opacity={0.6} />
                )}
              </g>
            );
          })}

          {/* User location pulse */}
          {userPos && (() => {
            const [ux, uy] = projection(userPos);
            return (
              <g>
                <circle cx={ux} cy={uy} r={6} fill="#fff" opacity={0.3} className="map-user-pulse" />
                <circle cx={ux} cy={uy} r={3} fill="#fff" />
              </g>
            );
          })()}
        </svg>

        {/* Popup overlay */}
        <AnimatePresence>
          {selected !== null && (() => {
            const m = members[selected];
            const [px, py] = projection(m.coords);
            const pctX = (px / W) * 100;
            const pctY = (py / H) * 100;
            return (
              <motion.div
                className="map-popup"
                style={{ left: pctX + '%', top: pctY + '%' }}
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="map-popup__team" style={{ color: teamColors[m.team] }}>{m.team}</div>
                <div className="map-popup__name">{m.name}</div>
                <div className="map-popup__city">{m.city}</div>
                <div className="map-popup__time">{getLocalTime(m.tz)}</div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
}
