# Elasticsearch Vector Index Performance Visualization

An interactive 3D visualization showcasing Elasticsearch's vector index types and their performance trade-offs, based on official Elastic benchmarks and the latest 2024-2025 improvements including BBQ (Better Binary Quantization).

> **⚠️ Disclaimer**: This is a proof of concept project created for personal learning and exploration. It is not an official Elastic product and should not be used for production decisions without consulting official Elasticsearch documentation and conducting your own benchmarks.


![Elastic Vector Search 3D](screenshots/elastic-vector-demo.gif)
*Interactive 3D visualization of HNSW, int8, int4, and BBQ index performance*

## 🚀 Key Features

### Index Types Visualized
- **HNSW (Standard)** - Full float32 precision with highest accuracy
- **int8_hnsw (Default)** - 75% memory reduction with good recall (Default since v8.14)
- **int4_hnsw** - 87% memory reduction for cost-sensitive applications (Added in v8.15)
- **BBQ HNSW** - Revolutionary 96% memory reduction using 1-bit quantization (GA in v9.0, April 2025)
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

Based on Elastic's 2024-2025 benchmark data:

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
- Introduced in v8.16 (Nov 2024) as technical preview, GA in v9.0 (Apr 2025)

## 🎮 Installation & Setup

### Prerequisites
- **Node.js** (version 18+) - [Download from nodejs.org](https://nodejs.org/)
- **Git** (optional, for cloning) - [Download from git-scm.com](https://git-scm.com/)

### Windows Installation

#### Quick Start
```cmd
git clone https://github.com/MrJoeSack/elastic-vector-3d.git
cd elastic-vector-3d
npm install
npm run dev
# Open http://localhost:5173 in your browser
```

#### Detailed Steps

**Option 1: Using Git (Recommended)**
1. **Open Command Prompt or PowerShell**
   ```cmd
   # Press Windows + R, type "cmd" or "powershell", press Enter
   ```

2. **Clone the repository**
   ```cmd
   git clone https://github.com/MrJoeSack/elastic-vector-3d.git
   cd elastic-vector-3d
   ```

3. **Install dependencies**
   ```cmd
   npm install
   ```

4. **Start the development server**
   ```cmd
   npm run dev
   ```

5. **Open in browser**
   - The terminal will show: `Local: http://localhost:5173/`
   - Open your browser and navigate to http://localhost:5173
   - The app should load automatically

**Option 2: Download ZIP**
1. **Download the project**
   - Go to https://github.com/MrJoeSack/elastic-vector-3d
   - Click the green "Code" button
   - Select "Download ZIP"
   - Extract to a folder (e.g., `C:\Users\YourName\Documents\elastic-vector-3d`)

2. **Open Command Prompt in the project folder**
   - Navigate to the extracted folder in File Explorer
   - Click in the address bar, type `cmd`, press Enter
   - Or: Shift + Right-click in the folder, select "Open PowerShell window here"

3. **Install and run**
   ```cmd
   npm install
   npm run dev
   ```

4. **Open http://localhost:5173 in your browser**

### macOS/Linux Installation
```bash
# Clone the repository
git clone https://github.com/MrJoeSack/elastic-vector-3d.git
cd elastic-vector-3d

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Troubleshooting

#### Common Windows Issues

**Issue: 'npm' is not recognized as an internal or external command**
- **Solution**: Install Node.js from https://nodejs.org/ and restart your terminal

**Issue: Port 5173 is already in use**
- **Solution**: Either close the application using that port or modify `vite.config.js`:
  ```javascript
  export default {
    server: {
      port: 3000  // Change to any available port
    }
  }
  ```

**Issue: Script execution is disabled (PowerShell)**
- **Solution**: Run PowerShell as Administrator and execute:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

**Issue: Slow initial load or white screen**
- **Solution**: Wait 10-15 seconds for initial compilation. Check browser console (F12) for errors.

### Testing the Application

1. **Verify the 3D visualization loads**
   - You should see a 3D space with colored spheres representing different index types

2. **Test interactions**
   - **Rotate**: Click and drag to rotate the view
   - **Zoom**: Use mouse wheel to zoom in/out
   - **Hover**: Move mouse over spheres to see tooltips
   - **Click**: Click on spheres for detailed information

3. **Test controls**
   - Adjust sliders in the right panel
   - Watch the visualization update in real-time
   - Change dataset size and dimensions

4. **Performance check**
   - The app should run smoothly at 60 FPS
   - If laggy, try reducing browser window size

### Build for Production
```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview

# The built files will be in the 'dist' folder
```

### System Requirements
- **Minimum**: 4GB RAM, any modern browser (Chrome, Firefox, Edge, Safari)
- **Recommended**: 8GB RAM, dedicated graphics for smooth 3D rendering
- **Browser**: Chrome or Edge recommended for best WebGL performance

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

## 📈 Recent Improvements (2024-2025)

Elasticsearch has made significant vector search improvements:
- **8.12** (Jan 2024): int8_hnsw introduced with 75% memory reduction
- **8.14** (Jun 2024): int8 becomes default, 50% faster indexing
- **8.15** (Aug 2024): SIMD optimizations for int8_hnsw, int4 quantization added
- **8.16** (Nov 2024): BBQ introduced as technical preview
- **9.0** (Apr 2025): BBQ now GA, 5x faster than competitors, ColBERT/ColPali support
- **Native code acceleration**: Up to 12x faster with recent optimizations

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