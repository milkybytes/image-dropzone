import { useState } from 'react';
import { ImageDropzone } from '@milkybytes/image-dropzone';
import styles from '../App.module.css';
import Code from './Code';

export default function ThemingExample() {
  const [image, setImage] = useState<string | undefined>();

  return (
    <section id="theming" className={styles.section}>
      <h2 className={styles.sectionTitle}>Theming</h2>
      <p className={styles.sectionDesc}>
        Pass a typed <code>theme</code> prop or override <code>--idz-*</code> CSS custom
        properties. Tokens are applied inline so multiple themes can coexist.
      </p>
      <div className={styles.example}>
        <div className={styles.preview}>
          <ImageDropzone
            label="Themed dropzone"
            width={350}
            height={570}
            imageSrc={image}
            theme={{
              bg: '#2e1f14',
              surface: '#3d2b1a',
              labelColor: 'rgba(255,220,180,0.5)',
              iconColor: '#ffe0b2',
              accent: '#ff9a3c',
            }}
            onImageUpload={(img) => setImage(img ?? undefined)}
          />
        </div>
        <Code>{`import type { ImageDropzoneTheme } from '@milkybytes/image-dropzone';

const warmTheme: ImageDropzoneTheme = {
  bg: '#2e1f14',
  surface: '#3d2b1a',
  labelColor: 'rgba(255,220,180,0.5)',
  iconColor: '#ffe0b2',
  accent: '#ff9a3c',
};

<ImageDropzone theme={warmTheme} ... />

// Or use CSS custom properties:
// .wrapper { --idz-bg: #2e1f14; --idz-accent: #ff9a3c; }`}</Code>
      </div>
    </section>
  );
}
