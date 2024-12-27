import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export const applyExplosionForce = (particles: { body: CANNON.Body }[]) => {
  particles.forEach(({ body }) => {
    const force = new CANNON.Vec3(
      (Math.random() - 0.5) * 100,
      Math.random() * 100,
      (Math.random() - 0.5) * 100
    );
    body.applyImpulse(force);
  });
};

export const fadeOutParticles = (particles: { mesh: THREE.Mesh }[], duration: number = 1) => {
  particles.forEach(({ mesh }) => {
    const material = mesh.material as THREE.MeshPhongMaterial;
    material.transparent = true;
    const startOpacity = material.opacity || 1;
    
    const animate = (startTime: number) => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      material.opacity = startOpacity * (1 - progress);
      
      if (progress < 1) {
        requestAnimationFrame(() => animate(startTime));
      }
    };
    
    animate(Date.now());
  });
};