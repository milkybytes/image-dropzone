import { useState } from 'react';
import { ImageDropzone } from '@milkybytes/image-dropzone';
import styles from '../App.module.css';
import Code from './Code';

export default function BasicExample() {
  const [image, setImage] = useState<string | undefined>();

  return (
    <section id="basic" className={styles.section}>
      <h2 className={styles.sectionTitle}>Basic Usage</h2>
      <p className={styles.sectionDesc}>
        Drop an image, click to browse, scroll to zoom, drag to pan.
        Only <code>width</code> and <code>height</code> are required.
      </p>
      <div className={styles.example}>
        <div className={styles.preview}>
          <ImageDropzone
            label="Drop image here"
            width={350}
            height={570}
            imageSrc={image}
            onImageUpload={(img) => setImage(img ?? undefined)}
          />
        </div>
        <Code>{`import { ImageDropzone } from '@milkybytes/image-dropzone';

const [image, setImage] = useState<string>();

<ImageDropzone
  label="Drop image here"
  width={350}
  height={570}
  imageSrc={image}
  onImageUpload={(img) => setImage(img ?? undefined)}
/>`}</Code>
      </div>
    </section>
  );
}
