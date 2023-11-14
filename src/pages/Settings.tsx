import { LuChevronRight, LuSettings } from "react-icons/lu";
import * as Papa from "papaparse";
import { save, open } from "@tauri-apps/api/dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { downloadDir } from "@tauri-apps/api/path";
import useSWRMutation from "swr/mutation";

import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
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
  await importData(parsedData);
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

  await writeTextFile(fpath, encrypted);
}

export default function Settings() {
  const { trigger: exportToBackup, isMutating: isExporting } = useSWRMutation(
    ["export"],
    exportCSV
  );
  const { trigger: importFromBackup, isMutating: isImporting } = useSWRMutation(
    ["import", "students", "classes", "batches", "payments"],
    importCSV
  );

  return (
    <Popover modal>
      <PopoverTrigger
        type="button"
        className="w-full flex items-center gap-x-2 hover:bg-gray-200 py-2 px-2 rounded-lg text-gray-500"
      >
        <LuSettings className="w-4 h-4" />
        <span className="text-sm font-medium flex-1 text-left">Settings</span>
        <LuChevronRight className="w-4 h-4" />
      </PopoverTrigger>
      <PopoverContent side="right" align="end" className="w-min p-2">
        <div className="w-[200px] flex flex-col gap-1.5">
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => exportToBackup()}
            disabled={isExporting || isImporting}
          >
            Export
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => importFromBackup()}
            disabled={isImporting || isExporting}
          >
            Import
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
