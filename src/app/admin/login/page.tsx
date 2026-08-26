"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#12180e] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-[#313d28] bg-[#171f16] p-8"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8e9a81]">
          Admin
        </p>
        <h1 className="mt-2 font-serif text-2xl text-[#ede7d5]">
          Sign in to manage content
        </h1>

        <label className="mt-6 block">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#8e9a81]">
            Password
          </span>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 min-h-11 w-full border border-[#313d28] bg-[#12180e] px-3 py-2.5 text-[#ede7d5] focus:border-[#cd8347] focus:outline-none"
          />
        </label>

        {error && (
          <p className="mt-3 text-sm text-[#e08a6a]" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="touch-manipulation mt-6 min-h-11 w-full bg-[#cd8347] px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-[#12180e] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
