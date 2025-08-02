export default function Legend() {
  const configurations = [
    { name: 'Cold Storage', color: '#4FC3F7', description: 'Low cost, higher latency' },
    { name: 'Warm Cache', color: '#66BB6A', description: 'Balanced performance' },
    { name: 'Premium Hot', color: '#F44336', description: 'Ultra-low latency' },
    { name: 'Balanced', color: '#FFB74D', description: 'Cost-effective' }
  ];

  const zones = [
    { name: 'Real-time Search', color: '#FF5722', description: 'Latency < 50ms, Recall > 92%' },
    { name: 'RAG Applications', color: '#4CAF50', description: 'Latency < 200ms, Cost < $200, Recall > 90%' },
    { name: 'Batch Analytics', color: '#2196F3', description: 'Cost < $100, Recall > 85%' }
  ];

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '20px',
      borderRadius: '8px',
      fontSize: '12px',
      border: '1px solid #333',
      minWidth: '280px'
    }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Legend</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#ccc' }}>Configurations</h4>
        {configurations.map((config, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '8px' 
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: config.color,
              marginRight: '10px',
              boxShadow: `0 0 10px ${config.color}40`
            }} />
            <div>
              <div style={{ fontWeight: 'bold' }}>{config.name}</div>
              <div style={{ fontSize: '10px', color: '#aaa' }}>{config.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#ccc' }}>Optimal Zones</h4>
        {zones.map((zone, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '8px' 
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: zone.color,
              opacity: 0.6,
              marginRight: '10px'
            }} />
            <div>
              <div style={{ fontWeight: 'bold' }}>{zone.name}</div>
              <div style={{ fontSize: '10px', color: '#aaa' }}>{zone.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#ccc' }}>Axes</h4>
        <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
          <div><strong>X-axis:</strong> Query Latency (10ms - 1000ms, log scale)</div>
          <div><strong>Y-axis:</strong> Cost per Million Vectors/Month ($20 - $2000, log scale)</div>
          <div><strong>Z-axis:</strong> Recall@10 Percentage (80% - 99%, linear scale)</div>
        </div>
      </div>

      <div style={{ 
        marginTop: '15px', 
        paddingTop: '15px', 
        borderTop: '1px solid #333',
        fontSize: '10px',
        color: '#888'
      }}>
        <div><strong>Interactions:</strong></div>
        <div>• Drag to rotate view</div>
        <div>• Scroll to zoom</div>
        <div>• Hover over spheres for details</div>
        <div>• Click spheres for configuration info</div>
      </div>
    </div>
  );
}