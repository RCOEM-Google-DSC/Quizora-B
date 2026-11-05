import type { QuizStatus } from "@/lib/quizzes";

const styles: Record<QuizStatus, string> = {
  live: "bg-mint text-ink",
  upcoming: "bg-sun text-ink",
  finished: "bg-ink text-white",
};

export default function StatusPill({ status }: { status: QuizStatus }) {
  return (
    <span className={`mono rounded-full px-3 py-1 text-xs uppercase ${styles[status]}`}>
      {status === "live" ? "● live" : status}
    </span>
  );
}