import styles from '../App.module.css';

const VARS = [
  ['--idz-bg', '#1e1e2e', 'Dropzone background'],
  ['--idz-border', 'none', 'Dropzone border'],
  ['--idz-border-hover', '#888', 'Hover border color'],
  ['--idz-radius', '8px', 'Border radius'],
  ['--idz-label-color', 'rgba(255,255,255,0.5)', 'Empty-state label color'],
  ['--idz-surface', '#2a2a3e', 'Toolbar background'],
  ['--idz-accent', '#7c83d4', 'Icon hover / active color'],
  ['--idz-icon-color', '#ffffff', 'Icon fill color'],
  ['--idz-carousel-btn-bg', 'rgba(0,0,0,0.6)', 'Nav button background'],
  ['--idz-carousel-btn-border', 'rgba(255,255,255,0.2)', 'Nav button border'],
  ['--idz-carousel-btn-color', '#ffffff', 'Nav button icon color'],
  ['--idz-carousel-dot-bg', 'rgba(255,255,255,0.4)', 'Inactive dot color'],
  ['--idz-carousel-dot-active-bg', 'rgba(255,255,255,0.9)', 'Active dot color'],
];

export default function CssVarsReference() {
  return (
    <section id="css-vars" className={styles.section}>
      <h2 className={styles.sectionTitle}>CSS Variables Reference</h2>
      <p className={styles.sectionDesc}>
        Override these custom properties on any ancestor element, or
        use the typed <code>theme</code> prop which maps to the same variables.
      </p>
      <div className={styles.varTable}>
        {VARS.map(([varName, defaultVal, desc]) => (
          <div key={varName} className={styles.varRow}>
            <code className={styles.varName}>{varName}</code>
            <code className={styles.varDefault}>{defaultVal}</code>
            <span className={styles.varDesc}>{desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
