'use client';

import { motion } from 'framer-motion';
import { DEMO_METRICS } from '@/hooks/useProxyMetrics';
import { COLORS } from '@/lib/constants';

export default function ProviderChainDetail() {
  const data = DEMO_METRICS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto space-y-3"
    >
      <h3 className="text-center text-sm font-bold text-purple-400">Provider Chain Priority</h3>

      {Object.entries(data.providers).map(([name, provider], idx) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="rounded-xl border bg-black/40 p-3 backdrop-blur-md"
          style={{
            borderColor: `${provider.format === 'anthropic' ? COLORS.anthropic : COLORS.openai}40`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  backgroundColor: `${provider.format === 'anthropic' ? COLORS.anthropic : COLORS.openai}30`,
                  color: provider.format === 'anthropic' ? COLORS.anthropic : COLORS.openai,
                }}
              >
                {idx + 1}
              </span>
              <span className="text-xs font-medium text-white">{name}</span>
            </div>
            <span
              className="text-[10px]"
              style={{ color: provider.available > 0 ? COLORS.success : COLORS.error }}
            >
              {provider.available > 0 ? '● ACTIVE' : '● COOLDOWN'}
            </span>
          </div>

          {/* Key rows */}
          <div className="mt-2 space-y-1">
            {provider.keys.map((key) => (
              <div
                key={key.index}
                className="flex items-center justify-between text-[10px] text-gray-400"
              >
                <span>Key #{key.index}</span>
                <div className="flex items-center gap-3">
                  <span>Uses: {key.uses}</span>
                  <span style={{ color: key.failures > 0 ? COLORS.error : COLORS.textDim }}>
                    Fails: {key.failures}
                  </span>
                  <span
                    className="rounded px-1 py-0.5"
                    style={{
                      backgroundColor:
                        key.cooldown === 'none' ? `${COLORS.success}20` : `${COLORS.error}20`,
                      color: key.cooldown === 'none' ? COLORS.success : COLORS.error,
                    }}
                  >
                    {key.cooldown === 'none' ? 'READY' : `CD ${key.cooldown}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Fallback arrows */}
      <div className="space-y-1 text-center text-[10px] text-gray-600">
        <p>&#8595; 429 / 5xx triggers fallback</p>
        <p>&#8595; All keys exhausted &#8594; next provider</p>
        <p>&#8595; All providers exhausted &#8594; 503 error</p>
      </div>
    </motion.div>
  );
}