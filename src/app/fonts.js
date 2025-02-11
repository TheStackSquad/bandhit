// src/app/fonts.js
import localFont from 'next/font/local';

export const roboto = localFont({
  src: '../fonts/RobotoSlab-Regular.woff', // ✅ Correct path inside `src/fonts/`
  variable: '--font-roboto',
  display: 'swap',
});

// export const RobotoRegular = localFont({
//   src: '../fonts/RobotoSlab-Regular.woff', // ✅ Correct path inside `src/fonts/`
//   variable: '--font-robotoRegular',
//   display: 'swap',
// });

export const zefani = localFont({
  src: '../fonts/ZefaniStencil_uppercase_-Regular.woff', // ✅ Correct path
  variable: '--font-zefani',
  display: 'swap',
});
