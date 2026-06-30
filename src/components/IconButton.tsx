import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
  active?: boolean;
};

export function IconButton({ icon, label, active, className = "", ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`icon-button ${active ? "is-active" : ""} ${className}`}
      {...props}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
