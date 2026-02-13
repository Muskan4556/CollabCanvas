"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signup } from "@/services/api/auth";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await signup({ name, username, password });
      localStorage.setItem("token", token);
      router.push("/");
      router.refresh();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Signup failed. Please try again.";
      setError(String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-2xl font-bold">Sign up</h1>
        <p className="mt-1 text-sm text-gray-600">Create an account.</p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <div className="text-sm font-medium">Name</div>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:border-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Muskan"
              autoComplete="name"
              required
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium">Email</div>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:border-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium">Password</div>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:border-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              required
            />
          </label>

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !name || !username || !password}
          >
            {loading ? "Creating account..." : "Sign up"}
          </Button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full text-sm underline hover:cursor-pointer hover:text-primary/90 transition-all duration-300 ease-in-out"
          >
            Already have an account? Login
          </button>
        </div>
      </form>
    </div>
  );
}

