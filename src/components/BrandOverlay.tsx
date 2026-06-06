import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Brand } from '../data/brandData';

interface BrandOverlayProps {
  brand: Brand | null;
}

export const BrandOverlay: React.FC<BrandOverlayProps> = ({ brand }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detectamos el tamaño de la pantalla en tiempo real
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Ejecutar al montar
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Si estamos en móvil, no renderizamos el panel derecho para evitar que pise el juego
  if (isMobile) return null;

  return (
    <AnimatePresence>
      {brand && (
        <motion.div
          className="fi-brand-overlay"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="fi-brand-overlay__content">
            <h2 className="fi-brand-overlay__name">{brand.name}</h2>
            <p className="fi-brand-overlay__description">
              {brand.descripcion}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
