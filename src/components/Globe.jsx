import { useEffect, useRef } from 'react';
import GlobeGL from 'react-globe.gl';
import Particles from './Particles2';

export default function Globe() {
  const globeEl = useRef();

  useEffect(() => {
    if (globeEl.current) {
      // Rotación automática y sin zoom
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.controls().enableZoom = false;

      // 🌐 Hacer el fondo del canvas transparente
      const renderer = globeEl.current.renderer();
      renderer.setClearColor('rgba(0, 0, 0, 0)', 0);
    }
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      {/* 🔸 Particles en el fondo */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <Particles/>
      </div>

      {/* 🌍 Globo transparente encima */}  
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <GlobeGL
          ref={globeEl}
          width={window.innerWidth / 2}
          height={window.innerHeight}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          showAtmosphere={true}
          atmosphereColor="rgba(135, 206, 235, 0.3)"
          atmosphereAltitude={0.25}
          // Configuración de nubes mejorada
          cloudsImageUrl="/clouds.png"
          cloudsAltitude={0.2}
          cloudsTransitionDuration={2000}
        />
      </div>
    </div>
  );
}
