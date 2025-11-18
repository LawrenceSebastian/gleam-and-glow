import { useEffect, useRef, useState } from "react";

// Helper: current time in Jakarta
function getJakartaTime() {
  const now = new Date();
  const jktString = now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
  return new Date(jktString);
}

export default function ShootingStar() {
  const [visible, setVisible] = useState(false);
  const lastTriggerRef = useRef(null);

  useEffect(() => {
    const durationMs = 3000; // matches shootingStar 3s animation

    const checkTime = () => {
      const jktNow = getJakartaTime();
      const hours = jktNow.getHours();   // 0–23
      const minutes = jktNow.getMinutes();

      // 11:11 AM or 11:11 PM in Jakarta
      if (hours === 11 && minutes === 11) {
        const key = jktNow.toDateString() + "-11:11";
        if (lastTriggerRef.current !== key) {
          lastTriggerRef.current = key;
          setVisible(true);
          setTimeout(() => setVisible(false), durationMs);
        }
      }
    };

    const id = setInterval(checkTime, 1000);
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="shooting-star"
      style={{ animation: "shootingStar 3s linear forwards" }}
    />
  );
}
