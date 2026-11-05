"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import AuthShell from "@/components/qz/AuthShell";
import Field from "@/components/qz/Field";

type Role = "player" | "host";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("player");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Pick a display name (2+ characters).";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    // TODO: replace with the real sign-up (Supabase / AuthContext) and save the chosen role.
    setTimeout(() => router.push("/quizzes"), 700);
  }

  const roles: { value: Role; letter: string }[] = [
    { value: "player", letter: "A" },
    { value: "host", letter: "B" },
  ];

  return (
    <AuthShell
      side="bg-cobalt text-white"
      big={
        <>
          join
          <br />
          the
          <br />
          <span className="text-sun">game.</span>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        <p className="mono text-sm">Q1. WHO ARE YOU?</p>
        <h1 className="display mt-3 text-6xl">sign up</h1>
        <Field id="name" label="Display name" placeholder="how others see you" autoComplete="nickname" value={name} onChange={setName} error={errors.name} />
        <Field id="email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={setEmail} error={errors.email} />
        <Field id="password" label="Password" type="password" placeholder="at least 8 characters" autoComplete="new-password" value={password} onChange={setPassword} error={errors.password} />
        <fieldset className="mt-6">
          <legend className="mono mb-2 text-[13px] uppercase">I want to be a</legend>
          <div className="flex gap-3">
            {roles.map((r) => (
              <label
                key={r.value}
                className={`cursor-pointer rounded-full border-[3px] border-ink px-5 py-2 font-semibold has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cobalt ${role === r.value ? "bg-ink text-white" : ""}`}
              >
                <input type="radio" name="role" value={r.value} checked={role === r.value} onChange={() => setRole(r.value)} className="sr-only" />
                {r.letter} · {r.value}
              </label>
            ))}
          </div>
        </fieldset>
        <button type="submit" disabled={loading} className="display mt-8 block w-full rounded-full bg-sun py-5 text-3xl disabled:opacity-60">
          {loading ? "creating…" : "create account →"}
        </button>
        <p className="mt-6 text-[17px]">
          Already playing?{" "}
          <Link href="/login" className="border-b-2 border-ink font-extrabold">Log in</Link>
        </p>
      </form>
    </AuthShell>
  );
}