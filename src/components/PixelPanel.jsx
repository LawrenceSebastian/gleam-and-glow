import UiFrame from "../assets/ui/bloomGUI.png";

/**
 * Reusable retro window frame with 8bit styling
 * Children get rendered INSIDE the frame.
 */
export default function PixelPanel({ children, width = 800, height = 700 }) {
  return (
    <div
      className="relative font-8bit flex flex-col items-center"
      style={{
        width: `${width}px`,
        minHeight: `${height}px`,
        backgroundImage: `url(${UiFrame})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",

        paddingTop: "360px",
        paddingLeft: "180px",
        paddingRight: "180px",
        paddingBottom: "170px",

        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {children}
    </div>
  );
}
