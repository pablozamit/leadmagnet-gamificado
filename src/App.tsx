import { useState, useEffect, useRef } from 'react';
import PhaserGame, { type IRefPhaserGame } from './components/PhaserGame';
import MissionIntro from './components/MissionIntro';
import { BrandOverlay } from './components/BrandOverlay';

import { EventBus } from './game/EventBus';
import { loadProgress, saveProgress, type GameProgress } from './game/utils/storage';
import { pillars, type Brand } from './data/brandData';
import './index.css';

type AppPhase = 'mission' | 'hub' | 'pillar' | 'final';

/**
 * `App` - Orquestador principal del flujo del juego.
 */
export default function App() {
  const [phase, setPhase] = useState<AppPhase>('mission');
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
  const [currentPillar, setCurrentPillar] = useState<string | null>(null);
  const gameRef = useRef<IRefPhaserGame>({ game: null, scene: null });

  useEffect(() => {
    const stored = loadProgress();
    if (stored) {
      setProgress(stored);
      setPhase('hub');
    }
  }, []);

  useEffect(() => {
    if (gameRef.current.game) {
      (gameRef.current.game as any).progress = progress;
    }
  }, [progress]);

  useEffect(() => {
    if (progress && progress.pillarsCompleted.length === 4) {
      const timer = setTimeout(() => {
        setPhase('final');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  useEffect(() => {
    const onPortalEntered = (pillarId: string): void => {
      setCurrentPillar(pillarId);
      setPhase('pillar');
    };

    const onBrandSelected = (brand: Brand | null): void => {
      setActiveBrand(brand);
    };

    const onDialogueFinished = (): void => {
      if (activeBrand) {
        const pillarId = pillars.find(p => p.brands.some(b => b.id === activeBrand.id))?.id;
        if (pillarId) {
          setProgress((prev) => {
            if (!prev) return prev;
            if (prev.pillarsCompleted.includes(pillarId)) return prev;
            const updated: GameProgress = {
              ...prev,
              pillarsCompleted: [...prev.pillarsCompleted, pillarId],
            };
            saveProgress(updated);
            return updated;
          });
        }
        setActiveBrand(null);
        setPhase('hub');
      }
    };

    const onPillarProgress = (data: { pillar: string; completed: number; total: number }): void => {
      setProgress((prev) => {
        if (!prev) return prev;
        const updated: GameProgress = {
          ...prev,
          currentPillar: data.pillar,
        };
        saveProgress(updated);
        return updated;
      });
    };

    const onPillarCompleted = (pillarId: string): void => {
      setProgress((prev) => {
        if (!prev) return prev;
        if (prev.pillarsCompleted.includes(pillarId)) return prev;
        const updated: GameProgress = {
          ...prev,
          pillarsCompleted: [...prev.pillarsCompleted, pillarId],
        };
        saveProgress(updated);
        return updated;
      });
    };

    const onFraseClaveCollected = (frase: string): void => {
      setProgress((prev) => {
        if (!prev) return prev;
        if (prev.frasesClave.includes(frase)) return prev;
        const updated: GameProgress = {
          ...prev,
          frasesClave: [...prev.frasesClave, frase],
        };
        saveProgress(updated);
        return updated;
      });
    };

    const onSceneReady = (scene: Phaser.Scene): void => {
      const key = scene.scene.key;
      if (key === 'HubScene') {
        setPhase('hub');
        setCurrentPillar(null);
        setActiveBrand(null);
      } else if (key === 'PillarScene') {
        setPhase('pillar');
      }
    };

    EventBus.on('portal-entered', onPortalEntered);
    EventBus.on('brand-selected', onBrandSelected);
    EventBus.on('dialogue-finished', onDialogueFinished);
    EventBus.on('pillar-progress-updated', onPillarProgress);
    EventBus.on('pillar-completed', onPillarCompleted);
    EventBus.on('frase-clave-collected', onFraseClaveCollected);
    EventBus.on('current-scene-ready', onSceneReady);

    return () => {
      EventBus.off('portal-entered', onPortalEntered);
      EventBus.off('brand-selected', onBrandSelected);
      EventBus.off('dialogue-finished', onDialogueFinished);
      EventBus.off('pillar-progress-updated', onPillarProgress);
      EventBus.off('pillar-completed', onPillarCompleted);
      EventBus.off('frase-clave-collected', onFraseClaveCollected);
      EventBus.off('current-scene-ready', onSceneReady);
    };
  }, [activeBrand, progress]);

  useEffect(() => {
    const sm = gameRef.current.scene?.scene;
    if (phase !== 'hub' || !sm) return;
    if (sm.isActive('PreloadScene')) return;
    if (!sm.isActive('HubScene')) sm.start('HubScene');
  }, [phase]);

  const handleMissionComplete = (newProgress: GameProgress): void => {
    setProgress(newProgress);
    setPhase('hub');
    EventBus.emit('lead-capture-complete');
  };

  return (
    <div className="fi-app">
      {phase === 'mission' && <MissionIntro onComplete={handleMissionComplete} />}

      {(phase === 'hub' || phase === 'pillar') && (
        <div className="fi-game-stage">
          <PhaserGame ref={gameRef} />
          <BrandOverlay brand={activeBrand} />
        </div>
      )}

      {/* 🌟 Pantalla de cierre fluida, con la copia enfocada en la aplicación práctica en el negocio */}
      {phase === 'final' && (
        <div className="fi-screen fi-screen--final" style={{ background: '#0a0a1e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', color: '#fff', textAlign: 'center' }}>
          <div style={{ maxWidth: '640px', width: '100%' }}>
            <h2 className="fi-final-title" style={{ fontFamily: "var(--fi-font-serif)", fontSize: '2.4rem', marginBottom: '1.5rem', lineHeight: '1.3', fontWeight: '400', color: '#f6a000' }}>
              ¡Felicidades por completar tu ruta!
            </h2>
            
            <p style={{ color: '#ccc', fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              Si miras tu email (vigilar que no haya llegado a la carpeta de spam) podrás ver las 8 estrategias de marca que no has podido explorar ahora.
            </p>

            <p style={{ color: '#ffffff', fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '2.5rem', opacity: 0.95 }}>
              Ver y aprender sobre dinamización está muy bien, pero el verdadero cambio llega cuando buscas <strong>la parte práctica</strong>. Si quieres descubrir exactamente qué hay detrás de estas estrategias y <strong>cómo aplicarlas paso a paso en tu propio negocio</strong>, las plazas están abiertas para el único curso universitario 100% enfocado en dinamización digital:
            </p>

            <a
              href="https://agatapuig.com/experto-universitario-en-dinamizacion-digital-2026-ev"
              className="fi-cta-btn fi-cta-btn--gold fi-cta-btn--giant"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', width: 'auto', padding: '20px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', color: '#1a1a2e' }}
            >
              Descubrir el Experto Universitario
              <svg className="fi-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', marginLeft: '10px' }}>
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            
            <p style={{ fontSize: '13px', color: '#666', marginTop: '3rem', opacity: 0.7, fontStyle: 'italic' }}>
              Las plazas son limitadas. Cada edición se completa antes del cierre.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
