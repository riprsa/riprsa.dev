export type AlertType = "error" | "info" | "success" | "warning";

export interface AlertOptions {
  type: AlertType;
  message: string;
  duration?: number; // Auto-dismiss after N ms (0 = no auto-dismiss)
  dismissible?: boolean; // Show close button
}

class AlertManager {
  private container: HTMLElement | null = null;
  private alerts: Map<string, HTMLElement> = new Map();

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    // Create container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "alert-container";
      this.container.className =
        "fixed bottom-4 right-4 z-[2000] flex flex-col gap-3 max-w-sm pointer-events-none";
      document.body.appendChild(this.container);
    }
  }

  /**
   * Show an alert banner
   */
  show(options: AlertOptions): string {
    const id = `alert-${Date.now()}-${Math.random()}`;
    const alert = this.createAlert(id, options);

    if (!this.container) {
      return id;
    }

    this.container.appendChild(alert);
    this.alerts.set(id, alert);

    // Trigger animation
    requestAnimationFrame(() => {
      alert.style.transform = "translateX(0)";
      alert.style.opacity = "1";
    });

    // Auto-dismiss
    if (options.duration && options.duration > 0) {
      setTimeout(() => this.dismiss(id), options.duration);
    }

    return id;
  }

  /**
   * Dismiss an alert by ID
   */
  dismiss(id: string): void {
    const alert = this.alerts.get(id);
    if (!alert) return;

    alert.style.transform = "translateX(450px)";
    alert.style.opacity = "0";

    setTimeout(() => {
      alert.remove();
      this.alerts.delete(id);
    }, 300);
  }

  /**
   * Clear all alerts
   */
  clearAll(): void {
    this.alerts.forEach((_, id) => this.dismiss(id));
  }

  /**
   * Get the number of active alerts
   */
  getAlertCount(): number {
    return this.alerts.size;
  }

  private createAlert(id: string, options: AlertOptions): HTMLElement {
    const alert = document.createElement("div");

    // Use inline styles for reliable rendering
    alert.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      border: 2px solid;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transform: translateX(450px);
      opacity: 0;
      transition: all 0.3s ease;
      backdrop-filter: blur(4px);
      pointer-events: auto;
      position: relative;
      z-index: 9999;
      margin-bottom: 12px;
      min-width: 300px;
    `;

    // Add type-specific colors
    const typeColors = this.getAlertInlineStyles(options.type);
    Object.assign(alert.style, typeColors);

    alert.setAttribute("data-alert-id", id);

    const icon = document.createElement("span");
    icon.className = "text-lg flex-shrink-0 font-bold";
    icon.textContent = this.getIcon(options.type);

    const message = document.createElement("span");
    message.className = "flex-1 text-sm font-medium leading-relaxed";
    message.textContent = options.message;

    alert.appendChild(icon);
    alert.appendChild(message);

    if (options.dismissible !== false) {
      const closeBtn = document.createElement("button");
      closeBtn.className =
        "bg-transparent border-none text-lg leading-none p-1 cursor-pointer transition-colors hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent rounded text-gray-400 hover:text-gray-200";
      closeBtn.textContent = "×";
      closeBtn.setAttribute("aria-label", "Dismiss");
      closeBtn.onclick = () => this.dismiss(id);
      alert.appendChild(closeBtn);
    }

    return alert;
  }

  private getAlertInlineStyles(type: AlertType): Partial<CSSStyleDeclaration> {
    switch (type) {
      case "error":
        return {
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          color: "#f87171",
        };
      case "success":
        return {
          borderColor: "#22c55e",
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          color: "#4ade80",
        };
      case "warning":
        return {
          borderColor: "#eab308",
          backgroundColor: "rgba(234, 179, 8, 0.2)",
          color: "#facc15",
        };
      case "info":
        return {
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          color: "#60a5fa",
        };
      default:
        return {
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          color: "#60a5fa",
        };
    }
  }

  private getIcon(type: AlertType): string {
    switch (type) {
      case "error":
        return "✕";
      case "success":
        return "✓";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "ℹ";
    }
  }
}

// Singleton instance
const alertManager = new AlertManager();

/**
 * Show an error alert
 */
export function showError(message: string, duration = 5000): string {
  return alertManager.show({ type: "error", message, duration });
}

/**
 * Show an info alert
 */
export function showInfo(message: string, duration = 3000): string {
  return alertManager.show({ type: "info", message, duration });
}

/**
 * Show a success alert
 */
export function showSuccess(message: string, duration = 3000): string {
  return alertManager.show({ type: "success", message, duration });
}

/**
 * Show a warning alert
 */
export function showWarning(message: string, duration = 4000): string {
  return alertManager.show({ type: "warning", message, duration });
}

/**
 * Dismiss a specific alert
 */
export function dismissAlert(id: string): void {
  alertManager.dismiss(id);
}

/**
 * Clear all alerts
 */
export function clearAllAlerts(): void {
  alertManager.clearAll();
}

/**
 * Show a custom alert
 */
export function showAlert(options: AlertOptions): string {
  return alertManager.show(options);
}

/**
 * Show a loading alert (no auto-dismiss)
 */
export function showLoading(message: string): string {
  return alertManager.show({
    type: "info",
    message,
    duration: 0,
    dismissible: false,
  });
}

/**
 * Update an existing alert message
 */
export function updateAlert(id: string, message: string): void {
  const alert = document.querySelector(`[data-alert-id="${id}"]`);
  if (alert) {
    const messageElement = alert.querySelector("span:not(.text-lg)");
    if (messageElement) {
      messageElement.textContent = message;
    }
  }
}

/**
 * Get the number of active alerts
 */
export function getAlertCount(): number {
  return alertManager.getAlertCount();
}
