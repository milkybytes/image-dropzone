/** Token map for theming ImageDropzone. All fields are optional. */
export interface ImageDropzoneTheme {
  /** Dropzone background color. Default: `#1e1e2e` */
  bg?: string;
  /** Dropzone border shorthand, e.g. `2px solid #444`. Default: `none` */
  border?: string;
  /** Border color when the dropzone is hovered. Default: `#888` */
  borderHover?: string;
  /** Border radius. Default: `8px` */
  radius?: string;
  /** Label text color when the dropzone is empty. Default: `rgba(255,255,255,0.5)` */
  labelColor?: string;
  /** Background color of the hover action toolbar. Default: `#2a2a3e` */
  surface?: string;
  /** Icon hover/active accent color. Default: `#7c83d4` */
  accent?: string;
  /** Icon fill color. Default: `#ffffff` */
  iconColor?: string;
}

/** Token map for theming ImageCarousel (extends ImageDropzoneTheme). */
export interface ImageCarouselTheme extends ImageDropzoneTheme {
  /** Nav button background. Default: `rgba(0,0,0,0.6)` */
  carouselBtnBg?: string;
  /** Nav button border color. Default: `rgba(255,255,255,0.2)` */
  carouselBtnBorder?: string;
  /** Nav button icon fill color. Default: `#ffffff` */
  carouselBtnColor?: string;
  /** Inactive dot background. Default: `rgba(255,255,255,0.4)` */
  carouselDotBg?: string;
  /** Active dot background. Default: `rgba(255,255,255,0.9)` */
  carouselDotActiveBg?: string;
}

/** Map a theme object to a CSS custom property style object. */
export function buildDropzoneThemeVars(theme: ImageDropzoneTheme): React.CSSProperties {
  const map: Record<string, string | undefined> = {
    '--idz-bg': theme.bg,
    '--idz-border': theme.border,
    '--idz-border-hover': theme.borderHover,
    '--idz-radius': theme.radius,
    '--idz-label-color': theme.labelColor,
    '--idz-surface': theme.surface,
    '--idz-accent': theme.accent,
    '--idz-icon-color': theme.iconColor,
  };
  return Object.fromEntries(Object.entries(map).filter(([, v]) => v != null)) as React.CSSProperties;
}

/** Map a carousel theme object to a CSS custom property style object. */
export function buildCarouselThemeVars(theme: ImageCarouselTheme): React.CSSProperties {
  const carouselMap: Record<string, string | undefined> = {
    '--idz-carousel-btn-bg': theme.carouselBtnBg,
    '--idz-carousel-btn-border': theme.carouselBtnBorder,
    '--idz-carousel-btn-color': theme.carouselBtnColor,
    '--idz-carousel-dot-bg': theme.carouselDotBg,
    '--idz-carousel-dot-active-bg': theme.carouselDotActiveBg,
  };
  return {
    ...buildDropzoneThemeVars(theme),
    ...(Object.fromEntries(Object.entries(carouselMap).filter(([, v]) => v != null)) as React.CSSProperties),
  };
}
