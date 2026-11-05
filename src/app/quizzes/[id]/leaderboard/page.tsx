import Link from "next/link";
import { notFound } from "next/navigation";
import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";
import { getQuiz, totalMarks } from "@/lib/quizzes";

export default async function QuizLeaderboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quiz = getQuiz(id);
  if (!quiz) notFound();

  if (quiz.status === "upcoming") {
    return (
      <section className="mx-auto max-w-[1100px] px-8 pb-12 pt-8">
        <p className="mono mb-4 text-sm">Q4. {quiz.title}</p>
        <div className="rounded-tr-[120px] bg-sun p-10">
          <p className="display text-5xl">no attempts yet.</p>
          <p className="mt-3 text-lg">This quiz opens {quiz.startsAt}.</p>
          <Link href={`/quizzes/${quiz.id}`} className="display mt-6 inline-block rounded-full bg-ink px-7 py-3 text-2xl text-white">quiz details</Link>
        </div>
      </section>
    );
  }

  return <LeaderboardView quizTitle={quiz.title} maxMarks={totalMarks(quiz)} />;
}