'use client';

import { useAuth } from '@/lib/auth-store';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Menu, Moon, Sun, User, X } from 'lucide-react';
import { AuthModal } from './auth-modal';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent"></div>
              <span>RishtaRate</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors text-sm">
                Home
              </Link>
              <Link href="/calculator" className="text-foreground hover:text-primary transition-colors text-sm">
                Calculator
              </Link>
              <Link href="/analyzer" className="text-foreground hover:text-primary transition-colors text-sm">
                Analyzer
              </Link>
              <Link href="/simulator" className="text-foreground hover:text-primary transition-colors text-sm">
                Financial Simulator
              </Link>
              <Link href="/auntie" className="text-foreground hover:text-primary transition-colors text-sm">
                AI Auntie
              </Link>
              <Link href="/learn" className="text-foreground hover:text-primary transition-colors text-sm">
                Learn
              </Link>
              <Link href="/community" className="text-foreground hover:text-primary transition-colors text-sm">
                Stories
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}

              {isAuthenticated && user ? (
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{user.name}</span>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="text-xs font-semibold px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="hidden md:block text-sm font-semibold px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden pb-4 space-y-2 border-t border-border/50 pt-4"
            >
              <Link href="/" className="block px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors">
                Home
              </Link>
              <Link href="/calculator" className="block px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors">
                Calculator
              </Link>
              <Link href="/analyzer" className="block px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors">
                Analyzer
              </Link>
              <Link href="/simulator" className="block px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors">
                Financial Simulator
              </Link>
              <Link href="/auntie" className="block px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors">
                AI Auntie
              </Link>
              <Link href="/learn" className="block px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors">
                Learn
              </Link>
              <Link href="/community" className="block px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors">
                Stories
              </Link>
              {isAuthenticated && user ? (
                <>
                  <div className="px-3 py-2 text-sm text-muted-foreground">Signed in as {user.name}</div>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="block px-3 py-2 rounded-lg hover:bg-muted text-primary font-semibold">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-primary text-primary-foreground font-semibold"
                >
                  Sign In
                </button>
              )}
            </motion.div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
