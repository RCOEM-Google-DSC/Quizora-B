"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { QuizStatus } from "@/lib/quizzes";

type Props = { quizId: string; status: QuizStatus; startsAt: string; endsAt: string };

export default function StartPanel({ quizId, status, startsAt, endsAt }: Props) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [warn, setWarn] = useState(false);

  if (status === "upcoming") {
    return <p className="rounded-tr-[60px] bg-sun px-6 py-4 text-lg font-semibold">This quiz opens {startsAt}. Come back then.</p>;
  }

  if (status === "finished") {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <p className="rounded-tr-[60px] bg-ink px-6 py-4 text-lg font-semibold text-white">This quiz closed on {endsAt}.</p>
        <Link href={`/quizzes/${quizId}/leaderboard`} className="display rounded-full border-[3px] border-ink px-8 py-3 text-2xl">see the board</Link>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => (isAuthenticated ? router.push(`/quizzes/${quizId}/attempt`) : setWarn(true))}
        className="display rounded-full bg-sun px-10 py-5 text-4xl"
      >
        start quiz →
      </button>
      {warn && (
        <p role="alert" className="mt-5 max-w-[520px] rounded-tr-[40px] bg-tomato px-5 py-4 font-semibold text-ink">
          You need to be logged in to attempt a quiz.{" "}
          <Link href="/login" className="underline">Log in</Link> or{" "}
          <Link href="/register" className="underline">create an account</Link>.
        </p>
      )}
    </div>
  );
}