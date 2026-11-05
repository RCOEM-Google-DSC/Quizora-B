import { notFound, redirect } from "next/navigation";
import QuizRunner from "@/components/qz/QuizRunner";
import { getQuiz } from "@/lib/quizzes";

export default async function AttemptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quiz = getQuiz(id);
  if (!quiz) notFound();
  // A quiz can only be attempted while its availability window is open.
  if (quiz.status !== "live") redirect(`/quizzes/${id}`);
  // TODO: also require a signed-in user here (Supabase session check).
  return <QuizRunner quiz={quiz} />;
}