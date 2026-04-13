export default function Navigation({ currentSection, totalSections, onDotClick }) {
  const sectionLabels = [
    'Hero',
    'About',
    'Skills',
    'Process',
    'Position',
    'Work',
    'Contact',
  ];

  return (
    <nav className="nav-dots" aria-label="Section navigation">
      {Array.from({ length: totalSections }, (_, i) => (
        <button
          key={i}
          className={`nav-dot ${i === currentSection ? 'nav-dot--active' : ''}`}
          onClick={() => onDotClick(i)}
          aria-label={`Go to ${sectionLabels[i] || `section ${i + 1}`}`}
          title={sectionLabels[i]}
        />
      ))}
    </nav>
  );
}
