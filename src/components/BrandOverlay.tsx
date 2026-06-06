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

  /* ─── MÓVIL: Panel central integrado sin bloqueo de clics ──────── */
  if (isMobile) {
    return (
      <AnimatePresence>
        {brand && (
          // Usamos una tarjeta flotante localizada estrictamente en la zona central muerta de la pantalla
          <motion.div
            key="sheet"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'absolute',
              // 1. SOLUCIÓN ESPACIO: Se posiciona en la franja central aprovechando la zona vacía de la pantalla
              top: '215px', 
              bottom: '155px', // Deja libre la esquina inferior izquierda para ver al personaje
              left: '16px',
              right: '16px',
              background: 'rgba(15, 15, 35, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(246,160,0,0.3)',
              borderRadius: '16px',
              // 2. SOLUCIÓN CLICS: Al no haber "backdrop" a pantalla completa, la zona superior queda libre 
              // para pulsar la burbuja de Phaser directamente sin interferencias de React.
              zIndex: 60, 
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
              pointerEvents: 'auto',
            }}
          >
            {/* Encabezado fijo de la marca */}
            <div
              style={{
                padding: '14px 20px 10px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                flexShrink: 0,
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 2,
                  color: '#6ec6ff',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: 2,
                }}
              >
                Estrategia de marca
              </div>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: '24px',
                  fontWeight: 400,
                  color: '#f6a000',
                  lineHeight: 1.15,
                }}
              >
                {brand.name}
              </h2>
            </div>

            {/* Contenido expandido que elimina el scroll innecesario en la mayoría de pantallas */}
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 20px 20px',
                WebkitOverflowScrolling: 'touch',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: '#d0d8e8',
                  fontFamily: "'Montserrat', sans-serif",
                  textAlign: 'justify'
                }}
              >
                {brand.descripcion}
              </p>

              <div
                style={{
                  background: 'rgba(246,160,0,0.05)',
                  border: '1px solid rgba(246,160,0,0.2)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  marginTop: 'auto' /* Empuja la frase clave al fondo de la tarjeta */
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: 1.5,
                    color: '#f6a000',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  Frase clave
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.4,
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
