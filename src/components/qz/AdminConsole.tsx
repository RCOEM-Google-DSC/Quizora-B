"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import StatusPill from "@/components/qz/StatusPill";
import { useAuth } from "@/context/AuthContext";
import { formatTime, quizzes, totalMarks, totalSeconds, type Difficulty, type Question, type Quiz } from "@/lib/quizzes";

type AdminQuiz = Quiz & { published: boolean };
type Tab = "quizzes" | "editor" | "attempts" | "roles";
type Role = "admin" | "editor" | "viewer";

const TABS: Tab[] = ["quizzes", "editor", "attempts", "roles"];
const LETTERS = ["A", "B", "C", "D"];
const INPUT = "h-12 w-full rounded-[16px] border-[3px] border-ink bg-white px-4 font-semibold disabled:opacity-60";
const BTN = "display rounded-full border-[3px] border-ink px-5 py-1.5 text-xl disabled:opacity-50";

const blankQuestion = (): Question => ({ q: "", options: ["", "", "", ""], answer: 0 });

// A quiz must be complete before it can be published.
function validate(quiz: AdminQuiz): string | null {
  if (!quiz.title.trim()) return "add a title first.";
  if (quiz.questions.length === 0) return "add at least one question first.";
  const bad = quiz.questions.findIndex((x) => !x.q.trim() || x.options.some((o) => !o.trim()));
  return bad >= 0 ? `question ${bad + 1} needs text and four options.` : null;
}

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mono mb-1.5 block text-[13px] uppercase">{label}</span>
      {children}
    </label>
  );
}

function Gate({ text, href, label }: { text: string; href: string; label: string }) {
  return (
    <section className="mx-auto max-w-[1200px] px-8 pb-12 pt-8">
      <p className="mono mb-4 text-sm">Q?.</p>
      <h1 className="display mb-6" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>restricted.</h1>
      <p className="mb-6 max-w-[460px] text-xl">{text}</p>
      <Link href={href} className="display inline-block rounded-full bg-sun px-9 py-4 text-3xl">{label}</Link>
    </section>
  );
}

