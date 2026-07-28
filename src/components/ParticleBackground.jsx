import { useMemo } from "react";

function ParticleBackground({ particleCount = 35 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }).map((_, i) => ({
        id: `particle-${i}`,
        left: Math.random() * 100,
        duration: 5 + Math.random() * 8, // 5–13s fall
        delay: Math.random() * 12,
        size: 2 + Math.random() * 3, // 2–5px
        opacity: 0.3 + Math.random() * 0.5,
      })),
    [particleCount]
  );

  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle particle-light"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

export default ParticleBackground;