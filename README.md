# Elasticsearch Vector Index Performance Visualization

An interactive 3D visualization showcasing Elasticsearch's vector index types and their performance trade-offs, based on official Elastic benchmarks and the latest 2024 improvements including BBQ (Better Binary Quantization).

> **⚠️ Disclaimer**: This is a proof of concept project created for personal learning and exploration. It is not an official Elastic product and should not be used for production decisions without consulting official Elasticsearch documentation and conducting your own benchmarks.

![Elastic Vector Search 3D](screenshots/elastic-vector-demo.gif)
*Interactive 3D visualization of HNSW, int8, int4, and BBQ index performance*

## 🚀 Key Features

### Index Types Visualized
- **HNSW (Standard)** - Full float32 precision with highest accuracy
- **int8_hnsw (Default)** - 75% memory reduction with good recall (Default since v8.14)
- **int4_hnsw** - 87% memory reduction for cost-sensitive applications
- **BBQ HNSW** - Revolutionary 96% memory reduction using 1-bit quantization
- **Flat (Exact)** - Brute-force search with perfect recall
- **BBQ Flat** - Binary quantized exact search

### Interactive Controls
- **HNSW Parameter Tuning**
  - `m` (connections): 8-64 - Controls graph connectivity
  - `ef_construction`: 50-500 - Graph build quality
  - `num_candidates`: 50-1000 - Search-time candidates
- **Dataset Configuration**
  - Size: 100K to 1B vectors
  - Dimensions: 384, 768, 1024, 1536
- **Real-time Performance Updates** - See how parameters affect latency, memory, and recall

## 📊 Performance Metrics

Based on Elastic's 2024 benchmark data:

| Index Type | Memory Reduction | Typical Recall | Query Latency | Use Case |
|:---:|:---:|:---:|:---:|:---|
| **HNSW** | 1x (baseline) | 96-99% | 5-10ms | Critical accuracy |
| **int8_hnsw** | 4x | 77-84% | 7-16ms | Production default |
| **int4_hnsw** | 8x | 70-80% | 10-20ms | Cost optimization |
| **BBQ HNSW** | 32x | 74-90% | 15-40ms | Massive scale |

## 🎯 What is BBQ?

**Better Binary Quantization (BBQ)** is Elastic's breakthrough in vector compression:
- Reduces vectors to just 1 bit per dimension (32x compression)
- Achieves better ranking quality than float32 in 9/10 datasets
- Uses asymmetric quantization: binary for storage, int4 for queries
- Includes intelligent reranking for surprising accuracy

## 🎮 Usage

### Installation
```bash
npm install
npm run dev
```

### Navigation
- **Drag** to rotate the 3D visualization
- **Scroll** to zoom in/out
- **Hover** over spheres for quick metrics
- **Click** spheres for detailed configuration analysis
- **Adjust sliders** to see real-time performance impact

### Understanding the Axes
- **X-axis (Blue)**: Query Latency (1ms - 1000ms, logarithmic)
- **Y-axis (Teal)**: Memory per Million Vectors (10MB - 10GB, logarithmic)
- **Z-axis (Yellow)**: Recall@10 (60% - 100%, linear)

## 🔬 Technical Implementation

