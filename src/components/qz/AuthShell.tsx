import type { ReactNode } from "react";

type Props = {
  side: string; // Tailwind classes for the colored panel, e.g. "bg-ink text-white"
  big: ReactNode;
  children: ReactNode;
};

export default function AuthShell({ side, big, children }: Props) {
  return (
    <div className="flex flex-wrap">
      <div className={`flex min-h-[320px] flex-[1_1_420px] items-end rounded-tr-[240px] p-8 sm:min-h-[640px] sm:p-12 ${side}`}>
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