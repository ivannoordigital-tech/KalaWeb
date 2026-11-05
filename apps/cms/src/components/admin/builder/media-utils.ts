export interface MediaLike {
  id?: string | number | null;
  url?: string | null;
  alt?: string | null;
  filename?: string | null;
}

function isMediaObject(value: unknown): value is MediaLike {
  return Boolean(value) && typeof value === 'object';
}

export function hasMediaValue(value: unknown): boolean {
  return value !== null && value !== undefined && value !== '';
}

export function getMediaThumbUrl(value: unknown): string | null {
  if (isMediaObject(value)) {
    return typeof value.url === 'string' && value.url ? value.url : null;
  }

  return typeof value === 'string' && value.startsWith('http') ? value : null;
}

export function getMediaDisplay(value: unknown): string {
  if (isMediaObject(value)) {
    // Jangan pernah mengakses properti dari null. typeof null === 'object'.
    return (
      (typeof value.alt === 'string' && value.alt.trim()) ||
      (typeof value.filename === 'string' && value.filename.trim()) ||
      (value.id !== null && value.id !== undefined ? `Media #${value.id}` : 'Media')
    );
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return value !== '' ? `ID Media: ${value}` : '';
  }

  return '';
}
