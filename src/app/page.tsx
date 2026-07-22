'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import FlowNode from '@/components/FlowNode';
import FlowConnection from '@/components/FlowConnection';
import MetricsPanel from '@/components/MetricsPanel';
import ProviderChainDetail from '@/components/ProviderChainDetail';
import { FLOW_NODES, COLORS } from '@/lib/constants';

// Dynamic import for Three.js to avoid SSR issues
const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), {
  ssr: false,
  loading: () => (
    <div
      className="fixed inset-0 -z-10"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #1a0a2a 100%)' }}
    />
  ),
});

type TabId = 'flowchart' | 'metrics' | 'providers';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'flowchart', label: 'Flow', icon: '\uD83C\uDF0A' },
  { id: 'metrics', label: 'Metrics', icon: '\uD83D\uDCCA' },
  { id: 'providers', label: 'Providers', icon: '\uD83D\uDD17' },
];

const AUDIT_FIXES = [
  'GOMAXPROCS fixed',
  'Pre-response retry',
  'Bidirectional translation',
  'SSE streaming',
  'Flush per chunk',
  'Config external',
  '10MB body limit',
  'Graceful shutdown',
  '/health + /metrics',
  'Error passthrough',
  'Context propagation',
];

function getConnectionLabel(nodeId: string): string | undefined {
  if (nodeId === 'provider-zen') return 'if 429 \u2192 fallback';
  if (nodeId === 'provider-go') return 'if exhausted \u2192 fallback';
  if (nodeId === 'translation') return 'only for OpenAI format';
  return undefined;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('flowchart');
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="min-h-screen w-full"
        style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #1a0a2a 100%)' }}
      />
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden pb-20">
      <ThreeBackground />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 border-b border-purple-500/20 bg-black/60 backdrop-blur-lg"
      >
        <div className="mx-auto max-w-md px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold" style={{ color: COLORS.translation }}>
                OmniProxy v2.0
              </h1>
              <p className="text-[10px] text-gray-500">
                Unified Smart Router &middot; Hermes System
              </p>
            </div>
            <motion.div
              className="rounded-full border border-green-500/30 px-2 py-0.5 text-[10px]"
              style={{ color: COLORS.success }}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              100% FREE
            </motion.div>
          </div>

          {/* Tab bar */}
          <div className="mt-3 flex gap-1 rounded-xl bg-black/40 p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex-1 rounded-lg py-2 text-xs font-medium transition-colors"
                style={{
                  color: activeTab === tab.id ? '#ffffff' : '#6b7280',
                }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.translation}40, ${COLORS.anthropic}20)`,
                      border: `1px solid ${COLORS.translation}50`,
                    }}
                  />
                )}
                <span className="relative z-10">
                  {tab.icon} {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="mx-auto max-w-md px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'flowchart' && (
            <motion.div
              key="flowchart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-0"
            >
              {FLOW_NODES.map((node, index) => (
                <div key={node.id}>
                  <FlowNode
                    node={node}
                    index={index}
                    isActive={activeNode === node.id}
                    onTap={() => setActiveNode(activeNode === node.id ? null : node.id)}
                  />
                  {index < FLOW_NODES.length - 1 && (
                    <FlowConnection
                      color={node.color}
                      active={true}
                      label={getConnectionLabel(node.id)}
                    />
                  )}
                </div>
              ))}

              {/* Architecture summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-8 rounded-xl border border-purple-500/20 bg-black/40 p-4 backdrop-blur-md"
              >
                <h3 className="mb-2 text-xs font-bold text-purple-400">Architecture: 3 Mergers</h3>
                <div className="space-y-2 text-[11px] text-gray-400">
                  <p>
                    <span style={{ color: COLORS.anthropic }}>Merge 1:</span> GoZen +
                    ExtremeRouter &mdash; single Go binary, zero IPC, ~15-25MB RAM
                  </p>
                  <p>
                    <span style={{ color: COLORS.translation }}>Merge 2:</span> Zen-Proxy &mdash;
                    invisible format translation with real-time SSE streaming
                  </p>
                  <p>
                    <span style={{ color: COLORS.openai }}>Merge 3:</span> CLIProxyAPIPlus &mdash;
                    in-memory key pool, round-robin, per-key cooldown
                  </p>
                </div>
              </motion.div>

              {/* Audit fixes badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="mt-3 flex flex-wrap gap-2"
              >
                {AUDIT_FIXES.map((fix) => (
                  <span
                    key={fix}
                    className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[9px] text-green-400"
                  >
                    &#10003; {fix}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'metrics' && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MetricsPanel />
            </motion.div>
          )}

          {activeTab === 'providers' && (
            <motion.div
              key="providers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProviderChainDetail />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-purple-500/20 bg-black/60 backdrop-blur-lg">
        <div className="mx-auto max-w-md px-4 py-2 text-center text-[10px] text-gray-600">
          OmniProxy v2.0 &middot; GoZen + ExtremeRouter + CLIProxyAPIPlus + Zen-Proxy &middot;
          i5-6200U 2C/4T &middot; 8GB RAM
        </div>
      </footer>
    </main>
  );
}