import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ElasticVectorVisualization from './components/ElasticVectorVisualization'
import ElasticLegend from './components/ElasticLegend'
import ParameterControls from './components/ParameterControls'
import { calculatePerformance, ELASTIC_COLORS } from './data/ElasticConfigurations'
import './App.css'

function App() {
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [hoveredPoint, setHoveredPoint] = useState(null)
  
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
        />
        
        {hoveredPoint && hoveredMetrics && (
          <div className="tooltip" style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: `linear-gradient(135deg, rgba(27, 169, 245, 0.1) 0%, rgba(0, 0, 0, 0.95) 100%)`,
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '14px',
            border: `2px solid ${hoveredPoint.color}`,
            boxShadow: `0 0 20px ${hoveredPoint.color}40`
          }}>
            <h3 style={{ color: hoveredPoint.color, margin: '0 0 10px 0' }}>
              {hoveredPoint.name}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <strong style={{ color: ELASTIC_COLORS.secondary }}>Latency:</strong>
                <div>{hoveredMetrics.latency}ms</div>
              </div>
              <div>
                <strong style={{ color: ELASTIC_COLORS.accent }}>Memory:</strong>
                <div>{hoveredMetrics.memoryPerMillion}MB/M</div>
              </div>
              <div>
                <strong style={{ color: ELASTIC_COLORS.warning }}>Recall:</strong>
                <div>{hoveredMetrics.recall}%</div>
              </div>
              <div>
                <strong style={{ color: ELASTIC_COLORS.success }}>QPS:</strong>
                <div>{hoveredMetrics.qps}</div>
              </div>
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#aaa' }}>
              <strong>Quantization:</strong> {hoveredPoint.quantization}
            </div>
          </div>
        )}
        
        {selectedPoint && selectedMetrics && (
          <div className="details-panel" style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
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
                <strong style={{ color: ELASTIC_COLORS.secondary }}>Query Latency:</strong>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectedMetrics.latency}ms</div>
              </div>
              <div>
                <strong style={{ color: ELASTIC_COLORS.accent }}>Memory/Million:</strong>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectedMetrics.memoryPerMillion}MB</div>
              </div>
              <div>
                <strong style={{ color: ELASTIC_COLORS.warning }}>Recall@10:</strong>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectedMetrics.recall}%</div>
              </div>
              <div>
                <strong style={{ color: ELASTIC_COLORS.success }}>Queries/sec:</strong>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectedMetrics.qps}</div>
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
          </div>
        )}
      </div>
    </div>
  )
}

export default App