import { Suspense, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { WebviewWindow } from "@tauri-apps/api/window";
import useSWR from "swr";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import * as student from "~/database/actions/student";
import { IStudentWithClassAndBatch } from "~/database/schema";

export const columns: ColumnDef<IStudentWithClassAndBatch>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Student's Name",
  },
  {
    accessorKey: "phone",
    enableSorting: false,
    header: "Phone",
  },
];

export default function AttendencePage() {
  return (
    <Suspense>
      <AttendencePageInner />
    </Suspense>
  );
}

function AttendencePageInner() {
  const [params] = useSearchParams();
  const batchId = params.get("batchId");

  const { data } = useSWR(
    ["batches", batchId, "students"],
    ([, id]) => student.readByBatch(id || undefined),
    {
      suspense: true,
    }
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const win = WebviewWindow.getByLabel("attendence_sheet");
    if (!batchId) {
      win?.close();
    }

    function closeAfterPrint() {
      win?.close();
    }

    window.addEventListener("afterprint", closeAfterPrint);
    window.print();

    return () => {
      window.removeEventListener("afterprint", closeAfterPrint);
    };
  }, []);

  if (!batchId) {
    return null;
  }
  return (
    <div>
      <table className="print:w-full border border-black border-collapse mt-3">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className="py-0.5 px-1.5 border border-black border-collapse"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="py-0.5 px-1.5 border border-black border-collapse"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                No results.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
