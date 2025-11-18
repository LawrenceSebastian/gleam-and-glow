import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
    return <p className="text-center text-slate-500 mt-10">Loading...</p>;
  }

  return (
    <BrowserRouter>
      <div className="relative min-h-screen overflow-hidden">

        {/* BACKGROUND LAYERS */}
        <CloudLayer />     {/* sky objects in the back (z-0) */}

        <WalkingPair />    {/* characters near bottom */}

        {/* ROUTES */}
        <Routes>
          {!user && <Route path="/" element={<AuthPanel />} />}

          {user && (
            <>
              <Route path="/bloom" element={<BloomPanel />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="*" element={<Navigate to="/bloom" replace />} />
            </>
          )}

          {!user && <Route path="*" element={<Navigate to="/" replace />} />}
        </Routes>

      </div>
    </BrowserRouter>
  );
}
