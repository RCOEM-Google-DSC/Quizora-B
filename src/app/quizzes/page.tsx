"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { quizzes, QUESTION_SECONDS, type Difficulty } from "@/lib/quizzes";

const cardStyles = [
  "bg-cobalt text-white rounded-tl-[160px]",
  "bg-tomato text-ink rounded-tr-[160px]",
  "bg-sun text-ink rounded-bl-[160px]",
  "bg-ink text-white rounded-br-[160px]",
  "bg-mint text-ink rounded-tl-[160px]",
  "bg-cobalt text-white rounded-tr-[160px]",
];

const categories = ["all", ...Array.from(new Set(quizzes.map((q) => q.category)))];
const difficulties: ("any" | Difficulty)[] = ["any", "easy", "medium", "hard"];

export default function QuizzesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState<"any" | Difficulty>("any");

  const visible = useMemo(
    () =>
      quizzes.filter(
        (q) =>
          q.title.toLowerCase().includes(search.trim().toLowerCase()) &&
          (category === "all" || q.category === category) &&
          (difficulty === "any" || q.difficulty === difficulty),
      ),
    [search, category, difficulty],
  );

  function reset() {
    setSearch("");
    setCategory("all");
    setDifficulty("any");
  }

  return (
    <section className="mx-auto max-w-[1200px] px-8 pb-12 pt-8">
      <p className="mono mb-4 text-sm">Q2.</p>
      <h1 className="display mb-8" style={{ fontSize: "clamp(3.5rem, 10vw, 8.75rem)" }}>pick a quiz.</h1>

      <label htmlFor="search" className="sr-only">Search quizzes</label>
      <input
        id="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="search quizzes"
        className="mb-5 h-[60px] w-full max-w-[520px] rounded-full border-[3px] border-ink bg-white px-6 text-lg font-semibold placeholder:font-normal placeholder:text-muted-foreground"
      />

      <div className="mb-4 flex flex-wrap gap-2.5" role="group" aria-label="Category">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={`rounded-full border-[3px] border-ink px-[18px] py-2 font-semibold ${category === c ? "bg-ink text-white" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mono mb-10 flex flex-wrap items-center gap-2 text-[13px] uppercase" role="group" aria-label="Difficulty">
        <span>Difficulty:</span>
        {difficulties.map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={difficulty === d}
            onClick={() => setDifficulty(d)}
            className={`rounded-full border-2 border-ink px-3 py-1 uppercase ${difficulty === d ? "bg-ink text-white" : ""}`}
          >
            {d}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-tr-[120px] bg-sun p-10">
          <p className="display text-5xl">no quiz matches.</p>
          <button type="button" onClick={reset} className="display mt-6 rounded-full bg-ink px-7 py-3 text-2xl text-white">
            clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((q) => {
            const style = cardStyles[quizzes.indexOf(q) % cardStyles.length];
            const minutes = Math.max(1, Math.round((q.questions.length * QUESTION_SECONDS) / 60));
            return (
              <Link
                key={q.id}
                href={`/quizzes/${q.id}`}
                className={`flex min-h-[300px] flex-col justify-between p-7 transition-transform hover:-translate-y-1.5 ${style}`}
              >
                <div className="mono flex items-center justify-between text-[13px] uppercase">
                  <span>{q.category}</span>
                  <span className="rounded-full border-2 border-current px-3 py-0.5 text-xs">{q.difficulty}</span>
                </div>
                <div className="display text-[44px]">{q.title}</div>
                <div className="flex items-end justify-between">
                  <span className="mono text-[13px] uppercase">
                    {q.questions.length} questions · {minutes} min
                  </span>
                  <span className="display text-3xl">start →</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}