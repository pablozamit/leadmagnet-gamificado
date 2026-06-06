import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Brand } from '../data/brandData';

interface BrandOverlayProps {
  brand: Brand | null;
}

export const BrandOverlay: React.FC<BrandOverlayProps> = ({ brand }) => {
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
              {brand.result?.contexto}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
