import Link from "next/link";
import { notFound } from "next/navigation";
import StartPanel from "@/components/qz/StartPanel";
import StatusPill from "@/components/qz/StatusPill";
import { formatTime, getQuiz, totalMarks, totalSeconds } from "@/lib/quizzes";

export default async function QuizInfoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quiz = getQuiz(id);
  if (!quiz) notFound();

  const facts: [string, string][] = [
    ["questions", String(quiz.questions.length)],
    ["total marks", String(totalMarks(quiz))],
    ["marks per question", String(quiz.marksPerQuestion)],
    ["time per question", `${quiz.secondsPerQuestion}s`],
    ["total duration", formatTime(totalSeconds(quiz))],
    ["difficulty", quiz.difficulty],
  ];

  const rules = [
    "You see one question at a time. Each question has its own timer, and the whole quiz has a total timer.",
    "Move with Previous, Next and Skip, or jump to any question using the question palette.",
    "You can change your answers until you submit. After you submit, answers are final.",
    "When a question’s own time runs out, you move on and that question is locked.",
    "When the total time runs out, your quiz is submitted automatically.",
    "You can retake this quiz while it is open. Every attempt is scored separately.",
    "Correct answers are shown after you submit. On the leaderboard, a tie is broken by the faster time.",
  ];

  return (
    <section className="mx-auto max-w-[1200px] px-8 pb-12 pt-8">
      <Link href="/quizzes" className="mono text-[13px] uppercase underline underline-offset-4">← all quizzes</Link>
      <div className="mb-3 mt-6 flex flex-wrap items-center gap-3">
        <StatusPill status={quiz.status} />
        <span className="mono text-xs uppercase">{quiz.category}</span>
      </div>
      <h1 className="display" style={{ fontSize: "clamp(3.5rem, 10vw, 8.75rem)" }}>{quiz.title}</h1>
      <p className="mt-5 max-w-[640px] text-xl leading-snug">{quiz.description}</p>
      <p className="mono mt-4 text-[13px] uppercase">Open {quiz.startsAt} → {quiz.endsAt}</p>

      <div className="my-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map(([label, value], i) => (
          <div key={label} className={`border-[3px] border-ink bg-white p-6 ${i === 0 ? "rounded-tl-[60px]" : ""} ${i === 5 ? "rounded-br-[60px]" : ""}`}>
            <div className="display text-5xl">{value}</div>
            <div className="mono mt-1 text-[12px] uppercase">{label}</div>
          </div>
        ))}
      </div>

      <h2 className="display mb-4 text-5xl">before you start.</h2>
      <ol className="mb-12 max-w-[760px] border-t-[3px] border-ink">
        {rules.map((rule, i) => (
          <li key={rule} className="flex gap-5 border-b border-ink py-4">
            <span className="display w-10 text-3xl">{i + 1}</span>
            <span className="text-lg leading-snug">{rule}</span>
          </li>
        ))}
      </ol>

      <StartPanel quizId={quiz.id} status={quiz.status} startsAt={quiz.startsAt} endsAt={quiz.endsAt} />
    </section>
  );
}