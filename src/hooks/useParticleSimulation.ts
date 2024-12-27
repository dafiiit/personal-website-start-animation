import { useEffect } from 'react';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as CANNON from 'cannon-es';
import { setupScene } from '../utils/sceneSetup';
import { createParticles } from '../utils/particleCreator';
import { applyExplosionForce, fadeOutParticles } from '../utils/animationUtils';
import { useCleanup } from './useCleanup';
import { useWindowResize } from './useWindowResize';

export const useParticleSimulation = (containerRef: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const { scene, camera, renderer, world } = setupScene(containerRef.current);
    const particles: ReturnType<typeof createParticles> = [];
    let physicsEnabled = false;

    // Create text geometry
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
      const textGeometry = new TextGeometry('David', {
        font,
        size: 5,
        height: 0.5,
        curveSegments: 24,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.05,
        bevelSegments: 8
      });

      textGeometry.center();
      createParticles(textGeometry, scene, world, particles, 0.2);

      // Add explosion effect after delay
      setTimeout(() => {
        physicsEnabled = true;
        applyExplosionForce(particles);
        
        // Start fade out after explosion
        setTimeout(() => {
          fadeOutParticles(particles, 1);
        }, 500);
      }, 2000);
    });

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      if (physicsEnabled) {
        world.step(1 / 60);
        particles.forEach(({ mesh, body }) => {
          mesh.position.copy(body.position as any);
          mesh.quaternion.copy(body.quaternion as any);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => useWindowResize(camera, renderer);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => useCleanup(containerRef, renderer, handleResize);
  }, []);
};