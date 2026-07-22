'use client';

import { motion } from 'framer-motion';

interface FlowConnectionProps {
  color?: string;
  active?: boolean;
  label?: string;
}

export default function FlowConnection({
  color = '#a855f7',
  active = false,
  label,
}: FlowConnectionProps) {
  return (
    <div className="relative flex flex-col items-center py-1">
      {/* Animated label */}
      {label && (
        <span className="text-[10px] text-gray-500 mb-1 italic">{label}</span>
      )}

      {/* Vertical line */}
      <div
        className="relative h-8 w-0.5 overflow-hidden rounded-full"
        style={{ backgroundColor: `${color}20` }}
      >
        <motion.div
          className="absolute inset-x-0 h-4 rounded-full"
          style={{
            background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
          }}
          animate={{ y: ['-100%', '200%'] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Flowing particles */}
      {active &&
        [0, 0.4, 0.8].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`,
            }}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 30, opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay,
              ease: 'easeIn',
            }}
          />
        ))}
    </div>
  );
}