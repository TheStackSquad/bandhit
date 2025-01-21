// src/app/fonts.js
import localFont from 'next/font/local'

export const novaFlat = localFont({
  src: '../Fontz/NovaFlat-Regular.woff2',
  variable: '--font-nova-flat',
  display: 'swap',
})

export const josefin = localFont({
  src: '../Fontz/JosefinSans-Regular.woff2',
  variable: '--font-josefin',
  display: 'swap',
})