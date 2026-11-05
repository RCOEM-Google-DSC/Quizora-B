import Link from "next/link";
import { formatTime, totalMarks, type Quiz } from "@/lib/quizzes";

const LETTERS = ["A", "B", "C", "D"];

type Props = { quiz: Quiz; answers: (number | null)[]; spent: number };

export default function ResultView({ quiz, answers, spent }: Props) {
  const total = quiz.questions.length;
  const correct = answers.filter((a, i) => a !== null && a === quiz.questions[i].answer).length;
  const unanswered = answers.filter((a) => a === null).length;
  const incorrect = total - correct - unanswered;
  const score = correct * quiz.marksPerQuestion;
  const max = totalMarks(quiz);
  const percent = Math.round((score / max) * 100);

  return (
    <section className="mx-auto max-w-[1200px] px-8 pb-12 pt-8">
      <p className="mono mb-4 text-sm">RESULT · {quiz.title}</p>
      <div className="flex flex-wrap items-center gap-8">
        <h1 className="display flex-[1_1_560px]" style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}>
          you scored
          <br />
          {score} of {max}.
        </h1>
        <div className="flex size-[240px] flex-col items-center justify-center rounded-full bg-sun">
          <span className="display text-[88px]">{percent}%</span>
          <span className="mono text-sm uppercase">Score</span>
        </div>
      </div>

      <div className="my-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-bl-[100px] bg-mint px-7 pb-6 pt-8">
          <div className="display text-[64px]">{correct}</div>
          <div className="mono text-[13px] uppercase">Correct</div>
        </div>
        <div className="bg-tomato px-7 py-6">
          <div className="display text-[64px]">{incorrect}</div>
          <div className="mono text-[13px] uppercase">Incorrect</div>
        </div>
        <div className="bg-sun px-7 py-6">
          <div className="display text-[64px]">{unanswered}</div>
          <div className="mono text-[13px] uppercase">Unanswered</div>
        </div>
        <div className="rounded-tr-[100px] bg-ink px-7 pb-6 pt-8 text-white">
          <div className="display text-[64px]">{formatTime(spent)}</div>
          <div className="mono text-[13px] uppercase">Time taken</div>
        </div>
      </div>

      <p className="mono mb-3 text-sm">REVIEW · CORRECT ANSWERS</p>
      <ol className="border-t-[3px] border-ink">
        {quiz.questions.map((q, i) => {
          const mine = answers[i];
          const ok = mine !== null && mine === q.answer;
          return (
            <li key={q.q} className="flex flex-wrap items-center gap-5 border-b border-ink py-4">
              <span className={`display flex size-11 items-center justify-center rounded-full text-[22px] ${ok ? "bg-mint" : mine === null ? "bg-sun" : "bg-tomato"}`}>
                {mine === null ? "–" : LETTERS[mine]}
              </span>
              <div className="flex-[1_1_300px]">
                <p className="text-xl font-semibold">{q.q}</p>
                <p className="mono mt-1 text-[13px]">
                  YOU: {mine === null ? "no answer" : q.options[mine]} · CORRECT: {LETTERS[q.answer]} {q.options[q.answer]}
                </p>
              </div>
              <span className="mono text-[13px]">{ok ? "CORRECT" : mine === null ? "UNANSWERED" : "INCORRECT"}</span>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={`/quizzes/${quiz.id}/leaderboard`} className="display rounded-full bg-sun px-9 py-5 text-3xl">view leaderboard</Link>
        {quiz.status === "live" && (
          <Link href={`/quizzes/${quiz.id}`} className="display rounded-full border-[3px] border-ink px-9 py-4 text-3xl">retake quiz</Link>
        )}
        <Link href="/quizzes" className="display rounded-full border-[3px] border-ink px-9 py-4 text-3xl">more quizzes</Link>
      </div>
    </section>
  );
}