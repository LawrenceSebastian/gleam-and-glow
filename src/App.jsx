import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";

import AuthPanel from "./components/AuthPanel";
import BloomPanel from "./components/BloomPanel";
import Archive from "./pages/Archive";

import WalkingPair from "./components/WalkingPair";
import CloudLayer from "./components/CloudLayer";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return <p className="text-center text-slate-500 mt-10">i ❤️ audrey !</p>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* BACKGROUND LAYERS */}
      <CloudLayer />
      <WalkingPair />

      {/* ROUTES */}
      <Routes>

        {/* Public route */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/bloom" replace /> : <AuthPanel />
          }
        />

        {/* Protected routes */}
        <Route
          path="/bloom"
          element={
            user ? <BloomPanel /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/archive"
          element={
            user ? <Archive /> : <Navigate to="/" replace />
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

    </div>
  );
}
