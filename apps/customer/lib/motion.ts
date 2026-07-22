/**
 * Named easing curves, mirroring the --ease-* custom properties in
 * globals.css. Framer Motion's `transition` prop needs a cubic-bezier
 * array, not a CSS var, so these are the same curves re-expressed for JS.
 */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const EASE_IN = [0.7, 0, 0.84, 0] as const
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const
