import Database from "tauri-plugin-sql";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import sql from "./sql";
import { batches, classes, payments, students } from "../database/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function initialize() {
  const db = await Database.load("sqlite:test.db");

  await db.execute(sql`
        ${classes}

        ${batches}
        
        ${students}

        ${payments}
    `);
}

export async function destroy() {
  await Database.get("sqlite:test.db").close();
}

export const db = () => Database.get("sqlite:test.db");
