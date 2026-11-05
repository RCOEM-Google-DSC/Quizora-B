import { notFound } from "next/navigation";
import ResultView from "@/components/qz/ResultView";
import { getQuiz, totalSeconds } from "@/lib/quizzes";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quiz = getQuiz(id);
  if (!quiz) notFound();

  // SAMPLE attempt. TODO: load the saved attempt (answers and time) from the backend.
  const answers = quiz.questions.map((q, i) => (i === 2 ? null : i === 1 ? (q.answer + 1) % 4 : q.answer));
  const spent = Math.round(totalSeconds(quiz) * 0.6);

  return (
    <>
      <p className="mono mx-auto max-w-[1200px] px-8 pt-4 text-[12px] uppercase">Sample attempt shown. Saved attempts load here once the backend is connected.</p>
      <ResultView quiz={quiz} answers={answers} spent={spent} />
    </>
  );
}