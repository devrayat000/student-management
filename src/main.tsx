import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

import { listen } from "@tauri-apps/api/event";
import { destroy } from "./lib/utils";

listen<string>("tauri://destroyed", (event) => {
  console.log(
    `Got error in window ${event.windowLabel}, payload: ${event.payload}`
  );
  return destroy();
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
