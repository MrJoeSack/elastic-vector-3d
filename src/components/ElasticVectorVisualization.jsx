import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js'
import { 
  ELASTIC_INDEX_CONFIGS, 
  ELASTIC_OPTIMAL_ZONES,
  calculatePerformance 
} from '../data/ElasticConfigurations'

// Logarithmic scaling functions for axes
const logScale = (value, min, max, targetMin = -2, targetMax = 4) => {
  const logValue = Math.log10(value);
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);
  return targetMin + (logValue - logMin) / (logMax - logMin) * (targetMax - targetMin);
};

const linearScale = (value, min, max, targetMin = 0, targetMax = 5) => {
  return targetMin + (value - min) / (max - min) * (targetMax - targetMin);
};

// Convert data coordinates to 3D positions
const dataToPosition = (latency, memory, recall) => [
  logScale(latency, 1, 1000),      // X: log scale for latency (1ms to 1000ms)
  logScale(memory, 10, 10000),     // Y: log scale for memory per million vectors (10MB to 10GB)
  linearScale(recall, 60, 100)     // Z: linear scale for recall (60% to 100%)
];

// Parametric functions for curved optimal zones
const createRealTimeRAGSurface = (u, v, target) => {
  // Real-time RAG: Balance between latency and recall
  const x = -2 + u * 3.5;  // latency range: 1-50ms
  const y = -2 + v * 6;    // memory: full range
  
  // Exponential curve for latency vs recall trade-off
  const latencyFactor = Math.exp(-2 * u);
  const memoryFactor = 1 - Math.exp(-1.2 * v);
  
  const z = 3.5 + latencyFactor * memoryFactor * 1.5; // 85%+ recall
  
  target.set(x, y, Math.min(z, 5));
};

const createLargeScaleSurface = (u, v, target) => {
  // Large-scale search: Memory efficiency with good recall
  const x = -2 + u * 6;    // latency: wider tolerance
  const y = -2 + v * 4.5;  // memory: up to 1GB per million
  
  // Power function for balanced trade-offs
  const scaleFactor = Math.pow(u, 0.6) * Math.pow(v, 0.7);
  const z = 3 + scaleFactor * 2; // 80%+ recall
  
  target.set(x, y, Math.min(z, 5));
};

const createCostOptimizedSurface = (u, v, target) => {
  // Cost-optimized: Minimum memory with acceptable recall
  const x = -2 + u * 6;   // latency: wide tolerance
  const y = -2 + v * 3.5; // memory: up to 500MB per million
  
  // Gentle curve for cost-sensitive scenarios
  const costFactor = 1 - Math.exp(-1.5 * v);
  const z = 2.5 + costFactor * 2.5; // 75%+ recall
  
  target.set(x, y, Math.min(z, 5));
};

const createHighAccuracySurface = (u, v, target) => {
  // High accuracy: Maximum recall regardless of cost
  const x = -2 + u * 6;  // latency: full range
  const y = -2 + v * 6;  // memory: full range
  
  // Steep curve requiring high recall
  const accuracyFactor = Math.pow(u * v, 0.3);
  const z = 4.5 + accuracyFactor * 0.5; // 95%+ recall
  
  target.set(x, y, Math.min(z, 5));
};

function ConfigurationPoint({ config, params, isSelected, isHovered, onClick, onHover, onHoverEnd }) {
  const meshRef = useRef();
  const glowRef = useRef();
  
  // Calculate dynamic performance based on parameters
  const performance = useMemo(() => {
    return calculatePerformance(config.indexType, params);
  }, [config.indexType, params]);
  
  const position = useMemo(() => {
    if (!performance) return [0, 0, 0];
    return dataToPosition(performance.latency, performance.memoryPerMillion, performance.recall);
  }, [performance]);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      const scale = isHovered ? 1.3 : isSelected ? 1.2 : 1.0;
      meshRef.current.scale.setScalar(scale + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
    
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(config);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(config);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHoverEnd();
        }}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshPhongMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, 0.4, 0]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {config.name}
      </Text>
      
      {/* Quantization indicator */}
      {config.quantization !== 'none' && (
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.08}
          color="#FFE66D"
          anchorX="center"
          anchorY="middle"
        >
          {config.quantization}
        </Text>
      )}
    </group>
  );
}

