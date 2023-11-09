import Database from "tauri-plugin-sql";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import sql from "./sql";
import { batches, classes, payments, students } from "../database/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DATABASE = "sqlite:stdmngmt.db";

export async function initialize() {
  const db = await Database.load(DATABASE);

  await db.execute(sql`
        ${classes}

        ${batches}
        
        ${students}

        ${payments}
    `);
}

export async function load() {
  await Database.load(DATABASE);
}

export async function destroy() {
  await Database.get(DATABASE).close();
}

export const db = () => Database.get(DATABASE);

export enum Month {
  January = "1",
  February = "2",
  March = "3",
  April = "4",
  May = "5",
  June = "6",
  July = "7",
  August = "8",
  September = "9",
  October = "10",
  November = "11",
  December = "12",
}
