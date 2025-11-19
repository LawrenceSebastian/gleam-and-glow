import stage1 from "../assets/flowers/lilac_bud.gif";
import stage2 from "../assets/flowers/lilac_bud2.gif";
import stage3 from "../assets/flowers/lilac_bud3.gif";
import stage4 from "../assets/flowers/lilac_bud4.gif";
import stage5 from "../assets/flowers/lilac_full.gif";
import { todayKeyJKT } from "../lib/bloom";

const stages = [stage1, stage2, stage3, stage4, stage5];

// 🎂 Your override date
const SPECIAL_BLOOM_DAY = "2025-11-19";

/** 
 * Compute the actual bloom stage index,
 * respecting manual override days.
 */
export function getFlowerStage(progress = 0) {
  // normal mapped stage index
  let idx = Math.min(
    Math.floor((progress / 30) * stages.length),
    stages.length - 1
  );

  // 🔥 full bloom override
  const today = todayKeyJKT();
  if (today === SPECIAL_BLOOM_DAY) {
    idx = stages.length - 1;
  }

  return idx;
}

export default function Flower({ progress = 0 }) {
  const idx = getFlowerStage(progress);
  const current = stages[idx];

  return (
    <div className="flower-fixed">
      <img
        src={current}
        alt="Lilac bloom"
        className="pixelated flower-img"
      />
    </div>
  );
}
