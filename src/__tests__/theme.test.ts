import { describe, it, expect } from 'vitest';
import { buildDropzoneThemeVars, buildCarouselThemeVars } from '../theme';

describe('Theme Utilities', () => {
    describe('buildDropzoneThemeVars', () => {
        it('returns an empty object for an empty theme', () => {
            expect(buildDropzoneThemeVars({})).toEqual({});
        });

        it('maps bg to --idz-bg', () => {
            const result = buildDropzoneThemeVars({ bg: '#fff' });
            expect(result).toEqual({ '--idz-bg': '#fff' });
        });

        it('maps all dropzone tokens', () => {
            const result = buildDropzoneThemeVars({
                bg: '#1',
                border: '#2',
                borderHover: '#3',
                radius: '#4',
                labelColor: '#5',
                surface: '#6',
                accent: '#7',
                iconColor: '#8',
            });
            expect(result).toEqual({
                '--idz-bg': '#1',
                '--idz-border': '#2',
                '--idz-border-hover': '#3',
                '--idz-radius': '#4',
                '--idz-label-color': '#5',
                '--idz-surface': '#6',
                '--idz-accent': '#7',
                '--idz-icon-color': '#8',
            });
        });

        it('omits undefined values', () => {
            const result = buildDropzoneThemeVars({ bg: '#fff', accent: undefined });
            expect(result).toEqual({ '--idz-bg': '#fff' });
        });
    });

    describe('buildCarouselThemeVars', () => {
        it('includes both dropzone and carousel tokens', () => {
            const result = buildCarouselThemeVars({
                bg: '#aaa',
                carouselBtnBg: '#bbb',
                carouselDotActiveBg: '#ccc',
            });
            expect(result).toEqual({
                '--idz-bg': '#aaa',
                '--idz-carousel-btn-bg': '#bbb',
                '--idz-carousel-dot-active-bg': '#ccc',
            });
        });

        it('returns an empty object for an empty theme', () => {
            expect(buildCarouselThemeVars({})).toEqual({});
        });

        it('maps all carousel-specific tokens', () => {
            const result = buildCarouselThemeVars({
                carouselBtnBg: '#1',
                carouselBtnBorder: '#2',
                carouselBtnColor: '#3',
                carouselDotBg: '#4',
                carouselDotActiveBg: '#5',
            });
            expect(result).toEqual({
                '--idz-carousel-btn-bg': '#1',
                '--idz-carousel-btn-border': '#2',
                '--idz-carousel-btn-color': '#3',
                '--idz-carousel-dot-bg': '#4',
                '--idz-carousel-dot-active-bg': '#5',
            });
        });
    });
});
