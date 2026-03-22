import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';

import { buildDropzoneThemeVars, ImageDropzoneTheme } from '../theme';
import DeleteIcon from '../icons/DeleteIcon';
import UploadIcon from '../icons/UploadIcon';
import styles from './ImageDropzone.module.css';
import DownloadIcon from '../icons/DownloadIcon';

export interface ActionContext {
  /** Whether an image is currently loaded */
  hasImage: boolean;
  /** Opens the native file picker */
  openFilePicker: () => void;
  /** Removes the current image */
  removeImage: () => void;
  /** Exports the currently-visible cropped area as a PNG data URL */
  exportCrop: () => string | undefined;
}

/**
 * Imperative handle exposed via ref. Use this to call exportCrop, openFilePicker,
 * or removeImage from outside the component (e.g. a "Download All" button).
 */
export interface ImageDropzoneHandle {
  /** Returns a PNG data URL of the currently-visible cropped area, or undefined if no image is loaded */
  exportCrop: () => string | undefined;
  /** Programmatically opens the native file picker */
  openFilePicker: () => void;
  /** Programmatically removes the current image */
  removeImage: () => void;
}

export interface ImageDropzoneProps {
  /** Placeholder label shown when no image is loaded */
  label?: string;
  /** Logical width of the dropzone in pixels (used for aspect ratio + transform normalization) */
  width: number;
  /** Logical height of the dropzone in pixels (used for aspect ratio) */
  height: number;
  /** Base64 or URL of the image to display */
  imageSrc?: string;
  /**
   * Called when the user pans or zooms the image.
   * Position and scale are normalized relative to the logical width/height.
   */
  onImageTransform?: (position: { x: number; y: number }, scale: number) => void;
  /** Called with a base64 data URL when an image is uploaded, or null when deleted */
  onImageUpload?: (image: string | null) => void;
  /**
   * Render prop for the action toolbar. Receives an ActionContext with helpers
   * (openFilePicker, removeImage, exportCrop, hasImage) so you can compose
   * any layout of icons you need. Defaults to an upload + delete icon when omitted.
   */
  actions?: (ctx: ActionContext) => React.ReactNode;
  /** When true, hides the action toolbar and disables drag/drop */
  readOnly?: boolean;
  /**
   * Theme token overrides. Any CSS `--idz-*` variable can still be set globally
   * via CSS; this prop takes precedence and is applied inline, making it easy
   * to support multiple themes without global variables.
   */
  theme?: ImageDropzoneTheme;
  /** Extra class name added to the outermost wrapper element. */
  className?: string;
  /** Extra inline styles added to the outermost wrapper element. */
  style?: React.CSSProperties;
}

