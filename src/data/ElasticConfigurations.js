// Elasticsearch Index Type Configurations
// Based on official Elastic benchmarks and blog posts (2024)

export const ELASTIC_INDEX_CONFIGS = [
  {
    id: 'hnsw',
    name: 'HNSW (Standard)',
    indexType: 'hnsw',
    latency: 10, // ms
    memoryPerMillion: 4000, // MB per million vectors (1024 dims)
    recall: 97,
    color: '#1BA9F5', // Elastic Blue
    description: 'Standard HNSW with full float32 precision. Highest accuracy but maximum memory usage. Best for critical applications requiring perfect recall.',
    laymanDescription: 'The premium option - like storing HD video instead of compressed. Perfect quality but needs lots of storage.',
    bestFor: 'Mission-critical searches, medical/legal applications',
    indexingTime: '1x (baseline)',
    updateFrequency: 'Supports real-time updates',
    quantization: 'none',
    memoryReduction: '1x',
    pros: ['Highest recall', 'Fastest queries', 'No accuracy loss'],
    cons: ['Maximum memory usage', 'Highest cost']
  },
  {
    id: 'int8_hnsw',
    name: 'int8_hnsw (Default)',
    indexType: 'int8_hnsw',
    latency: 12, // ms
    memoryPerMillion: 1000, // MB per million vectors
    recall: 84,
    color: '#00BFB3', // Elastic Teal
    description: 'Default index type since 8.14. 8-bit integer quantization reduces memory by 75% while maintaining good recall. Excellent balance for production.',
    laymanDescription: 'The recommended choice - like using efficient video compression. Great quality with 75% less storage.',
    bestFor: 'Most production applications, e-commerce, content search',
    indexingTime: '1.2x slower than standard',
    updateFrequency: 'Supports real-time updates',
    requirements: 'Elasticsearch 8.14+, benefits from SIMD-capable CPUs',
    quantization: '8-bit',
    memoryReduction: '4x',
    pros: ['75% memory savings', 'Good recall', 'SIMD optimized'],
    cons: ['Slight accuracy loss', '~20% slower than float32']
  },
  {
    id: 'int4_hnsw',
    name: 'int4_hnsw',
    indexType: 'int4_hnsw',
    latency: 15, // ms
    memoryPerMillion: 500, // MB per million vectors
    recall: 78,
    color: '#FEC514', // Elastic Yellow
    description: '4-bit quantization reduces memory by 87%. Good for cost-sensitive applications with acceptable accuracy trade-offs.',
    laymanDescription: 'The budget option - like using high compression. Good enough quality at a fraction of the cost.',
    bestFor: 'Large-scale applications where cost matters more than perfect accuracy',
    indexingTime: '1.1x slower than standard',
    updateFrequency: 'Supports real-time updates',
    requirements: 'Vector dimensions must be even numbers',
    quantization: '4-bit',
    memoryReduction: '8x',
    pros: ['87% memory savings', 'Very cost effective', 'Faster indexing'],
    cons: ['Noticeable accuracy loss', 'Requires even dimensions']
  },
  {
    id: 'bbq_hnsw',
    name: 'BBQ HNSW',
    indexType: 'bbq_hnsw',
    latency: 25, // ms (with reranking)
    memoryPerMillion: 125, // MB per million vectors
    recall: 88,
    color: '#F04E98', // Elastic Pink
    description: 'Better Binary Quantization with 1-bit precision. 96% memory reduction with surprising accuracy through asymmetric quantization and reranking.',
    laymanDescription: 'The space-saver option - like converting color photos to smart black & white. Amazingly good despite extreme compression.',
    bestFor: 'Billion-scale deployments, archive search, cost-critical applications',
    indexingTime: '2x slower due to optimization',
    updateFrequency: 'Best for stable data, updates require reindexing',
    requirements: 'Dimensions must be > 64, Elasticsearch 9.1+ recommended',
    quantization: '1-bit',
    memoryReduction: '32x',
    pros: ['96% memory savings', 'Better than expected recall', 'Extremely cost effective'],
    cons: ['Higher latency due to reranking', 'Requires dims > 64']
  },
  {
    id: 'flat',
    name: 'Flat (Exact)',
    indexType: 'flat',
    latency: 500, // ms for large datasets
    memoryPerMillion: 4000, // MB per million vectors
    recall: 100,
    color: '#6C5CE7', // Purple
    description: 'Brute-force exact search. Perfect recall but slowest performance. Use for small datasets or when 100% accuracy is required.',
    laymanDescription: 'The exhaustive option - checks every single item. Perfect accuracy but slow, like reading every page in a library.',
    bestFor: 'Small datasets (<100K vectors), legal/compliance requirements',
    indexingTime: 'Instant (no index to build)',
    updateFrequency: 'Instant updates',
    warningThreshold: 'Impractical above 100K vectors',
    quantization: 'none',
    memoryReduction: '1x',
    pros: ['Perfect recall', 'No graph building', 'Predictable performance'],
    cons: ['Very slow for large datasets', 'No approximation benefits']
  },
  {
    id: 'bbq_flat',
    name: 'BBQ Flat',
    indexType: 'bbq_flat',
    latency: 200, // ms
    memoryPerMillion: 125, // MB per million vectors
    recall: 92,
    color: '#A8E6CF', // Light Green
    description: 'Binary quantized exact search. Combines brute-force accuracy with BBQ memory efficiency.',
    quantization: '1-bit',
    memoryReduction: '32x',
    pros: ['High recall with exact search', 'Massive memory savings', 'No graph overhead'],
    cons: ['Slower than HNSW variants', 'Still O(n) complexity']
  }
];

