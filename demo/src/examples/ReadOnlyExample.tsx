import { ImageDropzone } from '@milkybytes/image-dropzone';
import styles from '../App.module.css';
import Code from './Code';
import exampleImage from './example_image.png';

export default function ReadOnlyExample() {
  return (
    <section id="readonly" className={styles.section}>
      <h2 className={styles.sectionTitle}>Read-Only</h2>
      <p className={styles.sectionDesc}>
        Set <code>readOnly</code> to hide the toolbar and disable drag-and-drop.
        Useful for previews or display-only contexts.
      </p>
      <div className={styles.example}>
        <div className={styles.preview}>
          <ImageDropzone
            width={350}
            height={570}
            imageSrc={exampleImage}
            readOnly
          />
        </div>
        <Code>{`<ImageDropzone
  width={350}
  height={570}
  imageSrc={previewUrl}
  readOnly
/>`}</Code>
      </div>
    </section>
  );
}
