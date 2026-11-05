"use client";

import { useEffect, useState } from "react";

type Player = { name: string; score: number; you?: boolean };

const START: Player[] = [
  { name: "Player One", score: 980 },
  { name: "Player Two", score: 940 },
  { name: "Player Three", score: 905 },
  { name: "Player Four", score: 870 },
  { name: "You", score: 845, you: true },
  { name: "Player Six", score: 820 },
  { name: "Player Seven", score: 790 },
];

const TOWERS = [
  "bg-sun text-ink",
  "bg-cobalt text-white",
  "bg-tomato text-ink",
  "bg-mint text-ink",
  "bg-ink text-white",
];

export function LeaderboardView() {
  const [players, setPlayers] = useState<Player[]>(START);

  // Demo only: simulates scores changing. Replace with Supabase Realtime later.
  useEffect(() => {
    const id = setInterval(() => {
      setPlayers((prev) =>
        prev.map((p) =>
          Math.random() < 0.4
            ? { ...p, score: p.score + 10 * (1 + Math.floor(Math.random() * 3)) }
            : p,
        ),
      );
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const ranked = [...players].sort((a, b) => b.score - a.score);
  const top = ranked.slice(0, 5);
  const rest = ranked.slice(5);
  const max = top[0].score;
  const min = top[top.length - 1].score - 60;
  const towerHeight = (score: number) => 80 + ((score - min) / (max - min)) * 300;
  const youIndex = ranked.findIndex((p) => p.you);

  return (
    <section className="mx-auto max-w-[1100px] px-8 pb-12 pt-8">
      <div className="mono flex flex-wrap justify-between gap-2 text-sm">
        <span>Q4.</span>
        <span>
          <span className="animate-pulse text-tomato">●</span> LIVE · UPDATES AS ANSWERS LAND
        </span>
      </div>
      <h1
        className="display mb-12 mt-4"
        style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}
      >
        who’s winning
        <br />
        right now?
      </h1>

      <ol className="flex items-end gap-3">
        {top.map((p, i) => (
          <li key={p.name} className="flex min-w-0 flex-1 flex-col justify-end">
            <span className="mono mb-2 text-center">{p.score}</span>
            <div
              className={`display flex items-start justify-center rounded-t-full pt-5 text-5xl transition-[height] duration-700 ease-out sm:text-6xl ${TOWERS[i]}`}
              style={{ height: towerHeight(p.score) }}
            >
              {i + 1}
            </div>
            <span
              className={`mt-2.5 truncate text-center text-[15px] font-semibold ${
                p.you ? "bg-ink text-white" : ""
              }`}
            >
              {p.name}
            </span>
          </li>
        ))}
      </ol>

      {rest.length > 0 && (
        <ol className="mt-10 border-t-[3px] border-ink" start={6}>
          {rest.map((p, i) => (
            <li
              key={p.name}
              className={`flex items-center gap-5 border-b border-ink py-3 ${
                p.you ? "bg-ink px-4 text-white" : ""
              }`}
            >
              <span className="display w-10 text-3xl">{i + 6}</span>
              <span className="flex-1 font-semibold">{p.name}</span>
              <span className="mono">{p.score}</span>
            </li>
          ))}
        </ol>
      )}

      <p className="mono mt-8 text-sm uppercase">
        {youIndex === 0
          ? "You are in the lead."
          : `You are ${max - ranked[youIndex].score} pts from #1.`}
      </p>
    </section>
  );
}