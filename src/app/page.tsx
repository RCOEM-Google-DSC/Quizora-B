import Link from "next/link";

const slabs = [
  { k: "A", title: "join a quiz", text: "Pick a quiz and take your seat. The clock starts when you do.", href: "/quizzes", cls: "bg-cobalt text-white slab-tl qz-slab-a" },
  { k: "B", title: "host a quiz", text: "Create an account to build questions and open a live session.", href: "/register", cls: "bg-tomato text-ink slab-tr qz-slab-b" },
  { k: "C", title: "see who’s winning", text: "The live leaderboard, updated as every answer lands.", href: "/leaderboard", cls: "bg-sun text-ink slab-bl qz-slab-c" },
  { k: "D", title: "log in / sign up", text: "Keep your scores, your history and your quizzes.", href: "/login", cls: "bg-ink text-white slab-br qz-slab-d" },
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-[1200px] overflow-hidden px-8 pb-24 pt-8">
        <p className="mono mb-4 text-sm">Q1.</p>
        <h1 className="display mb-12" style={{ fontSize: "clamp(3.75rem, 10.5vw, 9.25rem)" }}>
          <span className="qz-up">what do you</span>
          <span className="qz-up" style={{ animationDelay: "150ms" }}>want to do?</span>
        </h1>
        <div className="flex flex-wrap gap-3">
          {slabs.map((s) => (
            <Link
              key={s.k}
              href={s.href}
              className={`flex min-h-[260px] flex-[1_1_320px] flex-col justify-between p-7 transition-transform hover:-translate-y-1.5 sm:px-8 ${s.cls}`}
            >
              <div className="flex justify-between">
                <span className="display text-[120px] leading-none">{s.k}</span>
                <span className="mono text-3xl" aria-hidden="true">→</span>
              </div>
              <div>
                <div className="display text-[44px]">{s.title}</div>
                <p className="mt-2 max-w-[300px] text-[17px] leading-snug">{s.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-[1200px] px-8 py-24">
          <p className="mono mb-6 text-sm uppercase">Q2. How does it work?</p>
          <p className="display" style={{ fontSize: "clamp(3rem, 8.4vw, 7.5rem)", lineHeight: 1.05 }}>
            Enter a <span className="rounded-[0.2em] bg-sun px-[0.15em] text-ink">code.</span>
            <br />
            Beat the <span className="rounded-[0.2em] bg-tomato px-[0.15em] text-ink">clock.</span>
            <br />
            Watch the <span className="rounded-[0.2em] bg-mint px-[0.15em] text-ink">board</span> move.
          </p>
          <p className="mono mt-10 max-w-[420px] text-sm uppercase leading-relaxed text-concrete">
            One answer per question. Deadlines are checked on the server, so everyone plays fair.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-8 py-24">
        <p className="mono mb-4 text-sm">Q3.</p>
        <h2 className="display mb-10" style={{ fontSize: "clamp(3.75rem, 10.5vw, 9.25rem)" }}>ready?</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/quizzes" className="display inline-flex items-center gap-5 rounded-full bg-sun py-5 pl-5 pr-10 text-4xl">
            <span className="flex size-14 items-center justify-center rounded-full bg-ink text-3xl text-sun">A</span>
            yes, let’s go
          </Link>
          <Link href="/leaderboard" className="display inline-flex items-center gap-5 rounded-full border-[3px] border-ink py-4 pl-4 pr-10 text-4xl">
            <span className="flex size-14 items-center justify-center rounded-full bg-ink text-3xl text-paper">B</span>
            show me the board
          </Link>
        </div>
      </section>
    </>
  );
}