import { useMemo } from "react";
import grass1 from "../assets/grass/grass1.png";
import grass2 from "../assets/grass/grass2.png";
import grass3 from "../assets/grass/grass3.png";
import grass4 from "../assets/grass/grass4.png";

const sprites = [grass1, grass2, grass3, grass4];

function generateGrass() {
  const grasses = [];
  const BAN_MIN = 40;
  const BAN_MAX = 60;

  for (let i = 0; i < 10; i++) {
    let x;

    // keep retrying until x is NOT in the banned zone
    do {
      x = Math.random() * 100;
    } while (x >= BAN_MIN && x <= BAN_MAX);

    grasses.push({
      id: i,
      sprite: sprites[Math.floor(Math.random() * sprites.length)],
      x,
      scale: Math.random() * 0.5 + 1.0,
      opacity: Math.random() * 0.3 + 0.8,
    });
  }

  return grasses;
}


export default function GrassLayer() {
  const patches = useMemo(generateGrass, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[5]">
      {patches.map((g) => (
        <img
          key={g.id}
          src={g.sprite}
          className="pixelated"
          style={{
            position: "fixed",
            bottom: "0px",
            left: `${g.x}vw`,
            width: `${90 * g.scale}px`,
            height: "auto",
            opacity: g.opacity,
            imageRendering: "pixelated",
            zIndex: 5,
          }}
        />
      ))}
    </div>
  );
}
