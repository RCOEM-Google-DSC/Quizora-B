"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const baseLinks = [
  { href: "/quizzes", label: "Quizzes" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();

  // Profile link only shows when the user is logged in
  const links = isAuthenticated
    ? [...baseLinks, { href: "/profile", label: "Profile" }]
    : baseLinks;

  const initial = user ? user.name.charAt(0).toUpperCase() : "";

  // Close the account menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b-[3px] border-ink bg-background">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-8">
        {/* Logo */}
        <Link href="/" className="display text-3xl" onClick={() => setMobileOpen(false)}>
          quizora-b<span className="qz-dot text-tomato">.</span>
        </Link>

        {/* Desktop */}
        <div className="mono hidden items-center gap-7 text-sm uppercase md:flex">
          <nav aria-label="Main" className="flex items-center gap-7">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="underline-offset-4 hover:underline">
                {l.label}
              </Link>
            ))}
          </nav>

          {isAuthenticated && user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-label="Account menu"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
                className="display flex size-11 items-center justify-center rounded-full bg-sun text-2xl normal-case"
              >
                {initial}
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+12px)] w-72 rounded-bl-[40px] border-[3px] border-ink bg-white p-5 normal-case"
                >
                  <p className="display text-2xl">{user.name}</p>
                  <p className="mono mt-1 truncate text-xs text-muted-foreground">{user.email}</p>
                  <Link
                    href="/profile"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="mono mt-5 block border-t-2 border-ink pt-4 text-sm uppercase underline-offset-4 hover:underline"
                  >
                    My profile &amp; history
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="display mt-4 w-full rounded-full bg-tomato py-3 text-xl"
                  >
                    log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="underline-offset-4 hover:underline">
                Log in
              </Link>
              <Link href="/register" className="display rounded-full bg-ink px-5 py-2 text-xl normal-case text-white">
                sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((o) => !o)}
          className="mono rounded-full border-[3px] border-ink px-4 py-1.5 text-sm uppercase md:hidden"
        >
          {mobileOpen ? "close" : "menu"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="bg-ink text-paper md:hidden">
          <nav aria-label="Mobile" className="mx-auto max-w-[1200px] px-8 py-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="display block border-b border-paper/20 py-3 text-4xl"
              >
                {l.label}
              </Link>
            ))}

            <div className="mt-6 flex flex-col gap-3">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="display flex size-11 items-center justify-center rounded-full bg-sun text-2xl text-ink">
                      {initial}
                    </span>
                    <div className="min-w-0">
                      <p className="display text-xl">{user.name}</p>
                      <p className="mono truncate text-xs text-concrete">{user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="display rounded-full bg-tomato py-3 text-2xl text-ink"
                  >
                    log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="display rounded-full border-[3px] border-paper py-3 text-center text-2xl"
                  >
                    log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="display rounded-full bg-sun py-3 text-center text-2xl text-ink"
                  >
                    sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}