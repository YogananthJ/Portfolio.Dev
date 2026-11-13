/**
 * Image Accessibility Helpers
 *
 * Ensures every <img> either carries a meaningful, non-whitespace alt description
 * or is explicitly marked as decorative (`decorative: true` -> `alt=""` + `aria-hidden="true"`).
 */

export type AccessibleImageAltConfig =
  | {
      decorative: true;
      alt?: '';
    }
  | {
      decorative?: false;
      alt: string;
    };

export interface ImageAltValidationResult {
  valid: boolean;
  reason?: string;
}

export function validateImageAlt(
  alt: string | undefined,
  decorative = false
): ImageAltValidationResult {
  if (decorative) {
    if (alt !== undefined && alt !== '') {
      return {
        valid: false,
        reason: 'Decorative images must use an empty string alt="" attribute.',
      };
    }
    return { valid: true };
  }

  if (typeof alt !== 'string') {
    return {
      valid: false,
      reason: 'Non-decorative <img> elements must define an explicit alt attribute.',
    };
  }

  if (alt.length === 0) {
    return { valid: true };
  }

  if (alt.trim().length === 0) {
    return {
      valid: false,
      reason: 'Image alt attribute cannot contain only whitespace characters.',
    };
  }

  return { valid: true };
}

/**
 * Returns type-safe, accessible alt & aria-hidden props for <img> elements.
 */
export function getAccessibleImageProps(config: AccessibleImageAltConfig): {
  alt: string;
  'aria-hidden'?: true;
} {
  if (config.decorative) {
    return {
      alt: '',
      'aria-hidden': true,
    };
  }

  const trimmed = typeof config.alt === 'string' ? config.alt.trim() : '';
  if (!trimmed) {
    if (typeof console !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.warn(
        '[a11y] getAccessibleImageProps received an empty alt string without decorative: true.'
      );
    }
    return { alt: '' };
  }

  return { alt: trimmed };
}
