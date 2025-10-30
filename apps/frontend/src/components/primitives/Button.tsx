import type { MouseEvent } from "react";

export interface ButtonProps {
  label: string;
  title?: string;
  onClick?: (ev: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button(props: ButtonProps) {
  const {
    label,
    title,
    onClick,
    className = "",
    disabled = false,
    id,
    variant = "primary",
    size = "medium",
    loading = false,
    type = "button",
  } = props;

  const baseClasses =
    "inline-flex items-center gap-4 px-2 py-1 text-xs leading-tight rounded-lg border text-white cursor-pointer font-inherit transition-all";

  const variantClasses = {
    primary:
      "border-white/18 bg-amber-700 hover:bg-amber-600 hover:border-white/28",
    secondary:
      "border-white/18 bg-white/8 hover:bg-white/12 hover:border-white/28",
    danger:
      "border-red-500/50 bg-red-700 hover:bg-red-700 hover:border-red-400",
    warning:
      "border-yellow-500/50 bg-yellow-700 hover:bg-yellow-700 hover:border-yellow-400",
    success:
      "border-green-500/50 bg-green-600 hover:bg-green-700 hover:border-green-400",
  } as const;

  const sizeClasses = {
    small: "px-1.5 py-0.5 text-xs",
    medium: "px-2 py-1 text-xs",
    large: "px-3 py-2 text-sm",
  } as const;

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    loading ? "opacity-60 cursor-not-allowed bg-gray-600" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      id={id}
      className={classes}
      title={title}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? "Loading..." : label}
    </button>
  );
}


