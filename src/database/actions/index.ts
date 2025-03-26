import { db } from "~/lib/utils";
import * as schema from "~/database/schema";
import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";

type Schema = {
  [key: string]: SQLiteTableWithColumns<any>;
};
type ExportedData<S extends Schema> = {
  [K in keyof S]: S[K]["$inferSelect"][];
};

export async function exportData() {
  const tables = Object.keys(schema) as (keyof typeof schema)[];

  const result = await Promise.all(
    tables.map(async (name) => {
      const data = await db.select().from(schema[name]);
      return [name, data] as const;
    })
  );

  let dataMap = new Map(result);
  let data = Object.fromEntries(dataMap);
  return data as ExportedData<typeof schema>;
}

export async function importData(data: ExportedData<typeof schema>) {
  let table: keyof typeof schema;
  await db.transaction(async (tx) => {
    for (table in data) {
      if (Object.prototype.hasOwnProperty.call(data, table)) {
        const inputs = data[table];
        await tx.insert(schema[table]).values(inputs).execute();
      }
    }
  });
}
