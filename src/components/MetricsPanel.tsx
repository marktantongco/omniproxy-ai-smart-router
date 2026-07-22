'use client';

import { motion } from 'framer-motion';
import { useProxyMetrics, DEMO_METRICS } from '@/hooks/useProxyMetrics';
import { COLORS } from '@/lib/constants';

function AnimatedCounter({ value, color }: { value: number; color: string }) {
  return (
    <motion.span
      key={value}
      initial={{ scale: 1.3, color: '#ffffff' }}
      animate={{ scale: 1, color }}
      transition={{ duration: 0.4 }}
      className="text-2xl font-bold tabular-nums"
    >
      {value.toLocaleString()}
    </motion.span>
  );
}

export default function MetricsPanel() {
  const { metrics, error } = useProxyMetrics();
  const data = metrics || DEMO_METRICS;
  const successRate = data.requests > 0 ? ((data.successes / data.requests) * 100).toFixed(1) : '0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto space-y-3"
    >
      {/* Status bar */}
      <div className="flex items-center justify-between rounded-xl border border-purple-500/30 bg-black/40 px-4 py-2 backdrop-blur-md">
        <span className="text-xs text-gray-400">Proxy Status</span>
        <div className="flex items-center gap-2">
          <motion.div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: error ? COLORS.error : COLORS.success }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span
            className="text-xs font-medium"
            style={{ color: error ? COLORS.error : COLORS.success }}
          >
            {error ? 'DEMO MODE' : 'ONLINE'}
          </span>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-blue-500/20 bg-black/40 p-3 backdrop-blur-md">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Requests</p>
          <AnimatedCounter value={data.requests} color="#60a5fa" />
        </div>
        <div className="rounded-xl border border-green-500/20 bg-black/40 p-3 backdrop-blur-md">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Successes</p>
          <AnimatedCounter value={data.successes} color={COLORS.success} />
        </div>
        <div className="rounded-xl border border-red-500/20 bg-black/40 p-3 backdrop-blur-md">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Failures</p>
          <AnimatedCounter value={data.failures} color={COLORS.error} />
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-black/40 p-3 backdrop-blur-md">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Fallbacks</p>
          <AnimatedCounter value={data.fallbacks} color="#f59e0b" />
        </div>
      </div>

      {/* Success rate */}
      <div className="rounded-xl border border-purple-500/20 bg-black/40 p-3 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Success Rate</span>
          <span className="text-lg font-bold" style={{ color: COLORS.success }}>
            {successRate}%
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-800">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${COLORS.anthropic}, ${COLORS.success})` }}
            initial={{ width: 0 }}
            animate={{ width: `${successRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Provider key stats */}
      <div className="rounded-xl border border-purple-500/20 bg-black/40 p-3 backdrop-blur-md">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-gray-500">Key Pool Status</p>
        <div className="space-y-2">
          {Object.entries(data.providers).map(([name, provider]) => (
            <div key={name} className="flex items-center justify-between text-xs">
              <span className="text-gray-300">{name}</span>
              <div className="flex items-center gap-2">
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                  style={{
                    color: provider.format === 'anthropic' ? COLORS.anthropic : COLORS.openai,
                    backgroundColor: `${provider.format === 'anthropic' ? COLORS.anthropic : COLORS.openai}20`,
                  }}
                >
                  {provider.format}
                </span>
                <span className="text-gray-400">
                  {provider.available}/{provider.total_keys} keys
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Uptime */}
      <div className="text-center text-xs text-gray-500">Uptime: {data.uptime}</div>

      {error && (
        <p className="text-center text-[10px] text-gray-600">
          Showing demo data. Start OmniProxy and set NEXT_PUBLIC_PROXY_URL to see live metrics.
        </p>
      )}
    </motion.div>
  );
}