import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utility function for hover lift effect
 * Applies: hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5
 */
export function cnHoverLift(...classes: (string | undefined)[]) {
  return cn('hover:shadow-xl hover:shadow-black/5 transition-all duration-200 hover:-translate-y-0.5', ...classes)
}
