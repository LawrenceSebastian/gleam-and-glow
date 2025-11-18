import { useEffect, useState } from "react";
import lantern1 from "../assets/lanterns/lantern1.png";
import lantern2 from "../assets/lanterns/lantern2.png";

const sprites = [lantern1, lantern2];

const MAX_LANTERNS = 200;      // you can push this higher now
const SPAWN_INTERVAL = 500;    // spawn ~1.4 per sec

export default function LanternFestival() {
  const [lanterns, setLanterns] = useState([]);
  let nextId = 0;

  useEffect(() => {
    const spawn = () => {
      setLanterns((prev) => {
        if (prev.length >= MAX_LANTERNS) return prev;

        const duration = Math.random() * 25 + 35; // 22–34s slow drift

        return [
          ...prev,
          {
            id: nextId++,
            sprite: sprites[Math.floor(Math.random() * sprites.length)],

            startX: Math.random() * -25 - 10, // -10 to -35vw
            startY: Math.random() * 20 + 75,  // 75–95vh (near bottom)
            scale: Math.random() * 0.6 + 0.7, // 0.7–1.3x
            opacity: Math.random() * 0.4 + 0.6, // 0.6–1.0
            duration,
          },
        ];
      });
    };

    const interval = setInterval(spawn, SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const removeLantern = (id) => {
    setLanterns((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {lanterns.map((lantern) => (
        <div
          key={lantern.id}
          className="lantern absolute pixelated"
          style={{
            left: `${lantern.startX}vw`,
            top: `${lantern.startY}vh`,
            width: `${80 * lantern.scale}px`,
            opacity: lantern.opacity,
            animation: `lanternFloat ${lantern.duration}s linear forwards`,
          }}
          onAnimationEnd={() => removeLantern(lantern.id)}
        >
          <img
            src={lantern.sprite}
            style={{
              width: "100%",
              height: "auto",
              imageRendering: "pixelated",
            }}
          />
        </div>
      ))}
    </div>
  );
}
