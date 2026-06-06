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

  // Proporciones compactas fijas para la mitad inferior (Opción 2)
  const containerStyle: React.CSSProperties = isMobile ? {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '40vh',
    backgroundColor: '#0a0a1e',
    borderTop: '2px solid #f6a000',
    padding: '12px 16px',
    boxSizing: 'border-box',
    zIndex: 999,
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  } : {};

  const nameStyle: React.CSSProperties = isMobile ? {
    color: '#f6a000',
    fontSize: '1.1rem',
    margin: '0 0 4px 0',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 'bold',
    textAlign: 'left'
  } : {};

  const descriptionStyle: React.CSSProperties = isMobile ? {
    color: '#e2e8f0',
    fontSize: '0.85rem',
    lineHeight: '1.4',
    margin: 0,
    textAlign: 'left',
  } : {};

  return (
    <AnimatePresence>
      {brand && (
        <motion.div
          className="fi-brand-overlay"
          style={containerStyle}
          initial={isMobile ? { opacity: 0, y: 50 } : { opacity: 0, x: 50 }}
          animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
          exit={isMobile ? { opacity: 0, y: 50 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="fi-brand-overlay__content">
            <h2 style={isMobile ? nameStyle : {}} className={isMobile ? "" : "fi-brand-overlay__name"}>
              {brand.name}
            </h2>
            <p style={isMobile ? descriptionStyle : {}} className={isMobile ? "" : "fi-brand-overlay__description"}>
              {brand.descripcion}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
