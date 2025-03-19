import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import { initialize } from "./lib/utils";
import { getStoredKey } from "./database/encryption";

// initialize()
//   .then(() => getStoredKey())
//   .then(() => {
createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
// });
