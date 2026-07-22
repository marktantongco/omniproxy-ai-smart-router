'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MetricsResponse, HealthResponse } from '@/lib/types';

const PROXY_BASE = process.env.NEXT_PUBLIC_PROXY_URL || 'http://localhost:8080';
const POLL_INTERVAL = 3000;

export function useProxyMetrics() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    try {
      const [metricsRes, healthRes] = await Promise.all([
        fetch(`${PROXY_BASE}/metrics`),
        fetch(`${PROXY_BASE}/health`),
      ]);

      if (metricsRes.ok) {
        setMetrics(await metricsRes.json());
      }
      if (healthRes.ok) {
        setHealth(await healthRes.json());
      }
      setError(null);
    } catch {
      setError('Proxy offline — running in demo mode');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return { metrics, health, error, loading, refetch: fetchMetrics };
}

// Demo data for when proxy is offline
export const DEMO_METRICS: MetricsResponse = {
  requests: 1247,
  successes: 1183,
  failures: 12,
  retries: 52,
  fallbacks: 23,
  uptime: '4h32m',
  providers: {
    opencode_zen: {
      format: 'anthropic',
      available: 2,
      total_keys: 2,
      keys: [
        { index: 0, uses: 642, failures: 3, cooldown: 'none', last_used: '14:32:01' },
        { index: 1, uses: 541, failures: 1, cooldown: 'none', last_used: '14:31:58' },
      ],
    },
    opencode_go: {
      format: 'openai',
      available: 1,
      total_keys: 2,
      keys: [
        { index: 0, uses: 45, failures: 2, cooldown: '23s', last_used: '14:31:35' },
        { index: 1, uses: 38, failures: 0, cooldown: 'none', last_used: '14:30:12' },
      ],
    },
    openrouter: {
      format: 'openai',
      available: 1,
      total_keys: 1,
      keys: [
        { index: 0, uses: 12, failures: 1, cooldown: 'none', last_used: '14:28:44' },
      ],
    },
  },
};
