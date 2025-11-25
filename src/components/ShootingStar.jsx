import { useEffect, useRef, useState } from "react";

// Helper: get Jakarta-local time
function getJakartaTime() {
  const now = new Date();
  const jktString = now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
  return new Date(jktString);
}

export default function ShootingStar() {
  const [shower, setShower] = useState([]);
  const lastTriggerRef = useRef(null);

  // Create one meteor
  function makeStar(id) {
    return {
      id,
      delay: Math.random() * 20000, // 0–3 seconds
      duration: 3000 + Math.random() * 5000, // 5–12 seconds
      size: 2 + Math.random() * 4,
      startY: 5 + Math.random() * 40,
    };
  }

  useEffect(() => {
    const triggerShower = () => {
      const idBase = Date.now();

      // Generate MANY meteors (increase freely)
      const stars = Array.from({ length: 100 }, (_, i) => makeStar(idBase + i));
      setShower(stars);

      // Clean up ONLY after the last meteor finishes
      const maxLife = Math.max(...stars.map(s => s.delay + s.duration));
      setTimeout(() => setShower([]), maxLife + 500);
    };

    const checkTime = () => {
      const jkt = getJakartaTime();
      const h = jkt.getHours();
      const m = jkt.getMinutes();

      if (h === 5 && m === 57) {  // 11:11 PM Jakarta
        const key = jkt.toDateString() + "-05:57";
        if (lastTriggerRef.current !== key) {
          lastTriggerRef.current = key;
          triggerShower();
        }
      }
    };

    const interval = setInterval(checkTime, 1000);

    // Manual test: press S to trigger
    const keyHandler = (e) => {
      if (e.key.toLowerCase() === "s") {
        triggerShower();
      }
    };
    window.addEventListener("keydown", keyHandler);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", keyHandler);
    };
  }, []);

  if (!shower.length) return null;

  return (
    <>
      {shower.map(star => (
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
