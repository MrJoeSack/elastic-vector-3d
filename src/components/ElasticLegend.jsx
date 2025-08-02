import { useState } from 'react'
import { ELASTIC_INDEX_CONFIGS, ELASTIC_OPTIMAL_ZONES, ELASTIC_COLORS } from '../data/ElasticConfigurations'

export default function ElasticLegend() {
  const [hoveredItem, setHoveredItem] = useState(null)
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      background: `linear-gradient(135deg, rgba(27, 169, 245, 0.1) 0%, rgba(0, 0, 0, 0.95) 100%)`,
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      fontSize: '12px',
      border: `1px solid ${ELASTIC_COLORS.primary}33`,
      width: '320px',
      maxWidth: '320px',
      maxHeight: '700px',
      overflowY: 'auto',
      boxShadow: `0 0 30px rgba(27, 169, 245, 0.2)`
    }}>
      <h3 style={{ 
        margin: '0 0 15px 0', 
        fontSize: '16px',
        color: ELASTIC_COLORS.primary,
        borderBottom: `1px solid ${ELASTIC_COLORS.primary}33`,
        paddingBottom: '8px'
      }}>
        Elastic Index Types
      </h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '13px', 
          color: ELASTIC_COLORS.secondary 
        }}>
          Available Indexes
        </h4>
        {ELASTIC_INDEX_CONFIGS.map((config, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '8px',
            padding: '4px',
            borderRadius: '4px',
            transition: 'background 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}>
            <div title={`${config.quantization} precision`} style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: config.color,
              marginRight: '10px',
              boxShadow: `0 0 10px ${config.color}60`,
              border: `2px solid ${config.color}88`
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '12px', cursor: 'help' }} title={`Technical: ${config.indexType} index`}>{config.name}</div>
              <div style={{ fontSize: '10px', color: '#aaa', cursor: 'help' }} title={`${config.quantization} quantization`}>
                {config.memoryReduction} smaller
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '13px', 
          color: ELASTIC_COLORS.accent 
        }}>
          Optimal Use Cases
        </h4>
        {ELASTIC_OPTIMAL_ZONES.map((zone, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            marginBottom: '8px',
            padding: '4px',
            borderRadius: '4px'
          }}>
            <div style={{
              width: '14px',
              height: '14px',
              backgroundColor: zone.color,
              opacity: 0.7,
              marginRight: '10px',
              borderRadius: '2px',
              border: `1px solid ${zone.color}`
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{zone.name}</div>
              <div style={{ fontSize: '10px', color: '#aaa', lineHeight: '1.3' }}>
                {zone.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '13px', 
          color: ELASTIC_COLORS.warning 
        }}>
          Performance Metrics
        </h4>
        <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
          <div style={{ marginBottom: '4px' }}>
            <strong style={{ color: ELASTIC_COLORS.primary, cursor: 'help' }} title="X-axis: Query Latency (1-1000ms, log scale)">Speed:</strong>
            <div style={{ marginLeft: '16px', color: '#ccc' }}>
              How fast searches complete
            </div>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong style={{ color: ELASTIC_COLORS.secondary, cursor: 'help' }} title="Y-axis: Memory per Million Vectors (10MB-10GB, log scale)">Storage:</strong>
            <div style={{ marginLeft: '16px', color: '#ccc' }}>
              Memory used per million items
            </div>
          </div>
          <div>
            <strong style={{ color: ELASTIC_COLORS.accent, cursor: 'help' }} title="Z-axis: Recall@10 (60-100%, linear scale)">Accuracy:</strong>
            <div style={{ marginLeft: '16px', color: '#ccc' }}>
              How often finds the right results
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        paddingTop: '12px', 
        borderTop: `1px solid ${ELASTIC_COLORS.primary}33`,
        fontSize: '10px',
        color: '#888'
      }}>
        <div style={{ marginBottom: '6px', fontWeight: 'bold', color: ELASTIC_COLORS.success }}>
          Interactions:
        </div>
        <div style={{ lineHeight: '1.4' }}>
          • Drag to rotate 3D view<br/>
          • Scroll to zoom in/out<br/>
          • Hover spheres for quick metrics<br/>
          • Click spheres for detailed analysis<br/>
          • Adjust HNSW parameters to see impact
        </div>
      </div>

      <div style={{ 
        marginTop: '12px',
        padding: '8px',
        background: `linear-gradient(135deg, ${ELASTIC_COLORS.primary}11 0%, transparent 100%)`,
        borderRadius: '6px',
        fontSize: '10px',
        color: ELASTIC_COLORS.secondary,
        textAlign: 'center'
      }}>
        <strong>BBQ</strong> = Better Binary Quantization<br/>
        <span style={{ color: '#888' }}>Elastic's breakthrough 1-bit precision</span>
      </div>
    </div>
  );
}