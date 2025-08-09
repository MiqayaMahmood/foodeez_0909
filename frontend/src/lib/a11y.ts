/**
 * Utility functions for accessibility (a11y) improvements
 */

/**
 * Generates a unique ID for ARIA attributes
 * @param prefix - Prefix for the ID (default: 'id')
 * @returns A unique ID string
 */
export const generateId = (() => {
  let counter = 0;
  return (prefix = 'id') => `${prefix}-${++counter}`;
})();

/**
 * Handles keyboard interactions for interactive elements
 * @param callback - Function to call when the element is activated
 * @returns Event handlers for keyboard interactions
 */
export const handleKeyDown = (callback: () => void) => ({
  onKeyDown: (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  },
  role: 'button',
  tabIndex: 0,
});

/**
 * Visually hides an element while keeping it accessible to screen readers
 */
export const visuallyHidden = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute' as const,
  width: '1px',
  whiteSpace: 'nowrap' as const,
  wordWrap: 'normal' as const,
};

/**
 * Focus management for modals and dialogs
 */
export const focusManager = {
  /**
   * Traps focus within a container element
   * @param containerRef - Ref to the container element
   */
  trapFocus: (containerRef: React.RefObject<HTMLElement>) => {
    const focusableElements = containerRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  },
};

/**
 * Gets the contrast ratio between two colors
 * @param color1 - First color in hex format (e.g., '#ffffff')
 * @param color2 - Second color in hex format (e.g., '#000000')
 * @returns Contrast ratio between the two colors
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const [r1, g1, b1] = [r, g, b].map((c) => {
      if (c <= 0.03928) return c / 12.92;
      return Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Determines if text should be dark or light based on background color
 * @param backgroundColor - Background color in hex format (e.g., '#ffffff')
 * @returns 'dark' or 'light' depending on which provides better contrast
 */
export const getTextColorForBackground = (backgroundColor: string): 'dark' | 'light' => {
  const whiteContrast = getContrastRatio(backgroundColor, '#ffffff');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');
  
  // WCAG requires a contrast ratio of at least 4.5:1 for normal text
  if (whiteContrast >= 4.5) return 'light';
  if (blackContrast >= 4.5) return 'dark';
  
  // Fallback to the higher contrast option
  return whiteContrast > blackContrast ? 'light' : 'dark';
};
