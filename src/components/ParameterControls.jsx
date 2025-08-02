import { useState } from 'react'
import { HNSW_PARAMS, DATASET_SCALING, DIMENSION_SCALING, ELASTIC_COLORS } from '../data/ElasticConfigurations'

export default function ParameterControls({ params, onChange, isBeginnerMode = false }) {
  const [showHelp, setShowHelp] = useState({})
  const handleParamChange = (key, value) => {
    onChange({
      ...params,
      [key]: value
    });
  };

  const SliderControl = ({ label, param, value, min, max, step = 1, description, helpText, beginnerLabel }) => (
    <div style={{ marginBottom: '16px', position: 'relative' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '4px',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label style={{ 
            fontSize: '12px', 
            fontWeight: 'bold',
            color: ELASTIC_COLORS.secondary
          }}>
            {isBeginnerMode && beginnerLabel ? beginnerLabel : label}
          </label>
          {helpText && (
            <button
              onClick={() => setShowHelp({ ...showHelp, [param]: !showHelp[param] })}
              style={{
                background: 'transparent',
                border: `1px solid ${ELASTIC_COLORS.accent}44`,
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '10px',
                color: ELASTIC_COLORS.accent,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
            >
              ?
            </button>
          )}
        </div>
        <span style={{ 
          fontSize: '12px', 
          fontWeight: 'bold',
          color: ELASTIC_COLORS.accent,
          minWidth: '50px',
          textAlign: 'right'
        }}>
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => handleParamChange(param, Number(e.target.value))}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          outline: 'none',
          background: `linear-gradient(to right, 
            ${ELASTIC_COLORS.primary} 0%, 
            ${ELASTIC_COLORS.primary} ${((value - min) / (max - min)) * 100}%, 
            ${ELASTIC_COLORS.dark} ${((value - min) / (max - min)) * 100}%, 
            ${ELASTIC_COLORS.dark} 100%)`,
          cursor: 'pointer',
          WebkitAppearance: 'none',
          appearance: 'none'
        }}
      />
      {description && (
        <div style={{ 
          fontSize: '10px', 
          color: '#888',
          marginTop: '4px',
          lineHeight: '1.3'
        }}>
          {description}
        </div>
      )}
      {showHelp[param] && helpText && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          padding: '8px',
          background: `linear-gradient(135deg, ${ELASTIC_COLORS.primary}22 0%, rgba(0,0,0,0.95) 100%)`,
          border: `1px solid ${ELASTIC_COLORS.primary}44`,
          borderRadius: '6px',
          fontSize: '11px',
          color: '#ccc',
          lineHeight: '1.4',
          zIndex: 1000,
          boxShadow: `0 4px 12px rgba(0,0,0,0.5)`
        }}>
          💡 {helpText}
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: `linear-gradient(135deg, rgba(0, 191, 179, 0.1) 0%, rgba(0, 0, 0, 0.95) 100%)`,
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      fontSize: '12px',
      border: `1px solid ${ELASTIC_COLORS.secondary}33`,
      width: '320px',
      boxShadow: `0 0 30px rgba(0, 191, 179, 0.2)`
    }}>
      <h3 style={{ 
        margin: '0 0 16px 0', 
        fontSize: '16px',
        color: ELASTIC_COLORS.secondary,
        borderBottom: `1px solid ${ELASTIC_COLORS.secondary}33`,
        paddingBottom: '8px'
      }}>
        HNSW Parameters
      </h3>

      <SliderControl
        label="m (connections)"
        beginnerLabel="Search Network Density"
        param="m"
        value={params.m}
        min={HNSW_PARAMS.m.min}
        max={HNSW_PARAMS.m.max}
        description={isBeginnerMode ? HNSW_PARAMS.m.effect : HNSW_PARAMS.m.description}
        helpText={HNSW_PARAMS.m.explanation}
      />

      <SliderControl
        label="ef_construction"
        beginnerLabel="Index Quality"
        param="ef_construction"
        value={params.ef_construction}
        min={HNSW_PARAMS.ef_construction.min}
        max={HNSW_PARAMS.ef_construction.max}
        step={10}
        description={isBeginnerMode ? HNSW_PARAMS.ef_construction.effect : HNSW_PARAMS.ef_construction.description}
        helpText={HNSW_PARAMS.ef_construction.explanation}
      />

      <SliderControl
        label="num_candidates"
        beginnerLabel="Search Thoroughness"
        param="num_candidates"
        value={params.num_candidates}
        min={HNSW_PARAMS.num_candidates.min}
        max={HNSW_PARAMS.num_candidates.max}
        step={10}
        description={isBeginnerMode ? HNSW_PARAMS.num_candidates.effect : HNSW_PARAMS.num_candidates.description}
        helpText={HNSW_PARAMS.num_candidates.explanation}
      />

      <div style={{ 
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: `1px solid ${ELASTIC_COLORS.secondary}33`
      }}>
        <h4 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '14px',
          color: ELASTIC_COLORS.accent
        }}>
          Dataset Configuration
        </h4>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            fontSize: '12px', 
            fontWeight: 'bold',
            color: ELASTIC_COLORS.secondary,
            display: 'block',
            marginBottom: '8px'
          }}>
            Dataset Size
          </label>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '6px'
          }}>
            {Object.keys(DATASET_SCALING).map((size) => (
              <button
                key={size}
                onClick={() => handleParamChange('datasetSize', size)}
                style={{
                  padding: '6px',
                  fontSize: '11px',
                  fontWeight: params.datasetSize === size ? 'bold' : 'normal',
                  background: params.datasetSize === size 
                    ? `linear-gradient(135deg, ${ELASTIC_COLORS.primary} 0%, ${ELASTIC_COLORS.primary}88 100%)`
                    : 'rgba(255,255,255,0.1)',
                  color: params.datasetSize === size ? 'white' : '#aaa',
                  border: `1px solid ${params.datasetSize === size ? ELASTIC_COLORS.primary : '#444'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (params.datasetSize !== size) {
                    e.target.style.background = 'rgba(255,255,255,0.15)';
                    e.target.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (params.datasetSize !== size) {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.color = '#aaa';
                  }
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ 
            fontSize: '12px', 
            fontWeight: 'bold',
            color: ELASTIC_COLORS.secondary,
            display: 'block',
            marginBottom: '8px'
          }}>
            Vector Dimensions
          </label>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px'
          }}>
            {Object.keys(DIMENSION_SCALING).map((dims) => (
              <button
                key={dims}
                onClick={() => handleParamChange('dimensions', Number(dims))}
                style={{
                  padding: '6px',
                  fontSize: '11px',
                  fontWeight: params.dimensions === Number(dims) ? 'bold' : 'normal',
                  background: params.dimensions === Number(dims)
                    ? `linear-gradient(135deg, ${ELASTIC_COLORS.secondary} 0%, ${ELASTIC_COLORS.secondary}88 100%)`
                    : 'rgba(255,255,255,0.1)',
                  color: params.dimensions === Number(dims) ? 'white' : '#aaa',
                  border: `1px solid ${params.dimensions === Number(dims) ? ELASTIC_COLORS.secondary : '#444'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (params.dimensions !== Number(dims)) {
                    e.target.style.background = 'rgba(255,255,255,0.15)';
                    e.target.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (params.dimensions !== Number(dims)) {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.color = '#aaa';
                  }
                }}
              >
                {dims}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '16px',
        padding: '12px',
        background: `linear-gradient(135deg, ${ELASTIC_COLORS.warning}11 0%, transparent 100%)`,
        borderRadius: '6px',
        fontSize: '11px',
        color: '#ccc',
        lineHeight: '1.5'
      }}>
        <strong style={{ color: ELASTIC_COLORS.warning }}>Performance Impact:</strong>
        <div style={{ marginTop: '4px' }}>
          Higher <strong>m</strong> and <strong>ef_construction</strong> improve recall but increase memory and indexing time.
        </div>
        <div style={{ marginTop: '4px' }}>
          More <strong>candidates</strong> improve search quality but increase query latency.
        </div>
      </div>

      <div style={{ 
        marginTop: '12px',
        padding: '8px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '6px',
        fontSize: '10px',
        textAlign: 'center',
        color: '#888'
      }}>
        Visualizations update in real-time<br/>
        Based on Elastic's 2024 benchmarks
      </div>
    </div>
  );
}