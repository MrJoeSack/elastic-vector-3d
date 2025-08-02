import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ElasticVectorVisualization from './components/ElasticVectorVisualization'
import ElasticLegend from './components/ElasticLegend'
import ParameterControls from './components/ParameterControls'
import { translateToBeginner } from './components/BeginnerModeToggle'
import CostCalculator from './components/CostCalculator'
import { calculatePerformance, ELASTIC_COLORS, ELASTIC_INDEX_CONFIGS } from './data/ElasticConfigurations'
import './App.css'

function App() {
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [hoveredPoint, setHoveredPoint] = useState(null)
  // Always use beginner mode - technical details in tooltips
  const isBeginnerMode = true
  const [showCostCalculator, setShowCostCalculator] = useState(false)
  
  // HNSW and dataset parameters
  const [hnswParams, setHnswParams] = useState({
    m: 16,
    ef_construction: 100,
    num_candidates: 100,
    datasetSize: '1M',
    dimensions: 1024
  })

  // Calculate dynamic performance for hovered/selected points
  const getPerformanceMetrics = (config) => {
    if (!config) return null;
    return calculatePerformance(config.indexType, hnswParams);
  }

  const hoveredMetrics = getPerformanceMetrics(hoveredPoint)
  const selectedMetrics = getPerformanceMetrics(selectedPoint)
  

  return (
    <div className="app">
      <div className="header" style={{ background: `linear-gradient(135deg, ${ELASTIC_COLORS.dark} 0%, ${ELASTIC_COLORS.primary}22 100%)` }}>
        <h1 style={{ color: ELASTIC_COLORS.light }}>
          Elasticsearch Vector Index Performance
        </h1>
        <p style={{ color: ELASTIC_COLORS.secondary }}>
          Interactive 3D visualization of HNSW, int8, int4, and BBQ index trade-offs
        </p>
      </div>
      
      <div className="visualization-container">
        <Canvas
          camera={{ position: [8, 6, 8], fov: 60 }}
          style={{ background: `linear-gradient(180deg, #0a0a0a 0%, ${ELASTIC_COLORS.dark} 100%)` }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color={ELASTIC_COLORS.primary} />
          <pointLight position={[-10, -10, -10]} intensity={0.4} color={ELASTIC_COLORS.secondary} />
          
          <ElasticVectorVisualization 
            onPointSelect={setSelectedPoint}
            onPointHover={setHoveredPoint}
            selectedPoint={selectedPoint}
            hoveredPoint={hoveredPoint}
            hnswParams={hnswParams}
          />
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={20}
          />
        </Canvas>
        
        
        <ElasticLegend />
        
          <ParameterControls 
          params={hnswParams}
          onChange={setHnswParams}
          isBeginnerMode={true}
        />
        
        {showCostCalculator && selectedPoint && (
          <CostCalculator 
            config={selectedPoint}
            params={hnswParams}
            performance={selectedMetrics}
          />
        )}
        
        {hoveredPoint && hoveredMetrics && (
          <div className="tooltip" style={{
            position: 'absolute',
            top: '20px',
            left: '360px',  // Position next to legend
            background: `linear-gradient(135deg, rgba(27, 169, 245, 0.1) 0%, rgba(0, 0, 0, 0.95) 100%)`,
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '14px',
            border: `2px solid ${hoveredPoint.color}`,
            boxShadow: `0 0 20px ${hoveredPoint.color}40`
          }}>
            <h3 style={{ color: hoveredPoint.color, margin: '0 0 10px 0' }}>
              {isBeginnerMode ? translateToBeginner(hoveredPoint.indexType) : hoveredPoint.name}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <strong style={{ color: ELASTIC_COLORS.secondary }} title="Technical: Query Latency">
                  Speed:
                </strong>
                <div title={`${hoveredMetrics.latency}ms latency`} style={{ cursor: 'help' }}>
                  {translateToBeginner('latency_ms', hoveredMetrics.latency)}
                </div>
              </div>
              <div>
                <strong style={{ color: ELASTIC_COLORS.accent }} title="Technical: Memory per Million Vectors">
                  Storage:
                </strong>
                <div title={`${hoveredMetrics.memoryPerMillion}MB per million vectors`} style={{ cursor: 'help' }}>
                  {translateToBeginner('memory_gb', hoveredMetrics.memoryPerMillion / 1000)}
                </div>
              </div>
              <div>
                <strong style={{ color: ELASTIC_COLORS.warning }} title="Technical: Recall@10">
                  Accuracy:
                </strong>
                <div title={`${hoveredMetrics.recall}% recall@10`} style={{ cursor: 'help' }}>
                  {translateToBeginner('recall_pct', hoveredMetrics.recall)}
                </div>
              </div>
              <div>
                <strong style={{ color: ELASTIC_COLORS.success }} title="Queries Per Second">Throughput:</strong>
                <div title={`${hoveredMetrics.qps} queries per second`} style={{ cursor: 'help' }}>{hoveredMetrics.qps} searches/sec</div>
              </div>
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#aaa' }}>
              <strong title={`Technical: ${hoveredPoint.quantization} quantization`} style={{ cursor: 'help' }}>Compression:</strong> 
              {translateToBeginner(hoveredPoint.quantization)}
            </div>
          </div>
        )}
        
        {selectedPoint && selectedMetrics && (
          <div className="details-panel" style={{
            position: 'fixed',  // Use fixed positioning
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',  // Center horizontally
            background: `linear-gradient(135deg, rgba(27, 169, 245, 0.1) 0%, rgba(0, 0, 0, 0.95) 100%)`,
            color: 'white',
            padding: '24px',
            borderRadius: '12px',
            fontSize: '14px',
            border: `2px solid ${selectedPoint.color}`,
            maxWidth: '350px',
            boxShadow: `0 0 30px ${selectedPoint.color}40`
          }}>
            <h3 style={{ color: selectedPoint.color, margin: '0 0 12px 0' }}>
              {selectedPoint.name}
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '8px 0', fontSize: '13px', lineHeight: '1.5' }}>
                {selectedPoint.description}
              </p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '12px',
              padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <div>
                <strong style={{ color: ELASTIC_COLORS.secondary }} title="Query Latency">Search Speed:</strong>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }} title="Technical: Query Latency">{selectedMetrics.latency}ms</div>
              </div>
              <div>
                <strong style={{ color: ELASTIC_COLORS.accent }} title="Memory per Million Vectors">Storage Cost:</strong>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }} title="Technical: Memory per Million Vectors">{selectedMetrics.memoryPerMillion}MB</div>
              </div>
              <div>
                <strong style={{ color: ELASTIC_COLORS.warning }} title="Recall@10 metric">Search Accuracy:</strong>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }} title="Technical: Recall@10">{selectedMetrics.recall}%</div>
              </div>
              <div>
                <strong style={{ color: ELASTIC_COLORS.success }} title="Queries per Second">Throughput:</strong>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }} title="Technical: QPS">{selectedMetrics.qps}</div>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <strong>Additional Metrics:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '12px' }}>
                <li>Memory Reduction: {selectedPoint.memoryReduction}</li>
                <li>Indexing Speed: ~{selectedMetrics.indexingSpeed} docs/sec</li>
                <li>Total Memory ({hnswParams.datasetSize}): {selectedMetrics.totalMemoryGB}GB</li>
                <li>Index Type: <code style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>{selectedPoint.indexType}</code></li>
              </ul>
            </div>

            {selectedPoint.pros && (
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: ELASTIC_COLORS.success }}>Advantages:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '12px' }}>
                  {selectedPoint.pros.map((pro, i) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedPoint.cons && (
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: ELASTIC_COLORS.warning }}>Trade-offs:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '12px' }}>
                  {selectedPoint.cons.map((con, i) => (
                    <li key={i}>{con}</li>
                  ))}
                </ul>
              </div>
            )}

            <button 
              onClick={() => setSelectedPoint(null)}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                background: `linear-gradient(135deg, ${selectedPoint.color}44 0%, ${selectedPoint.color}22 100%)`,
                color: 'white',
                border: `1px solid ${selectedPoint.color}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = selectedPoint.color;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = `linear-gradient(135deg, ${selectedPoint.color}44 0%, ${selectedPoint.color}22 100%)`;
              }}
            >
              Close Details
            </button>
            
            {/* Toggle Cost Calculator */}
            <button 
              onClick={() => setShowCostCalculator(!showCostCalculator)}
              style={{
                marginTop: '8px',
                marginLeft: '8px',
                padding: '8px 16px',
                background: showCostCalculator
                  ? `linear-gradient(135deg, ${ELASTIC_COLORS.success}44 0%, ${ELASTIC_COLORS.success}22 100%)`
                  : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: `1px solid ${showCostCalculator ? ELASTIC_COLORS.success : '#444'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.3s ease'
              }}
            >
              💰 {showCostCalculator ? 'Hide' : 'Show'} Cost
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App