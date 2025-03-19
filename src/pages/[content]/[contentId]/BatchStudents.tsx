import { useState } from "react";
import { Link, useParams } from "react-router";
import useSWR from "swr";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LuArrowUpDown, LuEye, LuPrinter } from "react-icons/lu";
import { AiOutlineEdit } from "react-icons/ai";

import { IStudentWithClassAndBatch } from "~/database/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import * as student from "~/database/actions/student";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

export const columns: ColumnDef<IStudentWithClassAndBatch>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student Name
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "phone",
    enableSorting: false,
    header: "Phone",
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    enableSorting: false,
    cell: ({ row }) => {
      const status = row.original.paymentStatus;

      return (
        <Badge
          aria-disabled
          className={cn(
            status === "unpaid"
              ? "bg-red-500 hover:bg-red-500"
              : "bg-green-500 hover:bg-green-500"
          )}
        >
          {status.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const clz = row.original;

      return (
        <div className="flex gap-1 items-center">
          <Button size="icon" variant="outline" asChild className="h-8 w-10">
            <Link to={`/students/${clz.id.toString()}`}>
              <LuEye className="w-3.5 h-3.5 text-slate-700" />
            </Link>
          </Button>
          <Button size="icon" variant="outline" asChild className="h-8 w-10">
            <Link to={`/students/${clz.id.toString()}/edit`}>
              <AiOutlineEdit className="w-3.5 h-3.5 text-slate-700" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];

export default function BatchStudents() {
  const { contentId } = useParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data } = useSWR(
    ["batches", contentId, "students"],
    ([, id]) => student.readByBatch(id),
    {
      suspense: true,
    }
  );
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  async function printAttendenceSheet() {
    new WebviewWindow("attendence_sheet", {
      url: `/#/attendence?batchId=${contentId}`,
    });
  }

  return (
    <div className="mt-10">
      <div className="relative">
        <h3 className="text-3xl font-semibold text-center">
          Student's of this Batch
        </h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="absolute top-1/2 -translate-y-1/2 right-6 text-slate-700"
                onClick={printAttendenceSheet}
              >
                <span className="mr-1">Print</span>
                <LuPrinter className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Print attendence sheet</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mt-5">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