const ImageDropzone = React.memo(
  React.forwardRef<ImageDropzoneHandle, ImageDropzoneProps>((
    {
      label,
      width,
      height,
      imageSrc,
      onImageTransform = () => { },
      onImageUpload = () => { },
      actions,
      readOnly = false,
      theme,
      className,
      style,
    },
    ref,
  ) => {
    const [scale, setScale] = useState<number>(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [cursorStyle, setCursorStyle] = useState('grab');
    const dragOriginRef = useRef({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const [isHovered, setIsHovered] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [imageLoading, setImageLoading] = useState(!!imageSrc);
    const [displaySrc, setDisplaySrc] = useState(imageSrc);
    const [imageNaturalSize, setImageNaturalSize] = useState<{ width: number; height: number } | null>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    // Always-current ref used by stable event handlers to avoid stale closure issues
    const latestRef = useRef({ scale, position, containerSize, onImageTransform, width, height });
    useEffect(() => {
      latestRef.current = { scale, position, containerSize, onImageTransform, width, height };
    });

    useLayoutEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const observer = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      });

      observer.observe(container);
      return () => observer.disconnect();
    }, []);

    const updateTransform = (newPosition: { x: number; y: number }, newScale: number) => {
      const { containerSize: cs, width: w, height: h, onImageTransform: cb } = latestRef.current;
      if (!cs.width || !cs.height) return;

      const scaleRatioX = w / cs.width;
      const scaleRatioY = h / cs.height;

      setPosition(newPosition);
      setScale(newScale);
      cb(
        { x: newPosition.x * scaleRatioX, y: newPosition.y * scaleRatioY },
        newScale * Math.max(scaleRatioX, scaleRatioY),
      );
    };

    useEffect(() => {
      if (imageSrc !== displaySrc) {
        setImageLoading(true);
        setImageNaturalSize(null);
        const timer = setTimeout(() => setDisplaySrc(imageSrc), 300);
        return () => clearTimeout(timer);
      }
    }, [imageSrc, displaySrc]);

    const handleImageLoad = () => {
      setImageLoading(false);
      if (imageRef.current) {
        setImageNaturalSize({
          width: imageRef.current.naturalWidth,
          height: imageRef.current.naturalHeight,
        });
      }
    };

    useEffect(() => {
      if (imageLoading || !displaySrc || !imageNaturalSize || !containerSize.width || !containerSize.height) return;

      const { width: imgWidth, height: imgHeight } = imageNaturalSize;
      const newCoverScale = Math.max(containerSize.width / imgWidth, containerSize.height / imgHeight);
      const scaleRatio = newCoverScale / scale;

      const newX = position.x * scaleRatio;
      const newY = position.y * scaleRatio;

      const imgScaledWidth = imgWidth * newCoverScale;
      const imgScaledHeight = imgHeight * newCoverScale;

      const boundedX = Math.min(0, Math.max(newX, containerSize.width - imgScaledWidth));
      const boundedY = Math.min(0, Math.max(newY, containerSize.height - imgScaledHeight));

      updateTransform({ x: boundedX, y: boundedY }, newCoverScale);
    }, [containerSize.width, containerSize.height, imageNaturalSize, imageLoading]);

    const handleMouseDown = (event: React.MouseEvent<HTMLImageElement>) => {
      event.preventDefault();
      setCursorStyle('grabbing');
      isDraggingRef.current = true;
      dragOriginRef.current = {
        x: event.clientX - position.x,
        y: event.clientY - position.y,
      };
    };

    const handleDragMove = (event: MouseEvent) => {
      if (!isDraggingRef.current) return;
      event.preventDefault();
      updatePosition(event.clientX - dragOriginRef.current.x, event.clientY - dragOriginRef.current.y);
    };

    const handleDragStop = () => {
      isDraggingRef.current = false;
      setCursorStyle('grab');
    };

    useEffect(() => {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragStop);
      window.addEventListener('mouseleave', handleDragStop);
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragStop);
        window.removeEventListener('mouseleave', handleDragStop);
      };
    }, []);

    // Stable wheel handler — reads latest scale/position from ref so pan-then-zoom works correctly
    useEffect(() => {
      if (readOnly) return;
      const container = containerRef.current;
      if (!container) return;

      const onWheel = (event: WheelEvent) => {
        if (!imageRef.current || !containerRef.current) return;
        event.preventDefault();

        const { scale: cs, position: cp, containerSize: cSize, width: w, height: h, onImageTransform: cb } = latestRef.current;
        const cw = containerRef.current.clientWidth;
        const ch = containerRef.current.clientHeight;

        const minScale = Math.max(cw / imageRef.current.naturalWidth, ch / imageRef.current.naturalHeight);
        const newScale = Math.max(cs + event.deltaY * -0.001, minScale);

        const imgRect = imageRef.current.getBoundingClientRect();
        const pivotX = (event.clientX - imgRect.left) / cs;
        const pivotY = (event.clientY - imgRect.top) / cs;

        const newWidth = imageRef.current.naturalWidth * newScale;
        const newHeight = imageRef.current.naturalHeight * newScale;

        const newX = Math.min(0, Math.max(cp.x - pivotX * (newScale - cs), cw - newWidth));
        const newY = Math.min(0, Math.max(cp.y - pivotY * (newScale - cs), ch - newHeight));

        setPosition({ x: newX, y: newY });
        setScale(newScale);

        if (cSize.width && cSize.height) {
          const scaleRatioX = w / cSize.width;
          const scaleRatioY = h / cSize.height;
          cb(
            { x: newX * scaleRatioX, y: newY * scaleRatioY },
            newScale * Math.max(scaleRatioX, scaleRatioY),
          );
        }
      };

      container.addEventListener('wheel', onWheel, { passive: false });
      return () => container.removeEventListener('wheel', onWheel);
    }, [readOnly]);

    const updatePosition = (newX: number, newY: number) => {
      const { scale: s, containerSize: cs } = latestRef.current;
      if (!imageRef.current || !cs.width || !cs.height) return;
      const imgWidth = imageRef.current.naturalWidth * s;
      const imgHeight = imageRef.current.naturalHeight * s;
      updateTransform(
        {
          x: Math.min(0, Math.max(newX, cs.width - imgWidth)),
          y: Math.min(0, Math.max(newY, cs.height - imgHeight)),
        },
        s,
      );
    };

    const handleDragOver = (event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (event: React.DragEvent) => {
      event.preventDefault();
      processFile(event.dataTransfer.files[0]);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) processFile(file);
      if (inputRef.current) inputRef.current.value = '';
    };

    const processFile = (file: File) => {
      if (file?.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) onImageUpload?.(e.target.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const captureVisibleArea = (): string | undefined => {
      if (!imageRef.current || !containerSize.width || !containerSize.height) return undefined;
      const canvas = document.createElement('canvas');
      canvas.width = containerSize.width;
      canvas.height = containerSize.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return undefined;
      ctx.drawImage(
        imageRef.current,
        position.x,
        position.y,
        imageRef.current.naturalWidth * scale,
        imageRef.current.naturalHeight * scale,
      );
      return canvas.toDataURL('image/png');
    };

    useImperativeHandle(ref, () => ({
      exportCrop: captureVisibleArea,
      openFilePicker: () => inputRef.current?.click(),
      removeImage: () => onImageUpload?.(null),
    }));

    return (
      <div
        className={`${styles.dropzoneSizer}${className ? ` ${className}` : ''}`}
        style={{
          '--idz-width': `${width}px`,
          ...(theme ? buildDropzoneThemeVars(theme) : {}),
          ...style,
        } as React.CSSProperties}
      >
        <div
          ref={containerRef}
          className={styles.dropzone}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{ aspectRatio: `${width} / ${height}` }}
        >
          {displaySrc && (
            <img
              onMouseDown={readOnly ? undefined : handleMouseDown}
              onLoad={handleImageLoad}
              src={displaySrc}
              ref={imageRef}
              alt="Preview"
              style={{
                opacity: imageLoading ? 0 : 1,
                cursor: readOnly ? 'default' : cursorStyle,
                position: 'absolute',
                transition: 'opacity 0.5s ease-in-out',
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: '0 0',
                top: 0,
                left: 0,
              }}
            />
          )}
          {!displaySrc && label && (
            <div className={styles.label}>
              <span>{label}</span>
              <span style={{ fontSize: '0.75em', opacity: 0.6 }}>
                {width} × {height}
              </span>
            </div>
          )}
          {!readOnly && (
            <>
              <div className={`${styles.actions} ${isHovered ? styles['fade-in'] : ''}`}>
                {actions
                  ? actions({
                    hasImage: !!displaySrc,
                    openFilePicker: () => inputRef.current?.click(),
                    removeImage: () => onImageUpload?.(null),
                    exportCrop: captureVisibleArea,
                  })
                  : (
                    <>
                      <UploadIcon onClick={() => inputRef.current?.click()} />
                      <DownloadIcon onClick={() => {
                        const dataUrl = captureVisibleArea();
                        const href = dataUrl ?? displaySrc;
                        if (!href) return;
                        const a = document.createElement('a');
                        a.href = href;
                        a.download = 'cropped.png';
                        a.click();
                      }
                      }
                        disabled={!displaySrc}
                      />
                      <DeleteIcon disabled={!displaySrc} onClick={() => onImageUpload?.(null)} />
                    </>
                  )
                }
              </div>
              <input
                type="file"
                ref={inputRef}
                onChange={handleChange}
                style={{ display: 'none' }}
                accept="image/*"
              />
            </>
          )}
        </div>
      </div>
    );
  }),
);

ImageDropzone.displayName = 'ImageDropzone';

export default ImageDropzone;
