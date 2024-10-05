'use client'

import Link from 'next/link';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from "@nextui-org/react";

type NavLinkProps = {
  href: string;
  text: string;
};

const NavLink: React.FC<NavLinkProps> = ({ href, text }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const activeClasses = "bg-gray-200 text-black";
  const inactiveClasses = "hover:bg-gray-100 hover:text-gray-800";

  return (
    <Link href={href}>
      <button className={`px-4 py-2 rounded transition-colors ${isActive ? activeClasses : inactiveClasses}`}>
        {text}
      </button>
    </Link>
  );
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-400 text-black shadow-sm z-25">
        <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
            {/* Logo and left-side links */}
            <div className="flex items-center space-x-8">
                <Link href="/">
                <button className="text-xl font-bold text-blue-600 transition-colors">HSGS Hackathon 2024</button>
                </Link>
                <button className="text-xl md:hidden hover:bg-blue-200" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                &#9776;
                </button>
                <nav className={`md:flex md:space-x-4 ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
                    <NavLink href="/speaking" text="Speaking" />
                    <NavLink href="/pron" text="Pronunciation" />
                    <NavLink href="/prices" text="Prices" />
                </nav>
            </div>

            {/* Right-side links */}
            <div className="hidden md:flex items-center space-x-4">
                <Link href="/photos">
                <button className="px-6 py-2 bg-white text-black rounded shadow hover:bg-blue-200 transition-colors">
                    Log In
                </button>
                </Link>
                <Link href="/photos">
                <button className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-600 transition-colors">
                    Sign Up
                </button>
                </Link>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
