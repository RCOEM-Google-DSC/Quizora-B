"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import AuthShell from "@/components/qz/AuthShell";
import Field from "@/components/qz/Field";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    // TODO: replace with the real sign-in (Supabase / AuthContext) when the backend is connected.
    setTimeout(() => router.push("/quizzes"), 700);
  }

  return (
    <AuthShell
      side="bg-ink text-white"
      big={
        <>
          welcome
          <br />
          <span className="text-sun">back.</span>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        <p className="mono text-sm">Q1. WHO ARE YOU?</p>
        <h1 className="display mt-3 text-6xl">log in</h1>
        <Field id="email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={setEmail} error={errors.email} />
        <Field id="password" label="Password" type="password" placeholder="your password" autoComplete="current-password" value={password} onChange={setPassword} error={errors.password} />
        <button type="submit" disabled={loading} className="display mt-8 block w-full rounded-full bg-sun py-5 text-3xl disabled:opacity-60">
          {loading ? "logging in…" : "log in →"}
        </button>
        <p className="mt-6 text-[17px]">
          New here?{" "}
          <Link href="/register" className="border-b-2 border-ink font-extrabold">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
}