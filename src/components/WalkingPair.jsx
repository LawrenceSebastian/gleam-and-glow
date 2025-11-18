import { useEffect, useRef, useState } from "react";
import meWalk from "../assets/characters/Law.gif";
import meStill from "../assets/characters/Law_still.png";
import herWalk from "../assets/characters/Aud.gif";
import herStill from "../assets/characters/Aud_still.png";
import heart from "../assets/heart.gif";

export default function WalkingPair() {
  const [paused, setPaused] = useState(false);
  const meRef = useRef(null);

  useEffect(() => {
    let raf;
    const duration = 18_000;
    const pauseStart = 8_000;
    const pauseEnd = 10_000;

    const getAnimTime = () => {
      const el = meRef.current;
      if (!el) return null;
      const anim = el.getAnimations?.()[0];
      if (!anim || anim.currentTime == null) return null;
      return anim.currentTime % duration;
    };

    const tick = () => {
      const t = getAnimTime();
      if (t != null) setPaused(t >= pauseStart && t < pauseEnd);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {/* You */}
      <div
        ref={meRef}
        className="character-wrapper"
        style={{ right: 0, animation: "walkMe 18s linear infinite" }}
      >
        <img src={meWalk} alt="Me walking" className="character sprite" style={{ opacity: paused ? 0 : 1 }} />
        <img src={meStill} alt="Me still" className="character sprite" style={{ opacity: paused ? 1 : 0 }} />
      </div>

      {/* Her */}
      <div className="character-wrapper" style={{ left: 0, animation: "walkHer 18s linear infinite" }}>
        <img src={herWalk} alt="Her walking" className="character sprite" style={{ opacity: paused ? 0 : 1 }} />
        <img src={herStill} alt="Her still" className="character sprite" style={{ opacity: paused ? 1 : 0 }} />
      </div>

      {/* 💖 Heart only when paused (centered between them) */}
      <img
        src={heart}
        alt="Heart"
        className="heart-pop pixelated"
        style={{
          opacity: paused ? 1 : 0,
          transition: "opacity 0.01s linear",
          transform: "translate(-50%, 0) scale(1)",
        }}
      />

    </>
  );
}
