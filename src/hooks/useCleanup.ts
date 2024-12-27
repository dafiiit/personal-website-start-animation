export const useCleanup = (
  containerRef: React.RefObject<HTMLDivElement>,
  renderer: THREE.WebGLRenderer,
  handleResize: () => void
) => {
  window.removeEventListener('resize', handleResize);
  containerRef.current?.removeChild(renderer.domElement);
};