"use client";

import { useEffect, useState } from "react";
import { formatTime } from "@/lib/quizzes";

type Player = { name: string; score: number; seconds: number; you?: boolean };

const TOWERS = [
  "bg-sun text-ink",
  "bg-cobalt text-white",
  "bg-tomato text-ink",
  "bg-mint text-ink",
  "bg-ink text-white",
];

// Sample players. TODO: replace with this quiz's attempts from the backend.
function seed(max: number): Player[] {
  const row = (name: string, pct: number, seconds: number, you?: boolean): Player => ({
    name, score: Math.round(max * pct), seconds, you,
  });
  return [
    row("Player One", 1, 74),
    row("Player Two", 1, 81),
    row("Player Three", 0.875, 66),
    row("Player Four", 0.75, 90),
    row("You", 0.75, 97, true),
    row("Player Six", 0.625, 88),
    row("Player Seven", 0.5, 70),
  ];
}

export function LeaderboardView({ quizTitle, maxMarks }: { quizTitle: string; maxMarks: number }) {
  const [players, setPlayers] = useState<Player[]>(() => seed(maxMarks));

  // Demo only: simulates scores changing. Replace with Supabase Realtime later.
  useEffect(() => {
    const id = setInterval(() => {
      setPlayers((prev) =>
        prev.map((p) => (Math.random() < 0.25 ? { ...p, score: Math.min(maxMarks, p.score + 1) } : p)),
      );
    }, 2500);
    return () => clearInterval(id);
  }, [maxMarks]);

  // Score first. If scores are equal, the faster time ranks higher.
  const ranked = [...players].sort((a, b) => b.score - a.score || a.seconds - b.seconds);

  if (ranked.length === 0) {
    return (
      <section className="mx-auto max-w-[1100px] px-8 pb-12 pt-8">
        <p className="mono mb-4 text-sm">Q4. {quizTitle}</p>
        <div className="rounded-tr-[120px] bg-sun p-10">
          <p className="display text-5xl">no attempts yet.</p>
          <p className="mt-3 text-lg">Be the first on the board.</p>
        </div>
      </section>
    );
  }

  const top = ranked.slice(0, 5);
  const rest = ranked.slice(5);
  const hi = top[0].score;
  const lo = Math.min(top[top.length - 1].score - 1, hi - 1);
  const towerHeight = (score: number) => 80 + ((score - lo) / (hi - lo)) * 300;
  const youIndex = ranked.findIndex((p) => p.you);

  return (
    <section className="mx-auto max-w-[1100px] px-8 pb-12 pt-8">
      <div className="mono flex flex-wrap justify-between gap-2 text-sm">
        <span>Q4. {quizTitle}</span>
        <span>
          <span className="animate-pulse text-tomato">●</span> LIVE · UPDATES AS ATTEMPTS ARE SUBMITTED
        </span>
      </div>
      <h1 className="display mb-12 mt-4" style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}>
        who’s winning
        <br />
        right now?
      </h1>

      <ol className="flex items-end gap-3">
        {top.map((p, i) => (
          <li key={p.name} className="flex min-w-0 flex-1 flex-col justify-end">
            <span className="mono mb-2 text-center">{p.score} pts</span>
            <div
              className={`display flex items-start justify-center rounded-t-full pt-5 text-5xl transition-[height] duration-700 ease-out sm:text-6xl ${TOWERS[i]}`}
              style={{ height: towerHeight(p.score) }}
            >
              {i + 1}
            </div>
            <span className={`mt-2.5 truncate text-center text-[15px] font-semibold ${p.you ? "bg-ink text-white" : ""}`}>{p.name}</span>
            <span className="mono text-center text-xs">{formatTime(p.seconds)}</span>
          </li>
        ))}
      </ol>

      {rest.length > 0 && (
        <ol className="mt-10 border-t-[3px] border-ink" start={6}>
          {rest.map((p, i) => (
            <li key={p.name} className={`flex items-center gap-5 border-b border-ink py-3 ${p.you ? "bg-ink px-4 text-white" : ""}`}>
              <span className="display w-10 text-3xl">{i + 6}</span>
              <span className="flex-1 font-semibold">{p.name}</span>
              <span className="mono text-sm">{formatTime(p.seconds)}</span>
              <span className="mono">{p.score} pts</span>
            </li>
          ))}
        </ol>
      )}

      <p className="mono mt-8 text-sm uppercase">
        {youIndex === -1
          ? "Take the quiz to appear on the board."
          : youIndex === 0
            ? "You are in the lead."
            : `You are #${youIndex + 1}, ${hi - ranked[youIndex].score} pts behind #1.`}
      </p>
      <p className="mono mt-2 text-[12px] uppercase">Same score? The faster time ranks higher.</p>
    </section>
  );
}