// Optimal zones for different use cases
export const ELASTIC_OPTIMAL_ZONES = [
  {
    name: 'Real-time RAG',
    color: '#FF6B6B',
    opacity: 0.15,
    description: 'Low latency with good recall for conversational AI',
    criteria: { 
      maxLatency: 50, 
      minRecall: 85,
      recommendedTypes: ['int8_hnsw', 'bbq_hnsw']
    }
  },
  {
    name: 'Large-scale Search',
    color: '#4ECDC4',
    opacity: 0.12,
    description: 'Billion-scale vectors with cost efficiency',
    criteria: { 
      maxMemoryPerMillion: 1000,
      minRecall: 80,
      recommendedTypes: ['int8_hnsw', 'int4_hnsw', 'bbq_hnsw']
    }
  },
  {
    name: 'Cost-optimized',
    color: '#95E77E',
    opacity: 0.1,
    description: 'Minimum infrastructure cost with acceptable accuracy',
    criteria: { 
      maxMemoryPerMillion: 500,
      minRecall: 75,
      recommendedTypes: ['int4_hnsw', 'bbq_hnsw', 'bbq_flat']
    }
  },
  {
    name: 'High Accuracy',
    color: '#FFE66D',
    opacity: 0.13,
    description: 'Maximum recall for critical applications',
    criteria: { 
      minRecall: 95,
      recommendedTypes: ['hnsw', 'flat']
    }
  }
];

// HNSW tuning parameters with user-friendly explanations
export const HNSW_PARAMS = {
  m: {
    default: 16,
    min: 8,
    max: 64,
    description: 'Number of bi-directional links per node',
    layman: 'Search Network Connectivity',
    explanation: 'How connected is your search network? Like adding more roads between cities - more paths to find your destination.',
    effect: 'Higher = More accurate but uses more memory',
    recommendation: '16 for most cases, 32+ for high accuracy needs'
  },
  ef_construction: {
    default: 100,
    min: 50,
    max: 500,
    description: 'Size of dynamic candidate list',
    layman: 'Index Build Quality',
    explanation: 'How thoroughly to build the search index? Like spending more time organizing files - takes longer but easier to find things later.',
    effect: 'Higher = Better search quality but slower to build index',
    recommendation: '100 for balanced, 200+ for accuracy-critical'
  },
  num_candidates: {
    default: 100,
    min: 50,
    max: 1000,
    description: 'Number of candidates to track during search',
    layman: 'Search Thoroughness',
    explanation: 'How many options to check per search? Like checking more stores when shopping - more likely to find the best match but takes longer.',
    effect: 'Higher = More accurate results but slower searches',
    recommendation: '100 for speed, 200+ for accuracy'
  }
};