### Data Sources
- [Elastic BBQ: Better Binary Quantization](https://www.elastic.co/search-labs/blog/better-binary-quantization-lucene-elasticsearch)
- [Elasticsearch vs OpenSearch Performance](https://www.elastic.co/search-labs/blog/elasticsearch-opensearch-vector-search-performance-comparison)
- [Large-scale Vector Search Design](https://www.elastic.co/search-labs/blog/elasticsearch-vector-large-scale-part1)
- [Making Elasticsearch 8x Faster, 32x More Efficient](https://www.elastic.co/search-labs/blog/elasticsearch-lucene-vector-database-gains)

### Performance Calculation

The visualization dynamically calculates performance based on:
```javascript
performance = baseMetrics × datasetScaling × dimensionScaling × hnswParameterEffects
```

Where:
- Dataset scaling affects latency and memory linearly/logarithmically
- Dimension scaling impacts both computation and storage
- HNSW parameters (`m`, `ef_construction`) trade memory/time for recall

## 🌟 Optimal Use Cases

### Real-time RAG (Red Zone)
- **Requirements**: <50ms latency, >85% recall
- **Recommended**: int8_hnsw or bbq_hnsw with tuned parameters
- **Use for**: Conversational AI, live search

### Large-scale Search (Teal Zone)
- **Requirements**: <1GB/million vectors, >80% recall
- **Recommended**: int8_hnsw, int4_hnsw, or bbq_hnsw
- **Use for**: Billion-scale deployments

### Cost-optimized (Green Zone)
- **Requirements**: <500MB/million vectors, >75% recall
- **Recommended**: int4_hnsw or bbq_hnsw
- **Use for**: Budget-conscious applications

### High Accuracy (Yellow Zone)
- **Requirements**: >95% recall regardless of cost
- **Recommended**: Standard HNSW or flat
- **Use for**: Mission-critical applications

## 🛠️ Configuration Examples

### Production Default (int8_hnsw)
```json
{
  "type": "dense_vector",
  "dims": 1024,
  "index": true,
  "index_options": {
    "type": "int8_hnsw",
    "m": 16,
    "ef_construction": 100
  }
}
```

### Maximum Compression (BBQ)
```json
{
  "type": "dense_vector",
  "dims": 1024,
  "index": true,
  "index_options": {
    "type": "bbq_hnsw",
    "m": 16,
    "ef_construction": 100
  }
}
```

## 📈 2024 Improvements

Elasticsearch has made significant vector search improvements:
- **8.14**: int8 becomes default, 50% faster indexing
- **8.15**: SIMD optimizations for int8_hnsw
- **9.1**: BBQ by default, ACORN for filtered search
- **Native code acceleration**: Up to 12x faster than competitors

## 🏗️ Project Structure

```
elastic-vector-3d/
├── src/
│   ├── components/
│   │   ├── ElasticVectorVisualization.jsx  # Main 3D scene
│   │   ├── ElasticLegend.jsx              # Index type legend
│   │   └── ParameterControls.jsx          # HNSW parameter sliders
│   ├── data/
│   │   └── ElasticConfigurations.js       # Index configs & performance data
│   └── App.jsx                             # Main application
└── README.md                               # This file
```

## 🔗 Resources

- [Elasticsearch Vector Database](https://www.elastic.co/elasticsearch/vector-database)
- [Dense Vector Field Type Docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/dense-vector.html)
- [Elastic Search Labs Blog](https://www.elastic.co/search-labs/blog)
- [Elasticsearch Benchmarks](https://elasticsearch-benchmarks.elastic.co/)

## 💡 Key Insights

1. **BBQ is a game-changer**: 96% memory reduction with surprisingly good recall
2. **int8_hnsw is the sweet spot**: Default for good reason - excellent balance
3. **Parameters matter**: Tuning `m` and `ef_construction` can significantly impact performance
4. **Scale changes everything**: Performance characteristics shift dramatically with dataset size

## 🎯 When to Use Which Index

| Dataset Size | Speed Priority | Cost Priority | Accuracy Priority |
|:---:|:---:|:---:|:---:|
| <100K | hnsw | int8_hnsw | flat |
| 100K-10M | int8_hnsw | int4_hnsw | hnsw |
| 10M-100M | int8_hnsw | bbq_hnsw | int8_hnsw |
| >100M | bbq_hnsw | bbq_hnsw | int8_hnsw |

## 📝 License & Disclaimer

MIT License - Built with data from Elastic's public benchmarks and blog posts.

**Important Notes:**
- This is a personal learning project and proof of concept
- Performance metrics are approximations based on public benchmarks
- Always conduct your own testing for production use cases
- Not affiliated with or endorsed by Elastic NV
- For official information, consult [Elasticsearch documentation](https://www.elastic.co/guide/)

## 🙏 Acknowledgments

- Elastic Search Labs for comprehensive benchmarks and blog posts
- Three.js and React Three Fiber for 3D visualization capabilities
- The Elasticsearch team for continuous vector search improvements

---

*A personal exploration tool to help visualize and understand Elasticsearch's vector index trade-offs. Created for learning purposes - please refer to official documentation for production decisions.*