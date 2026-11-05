"use client";

import { useCallback, useEffect, useState } from "react";
import ResultView from "@/components/qz/ResultView";
import { formatTime, totalSeconds, type Quiz } from "@/lib/quizzes";

const LETTERS = ["A", "B", "C", "D"];
const SLAB = [
  "bg-cobalt text-white rounded-tl-[120px] pt-14 pb-6",
  "bg-tomato text-ink rounded-tr-[120px] pt-14 pb-6",
  "bg-sun text-ink rounded-bl-[120px] pt-6 pb-14",
  "bg-ink text-white rounded-br-[120px] pt-6 pb-14",
];
const PALETTE = {
  current: "bg-ink text-white",
  answered: "bg-mint text-ink",
  skipped: "bg-sun text-ink",
  unanswered: "bg-white text-ink",
};
const CIRCUMFERENCE = 2 * Math.PI * 38;

export default function QuizRunner({ quiz }: { quiz: Quiz }) {
  const total = quiz.questions.length;
  const perQuestion = quiz.secondsPerQuestion;
  const overallStart = totalSeconds(quiz);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => quiz.questions.map(() => null));
  const [skipped, setSkipped] = useState<boolean[]>(() => quiz.questions.map(() => false));
  const [left, setLeft] = useState<number[]>(() => quiz.questions.map(() => perQuestion));
  const [overall, setOverall] = useState(overallStart);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
  const [spent, setSpent] = useState(0);

  const locked = left[current] === 0;
  const answeredCount = answers.filter((a) => a !== null).length;
  const unansweredCount = total - answeredCount;

  const submit = useCallback((used: number) => {
    // TODO: save this attempt (answers, score, time) to the backend before showing the result.
    setSpent(used);
    setDone(true);
    setConfirming(false);
  }, []);

  const goTo = useCallback((i: number) => setCurrent(Math.min(total - 1, Math.max(0, i))), [total]);

  const pick = useCallback(
    (i: number) => {
      if (left[current] === 0) return; // this question’s time is up
      setAnswers((a) => a.map((v, k) => (k === current ? (v === i ? null : i) : v)));
      setSkipped((s) => s.map((v, k) => (k === current ? false : v)));
    },
    [current, left],
  );

  function skip() {
    if (answers[current] === null) {
      setSkipped((s) => s.map((v, k) => (k === current ? true : v)));
    }
    goTo(current + 1);
  }

  // One tick per second: total timer and the current question’s timer.
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => {
      if (overall <= 1) {
        submit(overallStart); // total time is up: submit automatically
        return;
      }
      setOverall(overall - 1);
      if (left[current] > 0) {
        const remaining = left[current] - 1;
        setLeft((l) => l.map((v, i) => (i === current ? v - 1 : v)));
        if (remaining === 0) {
          // This question’s time is up: lock it and move to the next one with time left.
          const next = left.findIndex((v, i) => i > current && v > 0);
          if (next >= 0) setCurrent(next);
        }
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [done, overall, left, current, overallStart, submit]);

  // Keyboard: 1-4 pick an answer, arrows move between questions.
  useEffect(() => {
    if (done || confirming) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= 4) pick(n - 1);
      else if (e.key === "ArrowRight") goTo(current + 1);
      else if (e.key === "ArrowLeft") goTo(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done, confirming, pick, goTo, current]);

  // Escape closes the submit prompt.
  useEffect(() => {
    if (!confirming) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConfirming(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirming]);

  if (done) return <ResultView quiz={quiz} answers={answers} spent={spent} />;

  const question = quiz.questions[current];
  const statusOf = (i: number) =>
    i === current ? "current" : answers[i] !== null ? "answered" : skipped[i] ? "skipped" : "unanswered";
  const low = left[current] <= 5 && left[current] > 0;

  return (
    <section className="mx-auto max-w-[1200px] px-8 pb-12 pt-8">
      <div className="mono mb-8 flex flex-wrap items-center justify-between gap-4 text-[13px] uppercase">
        <span>{quiz.title} · Question {current + 1} / {total}</span>
        <span
          role="timer"
          aria-label={`Total time left ${formatTime(overall)}`}
          className={`rounded-full px-4 py-1.5 text-sm ${overall <= 60 ? "bg-tomato text-ink" : "bg-ink text-white"}`}
        >
          total time {formatTime(overall)}
        </span>
      </div>

      <div className="flex flex-wrap gap-10">
        <div className="min-w-0 flex-[1_1_640px]">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
            <div className="min-w-0 flex-[1_1_380px]">
              <p className="mono mb-3 text-sm">Q{current + 1}.</p>
              <h1 className="display" style={{ fontSize: "clamp(2.25rem, 5.5vw, 4.75rem)" }}>{question.q}</h1>
            </div>
            <svg width="132" height="132" viewBox="0 0 100 100" role="timer" aria-label={`${left[current]} seconds left on this question`}>
              <circle cx="50" cy="50" r="46" fill="#111" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#3A3A3A" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="38" fill="none" strokeWidth="8"
                stroke={low ? "#FF4B3A" : "#FFC400"}
                strokeDasharray={`${(CIRCUMFERENCE * left[current]) / perQuestion} ${CIRCUMFERENCE}`}
                transform="rotate(-90 50 50)"
                style={{ transition: "stroke-dasharray 1s linear" }}
              />
              <text x="50" y="58" textAnchor="middle" fill="#fff" fontSize="22" fontFamily="var(--font-dm-mono), monospace">
                {formatTime(left[current])}
              </text>
            </svg>
          </div>

          {locked && (
            <p role="status" className="mono mb-4 rounded-tr-[24px] bg-tomato px-4 py-2 text-[13px] uppercase">
              Time’s up on this question. Your answer is locked.
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {question.options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                disabled={locked}
                onClick={() => pick(i)}
                aria-pressed={answers[current] === i}
                className={`flex min-h-[170px] min-w-0 items-center gap-5 px-8 text-left disabled:cursor-default ${SLAB[i]}`}
                style={answers[current] === i ? { outline: `6px solid ${i === 3 ? "#fff" : "#111"}`, outlineOffset: "-6px" } : undefined}
              >
                <span className="display text-[80px] leading-none">{LETTERS[i]}</span>
                <span className="display min-w-0 break-words text-3xl">{opt}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo(current - 1)} disabled={current === 0} className="display rounded-full border-[3px] border-ink px-7 py-2.5 text-2xl disabled:opacity-40">← previous</button>
            <button type="button" onClick={skip} disabled={current === total - 1} className="display rounded-full border-[3px] border-ink px-7 py-2.5 text-2xl disabled:opacity-40">skip</button>
            <button type="button" onClick={() => goTo(current + 1)} disabled={current === total - 1} className="display rounded-full bg-sun px-7 py-3 text-2xl disabled:opacity-40">next →</button>
          </div>
          <p className="mono mt-5 text-[12px] uppercase">Press 1–4 to pick an answer. Press the same answer again to clear it. Arrow keys move between questions.</p>
        </div>

        <aside className="flex-[1_1_280px] lg:max-w-[320px]">
          <p className="mono mb-3 text-sm uppercase">Questions</p>
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((qq, i) => (
              <button
                key={qq.q}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Question ${i + 1}, ${statusOf(i)}`}
                aria-current={i === current ? "true" : undefined}
                className={`display size-12 rounded-full border-[3px] border-ink text-xl ${PALETTE[statusOf(i)]}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <ul className="mono mt-5 space-y-1.5 text-[12px] uppercase">
            <li><span className="mr-2 inline-block size-3 rounded-full border-2 border-ink bg-ink" />current</li>
            <li><span className="mr-2 inline-block size-3 rounded-full border-2 border-ink bg-mint" />answered ({answeredCount})</li>
            <li><span className="mr-2 inline-block size-3 rounded-full border-2 border-ink bg-sun" />skipped</li>
            <li><span className="mr-2 inline-block size-3 rounded-full border-2 border-ink bg-white" />unanswered</li>
          </ul>
          <button type="button" onClick={() => setConfirming(true)} className="display mt-8 w-full rounded-full bg-ink py-4 text-2xl text-white">
            submit quiz
          </button>
        </aside>
      </div>

      {confirming && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-6" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="w-full max-w-[520px] rounded-tr-[100px] bg-paper p-8 pt-12">
            <h2 id="confirm-title" className="display text-5xl">submit quiz?</h2>
            <p className="mt-4 text-lg leading-snug">
              {unansweredCount > 0
                ? `You still have ${unansweredCount} unanswered question${unansweredCount === 1 ? "" : "s"}.`
                : "You answered every question."}{" "}
              Answers can’t be changed after you submit.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => submit(overallStart - overall)} className="display rounded-full bg-sun px-8 py-3 text-2xl">yes, submit</button>
              <button type="button" onClick={() => setConfirming(false)} className="display rounded-full border-[3px] border-ink px-8 py-2.5 text-2xl">keep going</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}