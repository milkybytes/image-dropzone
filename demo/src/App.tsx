import BasicExample from './examples/BasicExample';
import ReadOnlyExample from './examples/ReadOnlyExample';
import ActionsExample from './examples/ActionsExample';
import ActionsPositionExample from './examples/ActionsPositionExample';
import RefExample from './examples/RefExample';
import ThemingExample from './examples/ThemingExample';
import CarouselExample from './examples/CarouselExample';
import CssVarsReference from './examples/CssVarsReference';
import styles from './App.module.css';

const SECTIONS = [
  { id: 'basic', label: 'Basic Usage' },
  { id: 'readonly', label: 'Read-Only' },
  { id: 'actions', label: 'Custom Actions' },
  { id: 'actions-position', label: 'Actions Position' },
  { id: 'ref', label: 'Ref API' },
  { id: 'theming', label: 'Theming' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'css-vars', label: 'CSS Variables' },
] as const;

export default function App() {
  return (
    <div className={styles.layout}>
      <nav className={styles.nav}>
        <span className={styles.navTitle}>Examples</span>
        {SECTIONS.map(({ id, label }) => (
          <a key={id} href={`#${id}`} className={styles.navLink}>
            {label}
          </a>
        ))}
      </nav>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>@milkybytes/image-dropzone</h1>
          <p className={styles.subtitle}>
            Drag-and-drop image dropzone and carousel with pan, zoom, and CSS variable theming.
          </p>
          <div className={styles.links}>
            <a href="https://github.com/milkybytes/image-dropzone/actions/workflows/main.yml" target="_blank" rel="noopener noreferrer">
              <img src="https://github.com/milkybytes/image-dropzone/actions/workflows/main.yml/badge.svg" alt="CI" />
            </a>
            <a href="https://www.npmjs.com/package/@milkybytes/image-dropzone" target="_blank" rel="noopener noreferrer">
              <img src="https://img.shields.io/npm/v/@milkybytes/image-dropzone" alt="npm" />
            </a>
            <a href="https://github.com/milkybytes/image-dropzone/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
              <img src="https://img.shields.io/github/license/milkybytes/image-dropzone" alt="license" />
            </a>
          </div>
        </header>

        <BasicExample />
        <ReadOnlyExample />
        <ActionsExample />
        <ActionsPositionExample />
        <RefExample />
        <ThemingExample />
        <CarouselExample />
        <CssVarsReference />

        <footer className={styles.footer}>MIT License</footer>
      </main>
    </div>
  );
}
