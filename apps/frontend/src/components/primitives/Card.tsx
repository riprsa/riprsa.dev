import type { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * Card component - reusable container with consistent styling
 */
export function Card({ children, className = "", id }: CardProps) {
  return (
    <div
      id={id}
      className={`rounded-lg p-3 text-left ${className}`}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {children}
    </div>
  );
}
