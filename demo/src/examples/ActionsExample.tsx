import { useState } from 'react';
import { ImageDropzone } from '@milkybytes/image-dropzone';
import UploadIcon from '../icons/UploadIcon';
import DownloadIcon from '../icons/DownloadIcon';
import DeleteIcon from '../icons/DeleteIcon';
import styles from '../App.module.css';
import Code from './Code';

export default function ActionsExample() {
  const [image, setImage] = useState<string | undefined>();

  return (
    <section id="actions" className={styles.section}>
      <h2 className={styles.sectionTitle}>Custom Actions</h2>
      <p className={styles.sectionDesc}>
        The <code>actions</code> render prop gives you full control over the toolbar.
        You receive an <code>ActionContext</code> with <code>hasImage</code>,{' '}
        <code>openFilePicker</code>, <code>removeImage</code>, and <code>exportCrop</code>.
        Compose any buttons or icons in any order.
      </p>
      <div className={styles.example}>
        <div className={styles.preview}>
          <ImageDropzone
            label="Custom toolbar"
            width={350}
            height={570}
            imageSrc={image}
            onImageUpload={(img) => setImage(img ?? undefined)}
            actions={({ hasImage, openFilePicker, removeImage, exportCrop }) => (
              <>
                <UploadIcon onClick={openFilePicker} />
                {hasImage && (
                  <DownloadIcon
                    onClick={() => {
                      const dataUrl = exportCrop();
                      if (!dataUrl) return;
                      const a = document.createElement('a');
                      a.href = dataUrl;
                      a.download = 'cropped.png';
                      a.click();
                    }}
                  />
                )}
                <DeleteIcon disabled={!hasImage} onClick={removeImage} />
              </>
            )}
          />
        </div>
        <Code>{`import type { ActionContext } from '@milkybytes/image-dropzone';

<ImageDropzone
  width={350}
  height={570}
  imageSrc={image}
  onImageUpload={setImage}
  actions={({ hasImage, openFilePicker, removeImage, exportCrop }) => (
    <>
      <UploadIcon onClick={openFilePicker} />
      <DownloadIcon
        disabled={!hasImage}
        onClick={() => {
          const dataUrl = exportCrop();
          if (dataUrl) downloadFile(dataUrl, 'cropped.png');
        }}
      />
      <DeleteIcon disabled={!hasImage} onClick={removeImage} />
    </>
  )}
/>`}</Code>
      </div>
    </section>
  );
}
