"use client";

import { App } from "@/App";
import { AppProvider } from "@/contexts/AppProvider";

export default function Home() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
