import Database from "@tauri-apps/plugin-sql";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Store } from "@tauri-apps/plugin-store";
import sql from "./sql";
import * as schema from "../database/schema";
import { drizzle } from "drizzle-orm/sqlite-proxy";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DATABASE = "sqlite:stdmngmt.db";
const sqlite = await Database.load(DATABASE);

export const db = drizzle(
  async (sql, params, method) => {
    let rows: any = [];
    let results = [];

    // If the query is a SELECT, use the select method
    if (isSelectQuery(sql)) {
      rows = await sqlite.select(sql, params).catch((e) => {
        console.error("SQL Error:", e);
        return [];
      });
    } else {
      // Otherwise, use the execute method
      rows = await sqlite.execute(sql, params).catch((e) => {
        console.error("SQL Error:", e);
        return [];
      });
      return { rows: [] };
    }

    rows = rows.map((row: any) => {
      return Object.values(row);
    });

    // If the method is "all", return all rows
    results = method === "all" ? rows : rows[0];

    return { rows: results };
  },
  { logger: true, schema }
);

function isSelectQuery(sql: string): boolean {
  const selectRegex = /^\s*SELECT\b/i;
  return selectRegex.test(sql);
}

export const store = await Store.load(".settings.dat");

export async function initialize() {
  // const db = await Database.load(DATABASE);
  // await db.execute(sql`
  //       ${classes}
  //       ${batches}
  //       ${students}
  //       ${payments}
  //   `);
}

export async function load() {
  await Database.load(DATABASE);
}

export async function destroy() {
  await Database.get(DATABASE).close();
}

// export const db = () => Database.get(DATABASE);

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
