import * as Papa from "papaparse";
import { save, open } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { downloadDir } from "@tauri-apps/api/path";
import useSWRMutation from "swr/mutation";

import { Button } from "@fluentui/react-components";
import { exportData, importData } from "~/database/actions";
import { decrypt, encrypt, getStoredKey } from "~/database/encryption";

async function importCSV() {
  const filePath = await open({
    filters: [{ extensions: ["stmd"], name: "Student Management backup file" }],
    multiple: false,
    defaultPath: await downloadDir(),
  });
  if (!filePath || Array.isArray(filePath)) return;

  const encryptedText = await readTextFile(filePath);
  const file = await decrypt(encryptedText, await getStoredKey());
  const parsedData = await parseCSV(file);
  await importData(parsedData as any);
}

async function parseCSV(csvData: string) {
  const tables = csvData.split("\n\n");
  const data: Record<string, any[]> = {};

  for (const table of tables) {
    const [header, ...rest] = table.split("\n");
    const tableName = header.substring("# Table:".length).trim();
    data[tableName] = Papa.parse(rest.join("\n"), {
      header: true,
      skipEmptyLines: true,
    }).data;
  }

  return data;
}

async function exportCSV() {
  const fpath = await save({
    filters: [{ extensions: ["stmd"], name: "Student Management backup file" }],
    defaultPath: await downloadDir(),
  });
  if (!fpath) return;

  const tables = Object.entries(await exportData());

  const csvContent = tables
    .map(([tableName, tableData]) => {
      const tableCsv = Papa.unparse(tableData as any[], {
        header: true,
      });
      return `# Table: ${tableName}\n${tableCsv}`;
    })
    .join("\n\n");

  const encrypted = await encrypt(csvContent, await getStoredKey());
  console.log("Savin file...");
  await writeTextFile(fpath, encrypted);
}

export default function SettingsPage() {
  const { trigger: exportToBackup, isMutating: isExporting } = useSWRMutation(
    ["export"],
    exportCSV
  );
  const { trigger: importFromBackup, isMutating: isImporting } = useSWRMutation(
    ["import", "students", "classes", "batches", "payments"],
    importCSV
  );

  return (
    <div className="w-[200px] flex flex-col gap-1.5">
      <Button
        appearence="subtle"
        className="w-full"
        onClick={() => exportToBackup()}
        disabled={isExporting || isImporting}
      >
        Export
      </Button>
      <Button
        appearence="subtle"
        className="w-full"
        onClick={() => importFromBackup()}
        disabled={isImporting || isExporting}
      >
        Import
      </Button>
    </div>
  );
}
