import { useState } from 'react'
import { ELASTIC_COLORS } from '../data/ElasticConfigurations'

const PRESET_SCENARIOS = [
  {
    id: 'ecommerce',
    name: 'E-commerce Search',
    icon: '🛍️',
    description: 'Product search with filters',
    requirements: 'Fast response, good accuracy, moderate scale',
    recommended: {
      indexType: 'int8_hnsw',
      m: 16,
      ef_construction: 100,
      num_candidates: 100,
      datasetSize: '1M',
      dimensions: 768
    },
    explanation: 'Balanced performance for product catalogs with real-time updates'
  },
  {
    id: 'chatbot',
    name: 'RAG Chatbot',
    icon: '💬',
    description: 'Conversational AI knowledge base',
    requirements: 'Very fast, good accuracy, frequent queries',
    recommended: {
      indexType: 'int8_hnsw',
      m: 24,
      ef_construction: 150,
      num_candidates: 150,
      datasetSize: '10M',
      dimensions: 1536
    },
    explanation: 'Optimized for quick responses in conversational context'
  },
  {
    id: 'image',
    name: 'Image Similarity',
    icon: '🖼️',
    description: 'Visual search and recommendations',
    requirements: 'High accuracy, large vectors, batch processing OK',
    recommended: {
      indexType: 'hnsw',
      m: 32,
      ef_construction: 200,
      num_candidates: 200,
      datasetSize: '10M',
      dimensions: 1024
    },
    explanation: 'Maximum accuracy for visual similarity matching'
  },
  {
    id: 'logs',
    name: 'Log Analytics',
    icon: '📊',
    description: 'Security and observability search',
    requirements: 'Cost-effective, large scale, good-enough accuracy',
    recommended: {
      indexType: 'bbq_hnsw',
      m: 16,
      ef_construction: 100,
      num_candidates: 100,
      datasetSize: '100M',
      dimensions: 384
    },
    explanation: 'Extreme compression for massive log data volumes'
  },
  {
    id: 'legal',
    name: 'Legal Documents',
    icon: '⚖️',
    description: 'Contract and case law search',
    requirements: 'Perfect accuracy, compliance, smaller scale',
    recommended: {
      indexType: 'flat',
      m: 16,
      ef_construction: 100,
      num_candidates: 100,
      datasetSize: '100K',
      dimensions: 768
    },
    explanation: 'Exact search for compliance-critical applications'
  },
  {
    id: 'startup',
    name: 'Startup MVP',
    icon: '🚀',
    description: 'Proof of concept, limited budget',
    requirements: 'Lowest cost, acceptable accuracy, easy setup',
    recommended: {
      indexType: 'int4_hnsw',
      m: 12,
      ef_construction: 80,
      num_candidates: 80,
      datasetSize: '100K',
      dimensions: 384
    },
    explanation: 'Minimum viable configuration for testing ideas'
  }
]

export default function PresetScenarios({ onSelectScenario, currentParams }) {
  const [expandedScenario, setExpandedScenario] = useState(null)
  
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      background: `linear-gradient(135deg, rgba(254, 197, 20, 0.1) 0%, rgba(0, 0, 0, 0.95) 100%)`,
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      border: `1px solid ${ELASTIC_COLORS.accent}33`,
      width: '320px',
      maxHeight: '350px',
      overflowY: 'auto',
      boxShadow: `0 0 30px rgba(254, 197, 20, 0.2)`
    }}>
      <h3 style={{ 
        margin: '0 0 16px 0', 
        fontSize: '16px',
        color: ELASTIC_COLORS.accent,
        borderBottom: `1px solid ${ELASTIC_COLORS.accent}33`,
        paddingBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>⚡</span> Quick Start Scenarios
      </h3>
      
      <div style={{ 
        marginBottom: '12px',
        padding: '8px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '6px',
        fontSize: '11px',
        color: '#aaa',
        lineHeight: '1.4'
      }}>
        Select a common use case to automatically configure optimal settings
      </div>

      {PRESET_SCENARIOS.map((scenario) => (
        <div
          key={scenario.id}
          style={{
            marginBottom: '8px',
            border: `1px solid ${expandedScenario === scenario.id ? ELASTIC_COLORS.accent : '#333'}`,
            borderRadius: '8px',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
        >
          <button
            onClick={() => setExpandedScenario(
              expandedScenario === scenario.id ? null : scenario.id
            )}
            style={{
              width: '100%',
              padding: '12px',
              background: expandedScenario === scenario.id
                ? 'rgba(254, 197, 20, 0.1)'
                : 'rgba(255,255,255,0.02)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '13px',
              textAlign: 'left',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (expandedScenario !== scenario.id) {
                e.currentTarget.style.background = 'rgba(254, 197, 20, 0.05)'
              }
            }}
            onMouseLeave={(e) => {
              if (expandedScenario !== scenario.id) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
              }
            }}
          >
            <span style={{ fontSize: '20px' }}>{scenario.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                {scenario.name}
              </div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>
                {scenario.description}
              </div>
            </div>
            <span style={{
              transform: expandedScenario === scenario.id ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s ease',
              opacity: 0.5
            }}>
              ▼
            </span>
          </button>
          
          {expandedScenario === scenario.id && (
            <div style={{
              padding: '12px',
              background: 'rgba(0,0,0,0.3)',
              borderTop: `1px solid ${ELASTIC_COLORS.accent}33`
            }}>
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: ELASTIC_COLORS.secondary, fontSize: '12px' }}>
                  Requirements:
                </strong>
                <div style={{ fontSize: '11px', color: '#ccc', marginTop: '4px' }}>
                  {scenario.requirements}
                </div>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: ELASTIC_COLORS.primary, fontSize: '12px' }}>
                  Recommended Config:
                </strong>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#ccc', 
                  marginTop: '4px',
                  padding: '4px 8px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '4px',
                  fontFamily: 'monospace'
                }}>
                  Index: {scenario.recommended.indexType}<br/>
                  Dataset: {scenario.recommended.datasetSize} vectors<br/>
                  Dimensions: {scenario.recommended.dimensions}
                </div>
              </div>
              
              <div style={{ 
                marginBottom: '12px',
                fontSize: '11px',
                color: '#aaa',
                fontStyle: 'italic'
              }}>
                {scenario.explanation}
              </div>
              
              <button
                onClick={() => onSelectScenario(scenario.recommended)}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: `linear-gradient(135deg, ${ELASTIC_COLORS.accent} 0%, ${ELASTIC_COLORS.accent}88 100%)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)'
                  e.target.style.boxShadow = `0 4px 12px ${ELASTIC_COLORS.accent}44`
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)'
                  e.target.style.boxShadow = 'none'
                }}
              >
                Apply This Configuration
              </button>
            </div>
          )}
        </div>
      ))}
      
      <div style={{
        marginTop: '12px',
        padding: '8px',
        background: `linear-gradient(135deg, ${ELASTIC_COLORS.success}11 0%, transparent 100%)`,
        borderRadius: '6px',
        fontSize: '10px',
        color: ELASTIC_COLORS.success,
        textAlign: 'center'
      }}>
        💡 Tip: Start with a preset, then fine-tune parameters
      </div>
    </div>
  )
}