// Performance scaling factors based on dataset size
export const DATASET_SCALING = {
  '100K': { latencyMultiplier: 0.5, memoryMultiplier: 0.1 },
  '1M': { latencyMultiplier: 1.0, memoryMultiplier: 1.0 },
  '10M': { latencyMultiplier: 1.5, memoryMultiplier: 10 },
  '100M': { latencyMultiplier: 2.5, memoryMultiplier: 100 },
  '1B': { latencyMultiplier: 4.0, memoryMultiplier: 1000 }
};

// Vector dimension effects
export const DIMENSION_SCALING = {
  384: { latencyMultiplier: 0.7, memoryMultiplier: 0.375 },
  768: { latencyMultiplier: 0.9, memoryMultiplier: 0.75 },
  1024: { latencyMultiplier: 1.0, memoryMultiplier: 1.0 },
  1536: { latencyMultiplier: 1.3, memoryMultiplier: 1.5 }
};

// Calculate performance based on configuration
export function calculatePerformance(indexType, params = {}) {
  const config = ELASTIC_INDEX_CONFIGS.find(c => c.indexType === indexType);
  if (!config) return null;

  const m = params.m || HNSW_PARAMS.m.default;
  const efConstruction = params.ef_construction || HNSW_PARAMS.ef_construction.default;
  const numCandidates = params.num_candidates || HNSW_PARAMS.num_candidates.default;
  const datasetSize = params.datasetSize || '1M';
  const dimensions = params.dimensions || 1024;

  const datasetScale = DATASET_SCALING[datasetSize] || DATASET_SCALING['1M'];
  const dimScale = DIMENSION_SCALING[dimensions] || DIMENSION_SCALING[1024];

  // Calculate adjusted metrics
  let adjustedLatency = config.latency * datasetScale.latencyMultiplier * dimScale.latencyMultiplier;
  let adjustedMemory = config.memoryPerMillion * datasetScale.memoryMultiplier * dimScale.memoryMultiplier;
  let adjustedRecall = config.recall;

  // HNSW parameter effects
  if (config.indexType.includes('hnsw')) {
    // m affects memory and recall
    adjustedMemory *= (m / HNSW_PARAMS.m.default);
    adjustedRecall += (m - HNSW_PARAMS.m.default) * 0.2;

    // ef_construction affects recall
    adjustedRecall += (efConstruction - HNSW_PARAMS.ef_construction.default) * 0.02;

    // num_candidates affects latency and recall
    adjustedLatency *= (numCandidates / HNSW_PARAMS.num_candidates.default);
    adjustedRecall += (numCandidates - HNSW_PARAMS.num_candidates.default) * 0.01;
  }

  // Clamp recall to realistic bounds
  adjustedRecall = Math.min(Math.max(adjustedRecall, 50), config.indexType === 'flat' ? 100 : 99);

  return {
    latency: Math.round(adjustedLatency),
    memoryPerMillion: Math.round(adjustedMemory),
    recall: Math.round(adjustedRecall * 10) / 10,
    qps: Math.round(1000 / adjustedLatency), // Queries per second
    indexingSpeed: Math.round(50000 / (m * efConstruction / 100)), // Docs per second
    totalMemoryGB: (adjustedMemory * parseFloat(datasetSize.replace(/[KMB]/, '')) / 1000).toFixed(2)
  };
}

// Export color palette
export const ELASTIC_COLORS = {
  primary: '#1BA9F5', // Elastic Blue
  secondary: '#00BFB3', // Elastic Teal
  accent: '#FEC514', // Elastic Yellow
  warning: '#F04E98', // Elastic Pink
  success: '#00D9FF', // Elastic Cyan
  dark: '#343741', // Elastic Dark Gray
  light: '#F5F7FA' // Elastic Light Gray
};