function OptimalZone({ zone }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = zone.opacity + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
    }
  });

  // Create parametric geometry for curved zones
  const geometry = useMemo(() => {
    let parametricFunction;
    
    // Map zone to its corresponding parametric function
    switch (zone.name) {
      case 'Real-time RAG':
        parametricFunction = createRealTimeRAGSurface;
        break;
      case 'Large-scale Search':
        parametricFunction = createLargeScaleSurface;
        break;
      case 'Cost-optimized':
        parametricFunction = createCostOptimizedSurface;
        break;
      case 'High Accuracy':
        parametricFunction = createHighAccuracySurface;
        break;
      default:
        parametricFunction = (u, v, target) => {
          const x = -2 + u * 6;
          const y = -2 + v * 6;
          const z = Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * 2 + 2.5;
          target.set(x, y, z);
        };
    }
    
    return new ParametricGeometry(parametricFunction, 32, 32);
  }, [zone.name]);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial
        color={zone.color}
        transparent
        opacity={zone.opacity}
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  );
}

function Axes() {
  const latencyLabels = [1, 10, 50, 100, 500, 1000];
  const memoryLabels = [10, 50, 100, 500, 1000, 5000, 10000];
  const recallLabels = [60, 70, 80, 90, 100];

  return (
    <group>
      {/* X-axis (Latency) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-2, -2, 0, 4, -2, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#666" />
      </line>
      
      {/* Y-axis (Memory) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-2, -2, 0, -2, 4, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#666" />
      </line>
      
      {/* Z-axis (Recall) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-2, -2, 0, -2, -2, 5])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#666" />
      </line>

      {/* Axis Labels */}
      <Text position={[1, -2.5, 0]} fontSize={0.15} color="#1BA9F5" anchorX="center">
        Query Latency (ms)
      </Text>
      <Text position={[-2.8, 1, 0]} fontSize={0.15} color="#00BFB3" anchorX="center" rotation={[0, 0, Math.PI / 2]}>
        Memory per Million Vectors (MB)
      </Text>
      <Text position={[-2.5, -2.5, 2.5]} fontSize={0.15} color="#FEC514" anchorX="center" rotation={[0, -Math.PI / 2, 0]}>
        Recall@10 (%)
      </Text>

      {/* Grid lines and tick labels */}
      {latencyLabels.map(latency => {
        const x = logScale(latency, 1, 1000);
        return (
          <group key={latency}>
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([x, -2, 0, x, -2, 5])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#333" />
            </line>
            <Text position={[x, -2.3, 0]} fontSize={0.1} color="#666" anchorX="center">
              {latency}
            </Text>
          </group>
        );
      })}

      {memoryLabels.map(memory => {
        const y = logScale(memory, 10, 10000);
        if (y >= -2 && y <= 4) {
          return (
            <group key={memory}>
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([-2, y, 0, 4, y, 0])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#333" />
              </line>
              <Text position={[-2.3, y, 0]} fontSize={0.1} color="#666" anchorX="center">
                {memory}
              </Text>
            </group>
          );
        }
        return null;
      })}

      {recallLabels.map(recall => {
        const z = linearScale(recall, 60, 100);
        return (
          <group key={recall}>
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([-2, -2, z, 4, 4, z])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#333" />
            </line>
            <Text position={[-2.3, -2.3, z]} fontSize={0.1} color="#666" anchorX="center">
              {recall}%
            </Text>
          </group>
        );
      })}
    </group>
  );
}

export default function ElasticVectorVisualization({ 
  onPointSelect, 
  onPointHover, 
  selectedPoint, 
  hoveredPoint,
  hnswParams 
}) {
  const handlePointClick = (config) => {
    onPointSelect(selectedPoint?.id === config.id ? null : config);
  };

  const handlePointHover = (config) => {
    onPointHover(config);
  };

  const handlePointHoverEnd = () => {
    onPointHover(null);
  };

  return (
    <group>
      <Axes />
      
      {ELASTIC_OPTIMAL_ZONES.map((zone, index) => (
        <OptimalZone key={index} zone={zone} />
      ))}
      
      {ELASTIC_INDEX_CONFIGS.map((config) => (
        <ConfigurationPoint
          key={config.id}
          config={config}
          params={hnswParams}
          isSelected={selectedPoint?.id === config.id}
          isHovered={hoveredPoint?.id === config.id}
          onClick={handlePointClick}
          onHover={handlePointHover}
          onHoverEnd={handlePointHoverEnd}
        />
      ))}
    </group>
  );
}