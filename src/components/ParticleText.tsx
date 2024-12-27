import { useEffect, useRef } from 'react';
import { useParticleSimulation } from '../hooks/useParticleSimulation';

const ParticleText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useParticleSimulation(containerRef);
  return <div ref={containerRef} className="w-full h-screen" />;
};

export default ParticleText;