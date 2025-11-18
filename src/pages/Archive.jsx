import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Link } from "react-router-dom";
import PixelPanel from "../components/PixelPanel";

export default function Archive() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const q = query(
        collection(db, "bloom/default/entries"),
        orderBy("createdAt", "asc")
      );
      const snap = await getDocs(q);
      setEntries(snap.docs.map((d) => d.data()));
      setLoading(false);
    }
    load();
  }, []);

  if (loading)
    return <p className="text-center text-slate-500 mt-10">Loading archive...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-200 to-purple-100">
      <PixelPanel>
        <p className="text-black text-sm">PAST MESSAGES</p>

        <div className="w-full flex flex-col gap-3 max-h-[300px] overflow-y-auto">
          {entries.length === 0 ? (
            <p className="text-black text-xs">No entries yet.</p>
          ) : (
            entries.map((e, i) => (
              <div
                key={i}
                className="bg-white border border-black p-2 text-xs font-8bit"
              >
                {e.text}
              </div>
            ))
          )}
        </div>

        <Link
          to="/bloom"
          className="text-purple-700 underline text-xs font-8bit"
        >
          ← BACK TO FLOWER
        </Link>
      </PixelPanel>
    </div>
  );
}
