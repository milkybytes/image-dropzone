import { useState } from 'react';
import { ImageDropzone } from '@milkybytes/image-dropzone';
import type { ActionsPosition } from '@milkybytes/image-dropzone';
import styles from '../App.module.css';
import Code from './Code';

const POSITIONS: ActionsPosition[] = [
  'top', 'top-left', 'top-right',
  'left', 'right',
  'bottom', 'bottom-left', 'bottom-right',
];

export default function ActionsPositionExample() {
  const [position, setPosition] = useState<ActionsPosition>('top');
  const [image, setImage] = useState<string>();

  return (
    <section id="actions-position" className={styles.section}>
      <h2 className={styles.sectionTitle}>Actions Position</h2>
      <p className={styles.sectionDesc}>
        Use <code>actionsPosition</code> to anchor the toolbar to any edge or corner.
        The toolbar orientation adjusts automatically — horizontal for top/bottom/corners,
        vertical for left/right.
      </p>
      <div className={styles.demoButtons}>
        {POSITIONS.map((p) => (
          <button
            key={p}
            className={`${styles.demoButton} ${position === p ? styles.demoButtonActive : ''}`}
            onClick={() => setPosition(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <div className={styles.example}>
        <div className={styles.preview}>
          <ImageDropzone
            label="Hover to see toolbar"
            width={300}
            height={400}
            imageSrc={image}
            actionsPosition={position}
            onImageUpload={(src) => setImage(src ?? undefined)}
          />
        </div>
        <Code>{`<ImageDropzone
  actionsPosition="${position}"
  width={300}
  height={400}
  imageSrc={image}
  onImageUpload={setImage}
/>`}</Code>
      </div>
    </section>
  );
}
