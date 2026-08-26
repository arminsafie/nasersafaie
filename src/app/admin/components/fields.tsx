"use client";

import type { ReactNode } from "react";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#8e9a81]">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-[12px] text-[#726c52]">{hint}</p>}
    </label>
  );
}

const inputClass =
  "w-full min-h-11 border border-[#c7bc9c] bg-white px-3 py-2 text-[14px] text-[#23200f] focus:border-[#a85a2a] focus:outline-none";

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`${inputClass} min-h-[90px] resize-y ${props.className ?? ""}`}
    />
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 border border-[#c7bc9c] bg-[#f2eee0] p-6">
      <h2 className="font-serif text-xl text-[#23200f]">{title}</h2>
      {description && (
        <p className="mt-1 text-[13.5px] text-[#726c52]">{description}</p>
      )}
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  const styles = {
    primary: "bg-[#a85a2a] text-white hover:opacity-90",
    secondary:
      "border border-[#c7bc9c] bg-transparent text-[#23200f] hover:bg-[#e3dcc4]",
    danger: "bg-[#a13c2a] text-white hover:opacity-90",
  }[variant];
  return (
    <button
      {...props}
      className={`touch-manipulation min-h-11 px-3.5 py-2 font-mono text-[11.5px] uppercase tracking-[0.08em] transition-opacity disabled:opacity-40 ${styles} ${className}`}
    />
  );
}
