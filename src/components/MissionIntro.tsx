import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createInitialProgress, saveProgress, type GameProgress } from '../game/utils/storage';
import { EventBus } from '../game/EventBus';

interface MissionIntroProps {
  /** Callback con el progreso inicial cuando el lead se registra. */
  onComplete: (progress: GameProgress) => void;
}

/**
 * `MissionIntro` - Landing + captura de lead del juego.
 *
 * Flujo:
 *  1. Muestra título impactante + CTA "Comenzar la Misión"
 *  2. Al pulsar, aparece el formulario elegante (estilo `fi-`)
 *  3. Submit válido → partículas brillantes + mensaje bienvenida
 *  4. Llama a `onComplete` con el progreso persistido
 *
 * El localStorage se actualiza desde aquí para que el progreso esté
 * disponible antes de que React monte Phaser.
 */
export default function MissionIntro({ onComplete }: MissionIntroProps) {
  const [phase, setPhase] = useState<'intro' | 'form' | 'welcome'>('intro');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  // Genera partículas para el efecto de bienvenida
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1.5,
      size: 4 + Math.random() * 8,
    })),
  );

  useEffect(() => {
    if (phase !== 'welcome') return;
    const timer = setTimeout(() => {
      // Transición completada → callback al padre
    }, 1500);
    return () => clearTimeout(timer);
  }, [phase]);

  const agataLines: Record<'intro' | 'form' | 'welcome', string> = {
    intro:
      'Soy Ágata, tu guía. Te acompañaré en cada paso del museo: desde aquí hasta la última marca.',
    form: 'Regístrate para guardar tu progreso y las frases clave que vayas descubriendo.',
    welcome:
      '¡Perfecto! En el museo pulsa el pilar donde quieras empezar. Yo estaré contigo en cada pantalla.',
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = 'Tu nombre es necesario';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Necesitamos un email válido';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const progress = createInitialProgress(name, email);
    saveProgress(progress);
    setPhase('welcome');
    EventBus.emit('lead-capture-complete', progress);
    setTimeout(() => onComplete(progress), 1600);
  };

  return (
    <div className="fi-screen fi-screen--mission">
      <div className="fi-mission-bg" />

      <div className="fi-mission-layout">
        
        <div className="fi-mission-main">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
  <motion.div
    key="intro"
    className="fi-mission-inner"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.6 }}
  >
    <h1 className="fi-mission-title" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>
      <span className="fi-mission-main" style={{ block: 'inline-block', marginBottom: '0.5rem' }}>
        Tácticas de Retención que usan las Grandes Marcas
      </span>
    </h1>

    <p className="fi-mission-subtitle" style={{ marginTop: '1rem', marginBottom: '2rem', opacity: 0.9 }}>
      Aplica hoy las estrategias avanzadas de los líderes del mercado y haz que tu competencia se pregunte cuál es tu secreto.
    </p>

    <div className="fi-form-box" style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
      <p style={{ textAlign: 'left', marginBottom: '1.5rem', fontSize: '1.05rem', color: 'var(--fi-text-muted, #ccc)' }}>
        Descubre cómo las grandes marcas utilizan la dinamización digital y social. Te guiaré destripando la estrategia de 4 marcas muy conocidas y te diré cómo puedes utilizar cualquiera de estas estrategias para tu proyecto... Si completas la misión, <strong>¿a qué email quieres que te envíe la información?</strong>
      </p>

      <form onSubmit={handleSubmit} className="fi-lead-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="fi-field-group" style={{ textAlign: 'left' }}>
          <label className="fi-field-label" htmlFor="mi-name">Tu nombre</label>
          <input
            id="mi-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Ej: María"
            className={`fi-field-input ${errors.name ? 'fi-field-input--error' : ''}`}
            autoFocus
          />
          {errors.name && <span className="fi-field-error">{errors.name}</span>}
        </div>

        <div className="fi-field-group" style={{ textAlign: 'left' }}>
          <label className="fi-field-label" htmlFor="mi-email">Tu email</label>
          <input
            id="mi-email"
            type="type"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="maria@ejemplo.com"
            className={`fi-field-input ${errors.email ? 'fi-field-input--error' : ''}`}
          />
          {errors.email && <span className="fi-field-error">{errors.email}</span>}
        </div>

        <button type="submit" className="fi-cta-btn fi-cta-btn--gold fi-cta-btn--giant" style={{ marginTop: '0.5rem' }}>
          Comenzar la Misión
          <svg className="fi-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  </motion.div>
)}

        {phase === 'form' && (
          <motion.div
            key="form"
            className="fi-mission-inner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="fi-form-title">
              Regístrate como <span className="fi-text-gold">Aventurero Digital</span>
            </h2>
            <p className="fi-form-subtitle">
              Para guardar tu progreso y recibir tu certificado de exploración.
            </p>
            <div className="fi-lead-divider" />
            <form onSubmit={handleSubmit} className="fi-lead-form">
              <div className="fi-field-group">
                <label className="fi-field-label" htmlFor="mi-name">
                  Tu nombre
                </label>
                <input
                  id="mi-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Ej: María"
                  className={`fi-field-input ${errors.name ? 'fi-field-input--error' : ''}`}
                  autoFocus
                />
                {errors.name && <span className="fi-field-error">{errors.name}</span>}
              </div>
              <div className="fi-field-group">
                <label className="fi-field-label" htmlFor="mi-email">
                  Tu email
                </label>
                <input
                  id="mi-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="maria@ejemplo.com"
                  className={`fi-field-input ${errors.email ? 'fi-field-input--error' : ''}`}
                />
                {errors.email && <span className="fi-field-error">{errors.email}</span>}
              </div>
              <button type="submit" className="fi-cta-btn fi-cta-btn--gold fi-cta-btn--giant">
                Registrarme
                <svg className="fi-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </form>
            <p className="fi-lead-disclaimer">
              🔒 Tus datos están seguros. Solo te enviaremos contenido relevante.
            </p>
          </motion.div>
        )}

        {phase === 'welcome' && (
          <motion.div
            key="welcome"
            className="fi-mission-welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="fi-particles">
              {particles.map((p) => (
                <motion.span
                  key={p.id}
                  className="fi-particle"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: p.size,
                    height: p.size,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                  transition={{ duration: p.duration, delay: p.delay, repeat: 0 }}
                />
              ))}
            </div>
            <motion.h2
              className="fi-welcome-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Bienvenido/a a la Misión, <span className="fi-text-gold">{name}</span>.
            </motion.h2>
            <motion.p
              className="fi-welcome-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Tu aventura comienza ahora.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
