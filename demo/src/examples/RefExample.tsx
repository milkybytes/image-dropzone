import { useRef, useState } from 'react';
import { ImageDropzone } from '@milkybytes/image-dropzone';
import type { ImageDropzoneHandle } from '@milkybytes/image-dropzone';
import styles from '../App.module.css';
import Code from './Code';

export default function RefExample() {
  const [image, setImage] = useState<string | undefined>();
  const ref = useRef<ImageDropzoneHandle>(null);

  return (
    <section id="ref" className={styles.section}>
      <h2 className={styles.sectionTitle}>Ref API</h2>
      <p className={styles.sectionDesc}>
        Use <code>ImageDropzoneHandle</code> via <code>ref</code> to
        call <code>exportCrop()</code>, <code>openFilePicker()</code>,
        or <code>removeImage()</code> from <strong>outside</strong> the
        toolbar — for example from a separate button or keyboard shortcut.
      </p>
      <div className={styles.example}>
        <div className={styles.preview}>
          <ImageDropzone
            ref={ref}
            label="Upload an image"
            width={350}
            height={570}
            imageSrc={image}
            onImageUpload={(img) => setImage(img ?? undefined)}
          />
          <div className={styles.demoButtons}>
            <button onClick={() => ref.current?.openFilePicker()} className={styles.demoButton}>
              Open picker
            </button>
            <button
              disabled={!image}
              onClick={() => {
                const dataUrl = ref.current?.exportCrop();
                const href = dataUrl ?? image;
                if (!href) return;
                const a = document.createElement('a');
                a.href = href;
                a.download = 'cropped.png';
                a.click();
              }}
              className={styles.demoButton}
            >
              Download crop
            </button>
            <button disabled={!image} onClick={() => ref.current?.removeImage()} className={styles.demoButton}>
              Remove
            </button>
          </div>
        </div>
        <Code>{`import { useRef } from 'react';
import type { ImageDropzoneHandle } from '@milkybytes/image-dropzone';

const ref = useRef<ImageDropzoneHandle>(null);

<ImageDropzone
  ref={ref}
  width={350}
  height={570}
  imageSrc={image}
  onImageUpload={setImage}
/>

// Call from anywhere:
ref.current?.exportCrop();
ref.current?.openFilePicker();
ref.current?.removeImage();`}</Code>
      </div>
    </section>
  );
}
