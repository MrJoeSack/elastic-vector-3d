import { ELASTIC_INDEX_CONFIGS, ELASTIC_OPTIMAL_ZONES, ELASTIC_COLORS } from '../data/ElasticConfigurations'

export default function ElasticLegend() {
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
      width: '300px',
      maxWidth: '300px',
      maxHeight: '400px',
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
        Elasticsearch Index Types
      </h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '13px', 
          color: ELASTIC_COLORS.secondary 
        }}>
          Index Configurations
        </h4>
        {ELASTIC_INDEX_CONFIGS.slice(0, 4).map((config, index) => (
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
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: config.color,
              marginRight: '10px',
              boxShadow: `0 0 10px ${config.color}60`,
              border: `2px solid ${config.color}88`
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{config.name}</div>
              <div style={{ fontSize: '10px', color: '#aaa' }}>
                {config.quantization} • {config.memoryReduction}
              </div>
            </div>
          </div>
        ))}
        
        <div style={{ 
          marginTop: '8px', 
          paddingTop: '8px', 
          borderTop: `1px solid ${ELASTIC_COLORS.dark}` 
        }}>
          {ELASTIC_INDEX_CONFIGS.slice(4).map((config, index) => (
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
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: config.color,
                marginRight: '10px',
                boxShadow: `0 0 10px ${config.color}60`,
                border: `2px solid ${config.color}88`
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{config.name}</div>
                <div style={{ fontSize: '10px', color: '#aaa' }}>
                  {config.quantization} • {config.memoryReduction}
                </div>
              </div>
            </div>
          ))}
        </div>
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
          3D Axes
        </h4>
        <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
          <div style={{ marginBottom: '4px' }}>
            <strong style={{ color: ELASTIC_COLORS.primary }}>X-axis:</strong>
            <div style={{ marginLeft: '16px', color: '#ccc' }}>
              Query Latency (1ms - 1000ms, log scale)
            </div>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong style={{ color: ELASTIC_COLORS.secondary }}>Y-axis:</strong>
            <div style={{ marginLeft: '16px', color: '#ccc' }}>
              Memory per Million Vectors (10MB - 10GB, log scale)
            </div>
          </div>
          <div>
            <strong style={{ color: ELASTIC_COLORS.accent }}>Z-axis:</strong>
            <div style={{ marginLeft: '16px', color: '#ccc' }}>
              Recall@10 (60% - 100%, linear scale)
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