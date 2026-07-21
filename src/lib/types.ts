export interface KeyState {
  index: number;
  uses: number;
  failures: number;
  cooldown: string;
  last_used: string;
}

export interface ProviderMetrics {
  format: 'anthropic' | 'openai';
  available: number;
  total_keys: number;
  keys: KeyState[];
}

export interface MetricsResponse {
  requests: number;
  successes: number;
  failures: number;
  retries: number;
  fallbacks: number;
  uptime: string;
  providers: Record<string, ProviderMetrics>;
}

export interface HealthResponse {
  status: string;
  uptime: string;
  providers: number;
}

export type NodeType =
  | 'client'
  | 'server'
  | 'router'
  | 'keypool'
  | 'provider'
  | 'translation'
  | 'sse'
  | 'response';

export interface FlowNodeData {
  id: string;
  type: NodeType;
  title: string;
  subtitle: string;
  color: string;
  glowColor: string;
  icon: string;
  details?: string[];
}