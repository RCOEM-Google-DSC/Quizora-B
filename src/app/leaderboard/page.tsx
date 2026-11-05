import Link from "next/link";
import StatusPill from "@/components/qz/StatusPill";
import { quizzes } from "@/lib/quizzes";

export const metadata = {
  title: "Leaderboards — Quizora-B",
  description: "Pick a quiz to see its live leaderboard.",
};

export default function LeaderboardPage() {
  return (
    <section className="mx-auto max-w-[1100px] px-8 pb-12 pt-8">
      <p className="mono mb-4 text-sm">Q4.</p>
      <h1 className="display mb-10" style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}>pick a board.</h1>
      {quizzes.length === 0 ? (
        <p className="text-xl">No quizzes yet, so there are no leaderboards.</p>
      ) : (
        <ul className="border-t-[3px] border-ink">
          {quizzes.map((q) => (
            <li key={q.id} className="flex flex-wrap items-center gap-4 border-b border-ink px-2 py-5">
              <span className="display flex-[1_1_260px] text-4xl">{q.title}</span>
              <StatusPill status={q.status} />
              {q.status === "upcoming" ? (
                <span className="mono text-[13px] uppercase">opens {q.startsAt}</span>
              ) : (
                <Link href={`/quizzes/${q.id}/leaderboard`} className="display rounded-full bg-sun px-6 py-2 text-xl">see the board →</Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}