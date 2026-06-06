import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Brand } from '../data/brandData';

interface BrandOverlayProps {
  brand: Brand | null;
}

export const BrandOverlay: React.FC<BrandOverlayProps> = ({ brand }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Estilos responsivos en tiempo de ejecución
  const containerStyle: React.CSSProperties = isMobile ? {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '42vh',
    backgroundColor: '#0a0a1e',
    borderTop: '3px solid #f6a000',
    padding: '20px',
    overflowY: 'auto',
    boxSizing: 'border-box',
    zIndex: 999,
  } : {};

  const nameStyle: React.CSSProperties = isMobile ? {
    color: '#f6a000',
    fontSize: '1.3rem',
    margin: '0 0 10px 0',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 'bold',
    textAlign: 'left'
  } : {};

  const descriptionStyle: React.CSSProperties = isMobile ? {
    color: '#ffffff',
    fontSize: '0.95rem',
    lineSpacing: '1.5',
    margin: 0,
    textAlign: 'left'
  } : {};

  return (
    <AnimatePresence>
      {brand && (
        <motion.div
          className={isMobile ? "" : "fi-brand-overlay"}
          style={containerStyle}
          initial={isMobile ? { opacity: 0, y: 100 } : { opacity: 0, x: 50 }}
          animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
          exit={isMobile ? { opacity: 0, y: 100 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className={isMobile ? "" : "fi-brand-overlay__content"}>
            <h2 style={nameStyle} className={isMobile ? "" : "fi-brand-overlay__name"}>
              {brand.name}
            </h2>
            <p style={descriptionStyle} className={isMobile ? "" : "fi-brand-overlay__description"}>
              {brand.descripcion}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
