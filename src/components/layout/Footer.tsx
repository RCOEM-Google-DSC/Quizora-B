import Link from "next/link";

const links = [
  { href: "/quizzes", label: "Browse Quizzes" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/login", label: "Login" },
];

export function Footer() {
  return (
    <footer className="mt-24 rounded-tr-[160px] bg-ink text-paper">
      <div className="mx-auto max-w-[1200px] px-8 pb-8 pt-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="display text-4xl">
              quizora-b<span className="text-tomato">.</span>
            </Link>
            <p className="max-w-[320px] text-[15px] leading-relaxed text-concrete">
              Challenge yourself, learn something new, and compete with others
              on our interactive quiz platform.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="mono text-[13px] uppercase text-sun">Quick Links</h3>
            <nav className="flex flex-col gap-2.5">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="display w-fit text-2xl underline-offset-4 hover:text-sun hover:underline"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* About */}
          <div className="flex flex-col gap-4">
            <h3 className="mono text-[13px] uppercase text-sun">About</h3>
            <p className="max-w-[340px] text-[15px] leading-relaxed text-concrete">
              Built with Next.js, Tailwind CSS, and shadcn/ui as part of the GDG
              On Campus quiz platform project.
            </p>
          </div>
        </div>

        <div className="mono mt-14 flex flex-col items-center justify-between gap-2 border-t border-concrete/40 pt-6 text-center text-xs text-concrete md:flex-row">
          <p>&copy; 2026 Quizora-B. All rights reserved.</p>
          <p>Made with ❤️ by the team</p>
        </div>
      </div>
    </footer>
  );
}