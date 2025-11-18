import { isJakartaDaytime } from "../lib/timeOfDay";
import snoopySleep from "../assets/snoopy/snoopysleep.gif";
import snoopyFly from "../assets/snoopy/snoopyfly.png";
import snoopyHouse from "../assets/snoopy/snoopyhouse.png";

export default function Snoopy() {
  const isDay = isJakartaDaytime();

  if (!isDay) {
    // 🌙 NIGHT MODE — Sleeping Snoopy
    return (
      <img
        src={snoopySleep}
        alt="Sleeping Snoopy"
        className="pixelated"
        style={{
          position: "fixed",
          bottom: "0px",
          left: "20vw",         // [...] from the left
          width: "128px",        // adjust if needed
          height: "auto",
          zIndex: "10",
          imageRendering: "pixelated",
        }}
      />
    );
  }

  // 🌞 DAY MODE — Flying Snoopy
  return (
    <>
      <img
        src={snoopyFly}
        alt="Flying Snoopy"
        className="snoopy-fly pixelated"
      />
      <img
        src ={snoopyHouse}
        alt="Snoopy's House"
        className="snoopy-house pixelated"
        style={{
            position: "fixed",
            bottom: "0px",
            left: "20vw",         // [...] from the left
            width: "128px",        // adjust if needed
            height: "auto",
            zIndex: "10",
            imageRendering: "pixelated",
          }}
      />
    </>
  );
}
