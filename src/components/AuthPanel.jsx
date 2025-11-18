import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import PixelPanel from "./PixelPanel";

export default function AuthPanel() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(auth, email, pw);
    } catch (err) {
      alert("Login failed.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-200 to-purple-100">
      <PixelPanel>
        <p className="text-black text-sm">WELCOME</p>

        <input
          type="email"
          className="w-full bg-white border border-black p-2 text-xs font-8bit"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full bg-white border border-black p-2 text-xs font-8bit"
          placeholder="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-purple-500 text-white p-2 font-8bit"
        >
          LOGIN
        </button>
      </PixelPanel>
    </div>
  );
}
