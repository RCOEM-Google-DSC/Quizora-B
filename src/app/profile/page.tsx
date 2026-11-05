"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { formatTime, getQuiz, totalMarks } from "@/lib/quizzes";

type Attempt = { quizId: string; date: string; attempt: number; score: number; seconds: number };

// SAMPLE history. TODO: load the signed-in user's attempts from the backend.
const attempts: Attempt[] = [
  { quizId: "react-hooks", date: "Nov 4", attempt: 2, score: 8, seconds: 62 },
  { quizId: "react-hooks", date: "Nov 2", attempt: 1, score: 6, seconds: 70 },
  { quizId: "world-capitals", date: "Nov 2", attempt: 1, score: 6, seconds: 64 },
  { quizId: "web-security", date: "Nov 1", attempt: 1, score: 8, seconds: 118 },
  { quizId: "cricket-legends", date: "Oct 30", attempt: 1, score: 6, seconds: 55 },
];

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <section className="mx-auto max-w-[1200px] px-8 pb-12 pt-8">
        <p className="mono mb-4 text-sm">Q?.</p>
        <h1 className="display mb-6" style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}>who are you?</h1>
        <p className="mb-6 max-w-[460px] text-xl">Log in to see your profile and your attempt history.</p>
        <Link href="/login" className="display inline-block rounded-full bg-sun px-9 py-5 text-3xl">log in →</Link>
      </section>
    );
  }

  const rows = attempts.flatMap((a) => {
    const quiz = getQuiz(a.quizId);
    return quiz ? [{ ...a, quiz, max: totalMarks(quiz) }] : [];
  });
  const pct = (r: { score: number; max: number }) => Math.round((r.score / r.max) * 100);
  const average = rows.length ? Math.round(rows.reduce((sum, r) => sum + pct(r), 0) / rows.length) : 0;
  const best = rows.length ? Math.max(...rows.map(pct)) : 0;
  const quizzesTaken = new Set(rows.map((r) => r.quizId)).size;

  const stats = [
    { n: String(quizzesTaken), l: "quizzes taken", cls: "bg-cobalt text-white rounded-tl-[120px] pt-12" },
    { n: String(rows.length), l: "total attempts", cls: "bg-tomato text-ink pt-6" },
    { n: `${average}%`, l: "average score", cls: "bg-sun text-ink pt-6" },
    { n: `${best}%`, l: "best score", cls: "bg-ink text-white rounded-tr-[120px] pt-12" },
  ];

  return (
    <section className="mx-auto max-w-[1200px] px-8 pb-12 pt-8">
      <div className="mb-12 flex flex-wrap items-center gap-8">
        <div className="display flex size-[150px] items-center justify-center rounded-full bg-sun text-7xl">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="mono truncate text-sm">{user.email}</p>
          <h1 className="display mt-2 break-words" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>{user.name}</h1>
        </div>
      </div>

      <div className="mb-16 flex flex-wrap gap-3">
        {stats.map((s) => (
          <div key={s.l} className={`flex-[1_1_220px] px-7 pb-6 ${s.cls}`}>
            <div className="display text-[64px]">{s.n}</div>
            <div className="mono text-[13px] uppercase">{s.l}</div>
          </div>
        ))}
      </div>

      <p className="mono mb-3 text-sm uppercase">Attempt history</p>
      {rows.length === 0 ? (
        <div className="rounded-tr-[100px] bg-sun p-10">
          <p className="display text-5xl">no attempts yet.</p>
          <Link href="/quizzes" className="display mt-6 inline-block rounded-full bg-ink px-7 py-3 text-2xl text-white">pick a quiz</Link>
        </div>
      ) : (
        <ul className="border-t-[3px] border-ink">
          {rows.map((r) => (
            <li key={`${r.quizId}-${r.attempt}`} className="flex flex-wrap items-center gap-5 border-b border-ink py-4">
              <span className="flex-[1_1_240px]">
                <span className="block text-xl font-semibold">{r.quiz.title}</span>
                <span className="mono text-[12px] uppercase">attempt {r.attempt} · {r.date} · {formatTime(r.seconds)}</span>
              </span>
              <span className={`display rounded-full px-5 py-2 text-2xl ${pct(r) >= 75 ? "bg-mint" : pct(r) >= 50 ? "bg-sun" : "bg-tomato"}`}>
                {r.score} / {r.max}
              </span>
              <Link href={`/quizzes/${r.quizId}/result`} className="mono text-[13px] uppercase underline underline-offset-4">view result</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}