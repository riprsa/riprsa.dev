import type { ReactNode } from "react";

export interface RowProps {
  children: ReactNode;
}

export function Row({ children }: RowProps) {
  return <div className="flex flex-row gap-2">{children}</div>;
}


