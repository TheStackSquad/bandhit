//src/lib/svgFonts/svgFonts.jsx

import React from 'react';

export const ArrowLeftIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

export const CheckIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`h-5 w-5 ${className}`}
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export const EyeIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`h-5 w-5 ${className}`}
  >
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path
      fillRule="evenodd"
      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
      clipRule="evenodd"
    />
  </svg>
);

// Add more icons as needed
export const ArrowRightIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`h-5 w-5 ${className}`}
  >
    <path
      fillRule="evenodd"
      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

//HUB GRID

export const PaletteIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="13.5" cy="6.5" r=".5" />
    <circle cx="17.5" cy="10.5" r=".5" />
    <circle cx="8.5" cy="7.5" r=".5" />
    <circle cx="6.5" cy="12.5" r=".5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

export const StoreIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
  </svg>
);

export const SortAscIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M11 11h4" />
    <path d="M11 15h7" />
    <path d="M11 19h10" />
    <path d="m9 7 2-2 2 2" />
    <path d="M4 7h6" />
  </svg>
);

export const SortDescIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M11 5h4" />
    <path d="M11 9h7" />
    <path d="M11 13h10" />
    <path d="m3 17 2 2 2-2" />
    <path d="M6 18v-4" />
  </svg>
);

export const FilterIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

export const XIcon = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const TwitterIcon = ({ className = 'w-6 h-6', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M23.954 4.569c-.885.39-1.83.654-2.825.775a4.958 4.958 0 0 0 2.163-2.723 9.857 9.857 0 0 1-3.125 1.184 4.92 4.92 0 0 0-8.384 4.482A13.978 13.978 0 0 1 1.64 3.15 4.916 4.916 0 0 0 3.17 9.723 4.902 4.902 0 0 1 .964 9v.061a4.926 4.926 0 0 0 3.947 4.827 4.918 4.918 0 0 1-2.212.084 4.926 4.926 0 0 0 4.6 3.42A9.86 9.86 0 0 1 0 20.414a13.927 13.927 0 0 0 7.548 2.212c9.05 0 13.998-7.498 13.998-13.998 0-.213-.005-.425-.015-.636a10.005 10.005 0 0 0 2.463-2.55l.001-.003z" />
  </svg>
);

export const InstagramIcon = ({ className = 'w-6 h-6', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.319 3.608 1.293.974.975 1.23 2.242 1.293 3.608.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.062 1.366-.319 2.633-1.293 3.608-.975.974-2.242 1.23-3.608 1.293-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.366-.062-2.633-.319-3.608-1.293-.974-.975-1.23-2.242-1.293-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.849c.062-1.366.319-2.633 1.293-3.608.975-.974 2.242-1.23 3.608-1.293 1.265-.058 1.645-.07 4.849-.07zm0-2.163C8.575 0 8.146.012 7.05.07 5.793.132 4.58.389 3.685 1.285.985 3.985.132 6.575.07 7.05.012 8.146 0 8.575 0 12s.012 3.584.07 4.849c.062 1.366.319 2.633 1.293 3.608.975.974 2.242 1.23 3.608 1.293 1.265.058 1.645.07 4.849.07s3.584-.012 4.849-.07c-1.366-.062 2.633-.319 3.608-1.293.974-.975 1.23-2.242 1.293-3.608C23.988 15.584 24 15.204 24 12s-.012-3.584-.07-4.849z" />
  </svg>
);

export const FacebookIcon = ({ className = 'w-6 h-6', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const PhoneIcon = ({ className = 'w-6 h-6', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M3 2.25A1.5 1.5 0 0 1 4.5.75h3A1.5 1.5 0 0 1 9 2.25v1.5a1.5 1.5 0 0 1-1.5 1.5H6.21a16.933 16.933 0 0 0 6.08 6.08v-1.29a1.5 1.5 0 0 1 1.5-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-.75C10.574 17.25 6.75 13.426 6.75 8.25v-.75A1.5 1.5 0 0 1 8.25 6h3a1.5 1.5 0 0 1 1.5 1.5v1.5a1.5 1.5 0 0 1-1.5 1.5H9a.75.75 0 0 1 0-1.5h2.25a.75.75 0 0 0 .75-.75V7.5a.75.75 0 0 0-.75-.75H8.25a.75.75 0 0 0-.75.75v.75C7.5 13.59 11.91 18 17.25 18h.75a.75.75 0 0 0 .75-.75v-3a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v3a2.25 2.25 0 0 1-2.25 2.25h-.75C11.3 20.25 4.5 13.45 4.5 5.25V4.5A2.25 2.25 0 0 1 6.75 2.25h3a.75.75 0 0 0 0-1.5h-3A3.75 3.75 0 0 0 3 4.5v.75C3 13.69 10.31 21 19.5 21h.75A3.75 3.75 0 0 0 24 17.25v-3a3.75 3.75 0 0 0-3.75-3.75h-3A3.75 3.75 0 0 0 13.5 14.25v1.29a18.427 18.427 0 0 1-6.08-6.08H7.5A3.75 3.75 0 0 0 3.75 5.25v-.75z" />
  </svg>
);

export const HeartIcon = ({ className = 'w-6 h-6', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <path d="M12.001 4.529c2.349-2.532 6.15-2.532 8.499 0 2.225 2.396 2.225 6.29 0 8.686l-7.133 7.69a1.25 1.25 0 0 1-1.732 0l-7.134-7.69c-2.224-2.396-2.224-6.29 0-8.686 2.348-2.532 6.15-2.532 8.5 0z" />
  </svg>
);

export const BadgeCheckIcon = ({ className = 'w-6 h-6', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <path d="M13.828 4.252a2 2 0 0 0-3.656 0l-.262.637a1 1 0 0 1-.857.611l-.686.056a2 2 0 0 0-1.842 1.84l-.056.686a1 1 0 0 1-.612.857l-.636.262a2 2 0 0 0 0 3.656l.636.262a1 1 0 0 1 .612.857l.056.686a2 2 0 0 0 1.84 1.842l.686.056a1 1 0 0 1 .857.612l.262.636a2 2 0 0 0 3.656 0l.262-.636a1 1 0 0 1 .857-.612l.686-.056a2 2 0 0 0 1.842-1.842l.056-.686a1 1 0 0 1 .612-.857l.636-.262a2 2 0 0 0 0-3.656l-.636-.262a1 1 0 0 1-.612-.857l-.056-.686a2 2 0 0 0-1.842-1.84l-.686-.056a1 1 0 0 1-.857-.612l-.262-.637zM10.707 13.707l-2-2a1 1 0 1 1 1.414-1.414L11 11.586l2.879-2.879a1 1 0 1 1 1.414 1.414l-3.586 3.586a1 1 0 0 1-1.414 0z" />
  </svg>
);

