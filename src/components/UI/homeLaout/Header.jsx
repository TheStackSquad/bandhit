// src/components/Header.jsx
"use client";
import Link from "next/link";
import DropdownUI from "@/components/motion/dropdown";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl">
        <Link href="/">
          <h1 className="text-xl font-bold text-blue-600 header-font">
            Bandhit
          </h1>
        </Link>
        <DropdownUI />
      </div>
    </header>
  );
}
