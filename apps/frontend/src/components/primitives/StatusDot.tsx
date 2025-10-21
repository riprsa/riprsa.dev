/**
 * Status indicator dot component
 */

export type StatusType =
  | "connected"
  | "disconnected"
  | "connecting"
  | "error"
  | "stopped"
  | "retry";

export interface StatusDotProps {
  status: StatusType | string;
  id?: string;
  title?: string;
}

export function StatusDot({ status, id, title }: StatusDotProps) {
  let colorClass = "status-red";

  if (status === "connected") {
    colorClass = "status-green";
  } else if (status === "connecting" || status.startsWith("retry")) {
    colorClass = "status-yellow";
  } else if (
    status === "error" ||
    status === "disconnected" ||
    status === "stopped"
  ) {
    colorClass = "status-red";
  }

  return (
    <span
      id={id}
      className={`status-dot ${colorClass}`}
      title={title || status}
    />
  );
}
