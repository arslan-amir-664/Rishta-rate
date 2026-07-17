'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ScoreMeterProps {
  score: number;
  label: string;
  color: 'red' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
}

const colorMap = {
  red: {
    light: '#fecaca',
    dark: '#dc2626',
    gradient: 'from-red-500 to-red-700',
  },
  green: {
    light: '#bbf7d0',
    dark: '#16a34a',
    gradient: 'from-green-500 to-green-700',
  },
  yellow: {
    light: '#fef08a',
    dark: '#eab308',
    gradient: 'from-yellow-500 to-yellow-700',
  },
};

const sizeMap = {
  sm: { radius: 45, strokeWidth: 4, fontSize: '14px' },
  md: { radius: 60, strokeWidth: 5, fontSize: '18px' },
  lg: { radius: 80, strokeWidth: 6, fontSize: '24px' },
};

export function ScoreMeter({ score, label, color, size = 'md' }: ScoreMeterProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const config = sizeMap[size];
  const colors = colorMap[color];
  const circumference = 2 * Math.PI * config.radius;
  const offset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    let animationId: NodeJS.Timeout;
    if (displayScore < score) {
      animationId = setTimeout(() => {
        setDisplayScore(prev => Math.min(prev + 0.1, score));
      }, 10);
    }
    return () => clearTimeout(animationId);
  }, [displayScore, score]);

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={config.radius * 2 + 10}
          height={config.radius * 2 + 10}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.radius + 5}
            cy={config.radius + 5}
            r={config.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-muted opacity-20"
          />
          {/* Progress circle */}
          <motion.circle
            cx={config.radius + 5}
            cy={config.radius + 5}
            r={config.radius}
            fill="none"
            stroke={colors.dark}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <motion.div
            className="text-2xl font-bold"
            style={{
              color: colors.dark,
              fontSize: config.fontSize,
            }}
          >
            {displayScore.toFixed(1)}
          </motion.div>
          <div className="text-xs text-muted-foreground">/100</div>
        </div>
      </div>
      <div className="text-center">
        <h4 className="font-semibold text-foreground text-sm">{label}</h4>
      </div>
    </motion.div>
  );
}
