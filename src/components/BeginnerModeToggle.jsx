import { useState } from 'react'
import { ELASTIC_COLORS } from '../data/ElasticConfigurations'

export default function BeginnerModeToggle({ onModeChange }) {
  const [isBeginnerMode, setIsBeginnerMode] = useState(true)

  const handleToggle = () => {
    const newMode = !isBeginnerMode
    setIsBeginnerMode(newMode)
    onModeChange(newMode)
  }

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '360px',  // Position to the right of the legend
      zIndex: 1000
    }}>
      <button
        onClick={handleToggle}
        style={{
          padding: '8px 16px',
          background: isBeginnerMode 
            ? `linear-gradient(135deg, ${ELASTIC_COLORS.success}44 0%, ${ELASTIC_COLORS.success}22 100%)`
            : `linear-gradient(135deg, ${ELASTIC_COLORS.warning}44 0%, ${ELASTIC_COLORS.warning}22 100%)`,
          color: 'white',
          border: `1px solid ${isBeginnerMode ? ELASTIC_COLORS.success : ELASTIC_COLORS.warning}`,
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
          boxShadow: `0 2px 10px ${isBeginnerMode ? ELASTIC_COLORS.success : ELASTIC_COLORS.warning}33`
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)'
        }}
      >
        <span style={{ fontSize: '16px' }}>
          {isBeginnerMode ? '👶' : '🚀'}
        </span>
        {isBeginnerMode ? 'Beginner Mode' : 'Expert Mode'}
      </button>
      {/* Removed the description box to reduce clutter */}
    </div>
  )
}

export const translateToBeginner = (term, value) => {
  const translations = {
    // Metrics
    'Query Latency': 'Search Speed',
    'Memory per Million Vectors': 'Storage Cost',
    'Recall@10': 'Search Accuracy',
    'Queries/sec': 'Searches per Second',
    'Indexing Speed': 'Data Processing Speed',
    
    // Technical terms
    'quantization': 'compression type',
    'HNSW': 'Search Network',
    'float32': 'full quality',
    '8-bit': 'light compression',
    '4-bit': 'medium compression', 
    '1-bit': 'extreme compression',
    'none': 'no compression',
    
    // Values with units
    'latency_ms': value < 20 ? '⚡ Very Fast' : value < 50 ? '🏃 Fast' : value < 100 ? '🚶 Normal' : '🐢 Slow',
    'memory_gb': value < 0.5 ? '💚 Very Low' : value < 2 ? '💛 Low' : value < 5 ? '🧡 Medium' : '❤️ High',
    'recall_pct': value > 95 ? '🎯 Excellent' : value > 90 ? '✅ Very Good' : value > 85 ? '👍 Good' : value > 80 ? '🤔 Acceptable' : '⚠️ Limited',
    
    // Index types
    'hnsw': 'Premium (Best Quality)',
    'int8_hnsw': 'Recommended (Balanced)',
    'int4_hnsw': 'Economy (Cost-Effective)',
    'bbq_hnsw': 'Ultra-Compressed (Massive Scale)',
    'flat': 'Perfect Search (Small Data)',
    'bbq_flat': 'Compressed Perfect Search'
  }
  
  return translations[term] || term
}

export const getBeginnerTooltip = (term) => {
  const tooltips = {
    'Search Speed': 'How long it takes to find results. Faster is better for user experience.',
    'Storage Cost': 'How much disk/memory space is needed. Lower costs save money.',
    'Search Accuracy': 'How often the search finds the right results. Higher is better but costs more.',
    'compression': 'Reduces storage needs by simplifying data, like making a photo smaller.',
    'Search Network': 'A smart way to organize data for fast searching, like a well-organized library.',
    'Searches per Second': 'How many users can search at the same time. Important for popular services.',
    'Data Processing Speed': 'How fast new data can be added to the search system.'
  }
  
  return tooltips[term] || null
}