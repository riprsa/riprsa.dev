import { createRoot } from "react-dom/client";
import { App } from "@/App";
import "@/index.css";
import { AppProvider } from "@/contexts/AppProvider";

function start() {
  const root = createRoot(document.getElementById("root")!);
  root.render(
    <AppProvider>
      <App />
    </AppProvider>
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
