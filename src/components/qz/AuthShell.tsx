import type { ReactNode } from "react";

type Props = {
  side: string; // Tailwind classes for the colored panel, e.g. "bg-ink text-white"
  big: ReactNode;
  children: ReactNode;
};

export default function AuthShell({ side, big, children }: Props) {
  return (
    // min-h makes the page at least as tall as the screen under the navbar.
    // -mb-24 cancels the footer's top margin, so the colored panel runs down to the footer.
    <div className="-mb-24 flex min-h-[calc(100svh-75px)] flex-wrap">
      <div className={`flex min-h-[320px] flex-[1_1_420px] items-end rounded-tr-[240px] p-8 sm:p-12 ${side}`}>
        <div className="display" style={{ fontSize: "clamp(4rem, 9vw, 8rem)" }}>
          {big}
        </div>
      </div>
      <div className="flex-[1_1_480px] px-6 py-12 sm:px-12 sm:py-16">
        <div className="mx-auto max-w-[440px]">{children}</div>
      </div>
    </div>
  );
}