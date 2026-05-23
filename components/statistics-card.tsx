'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: number;
  icon?: React.ReactNode;
}

export function StatisticsCard({ title, value, subtext, trend, icon }: StatisticsCardProps) {
  const isPositive = trend ? trend >= 0 : false;

  return (
    <motion.div
      className="p-4 rounded-lg bg-card/50 backdrop-blur border border-border/50 hover:border-border transition-colors"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-primary">{icon}</div>}
      </div>

      <div className="space-y-2">
        <div className="text-2xl font-bold text-foreground">{value}</div>

        {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}

        {trend !== undefined && (
          <div className="flex items-center gap-1 pt-1">
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(trend)}% from last month
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
