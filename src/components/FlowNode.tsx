'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { FlowNodeData } from '@/lib/types';
import { COLORS } from '@/lib/constants';

interface FlowNodeProps {
  node: FlowNodeData;
  index: number;
  isActive?: boolean;
  onTap?: () => void;
}

export default function FlowNode({ node, index, isActive, onTap }: FlowNodeProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.12,
        type: 'spring',
        stiffness: 120,
        damping: 14,
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        setExpanded(!expanded);
        onTap?.();
      }}
      className="relative cursor-pointer w-full max-w-sm mx-auto"
      style={{ zIndex: expanded ? 50 : 10 }}
    >
      {/* Glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl blur-xl"
        style={{ backgroundColor: node.glowColor }}
        animate={{
          opacity: isActive ? [0.4, 0.8, 0.4] : [0.2, 0.4, 0.2],
          scale: isActive ? [1, 1.05, 1] : [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Card */}
      <div
        className="relative rounded-2xl border p-4 backdrop-blur-md"
        style={{
          backgroundColor: COLORS.cardBg,
          borderColor: expanded ? node.color : COLORS.border,
          boxShadow: expanded
            ? `0 0 30px ${node.glowColor}, inset 0 0 20px rgba(0,0,0,0.3)`
            : `0 4px 20px rgba(0,0,0,0.4)`,
        }}
      >
        {/* Top row */}
        <div className="flex items-center gap-3">
          <motion.div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
            style={{
              background: `linear-gradient(135deg, ${node.color}40, ${node.color}10)`,
              border: `1px solid ${node.color}60`,
            }}
            animate={
              isActive
                ? { boxShadow: [`0 0 10px ${node.color}`, `0 0 25px ${node.color}`, `0 0 10px ${node.color}`] }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {node.icon}
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold truncate" style={{ color: node.color }}>
              {node.title}
            </h3>
            <p className="text-xs text-gray-400 truncate">{node.subtitle}</p>
          </div>
        </div>

        {/* Expandable details */}
        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          {node.details && (
            <ul className="mt-3 space-y-1.5 border-t pt-3" style={{ borderColor: `${node.color}30` }}>
              {node.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <span style={{ color: node.color }}>&#9656;</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
