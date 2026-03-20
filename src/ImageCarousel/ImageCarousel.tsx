import React from 'react';

import { buildCarouselThemeVars, ImageCarouselTheme } from '../theme';
import ImageDropzone, { type ActionContext } from '../ImageDropzone/ImageDropzone';
import ChevronLeftIcon from '../icons/ChevronLeftIcon';
import ChevronRightIcon from '../icons/ChevronRightIcon';
import DeleteIcon from '../icons/DeleteIcon';
import DownloadIcon from '../icons/DownloadIcon';
import ImageUploadIcon from '../icons/ImageUploadIcon';
import styles from './ImageCarousel.module.css';

export interface CarouselSlot {
  label: string;
}

export interface ImageCarouselProps {
  /** Logical width of each image slot in pixels */
  width: number;
  /** Logical height of each image slot in pixels */
  height: number;
  /** Metadata for each slot (currently just a label) */
  slots: CarouselSlot[];
  /** Base64/URL images corresponding to each slot (null = empty) */
  images: (string | null)[];
  /** Index of the currently visible slot */
  currentIndex: number;
  /** Called when the user uploads or clears an image in a slot */
  onImageUpload: (slotIndex: number, image: string | null) => void;
  /** Called when the user clicks download on a slot */
  onImageDownload?: (slotIndex: number) => void;
  /** Called when the user pans/zooms an image in a slot */
  onImageTransform?: (slotIndex: number, position: { x: number; y: number }, scale: number) => void;
  /** Called when the user navigates to a different slot */
  onIndexChange: (newIndex: number) => void;
  /**
   * If provided, shows left/right move arrows in the dropzone toolbar
   * so the user can reorder images between adjacent slots.
   */
  onCarouselImageMove?: (fromIndex: number, toIndex: number) => void;
  /**
   * Render prop for the action toolbar of each slot. Receives standard ActionContext
   * plus the current `slotIndex`. Overrides the default upload/move/download/delete toolbar.
   */
  actions?: (ctx: ActionContext & { slotIndex: number }) => React.ReactNode;
  /**
   * Theme token overrides. Covers both the inner dropzone and the carousel
   * nav buttons/dots. Supports multiple themes without any global CSS.
   */
  theme?: ImageCarouselTheme;
  /** Extra class name added to the outermost wrapper element. */
  className?: string;
  /** Extra inline styles added to the outermost wrapper element. */
  style?: React.CSSProperties;
}

const ImageCarousel = React.memo(({
  width,
  height,
  slots,
  images,
  currentIndex,
  onImageUpload = () => {},
  onImageDownload = () => {},
  onImageTransform = () => {},
  onIndexChange = () => {},
  onCarouselImageMove = () => {},
  actions,
  theme,
  className,
  style,
}: ImageCarouselProps) => {
  const handlePrevious = () => {
    onIndexChange(currentIndex === 0 ? slots.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    onIndexChange(currentIndex === slots.length - 1 ? 0 : currentIndex + 1);
  };

  const canMoveLeft = !!(images[currentIndex] && currentIndex > 0 && images[currentIndex - 1]);
  const canMoveRight = !!(
    images[currentIndex] &&
    currentIndex < slots.length - 1 &&
    images[currentIndex + 1]
  );

  return (
    <div
      className={`${styles.carouselContainer}${className ? ` ${className}` : ''}`}
      style={theme ? { ...buildCarouselThemeVars(theme), ...style } as React.CSSProperties : style}
    >
      <div className={styles.carouselWrapper}>
        <ImageDropzone
          label={slots[currentIndex].label}
          width={width}
          height={height}
          imageSrc={images[currentIndex] ?? undefined}
          onImageUpload={(image) => onImageUpload(currentIndex, image)}
          onImageTransform={(position, scale) => onImageTransform(currentIndex, position, scale)}
          actions={actions
            ? (ctx) => actions({ ...ctx, slotIndex: currentIndex })
            : (ctx) => (
                <>
                  <ImageUploadIcon onClick={ctx.triggerUpload} />
                  {onCarouselImageMove && canMoveLeft && (
                    <ChevronLeftIcon onClick={() => onCarouselImageMove(currentIndex, currentIndex - 1)} />
                  )}
                  {onCarouselImageMove && canMoveRight && (
                    <ChevronRightIcon onClick={() => onCarouselImageMove(currentIndex, currentIndex + 1)} />
                  )}
                  {onImageDownload && <DownloadIcon onClick={() => onImageDownload(currentIndex)} />}
                  <DeleteIcon disabled={!ctx.hasSrc} onClick={ctx.clearImage} />
                </>
              )
          }
        />

        <div className={styles.carouselControls}>
          <button type="button" className={styles.carouselButton} onClick={handlePrevious} aria-label="Previous image">
            <ChevronLeftIcon />
          </button>

          <div className={styles.carouselDots}>
            {slots.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.carouselDot} ${index === currentIndex ? styles.active : ''}`}
                onClick={() => onIndexChange(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button type="button" className={styles.carouselButton} onClick={handleNext} aria-label="Next image">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
});

export default ImageCarousel;
