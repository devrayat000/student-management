import bricks from "sql-bricks";
import { db } from "~/lib/utils";

export async function exportData() {
  const { text, values } = bricks
    .select()
    .from("sqlite_master")
    .where({ type: "table" }, bricks.not(bricks.like("name", "sqlite_%")))
    .toParams();
  const tables = await db().select<{ name: string }[]>(text, values);

  const result = await Promise.all(
    tables.map(async ({ name }) => {
      const { text, values } = bricks.select().from(name).toParams();
      const data = await db().select<any[]>(text, values);
      return { name, data };
    })
  );

  const data: Record<string, any[]> = {};
  for (const iterator of result) {
    data[iterator.name] = iterator.data;
  }
  return data;
}

export async function importData(data: Record<string, any[]>) {
  let queries = [];
  for (const table in data) {
    if (Object.prototype.hasOwnProperty.call(data, table)) {
      const inputs = data[table];
      const { text, values } = bricks.insert(table, ...inputs).toParams();
      queries.push(db().execute(text, values));
    }
  }

  await Promise.all(queries);
}
