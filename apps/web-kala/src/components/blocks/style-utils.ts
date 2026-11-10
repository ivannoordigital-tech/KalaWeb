/**
 * Token → Tailwind class maps for CMS style controls.
 *
 * Only static class strings live here, so Tailwind can always see them.
 * Never build class names dynamically from CMS values.
 */

export type StyleBlock = Record<string, any>;

const BACKGROUND_CLASSES: Record<string, string> = {
  none: '',
  cream: 'bg-[#FFF9F4]',
  white: 'bg-white',
  peach: 'bg-[#FFEFE5]',
  terracotta: 'bg-[#B3471E]',
  dark: 'bg-[#4B2E22]',
  gradient: 'bg-gradient-to-br from-[#FFF9F4] via-[#FFEFE5] to-[#F6DCCD]',
};

const PADDING_CLASSES: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6 md:p-8',
  lg: 'p-8 md:p-12',
  xl: 'p-10 md:p-16',
};

const MARGIN_CLASSES: Record<string, string> = {
  none: '',
  sm: 'my-2',
  md: 'my-4',
  lg: 'my-8',
};

const RADIUS_CLASSES: Record<string, string> = {
  none: '',
  md: 'rounded-xl',
  lg: 'rounded-3xl',
  full: 'rounded-full',
};

const SHADOW_CLASSES: Record<string, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-xl',
};

const ALIGN_CLASSES: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const MAX_WIDTH_CLASSES: Record<string, string> = {
  narrow: 'max-w-2xl',
  medium: 'max-w-4xl',
  wide: 'max-w-6xl',
  full: 'max-w-none',
};

const TEXT_COLOR_CLASSES: Record<string, string> = {
  ink: 'text-[#4B2E22]',
  muted: 'text-[#86675A]',
  accent: 'text-[#B3471E]',
  white: 'text-white',
};

const VISIBILITY_CLASSES: Record<string, string> = {
  all: '',
  desktop: 'hidden md:block',
  tablet: 'hidden md:block lg:hidden',
  mobile: 'block md:hidden',
};

const join = (...parts: Array<string | undefined>) => parts.filter(Boolean).join(' ');

/** Classes shared by containers and widgets. */
export function getStyleClasses(block: StyleBlock): string {
  return join(
    BACKGROUND_CLASSES[block?.styleBackground] ?? '',
    MARGIN_CLASSES[block?.styleMargin] ?? '',
    RADIUS_CLASSES[block?.styleRadius] ?? '',
    SHADOW_CLASSES[block?.styleShadow] ?? '',
    ALIGN_CLASSES[block?.styleAlign] ?? '',
    TEXT_COLOR_CLASSES[block?.styleTextColor] ?? '',
    VISIBILITY_CLASSES[block?.styleVisibility] ?? '',
  );
}

/** Padding is applied by the block shell, not by text widgets. */
export function getPaddingClass(block: StyleBlock): string {
  return PADDING_CLASSES[block?.stylePadding] ?? '';
}

export function getMaxWidthClass(block: StyleBlock): string {
  return MAX_WIDTH_CLASSES[block?.styleMaxWidth] ?? MAX_WIDTH_CLASSES.full;
}

export function getVisibilityClass(block: StyleBlock): string {
  return VISIBILITY_CLASSES[block?.styleVisibility] ?? '';
}

export function getTextColorClass(block: StyleBlock): string {
  return TEXT_COLOR_CLASSES[block?.styleTextColor] ?? TEXT_COLOR_CLASSES.ink;
}

export function getAlignClass(block: StyleBlock): string {
  return ALIGN_CLASSES[block?.styleAlign] ?? ALIGN_CLASSES.left;
}

/** Resolve a Payload media value (id, string URL, or object) to a URL. */
export function resolveMediaUrl(value: any): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && typeof value.url === 'string') return value.url;
  return null;
}
