import React from 'react';
import { motion } from 'framer-motion';
interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  className?: string;
}
export function ProgressBar({
  progress,
  showLabel = true,
  className = ''
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  return (
    <div className={`w-full ${className}`}>
      {showLabel &&
      <div className="flex justify-between items-center mb-2 text-sm font-medium">
          <span className="text-ink-secondary">Progress</span>
          <span className="text-ajo-600">{clampedProgress}%</span>
        </div>
      }
      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{
            width: 0
          }}
          animate={{
            width: `${clampedProgress}%`
          }}
          transition={{
            duration: 1,
            ease: 'easeOut'
          }}
          className="h-full bg-ajo-600 rounded-full" />
        
      </div>
    </div>);

}