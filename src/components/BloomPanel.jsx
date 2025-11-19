import { useEffect, useMemo, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { todayKeyJKT, clamp } from "../lib/bloom";

import Flower, { getFlowerStage } from "./Flower";   // ← NEW
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

import Snoopy from "./Snoopy";
import GrassLayer from "./GrassLayer";
import { isJakartaDaytime } from "../lib/timeOfDay";
import Stars from "./Stars";
import ShootingStar from "./ShootingStar";
import CloudLayer from "./CloudLayer";
import UiFrame from "../assets/ui/bloomGUI.png";
import LanternFestival from "./LanternFestival";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";


const MAX_DAYS = 30;
const ALLOWED_WRITERS = new Set(["lsadhinatha@gmail.com"]);

export default function BloomPanel() {
  const navigate = useNavigate();
  const [bloom, setBloom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [latestEntry, setLatestEntry] = useState(null);
  const [user, setUser] = useState(auth.currentUser);

  const daytime = isJakartaDaytime();

  // Listen to auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const bloomRef = useMemo(() => doc(db, "bloom", "default"), []);

  // Load bloom doc & listen
  useEffect(() => {
    let unsub;
    (async () => {
      const snap = await getDoc(bloomRef);

      if (!snap.exists()) {
        await setDoc(bloomRef, {
          cycleStart: serverTimestamp(),
          progress: 0,
          lastEntryKey: null,
        });
      }

      unsub = onSnapshot(bloomRef, (s) => {
        setBloom(s.data());
        setLoading(false);
      });
    })();

    return () => unsub && unsub();
  }, [bloomRef]);

  const canWrite = user && ALLOWED_WRITERS.has(user.email || "");

  const pct = useMemo(() => {
    const p = bloom?.progress ?? 0;
    return Math.round((clamp(p, 0, MAX_DAYS) / MAX_DAYS) * 100);
  }, [bloom]);

  async function handleAdd() {
    if (!canWrite) return alert("Only the designated writer can add.");
    if (!note.trim()) return alert("Write a short note first.");

    const today = todayKeyJKT();

    if (bloom?.lastEntryKey === today) {
      return alert("Already added today 💜");
    }

    let nextProgress = clamp((bloom?.progress ?? 0) + 1, 0, MAX_DAYS);
    let dayNumber = nextProgress;

    if (bloom?.progress === MAX_DAYS) {
      nextProgress = 1;
      dayNumber = 1;

      await setDoc(
        bloomRef,
        {
          cycleStart: serverTimestamp(),
          progress: nextProgress,
          lastEntryKey: today,
        },
        { merge: true }
      );
    } else {
      await updateDoc(bloomRef, {
        progress: nextProgress,
        lastEntryKey: today,
      });
    }

    await addDoc(collection(bloomRef, "entries"), {
      text: note.trim(),
      createdAt: serverTimestamp(),
      day: dayNumber,
    });

    setNote("");
  }

  // Latest entry
  useEffect(() => {
    const q = query(
      collection(bloomRef, "entries"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) setLatestEntry(snap.docs[0].data());
      else setLatestEntry(null);
    });

    return () => unsub();
  }, [bloomRef]);

  if (loading) return <p className="text-slate-500">Loading bloom…</p>;

  const progressLabel = `${bloom?.progress ?? 0}/${MAX_DAYS}`;

  // 🌕 FULL BLOOM DETECTION (real + override)
  const flowerStage = getFlowerStage(bloom?.progress);
  const isFullBloomToday = flowerStage === 4; // stage5 is index 4

  return (
    <div
      className={
        "relative min-h-screen w-full transition-colors duration-700 " +
        (daytime
          ? "bg-gradient-to-b from-sky-300 via-sky-100 to-sky-200"
          : "bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-700")
      }
    >
      {daytime && <CloudLayer />}

      <Snoopy />
      <GrassLayer />
      <ShootingStar />
      {!daytime && <Stars />}

      <div className="relative min-h-screen w-full flex items-center justify-center">
        {/* 🏮 Lantern Festival only in FULL BLOOM + NIGHT */}
        {isFullBloomToday && !daytime && <LanternFestival />}

        {/* === Pixel Frame === */}
        <div
          className="relative font-8bit flex flex-col items-center"
          style={{
            width: "900px",
            minHeight: "700px",
            backgroundImage: `url(${UiFrame})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            imageRendering: "pixelated",

            paddingTop: "350px",
            paddingLeft: "170px",
            paddingRight: "170px",
            paddingBottom: "160px",

            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <button
            onClick={async () => {
              await signOut(auth);
              navigate("/");
            }}
            className="text-xs text-purple-700 underline font-8bit mb-2"
            style={{ imageRendering: "pixelated" }}
          >
            RETURN TO MAIN MENU
          </button>

          {/* Flower */}
          <Flower progress={bloom?.progress} />

          {/* Progress Header */}
          <p className="text-xs text-black mt-2">BLOOM PROGRESS</p>

          {/* Progress Bar */}
          <div className="w-full h-4 bg-black">
            <div className="h-full bg-green-500" style={{ width: `${pct}%` }} />
          </div>

          <p className="text-xs text-black">{progressLabel}</p>

          {/* Writer UI */}
          {canWrite ? (
            <div className="w-full space-y-3">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full bg-white border border-black p-2 text-xs font-8bit"
                style={{ imageRendering: "pixelated" }}
              />

              <button
                onClick={handleAdd}
                className="w-full bg-purple-700 text-white p-2 font-8bit"
                style={{ imageRendering: "pixelated" }}
              >
                ADD TODAY
              </button>
            </div>
          ) : (
            <p className="text-xs text-black font-8bit"></p>
          )}

          {/* Latest Note */}
          {latestEntry && (
            <div
              className="w-full bg-white border border-black p-3 text-xs font-8bit"
              style={{ imageRendering: "pixelated" }}
            >
              <p className="text-black">My Dearest Audrey,</p>
              <p className="mt-1 text-black">{latestEntry.text}</p>
            </div>
          )}

          <Link
            to="/archive"
            className="mt-4 text-purple-700 text-xs underline font-8bit"
            style={{ imageRendering: "pixelated" }}
          >
            VIEW ARCHIVE
          </Link>
        </div>
      </div>
    </div>
  );
}