export default function AdminConsole() {
  const { user, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<Tab>("quizzes");
  const [items, setItems] = useState<AdminQuiz[]>(() => quizzes.map((q) => ({ ...q, published: q.id !== "indian-history" })));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [attemptsId, setAttemptsId] = useState(quizzes[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [members, setMembers] = useState<{ name: string; email: string; role: Role }[]>([
    { name: "Team lead", email: "lead@example.com", role: "admin" },
    { name: "Member two", email: "two@example.com", role: "editor" },
    { name: "Member three", email: "three@example.com", role: "viewer" },
  ]);

  // TODO: enforce this on the server (Supabase policies). This is only the screen-level check.
  const role = (user as unknown as { role?: string } | null)?.role;

  if (!isAuthenticated) return <Gate text="Log in to open the admin console." href="/login" label="log in" />;
  if (role && role !== "admin") return <Gate text="You don’t have access to the admin console." href="/" label="back home" />;

  const editing = items.find((i) => i.id === editingId) ?? null;
  const locked = editing?.status === "live";
  const attemptsQuiz = items.find((i) => i.id === attemptsId) ?? null;

  const patch = (id: string, p: Partial<AdminQuiz>) =>
    setItems((list) => list.map((i) => (i.id === id ? { ...i, ...p } : i)));

  function newQuiz() {
    const id = `quiz-${Date.now()}`;
    setItems((l) => [
      ...l,
      { id, title: "", description: "", category: "general", difficulty: "easy", status: "upcoming", startsAt: "", endsAt: "", marksPerQuestion: 1, secondsPerQuestion: 20, questions: [blankQuestion()], published: false },
    ]);
    setEditingId(id);
    setTab("editor");
    setMessage(null);
  }

  function togglePublish(i: AdminQuiz) {
    if (!i.published) {
      const err = validate(i);
      if (err) {
        setMessage(`${i.title || "this quiz"}: ${err}`);
        return;
      }
    }
    patch(i.id, { published: !i.published });
    setMessage(null);
  }

  function setQuestion(qi: number, p: Partial<Question>) {
    if (!editing) return;
    patch(editing.id, { questions: editing.questions.map((x, k) => (k === qi ? { ...x, ...p } : x)) });
  }

  function setOption(qi: number, oi: number, value: string) {
    if (!editing) return;
    const options = editing.questions[qi].options.map((o, k) => (k === oi ? value : o)) as Question["options"];
    setQuestion(qi, { options });
  }

  // Sample participants. TODO: load real attempts for the selected quiz.
  const max = attemptsQuiz ? totalMarks(attemptsQuiz) : 0;
  const sample: [string, number, number, number][] = [
    ["Player One", 1, 74, 1],
    ["Player Two", 1, 81, 2],
    ["Player Three", 0.75, 66, 1],
    ["Player Four", 0.75, 90, 1],
    ["Player Five", 0.5, 70, 3],
  ];
  const rows = attemptsQuiz && attemptsQuiz.status !== "upcoming"
    ? sample.map(([name, pct, seconds, tries]) => ({ name, score: Math.round(max * pct), seconds, tries }))
        .sort((a, b) => b.score - a.score || a.seconds - b.seconds)
    : [];

  return (
    <section className="mx-auto max-w-[1200px] px-8 pb-12 pt-8">
      <p className="mono mb-4 text-sm">ADMIN.</p>
      <h1 className="display mb-8" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>admin console.</h1>

      <div className="mb-8 flex flex-wrap gap-2.5" role="group" aria-label="Admin sections">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-full border-[3px] border-ink px-[18px] py-2 font-semibold ${tab === t ? "bg-ink text-white" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      {message && <p role="status" className="mb-6 rounded-tr-[24px] bg-tomato px-5 py-3 font-semibold">{message}</p>}

      {tab === "quizzes" && (
        <div>
          <button type="button" onClick={newQuiz} className="display mb-6 rounded-full bg-sun px-7 py-3 text-2xl">+ new quiz</button>
          <ul className="border-t-[3px] border-ink">
            {items.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center gap-4 border-b border-ink py-4">
                <span className="display flex-[1_1_240px] text-3xl">{i.title || "untitled quiz"}</span>
                <StatusPill status={i.status} />
                <span className={`mono rounded-full border-2 border-ink px-3 py-0.5 text-xs uppercase ${i.published ? "bg-mint" : "bg-white"}`}>{i.published ? "published" : "draft"}</span>
                <button type="button" className={BTN} onClick={() => togglePublish(i)}>{i.published ? "unpublish" : "publish"}</button>
                <button
                  type="button"
                  className={BTN}
                  disabled={i.status === "live"}
                  title={i.status === "live" ? "Live quizzes can’t be edited" : undefined}
                  onClick={() => { setEditingId(i.id); setTab("editor"); setMessage(null); }}
                >
                  {i.status === "live" ? "locked" : "edit"}
                </button>
                <button type="button" className={BTN} onClick={() => { setAttemptsId(i.id); setTab("attempts"); }}>attempts</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "editor" && (
        editing ? (
          <div>
            {locked && <p role="status" className="mono mb-5 rounded-tr-[24px] bg-sun px-5 py-3 text-[13px] uppercase">This quiz is live. Details and questions can’t be edited.</p>}
            <fieldset disabled={locked} className="m-0 grid min-w-0 gap-4 border-0 p-0 sm:grid-cols-2">
              <div className="sm:col-span-2"><Labeled label="Title"><input className={INPUT} value={editing.title} onChange={(e) => patch(editing.id, { title: e.target.value })} /></Labeled></div>
              <div className="sm:col-span-2">
                <Labeled label="Description">
                  <textarea rows={3} className="w-full rounded-[16px] border-[3px] border-ink bg-white p-4 font-semibold disabled:opacity-60" value={editing.description} onChange={(e) => patch(editing.id, { description: e.target.value })} />
                </Labeled>
              </div>
              <Labeled label="Category"><input className={INPUT} value={editing.category} onChange={(e) => patch(editing.id, { category: e.target.value })} /></Labeled>
              <Labeled label="Difficulty">
                <select className={INPUT} value={editing.difficulty} onChange={(e) => patch(editing.id, { difficulty: e.target.value as Difficulty })}>
                  <option value="easy">easy</option>
                  <option value="medium">medium</option>
                  <option value="hard">hard</option>
                </select>
              </Labeled>
              <Labeled label="Marks per question"><input type="number" min={1} className={INPUT} value={editing.marksPerQuestion} onChange={(e) => patch(editing.id, { marksPerQuestion: Math.max(1, Number(e.target.value) || 1) })} /></Labeled>
              <Labeled label="Seconds per question"><input type="number" min={5} className={INPUT} value={editing.secondsPerQuestion} onChange={(e) => patch(editing.id, { secondsPerQuestion: Math.max(5, Number(e.target.value) || 5) })} /></Labeled>
              <Labeled label="Opens (availability start)"><input className={INPUT} placeholder="Nov 5, 9:00 AM" value={editing.startsAt} onChange={(e) => patch(editing.id, { startsAt: e.target.value })} /></Labeled>
              <Labeled label="Closes (availability end)"><input className={INPUT} placeholder="Nov 12, 11:59 PM" value={editing.endsAt} onChange={(e) => patch(editing.id, { endsAt: e.target.value })} /></Labeled>

              <div className="mt-4 sm:col-span-2">
                <p className="mono mb-3 text-sm uppercase">
                  Questions ({editing.questions.length}) · {totalMarks(editing)} marks · {formatTime(totalSeconds(editing))} total
                </p>
                {editing.questions.map((x, qi) => (
                  <div key={qi} className="mb-4 rounded-tr-[60px] border-[3px] border-ink bg-white p-5">
                    <Labeled label={`Question ${qi + 1}`}>
                      <input className={INPUT} value={x.q} onChange={(e) => setQuestion(qi, { q: e.target.value })} />
                    </Labeled>
                    <p className="mono mb-2 mt-4 text-[12px] uppercase">Options. Select the correct one.</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {x.options.map((o, oi) => (
                        <div key={oi} className="flex items-center gap-3">
                          <input type="radio" name={`correct-${qi}`} checked={x.answer === oi} onChange={() => setQuestion(qi, { answer: oi })} aria-label={`Option ${LETTERS[oi]} is correct`} className="size-5 accent-ink" />
                          <input aria-label={`Option ${LETTERS[oi]}`} placeholder={`Option ${LETTERS[oi]}`} className={INPUT} value={o} onChange={(e) => setOption(qi, oi, e.target.value)} />
                        </div>
                      ))}
                    </div>
                    <button type="button" className="mono mt-4 text-[13px] uppercase underline" onClick={() => patch(editing.id, { questions: editing.questions.filter((_, k) => k !== qi) })}>
                      remove question
                    </button>
                  </div>
                ))}
                <button type="button" className={BTN} onClick={() => patch(editing.id, { questions: [...editing.questions, blankQuestion()] })}>+ add question</button>
              </div>
            </fieldset>
            <button type="button" onClick={() => setTab("quizzes")} className="display mt-8 rounded-full bg-sun px-8 py-3 text-2xl">done</button>
            <p className="mono mt-3 text-[12px] uppercase">Changes are kept on this screen only until the backend is connected.</p>
          </div>
        ) : (
          <p className="text-xl">Pick a quiz to edit from the quizzes tab, or create a new one.</p>
        )
      )}

      {tab === "attempts" && (
        <div>
          <div className="mb-6 max-w-[420px]">
            <Labeled label="Quiz">
              <select className={INPUT} value={attemptsId} onChange={(e) => setAttemptsId(e.target.value)}>
                {items.map((i) => <option key={i.id} value={i.id}>{i.title || "untitled quiz"}</option>)}
              </select>
            </Labeled>
          </div>
          {rows.length === 0 ? (
            <p className="rounded-tr-[60px] bg-sun px-6 py-4 text-lg font-semibold">No attempts yet for this quiz.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="mono border-b-[3px] border-ink text-[12px] uppercase">
                    <th className="py-2 pr-4">Rank</th><th className="py-2 pr-4">Participant</th><th className="py-2 pr-4">Attempts</th><th className="py-2 pr-4">Best score</th><th className="py-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.name} className="border-b border-ink">
                      <td className="display py-3 pr-4 text-3xl">{i + 1}</td>
                      <td className="py-3 pr-4 font-semibold">{r.name}</td>
                      <td className="mono py-3 pr-4">{r.tries}</td>
                      <td className="mono py-3 pr-4">{r.score} / {max}</td>
                      <td className="mono py-3">{formatTime(r.seconds)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {attemptsQuiz && (
            <Link href={`/quizzes/${attemptsQuiz.id}/leaderboard`} className="display mt-6 inline-block rounded-full border-[3px] border-ink px-7 py-2.5 text-2xl">view leaderboard</Link>
          )}
        </div>
      )}

      {tab === "roles" && (
        <div>
          <ul className="border-t-[3px] border-ink">
            {members.map((m) => (
              <li key={m.email} className="flex flex-wrap items-center gap-4 border-b border-ink py-4">
                <span className="flex-[1_1_240px]">
                  <span className="block text-xl font-semibold">{m.name}</span>
                  <span className="mono text-[12px]">{m.email}</span>
                </span>
                <label className="flex items-center gap-3">
                  <span className="mono text-[12px] uppercase">Role</span>
                  <select
                    className="h-11 rounded-[14px] border-[3px] border-ink bg-white px-3 font-semibold"
                    value={m.role}
                    onChange={(e) => setMembers((list) => list.map((x) => (x.email === m.email ? { ...x, role: e.target.value as Role } : x)))}
                  >
                    <option value="admin">admin</option>
                    <option value="editor">editor</option>
                    <option value="viewer">viewer</option>
                  </select>
                </label>
              </li>
            ))}
          </ul>
          <ul className="mono mt-6 space-y-1.5 text-[12px] uppercase">
            <li>admin: full access, including role management</li>
            <li>editor: create and edit quizzes, publish, view results</li>
            <li>viewer: view quizzes, attempts and leaderboards</li>
          </ul>
          <p className="mono mt-3 text-[12px] uppercase">Roles are saved on this screen only until the backend is connected.</p>
        </div>
      )}
    </section>
  );
}