"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { QUESTION_SECONDS, type Quiz } from "@/lib/quizzes";

const LIMIT = QUESTION_SECONDS;
const LETTERS = ["A", "B", "C", "D"];
const SLAB = [
  "bg-cobalt text-white rounded-tl-[160px]",
  "bg-tomato text-ink rounded-tr-[160px]",
  "bg-sun text-ink rounded-bl-[160px]",
  "bg-ink text-white rounded-br-[160px]",
];
const CIRCUMFERENCE = 2 * Math.PI * 38;

export default function QuizRunner({ quiz }: { quiz: Quiz }) {
  const total = quiz.questions.length;
  const [phase, setPhase] = useState<"play" | "done">("play");
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(LIMIT);
  const [locked, setLocked] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]); // -1 means unanswered
  const [spent, setSpent] = useState(0);

  const lock = useCallback(
    (choice: number) => {
      if (locked) return;
      setLocked(true);
      setSelected(choice);
      setAnswers((a) => [...a, choice]);
      setSpent((s) => s + (LIMIT - timeLeft));
      setTimeout(() => {
        if (index + 1 >= total) {
          setPhase("done");
        } else {
          setIndex((i) => i + 1);
          setSelected(null);
          setLocked(false);
          setTimeLeft(LIMIT);
        }
      }, 900);
    },
    [locked, timeLeft, index, total],
  );

  // Countdown. When time runs out the question is locked as unanswered.
  useEffect(() => {
    if (phase !== "play" || locked) return;
    const t = setTimeout(() => {
      if (timeLeft <= 1) lock(-1);
      else setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, locked, timeLeft, lock]);

  // Keyboard shortcuts: 1 to 4 pick an answer.
  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= 4) lock(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, lock]);

  function retry() {
    setPhase("play");
    setIndex(0);
    setTimeLeft(LIMIT);
    setLocked(false);
    setSelected(null);
    setAnswers([]);
    setSpent(0);
  }

  if (phase === "done") {
    const score = answers.filter((a, i) => a === quiz.questions[i].answer).length;
    const percent = Math.round((score / total) * 100);
    const m = Math.floor(spent / 60);
    const s = String(spent % 60).padStart(2, "0");
    return (
      <section className="mx-auto max-w-[1200px] px-8 pb-12 pt-8">
        <p className="mono mb-4 text-sm">RESULT.</p>
        <div className="flex flex-wrap items-center gap-8">
          <h1 className="display flex-[1_1_560px]" style={{ fontSize: "clamp(4rem, 11vw, 10rem)" }}>
            you got
            <br />
            {score} of {total}.
          </h1>
          <div className="flex size-[260px] flex-col items-center justify-center rounded-full bg-sun">
            <span className="display text-[96px]">{percent}%</span>
            <span className="mono text-sm uppercase">Score</span>
          </div>
        </div>

        <div className="my-12 flex flex-wrap gap-3">
          <div className="flex-[1_1_220px] rounded-bl-[120px] bg-mint px-7 py-6">
            <div className="display text-[72px]">{score}</div>
            <div className="mono text-[13px] uppercase">Correct</div>
          </div>
          <div className="flex-[1_1_220px] bg-tomato px-7 py-6">
            <div className="display text-[72px]">{total - score}</div>
            <div className="mono text-[13px] uppercase">Wrong or skipped</div>
          </div>
          <div className="flex-[1_1_220px] rounded-tr-[120px] bg-ink px-7 py-6 text-white">
            <div className="display text-[72px]">{m}:{s}</div>
            <div className="mono text-[13px] uppercase">Time taken</div>
          </div>
        </div>

        <p className="mono mb-3 text-sm">REVIEW</p>
        <ol className="border-t-[3px] border-ink">
          {quiz.questions.map((q, i) => {
            const ok = answers[i] === q.answer;
            const yours = answers[i] >= 0 ? q.options[answers[i]] : "no answer";
            return (
              <li key={q.q} className="flex flex-wrap items-center gap-5 border-b border-ink py-4">
                <span className={`display flex size-11 items-center justify-center rounded-full text-[22px] ${ok ? "bg-mint" : "bg-tomato"}`}>
                  {answers[i] >= 0 ? LETTERS[answers[i]] : "–"}
                </span>
                <div className="flex-[1_1_300px]">
                  <p className="text-xl font-semibold">{q.q}</p>
                  {!ok && (
                    <p className="mono mt-1 text-[13px]">
                      YOU: {yours} · CORRECT: {q.options[q.answer]}
                    </p>
                  )}
                </div>
                <span className="mono text-[13px]">{ok ? "CORRECT" : "WRONG"}</span>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={retry} className="display rounded-full bg-sun px-9 py-5 text-3xl">retry</button>
          <Link href="/leaderboard" className="display rounded-full border-[3px] border-ink px-9 py-4 text-3xl">see the board</Link>
          <Link href="/quizzes" className="display rounded-full border-[3px] border-ink px-9 py-4 text-3xl">more quizzes</Link>
        </div>
      </section>
    );
  }

  const question = quiz.questions[index];
  const low = timeLeft <= 5;

  return (
    <section className="mx-auto max-w-[1200px] px-8 pb-12 pt-8">
      <div className="mono mb-8 flex flex-wrap items-center gap-1.5 text-[13px]">
        <span className="mr-2">QUESTION {index + 1} / {total}</span>
        {quiz.questions.map((q, i) => (
          <span key={q.q} className={`h-1.5 w-[22px] ${i < index ? "bg-ink" : i === index ? "bg-tomato" : "bg-[#C9C9C2]"}`} />
        ))}
      </div>

      <div className="mb-12 flex flex-wrap items-center justify-between gap-8">
        <div className="flex-[1_1_560px]">
          <p className="mono mb-4 text-sm">Q{index + 1}.</p>
          <h1 className="display" style={{ fontSize: "clamp(2.5rem, 7.5vw, 6.5rem)" }}>{question.q}</h1>
        </div>
        <svg width="168" height="168" viewBox="0 0 100 100" role="timer" aria-label={`${timeLeft} seconds left`}>
          <circle cx="50" cy="50" r="46" fill="#111" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#3A3A3A" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="38" fill="none" strokeWidth="8"
            stroke={low ? "#FF4B3A" : "#FFC400"}
            strokeDasharray={`${(CIRCUMFERENCE * timeLeft) / LIMIT} ${CIRCUMFERENCE}`}
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dasharray 1s linear" }}
          />
          <text x="50" y="58" textAnchor="middle" fill="#fff" fontSize="22" fontFamily="var(--font-dm-mono), monospace">
            0:{String(timeLeft).padStart(2, "0")}
          </text>
        </svg>
      </div>

      <div className="flex flex-wrap gap-3">
        {question.options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            disabled={locked}
            onClick={() => lock(i)}
            className={`flex min-h-[200px] flex-[1_1_320px] items-center gap-6 px-8 py-6 text-left disabled:cursor-default ${SLAB[i]}`}
            style={selected === i ? { outline: `6px solid ${i === 3 ? "#fff" : "#111"}`, outlineOffset: "-6px" } : undefined}
          >
            <span className="display text-[96px] leading-none">{LETTERS[i]}</span>
            <span className="display text-4xl">{opt}</span>
            {selected === i && <span className="mono ml-auto text-[13px]">LOCKED IN</span>}
          </button>
        ))}
      </div>
      <p className="mono mt-6 text-[13px] uppercase">Press 1–4 to answer. One final answer per question.</p>
    </section>
  );
}