'use client';

import { useAuth } from '@/lib/auth-store';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AuthModal } from './auth-modal';

interface ProtectedFeatureProps {
  children: React.ReactNode;
  featureName?: string;
}

export function ProtectedFeature({ children, featureName = 'Feature' }: ProtectedFeatureProps) {
  const { isAuthenticated } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Blurred content */}
          <div className="blur-sm pointer-events-none select-none">
            {children}
          </div>

          {/* Overlay with login prompt */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center space-y-4">
              <Lock className="w-8 h-8 mx-auto text-muted-foreground" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">{featureName} is Protected</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sign in to access this feature
                </p>
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </>
    );
  }

  return <>{children}</>;
}
