"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import StatusPill from "@/components/qz/StatusPill";
import { formatTime, quizzes, totalMarks, totalSeconds, type QuizStatus } from "@/lib/quizzes";

// pt-16 / pb-16 keep the text away from whichever corner is rounded.
const cardStyles = [
  "bg-cobalt text-white rounded-tl-[120px] pt-16 pb-7",
  "bg-tomato text-ink rounded-tr-[120px] pt-16 pb-7",
  "bg-sun text-ink rounded-bl-[120px] pt-7 pb-16",
  "bg-ink text-white rounded-br-[120px] pt-7 pb-16",
  "bg-mint text-ink rounded-tl-[120px] pt-16 pb-7",
  "bg-cobalt text-white rounded-tr-[120px] pt-16 pb-7",
];

const statuses: ("all" | QuizStatus)[] = ["all", "live", "upcoming", "finished"];
const categories = ["all", ...Array.from(new Set(quizzes.map((q) => q.category)))];

export default function QuizzesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | QuizStatus>("all");
  const [category, setCategory] = useState("all");

  const visible = useMemo(
    () =>
      quizzes.filter(
        (q) =>
          q.title.toLowerCase().includes(search.trim().toLowerCase()) &&
          (status === "all" || q.status === status) &&
          (category === "all" || q.category === category),
      ),
    [search, status, category],
  );

  function reset() {
    setSearch("");
    setStatus("all");
    setCategory("all");
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

      <div className="mb-4 flex flex-wrap gap-2.5" role="group" aria-label="Status">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={status === s}
            onClick={() => setStatus(s)}
            className={`rounded-full border-[3px] border-ink px-[18px] py-2 font-semibold ${status === s ? "bg-ink text-white" : ""}`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="mono mb-10 flex flex-wrap items-center gap-2 text-[13px] uppercase" role="group" aria-label="Category">
        <span>Category:</span>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={`rounded-full border-2 border-ink px-3 py-1 uppercase ${category === c ? "bg-ink text-white" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-tr-[120px] bg-sun p-10">
          <p className="display text-5xl">{quizzes.length === 0 ? "no quizzes yet." : "no quiz matches."}</p>
          {quizzes.length > 0 && (
            <button type="button" onClick={reset} className="display mt-6 rounded-full bg-ink px-7 py-3 text-2xl text-white">
              clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((q) => (
            <article key={q.id} className={`flex min-h-[420px] flex-col justify-between gap-4 px-7 ${cardStyles[quizzes.indexOf(q) % cardStyles.length]}`}>
              <div className="flex items-center justify-between">
                <StatusPill status={q.status} />
                <span className="mono text-xs uppercase">{q.category} · {q.difficulty}</span>
              </div>
              <div>
                <h2 className="display text-[40px]">{q.title}</h2>
                <p className="mt-2 text-[15px] leading-snug">{q.description}</p>
              </div>
              <div>
                <p className="mono text-[12px] uppercase leading-relaxed">
                  {q.questions.length} questions · {totalMarks(q)} marks ({q.marksPerQuestion} each)
                  <br />
                  {q.secondsPerQuestion}s per question · {formatTime(totalSeconds(q))} total
                  <br />
                  {q.startsAt} → {q.endsAt}
                </p>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <Link href={`/quizzes/${q.id}`} className="mono text-[13px] uppercase underline underline-offset-4">details</Link>
                  {q.status === "live" && <Link href={`/quizzes/${q.id}`} className="display text-3xl">start →</Link>}
                  {q.status === "upcoming" && <span className="mono text-[12px] uppercase">opens {q.startsAt}</span>}
                  {q.status === "finished" && <Link href={`/quizzes/${q.id}/leaderboard`} className="display text-2xl">see the board →</Link>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}