import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Brand } from '../data/brandData';

interface BrandOverlayProps {
  brand: Brand | null;
}

export const BrandOverlay: React.FC<BrandOverlayProps> = ({ brand }) => {
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Reset scroll al abrir nueva marca
  useEffect(() => {
    if (brand && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [brand]);

  /* ─── MÓVIL: bottom sheet ──────────────────────────────────────── */
  if (isMobile) {
    return (
      <AnimatePresence>
        {brand && (
          <>
            {/* Overlay semitransparente encima del canvas */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.45)',
                zIndex: 50,
                pointerEvents: 'none',
              }}
            />

            {/* Bottom sheet */}
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: '55dvh',
                background: 'linear-gradient(170deg, #14142e 0%, #0a0a1e 100%)',
                borderTop: '2px solid rgba(246,160,0,0.6)',
                borderRadius: '20px 20px 0 0',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
              }}
            >
              {/* Handle visual */}
              <div
                style={{
                  width: 40,
                  height: 4,
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 2,
                  margin: '12px auto 0',
                  flexShrink: 0,
                }}
              />

              {/* Encabezado fijo */}
              <div
                style={{
                  padding: '12px 20px 10px',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: '#6ec6ff',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  Estrategia de marca
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "'DM Serif Display', Georgia, serif",
                    fontSize: 'clamp(22px, 6vw, 30px)',
                    fontWeight: 400,
                    color: '#f6a000',
                    lineHeight: 1.15,
                  }}
                >
                  {brand.name}
                </h2>
              </div>

              {/* Contenido scrollable */}
              <div
                ref={scrollRef}
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '14px 20px 24px',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {/* Descripción principal */}
                <p
                  style={{
                    margin: '0 0 16px',
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: '#d0d8e8',
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {brand.descripcion}
                </p>

                {/* Frase clave */}
                <div
                  style={{
                    background: 'rgba(246,160,0,0.07)',
                    border: '1px solid rgba(246,160,0,0.25)',
                    borderRadius: 12,
                    padding: '12px 14px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: 2,
                      color: '#f6a000',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    Frase clave
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: '#ffe082',
                      fontFamily: "'DM Serif Display', Georgia, serif",
                      fontStyle: 'italic',
                    }}
                  >
                    {brand.result.fraseClave}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  /* ─── ESCRITORIO: overlay lateral derecho (sin cambios) ────────── */
  return (
    <AnimatePresence>
      {brand && (
        <motion.div
          className="fi-brand-overlay"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="fi-brand-overlay__content">
            <h2 className="fi-brand-overlay__name">{brand.name}</h2>
            <p className="fi-brand-overlay__description">{brand.descripcion}</p>

            <div
              style={{
                marginTop: 24,
                padding: '16px 20px',
                background: 'rgba(246,160,0,0.07)',
                border: '1px solid rgba(246,160,0,0.25)',
                borderRadius: 12,
                textAlign: 'right',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 2,
                  color: '#f6a000',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: 10,
                }}
              >
                Frase clave
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: '#ffe082',
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontStyle: 'italic',
                }}
              >
                {brand.result.fraseClave}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
