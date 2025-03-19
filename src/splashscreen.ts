import { invoke } from "@tauri-apps/api/core";
import { initialize } from "./lib/utils";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Initialized");
  // await initialize();
  await invoke("close_splashscreen");
});
