// src/utils/classNameUtils.jsx

'use client';

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// The cn (className) utility function combines clsx and tailwind-merge to
// efficiently handle class name conflicts and combinations
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}