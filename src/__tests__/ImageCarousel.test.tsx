import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageCarousel from '../ImageCarousel/ImageCarousel';

const SLOTS = [{ label: 'Image 1' }, { label: 'Image 2' }, { label: 'Image 3' }];

function renderCarousel(overrides: Record<string, any> = {}) {
    const defaults = {
        width: 350,
        height: 570,
        slots: SLOTS,
        images: [null, null, null] as (string | null)[],
        currentIndex: 0,
        onImageUpload: vi.fn(),
        onIndexChange: vi.fn(),
        ...overrides,
    };
    return { ...render(<ImageCarousel {...defaults} />), props: defaults };
}

describe('ImageCarousel', () => {
    describe('Rendering', () => {
        it('renders the current slot label', () => {
            renderCarousel();
            expect(screen.getByText('Image 1')).toBeInTheDocument();
        });

        it('renders the correct label for a non-zero index', () => {
            renderCarousel({ currentIndex: 1 });
            expect(screen.getByText('Image 2')).toBeInTheDocument();
        });

        it('renders navigation dots matching the number of slots', () => {
            const { container } = renderCarousel();
            const dots = container.querySelectorAll('button[class*="carouselDot"]');
            expect(dots.length).toBe(3);
        });

        it('marks the active dot', () => {
            const { container } = renderCarousel({ currentIndex: 1 });
            const dots = container.querySelectorAll('button[class*="carouselDot"]');
            expect(dots[1].className).toContain('active');
            expect(dots[0].className).not.toContain('active');
        });
    });

    describe('Navigation', () => {
        it('calls onIndexChange with previous index on prev button', () => {
            const { container, props } = renderCarousel({ currentIndex: 2 });
            const prevBtn = container.querySelector('button[aria-label="Previous image"]')!;
            fireEvent.click(prevBtn);
            expect(props.onIndexChange).toHaveBeenCalledWith(1);
        });

        it('calls onIndexChange with next index on next button', () => {
            const { container, props } = renderCarousel({ currentIndex: 0 });
            const nextBtn = container.querySelector('button[aria-label="Next image"]')!;
            fireEvent.click(nextBtn);
            expect(props.onIndexChange).toHaveBeenCalledWith(1);
        });

        it('wraps to last slot when pressing prev on first slot', () => {
            const { container, props } = renderCarousel({ currentIndex: 0 });
            const prevBtn = container.querySelector('button[aria-label="Previous image"]')!;
            fireEvent.click(prevBtn);
            expect(props.onIndexChange).toHaveBeenCalledWith(2);
        });

        it('wraps to first slot when pressing next on last slot', () => {
            const { container, props } = renderCarousel({ currentIndex: 2 });
            const nextBtn = container.querySelector('button[aria-label="Next image"]')!;
            fireEvent.click(nextBtn);
            expect(props.onIndexChange).toHaveBeenCalledWith(0);
        });

        it('calls onIndexChange when clicking a dot', () => {
            const { container, props } = renderCarousel({ currentIndex: 0 });
            const dots = container.querySelectorAll('button[class*="carouselDot"]');
            fireEvent.click(dots[2]);
            expect(props.onIndexChange).toHaveBeenCalledWith(2);
        });
    });

    describe('Image Handling', () => {
        it('passes current slot image to the dropzone', () => {
            renderCarousel({
                images: ['data:image/png;base64,aaa', null, null],
                currentIndex: 0,
            });
            expect(screen.getByAltText('Preview')).toHaveAttribute('src', 'data:image/png;base64,aaa');
        });

        it('shows label when current slot has no image', () => {
            const { container } = renderCarousel({ images: [null, null, null], currentIndex: 0 });
            const label = container.querySelector('[class*="label"]')!;
            expect(label).toBeInTheDocument();
            expect(label.textContent).toContain('Image 1');
        });
    });

    describe('Carousel Image Move', () => {
        it('does not render move arrows when onCarouselImageMove is not provided', () => {
            const { container } = renderCarousel({
                images: ['data:a', 'data:b', null],
                currentIndex: 0,
            });
            const toolbar = container.querySelector('[class*="actions"]')!;
            // Default toolbar: upload + delete (no chevrons)
            const svgs = toolbar.querySelectorAll('svg');
            // Should only have upload, download(?), delete — no chevrons
            // Without onCarouselImageMove, no chevron icons are rendered
            expect(svgs.length).toBeLessThanOrEqual(3);
        });
    });

    describe('Theming', () => {
        it('applies carousel theme tokens as CSS custom properties', () => {
            const { container } = renderCarousel({
                theme: { carouselBtnBg: '#111', carouselDotActiveBg: '#222', bg: '#333' },
            });
            const wrapper = container.firstElementChild as HTMLElement;
            expect(wrapper.style.getPropertyValue('--idz-carousel-btn-bg')).toBe('#111');
            expect(wrapper.style.getPropertyValue('--idz-carousel-dot-active-bg')).toBe('#222');
            expect(wrapper.style.getPropertyValue('--idz-bg')).toBe('#333');
        });
    });

    describe('Style Passthrough', () => {
        it('applies custom className', () => {
            const { container } = renderCarousel({ className: 'my-carousel' });
            expect(container.firstElementChild).toHaveClass('my-carousel');
        });

        it('merges custom style', () => {
            const { container } = renderCarousel({ style: { padding: '8px' } });
            const wrapper = container.firstElementChild as HTMLElement;
            expect(wrapper.style.padding).toBe('8px');
        });
    });

    describe('Actions Render Prop', () => {
        it('passes slotIndex in actions context', () => {
            let capturedSlotIndex: number | undefined;
            renderCarousel({
                currentIndex: 2,
                actions: (ctx: any) => {
                    capturedSlotIndex = ctx.slotIndex;
                    return null;
                },
            });
            expect(capturedSlotIndex).toBe(2);
        });
    });
});
