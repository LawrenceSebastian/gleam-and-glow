export default function Stars({ count = 60 }) {
  const stars = Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,       // 0–100vw
    top: Math.random() * 40,         // upper 40% of screen
    size: Math.random() * 4 + 2,     // 2–6 px
    opacity: Math.random() * 0.6 + 0.4,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-[1]">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute bg-white pixelated"
          style={{
            top: `${s.top}vh`,
            left: `${s.left}vw`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: "0",  // square pixel stars
            opacity: s.opacity,
            animation:
              Math.random() < 0.5
                ? `twinkle ${Math.random() * 2 + 1}s ease-in-out infinite`
                : "none",
          }}
        />
      ))}
    </div>
  );
}
