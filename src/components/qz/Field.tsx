"use client";

import { useState } from "react";

type Props = {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
};

export default function Field({ id, label, type = "text", placeholder, value, onChange, error, autoComplete }: Props) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="mt-5">
      <div className="mb-2 flex items-end justify-between">
        <label htmlFor={id} className="mono text-[13px] uppercase">
          {label}
        </label>
        {isPassword && (
          <button type="button" onClick={() => setShow((s) => !s)} className="mono text-[13px] uppercase underline">
            {show ? "hide" : "show"}
          </button>
        )}
      </div>
      <input
        id={id}
        type={isPassword && show ? "text" : type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-[60px] w-full rounded-[20px] border-[3px] border-ink bg-white px-5 text-lg font-semibold placeholder:font-normal placeholder:text-muted-foreground"
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 rounded-tr-[20px] bg-tomato px-4 py-2 text-sm font-semibold text-ink">
          {error}
        </p>
      )}
    </div>
  );
}