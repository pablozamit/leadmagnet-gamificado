import { motion } from 'framer-motion';
import { PILLAR_ASSETS, PILLAR_ORDER } from '../data/pillarAssets';

interface ProgressBarProps {
  completedPillars: number;
  totalPillars: number;
  currentPillar: string | null;
  frasesClaveCount: number;
}

/**
 * HUD compacto: título + progreso + 4 pilares sin aglomerar (móvil-first).
 */
export default function ProgressBar({
  completedPillars,
  totalPillars,
  currentPillar,
  frasesClaveCount,
}: ProgressBarProps) {
  const percentage = Math.round((completedPillars / totalPillars) * 100);

  return (
    <motion.header
      className="fi-hud"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <div className="fi-hud__top">
        <div className="fi-hud__title-block">
          <h1 className="fi-hud__title">Museo de la Dinamización</h1>
          <p className="fi-hud__subtitle">4 pilares · experiencia guiada</p>
        </div>
        <div className="fi-hud__stats">
          <span className="fi-hud__percent">{percentage}%</span>
          <span className="fi-hud__frases">{frasesClaveCount} frases</span>
        </div>
      </div>

      <div className="fi-hud__bar-track" aria-hidden>
        <motion.div
          className="fi-hud__bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <nav className="fi-hud__pillars" aria-label="Pilares de la misión">
        {PILLAR_ORDER.map((id) => {
          const p = PILLAR_ASSETS[id];
          const isActive = currentPillar === id;
          return (
            <div
              key={p.id}
              className={`fi-hud__pillar ${isActive ? 'fi-hud__pillar--active' : ''}`}
              style={{
                borderColor: `#${(p.color & 0xffffff).toString(16).padStart(6, '0')}`,
              }}
              title={p.label}
            >
              <img src={p.icon} alt="" className="fi-hud__pillar-icon" width={40} height={40} />
            </div>
          );
        })}
      </nav>
    </motion.header>
  );
}