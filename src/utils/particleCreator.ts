import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export const createParticles = (
  textGeometry: THREE.BufferGeometry,
  scene: THREE.Scene,
  world: CANNON.World,
  particles: { mesh: THREE.Mesh; body: CANNON.Body }[],
  particleSize: number
) => {
  const material = new THREE.MeshPhongMaterial({ 
    color: 0x00ff00,
    emissive: 0x00ff00,
    emissiveIntensity: 0.2,
    shininess: 100
  });

  // Create a grid-based sampling approach
  const bbox = new THREE.Box3().setFromBufferAttribute(
    textGeometry.attributes.position as THREE.BufferAttribute
  );
  const size = new THREE.Vector3();
  bbox.getSize(size);

  // Define grid size
  const gridStep = particleSize * 3; // Adjust this value to control density
  const positions: number[] = [];
  
  // Sample points using raycasting for better distribution
  const raycaster = new THREE.Raycaster();
  const textMesh = new THREE.Mesh(textGeometry);
  
  // Create grid of points
  for (let x = bbox.min.x; x <= bbox.max.x; x += gridStep) {
    for (let y = bbox.min.y; y <= bbox.max.y; y += gridStep) {
      // Cast ray from front to back
      const origin = new THREE.Vector3(x, y, bbox.max.z + 1);
      raycaster.set(origin, new THREE.Vector3(0, 0, -1));
      const intersects = raycaster.intersectObject(textMesh);
      
      if (intersects.length > 0) {
        const point = intersects[0].point;
        positions.push(point.x, point.y, point.z);
      }
    }
  }

  // Create particles at sampled positions
  for (let i = 0; i < positions.length; i += 3) {
    const particle = new THREE.Mesh(
      new THREE.SphereGeometry(particleSize),
      material
    );
    
    particle.position.set(positions[i], positions[i + 1], positions[i + 2]);
    particle.castShadow = true;
    particle.receiveShadow = true;

    const shape = new CANNON.Sphere(particleSize);
    const body = new CANNON.Body({
      mass: 1,
      shape,
      position: new CANNON.Vec3(positions[i], positions[i + 1], positions[i + 2]),
    });

    scene.add(particle);
    world.addBody(body);
    particles.push({ mesh: particle, body });
  }
};