'use client';

import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ count = 3, className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="h-24 bg-muted/20 rounded-lg overflow-hidden"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <div className="h-full w-full bg-gradient-to-r from-transparent via-muted to-transparent animate-pulse"></div>
        </motion.div>
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="space-y-3">
      <motion.div
        className="h-4 bg-muted/20 rounded"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.div
        className="h-8 bg-muted/20 rounded"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', delay: 0.1 }}
      />
      <motion.div
        className="h-4 bg-muted/20 rounded w-2/3"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', delay: 0.2 }}
      />
    </div>
  );
}
