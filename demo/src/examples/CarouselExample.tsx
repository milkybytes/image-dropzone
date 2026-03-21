import { useState } from 'react';
import { ImageCarousel } from '@milkybytes/image-dropzone';
import styles from '../App.module.css';
import Code from './Code';

const SLOTS = [
  { label: 'Image 1' },
  { label: 'Image 2' },
  { label: 'Image 3' },
  { label: 'Image 4' },
];

export default function CarouselExample() {
  const [images, setImages] = useState<(string | null)[]>(Array(SLOTS.length).fill(null));
  const [index, setIndex] = useState(0);

  const handleUpload = (slot: number, img: string | null) => {
    setImages((prev) => {
      const next = [...prev];
      next[slot] = img;
      return next;
    });
  };

  const handleMove = (from: number, to: number) => {
    setImages((prev) => {
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  };

  return (
    <section id="carousel" className={styles.section}>
      <h2 className={styles.sectionTitle}>Carousel</h2>
      <p className={styles.sectionDesc}>
        A multi-slot carousel wrapping <code>ImageDropzone</code>. Navigate with
        prev/next buttons or dots. Enable drag-to-reorder
        with <code>onCarouselImageMove</code>.
      </p>
      <div className={styles.example}>
        <div className={styles.preview}>
          <ImageCarousel
            width={350}
            height={570}
            slots={SLOTS}
            images={images}
            currentIndex={index}
            onIndexChange={setIndex}
            onImageUpload={handleUpload}
            onImageDownload={(i) => {
              const src = images[i];
              if (!src) return;
              const a = document.createElement('a');
              a.href = src;
              a.download = `slot-${i}.png`;
              a.click();
            }}
            onImageTransform={() => {}}
            onCarouselImageMove={handleMove}
          />
          <div className={styles.slotStatus}>
            {SLOTS.map((slot, i) => (
              <div
                key={i}
                className={`${styles.slotChip} ${images[i] ? styles.slotChipFilled : ''}`}
              >
                {slot.label}
              </div>
            ))}
          </div>
        </div>
        <Code>{`import { ImageCarousel } from '@milkybytes/image-dropzone';

const SLOTS = [
  { label: 'Image 1' },
  { label: 'Image 2' },
  { label: 'Image 3' },
  { label: 'Image 4' },
];

const [images, setImages] = useState<(string | null)[]>(
  Array(SLOTS.length).fill(null),
);
const [index, setIndex] = useState(0);

<ImageCarousel
  width={350}
  height={570}
  slots={SLOTS}
  images={images}
  currentIndex={index}
  onIndexChange={setIndex}
  onImageUpload={(slot, img) => {
    setImages(prev => {
      const next = [...prev];
      next[slot] = img;
      return next;
    });
  }}
  onCarouselImageMove={(from, to) => {
    setImages(prev => {
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  }}
/>`}</Code>
      </div>
    </section>
  );
}
