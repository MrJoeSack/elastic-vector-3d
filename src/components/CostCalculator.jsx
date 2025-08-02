import { useState } from 'react'
import { ELASTIC_COLORS } from '../data/ElasticConfigurations'

// AWS/Cloud pricing estimates (per GB/month)
const CLOUD_PRICING = {
  storage: {
    ssd: 0.10,  // per GB/month for SSD
    hdd: 0.025, // per GB/month for HDD
  },
  memory: {
    standard: 3.50, // per GB/month for RAM
  },
  compute: {
    vcpu: 40.00, // per vCPU/month
  },
  transfer: {
    egress: 0.09, // per GB outbound
  }
}

// Elasticsearch Cloud pricing tiers (simplified)
const ELASTIC_CLOUD_TIERS = {
  standard: { multiplier: 1.0, name: 'Standard', sla: '99.5%' },
  gold: { multiplier: 1.5, name: 'Gold', sla: '99.9%' },
  platinum: { multiplier: 2.0, name: 'Platinum', sla: '99.95%' }
}

export default function CostCalculator({ config, params, performance }) {
  const [cloudTier, setCloudTier] = useState('standard')
  const [monthlyQueries, setMonthlyQueries] = useState(1000000) // 1M queries/month default
  
  if (!config || !performance) return null

  // Calculate costs
  const calculateCosts = () => {
    const vectorCount = parseFloat(params.datasetSize.replace(/[KMB]/, '')) * 
      (params.datasetSize.includes('K') ? 1000 : 
       params.datasetSize.includes('M') ? 1000000 : 
       params.datasetSize.includes('B') ? 1000000000 : 1)
    
    // Storage cost (includes both vectors and graph for HNSW)
    const storageSizeGB = (performance.memoryPerMillion * vectorCount / 1000000) / 1024
    const graphOverheadGB = config.indexType.includes('hnsw') 
      ? storageSizeGB * (params.m / 16) * 0.2  // Graph overhead scales with m
      : 0
    const totalStorageGB = storageSizeGB + graphOverheadGB
    const storageCost = totalStorageGB * CLOUD_PRICING.storage.ssd
    
    // Memory cost (for hot data)
    const hotDataRatio = config.indexType.includes('hnsw') ? 0.3 : 1.0 // HNSW can page out some data
    const memoryCost = (totalStorageGB * hotDataRatio) * CLOUD_PRICING.memory.standard
    
    // Compute cost (based on query volume and latency)
    const queriesPerSecond = monthlyQueries / (30 * 24 * 3600)
    const vcpusNeeded = Math.ceil(queriesPerSecond / (performance.qps / 4)) // Assume 4 cores per instance
    const computeCost = vcpusNeeded * CLOUD_PRICING.compute.vcpu
    
    // Transfer cost (assume 1KB response per query)
    const transferGB = (monthlyQueries * 1) / (1024 * 1024) // 1KB per query
    const transferCost = transferGB * CLOUD_PRICING.transfer.egress
    
    // Apply cloud tier multiplier
    const tierMultiplier = ELASTIC_CLOUD_TIERS[cloudTier].multiplier
    
    return {
      storage: storageCost * tierMultiplier,
      memory: memoryCost * tierMultiplier,
      compute: computeCost * tierMultiplier,
      transfer: transferCost,
      total: (storageCost + memoryCost + computeCost + transferCost) * tierMultiplier,
      breakdown: {
        storageSizeGB,
        graphOverheadGB,
        totalStorageGB,
        vcpusNeeded,
        hotDataRatio
      }
    }
  }
  
  const costs = calculateCosts()
  
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      background: `linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(0, 0, 0, 0.95) 100%)`,
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      border: `1px solid ${ELASTIC_COLORS.success}33`,
      width: '320px',
      boxShadow: `0 0 30px rgba(0, 217, 255, 0.2)`
    }}>
      <h3 style={{ 
        margin: '0 0 16px 0', 
        fontSize: '16px',
        color: ELASTIC_COLORS.success,
        borderBottom: `1px solid ${ELASTIC_COLORS.success}33`,
        paddingBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>💰</span> Cost Calculator
      </h3>
      
      {/* Query Volume Input */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ 
          fontSize: '12px', 
          color: ELASTIC_COLORS.secondary,
          display: 'block',
          marginBottom: '4px'
        }}>
          Monthly Query Volume
        </label>
        <input
          type="number"
          value={monthlyQueries}
          onChange={(e) => setMonthlyQueries(Math.max(1000, parseInt(e.target.value) || 0))}
          style={{
            width: '100%',
            padding: '6px',
            background: 'rgba(255,255,255,0.1)',
            border: `1px solid ${ELASTIC_COLORS.secondary}44`,
            borderRadius: '4px',
            color: 'white',
            fontSize: '12px'
          }}
        />
        <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
          {(monthlyQueries / 1000000).toFixed(1)}M queries/month
        </div>
      </div>
      
      {/* Cloud Tier Selection */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          fontSize: '12px', 
          color: ELASTIC_COLORS.accent,
          display: 'block',
          marginBottom: '8px'
        }}>
          Deployment Tier
        </label>
        <div style={{ display: 'flex', gap: '4px' }}>
          {Object.entries(ELASTIC_CLOUD_TIERS).map(([tier, info]) => (
            <button
              key={tier}
              onClick={() => setCloudTier(tier)}
              style={{
                flex: 1,
                padding: '6px',
                fontSize: '11px',
                background: cloudTier === tier
                  ? `linear-gradient(135deg, ${ELASTIC_COLORS.success} 0%, ${ELASTIC_COLORS.success}88 100%)`
                  : 'rgba(255,255,255,0.1)',
                color: cloudTier === tier ? 'white' : '#aaa',
                border: `1px solid ${cloudTier === tier ? ELASTIC_COLORS.success : '#444'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{info.name}</div>
              <div style={{ fontSize: '9px', marginTop: '2px' }}>
                SLA: {info.sla}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Cost Breakdown */}
      <div style={{
        padding: '12px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        marginBottom: '12px'
      }}>
        <h4 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '13px',
          color: ELASTIC_COLORS.warning
        }}>
          Estimated Monthly Costs
        </h4>
        
        <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#aaa' }}>Storage ({costs.breakdown.totalStorageGB.toFixed(1)}GB):</span>
            <strong>${costs.storage.toFixed(2)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#aaa' }}>Memory (Hot Data):</span>
            <strong>${costs.memory.toFixed(2)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#aaa' }}>Compute ({costs.breakdown.vcpusNeeded} vCPUs):</span>
            <strong>${costs.compute.toFixed(2)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#aaa' }}>Data Transfer:</span>
            <strong>${costs.transfer.toFixed(2)}</strong>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: `1px solid ${ELASTIC_COLORS.success}33`,
            fontSize: '14px',
            fontWeight: 'bold',
            color: ELASTIC_COLORS.success
          }}>
            <span>Total Monthly:</span>
            <span>${costs.total.toFixed(2)}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: '4px',
            fontSize: '11px',
            color: '#888'
          }}>
            <span>Annual Cost:</span>
            <span>${(costs.total * 12).toFixed(0)}</span>
          </div>
        </div>
      </div>
      
      {/* Savings Comparison */}
      {config.indexType !== 'hnsw' && (
        <div style={{
          padding: '8px',
          background: `linear-gradient(135deg, ${ELASTIC_COLORS.success}11 0%, transparent 100%)`,
          borderRadius: '6px',
          fontSize: '11px',
          lineHeight: '1.4'
        }}>
          <strong style={{ color: ELASTIC_COLORS.success }}>
            💡 Savings vs Standard HNSW:
          </strong>
          <div style={{ marginTop: '4px', color: '#ccc' }}>
            You save ~${((4 - parseFloat(config.memoryReduction)) * costs.total / 4).toFixed(0)}/month
            ({config.memoryReduction} memory reduction)
          </div>
        </div>
      )}
      
      {/* Warnings */}
      {costs.total > 1000 && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          background: `linear-gradient(135deg, ${ELASTIC_COLORS.warning}22 0%, transparent 100%)`,
          borderRadius: '6px',
          fontSize: '10px',
          color: ELASTIC_COLORS.warning,
          lineHeight: '1.4'
        }}>
          ⚠️ High cost detected! Consider BBQ or int4 quantization for significant savings.
        </div>
      )}
      
      <div style={{
        marginTop: '12px',
        fontSize: '9px',
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        * Estimates based on typical cloud pricing. Actual costs may vary.
      </div>
    </div>
  )
}