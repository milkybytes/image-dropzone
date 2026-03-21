# @milkybytes/image-dropzone

[![CI](https://github.com/milkybytes/image-dropzone/actions/workflows/main.yml/badge.svg)](https://github.com/milkybytes/image-dropzone/actions/workflows/main.yml)
[![npm](https://img.shields.io/npm/v/@milkybytes/image-dropzone)](https://www.npmjs.com/package/@milkybytes/image-dropzone)
[![license](https://img.shields.io/github/license/milkybytes/image-dropzone)](./LICENSE)

A React component library for drag-and-drop image upload with pan, zoom, and multi-slot carousels. Fully themeable via CSS custom properties — no Tailwind or other framework required.

**[Live Demo →](https://milkybytes.github.io/image-dropzone/)**

## Installation

```bash
npm install @milkybytes/image-dropzone
```

Import the stylesheet:

```ts
import '@milkybytes/image-dropzone/dist/style.css';
```

## Usage

```tsx
import { ImageDropzone } from '@milkybytes/image-dropzone';

function App() {
  const [image, setImage] = useState<string>();

  return (
    <ImageDropzone
      width={300}
      height={400}
      imageSrc={image}
      onImageUpload={(src) => setImage(src ?? undefined)}
    />
  );
}
```

Requires React 17+.

## License

MIT
