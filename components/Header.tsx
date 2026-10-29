'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Project Matcher', id: 'project-matcher' },
    { href: '/blueprint', label: 'My Blueprint', id: 'my-blueprint' },
    { href: '/dashboard', label: 'Organizer Dashboard', id: 'organizer-dashboard' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest border-b border-surface-container-high/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-[1200px] mx-auto px-gutter flex items-center justify-between gap-space-md">
        {/* Brand */}
        <div className="flex items-center gap-space-md shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              alt="Campus Growth Engine Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9AfHNEPzs5GRVdSuvZpRdxWCo5NP3dXDxCydhH_q2yRgj-EnmWhqnJr9piP1ECr_p1MBAwi1OU9-ETMH7iFz8Bpgy1Jjr57l6Mb60-sVBlmE0VmRUMaZu9qPUMH0i3x2Gpf5SoU2pmrQKjqSmX4DJz0DsK48Wy7W-3vW1cvmg5L8in2m63amOADaPOWUhoGFr9jMvwc4nYgEtOnFUusxF_60CTJ_xRjOmtU0Eez5g"
            />
            <div className="flex items-center gap-space-sm">
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                Campus Growth Engine
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-badge-caption text-badge-caption uppercase font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Free AI Workshop
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-space-lg">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.id}
                href={link.href}
                className={`py-2 transition-colors ${
                  active
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'font-label-md text-label-md text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Session Pill & Community */}
        <div className="flex items-center gap-space-md shrink-0">
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px] text-primary">calendar_clock</span>
            <span>Workshop: Saturday, 6:00 PM IST (Target Cohort)</span>
          </div>

          <a
            href="https://nxtwave.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
          >
            NxtWave Community
          </a>

          <Link
            href="/dashboard"
            title="Organizer Console"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary-container transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container"
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-b border-surface-container-high px-gutter py-4 flex flex-col gap-3 shadow-md animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2 px-3 rounded-lg font-label-md ${
                isActive(link.href)
                  ? 'bg-primary-container text-on-primary-container font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-surface-container flex flex-col gap-2 text-label-sm text-on-surface-variant">
            <div className="flex items-center gap-1.5 py-1">
              <span className="material-symbols-outlined text-[16px] text-primary">calendar_clock</span>
              <span>Saturday, 6:00 PM IST (60 Mins)</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
