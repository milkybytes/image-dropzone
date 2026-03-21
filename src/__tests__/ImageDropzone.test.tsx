import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageDropzone from '../ImageDropzone/ImageDropzone';

describe('ImageDropzone', () => {
    describe('Rendering', () => {
        it('renders the label when no image is provided', () => {
            render(<ImageDropzone width={350} height={570} label="Drop here" />);
            expect(screen.getByText('Drop here')).toBeInTheDocument();
        });

        it('renders the dimensions in the label area', () => {
            const { container } = render(<ImageDropzone width={350} height={570} label="Drop here" />);
            const label = container.querySelector('[class*="label"]')!;
            expect(label.textContent).toContain('350 × 570');
        });

        it('renders an image when imageSrc is provided', () => {
            render(<ImageDropzone width={350} height={570} imageSrc="data:image/png;base64,abc" />);
            const img = screen.getByAltText('Preview');
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('src', 'data:image/png;base64,abc');
        });

        it('hides the label when an image is loaded', () => {
            const { container } = render(<ImageDropzone width={350} height={570} label="Drop here" imageSrc="data:image/png;base64,abc" />);
            expect(container.querySelector('[class*="label"]')).not.toBeInTheDocument();
        });

        it('sets the aspect ratio from width/height', () => {
            const { container } = render(<ImageDropzone width={350} height={570} />);
            const dropzone = container.querySelector('[class*="dropzone"]:not([class*="Sizer"])')!;
            expect(dropzone.getAttribute('style')).toContain('aspect-ratio: 350 / 570');
        });
    });


    describe('Read Only Mode', () => {
        it('hides the action toolbar when readOnly is true', () => {
            const { container } = render(
                <ImageDropzone width={350} height={570} readOnly imageSrc="data:image/png;base64,abc" />,
            );
            expect(container.querySelector('[class*="actions"]')).not.toBeInTheDocument();
        });

        it('hides the file input when readOnly is true', () => {
            const { container } = render(
                <ImageDropzone width={350} height={570} readOnly />,
            );
            expect(container.querySelector('input[type="file"]')).not.toBeInTheDocument();
        });

        it('shows the action toolbar when readOnly is false', () => {
            const { container } = render(<ImageDropzone width={350} height={570} />);
            expect(container.querySelector('[class*="actions"]')).toBeInTheDocument();
        });

    });

    describe('File-Upload', () => {
        it('calls onImageUpload when a file is dropped', async () => {
            const onUpload = vi.fn();
            const { container } = render(
                <ImageDropzone width={350} height={570} onImageUpload={onUpload} />,
            );
            const dropzone = container.querySelector('[class*="dropzone"]:not([class*="Sizer"])')!;

            const file = new File(['pixels'], 'photo.png', { type: 'image/png' });

            const mockResult = 'data:image/png;base64,bW9jaw==';
            const originalFileReader = globalThis.FileReader;
            let capturedReader: any;
            globalThis.FileReader = class {
                onload: any = null;
                result = mockResult;
                readAsDataURL() {
                    capturedReader = this;
                    Promise.resolve().then(() => this.onload({ target: { result: mockResult } }));
                }
            } as any;

            fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

            await vi.waitFor(() => {
                expect(onUpload).toHaveBeenCalledWith(mockResult);
            });
            globalThis.FileReader = originalFileReader;
        });

        it('ignores non-image files on drop', () => {
            const onUpload = vi.fn();
            const { container } = render(
                <ImageDropzone width={350} height={570} onImageUpload={onUpload} />,
            );
            const dropzone = container.querySelector('[class*="dropzone"]:not([class*="Sizer"])')!;

            const file = new File(['text'], 'readme.txt', { type: 'text/plain' });
            fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

            expect(onUpload).not.toHaveBeenCalled();
        });

        it('calls onImageUpload via file input change', async () => {
            const onUpload = vi.fn();
            const { container } = render(
                <ImageDropzone width={350} height={570} onImageUpload={onUpload} />,
            );
            const input = container.querySelector('input[type="file"]')!;

            const file = new File(['pixels'], 'photo.png', { type: 'image/png' });
            const mockResult = 'data:image/png;base64,bW9jaw==';
            const originalFileReader = globalThis.FileReader;
            globalThis.FileReader = class {
                onload: any = null;
                result = mockResult;
                readAsDataURL() {
                    Promise.resolve().then(() => this.onload({ target: { result: mockResult } }));
                }
            } as any;

            fireEvent.change(input, { target: { files: [file] } });

            await vi.waitFor(() => {
                expect(onUpload).toHaveBeenCalledWith(mockResult);
            });
            globalThis.FileReader = originalFileReader;
        });
    });

    describe('Actions Render Prop', () => {
        it('renders default upload and delete icons when no actions prop', () => {
            const { container } = render(<ImageDropzone width={350} height={570} />);
            const toolbar = container.querySelector('[class*="actions"]')!;
            const svgs = toolbar.querySelectorAll('svg');
            expect(svgs.length).toBe(2); // upload + delete
        });

        it('renders custom actions via render prop', () => {
            render(
                <ImageDropzone
                    width={350}
                    height={570}
                    actions={({ hasImage, openFilePicker, removeImage }) => (
                        <button data-testid="custom-btn" onClick={openFilePicker}>
                            Custom
                        </button>
                    )}
                />,
            );
            expect(screen.getByTestId('custom-btn')).toBeInTheDocument();
        });

        it('passes hasImage=false when no image is loaded', () => {
            let capturedCtx: any;
            render(
                <ImageDropzone
                    width={350}
                    height={570}
                    actions={(ctx) => {
                        capturedCtx = ctx;
                        return null;
                    }}
                />,
            );
            expect(capturedCtx.hasImage).toBe(false);
        });

        it('passes hasImage=true when an image is loaded', () => {
            let capturedCtx: any;
            render(
                <ImageDropzone
                    width={350}
                    height={570}
                    imageSrc="data:image/png;base64,abc"
                    actions={(ctx) => {
                        capturedCtx = ctx;
                        return null;
                    }}
                />,
            );
            expect(capturedCtx.hasImage).toBe(true);
        });

        it('removeImage calls onImageUpload with null', () => {
            const onUpload = vi.fn();
            let capturedCtx: any;
            render(
                <ImageDropzone
                    width={350}
                    height={570}
                    onImageUpload={onUpload}
                    actions={(ctx) => {
                        capturedCtx = ctx;
                        return <button data-testid="clear" onClick={ctx.removeImage} />;
                    }}
                />,
            );
            fireEvent.click(screen.getByTestId('clear'));
            expect(onUpload).toHaveBeenCalledWith(null);
        });
    });

    describe('Theming', () => {
        it('applies theme tokens as CSS custom properties', () => {
            const { container } = render(
                <ImageDropzone width={350} height={570} theme={{ bg: '#ff0000', accent: '#00ff00' }} />,
            );
            const sizer = container.firstElementChild as HTMLElement;
            expect(sizer.style.getPropertyValue('--idz-bg')).toBe('#ff0000');
            expect(sizer.style.getPropertyValue('--idz-accent')).toBe('#00ff00');
        });

        it('sets --idz-width from the width prop', () => {
            const { container } = render(<ImageDropzone width={200} height={300} />);
            const sizer = container.firstElementChild as HTMLElement;
            expect(sizer.style.getPropertyValue('--idz-width')).toBe('200px');
        });

    });

    describe('Style Passthrough', () => {

        it('applies custom className to the outer wrapper', () => {
            const { container } = render(<ImageDropzone width={350} height={570} className="my-class" />);
            expect(container.firstElementChild).toHaveClass('my-class');
        });

        it('merges custom style onto the outer wrapper', () => {
            const { container } = render(
                <ImageDropzone width={350} height={570} style={{ margin: '10px' }} />,
            );
            const sizer = container.firstElementChild as HTMLElement;
            expect(sizer.style.margin).toBe('10px');
        });

    });


    describe('Hover State', () => {
        it('adds fade-in class on mouse enter', () => {
            const { container } = render(<ImageDropzone width={350} height={570} />);
            const dropzone = container.querySelector('[class*="dropzone"]:not([class*="Sizer"])')!;
            const toolbar = container.querySelector('[class*="actions"]')!;

            fireEvent.mouseEnter(dropzone);
            expect(toolbar.className).toMatch(/fade.?in/);
        });

        it('removes fade-in class on mouse leave', () => {
            const { container } = render(<ImageDropzone width={350} height={570} />);
            const dropzone = container.querySelector('[class*="dropzone"]')!;
            const toolbar = container.querySelector('[class*="actions"]')!;

            fireEvent.mouseEnter(dropzone);
            fireEvent.mouseLeave(dropzone);
            expect(toolbar.className).not.toContain('fade-in');
        });
    });
});
