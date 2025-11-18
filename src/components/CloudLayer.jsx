import { useEffect, useRef, useState } from "react";
import cloud1 from "../assets/clouds/cloud1.png";
import cloud2 from "../assets/clouds/cloud2.png";
import cloud3 from "../assets/clouds/cloud3.png";
import cloud4 from "../assets/clouds/cloud4.png";

const sprites = [cloud1, cloud2, cloud3, cloud4];

const MAX_CLOUDS = 10;
const SPAWN_INTERVAL = 2500;

export default function CloudLayer() {
  const [clouds, setClouds] = useState([]);

  // useRef ensures ID persists and never resets
  const nextId = useRef(0);

  useEffect(() => {
    const spawnCloud = () => {
      setClouds(prev => {
        if (prev.length >= MAX_CLOUDS) return prev;

        const id = nextId.current++;
        const duration = Math.random() * 25 + 45;

        return [
          ...prev,
          {
            id,
            sprite: sprites[Math.floor(Math.random() * sprites.length)],
            top: Math.random() * 20 + 32,
            startX: -20 - Math.random() * 10,
            scale: Math.random() * 0.4 + 0.8,
            opacity: Math.random() * 0.3 + 0.7,
            duration
          }
        ];
      });
    };

    // Run only once on mount
    const interval = setInterval(spawnCloud, SPAWN_INTERVAL);

    // Spawn a few clouds instantly for preload
    for (let i = 0; i < 4; i++) spawnCloud();

    return () => clearInterval(interval);
  }, []); // <-- NO DEPENDENCIES

  const removeCloud = (id) => {
    setClouds(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {clouds.map((cloud) => (
        <img
          key={cloud.id}
          src={cloud.sprite}
          className="cloud pixelated"
          style={{
            position: "absolute",
            top: `${cloud.top}px`,
            left: `${cloud.startX}vw`,
            width: `${150 * cloud.scale}px`,
            opacity: cloud.opacity,
            height: "auto",

            // Use the duration
            animation: `cloudLoop ${cloud.duration}s linear forwards`
          }}
          onAnimationEnd={() => removeCloud(cloud.id)}
        />
      ))}
    </div>
  );
}
