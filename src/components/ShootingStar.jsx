import { useEffect, useRef, useState } from "react";

// Get Jakarta time
function getJakartaTime() {
  const now = new Date();
  const jktString = now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
  return new Date(jktString);
}

export default function ShootingStar() {
  const [shower, setShower] = useState([]);
  const lastTriggerRef = useRef(null);

  function makeStar(id) {
    return {
      id,
      delay: Math.random() * 20000,        // 0–20s
      duration: 3000 + Math.random() * 5000, // 3–8s
      size: 2 + Math.random() * 4,
      startY: 5 + Math.random() * 40,
    };
  }

  function triggerShower() {
    const idBase = Date.now();
    const stars = Array.from({ length: 100 }, (_, i) => makeStar(idBase + i));
    setShower(stars);

    const maxLife = Math.max(...stars.map(s => s.delay + s.duration));
    setTimeout(() => setShower([]), maxLife + 500);
  }

  useEffect(() => {
    function check() {
      const jkt = getJakartaTime();
      const h = jkt.getHours();
      const m = jkt.getMinutes();

      // main trigger: 23:11 JKT
      if (h === 6 && m === 6) {
        const key = jkt.toDateString() + "-06:06";

        if (lastTriggerRef.current !== key) {
          lastTriggerRef.current = key;
          triggerShower();
        }
      }

      // re-check ASAP (not throttled like setInterval)
      requestAnimationFrame(check);
    }

    // Start the heartbeat
    requestAnimationFrame(check);

    // Manual testing: press S
    const handler = (e) => {
      if (e.key.toLowerCase() === "s") triggerShower();
    };
    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!shower.length) return null;

  return (
    <>
      {shower.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: `${star.startY}vh`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `shootingStar ${star.duration}ms linear forwards`,
            animationDelay: `${star.delay}ms`,
          }}
        />
      ))}
    </>
  );
}
