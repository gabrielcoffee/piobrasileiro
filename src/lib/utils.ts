/**
 * Utility function to combine CSS class names
 * Simple replacement for the previous Tailwind-dependent cn function
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Utility function to conditionally apply CSS classes
 */
export function conditionalClass(condition: boolean, classIfTrue: string, classIfFalse?: string): string {
  return condition ? classIfTrue : (classIfFalse || '');
}
