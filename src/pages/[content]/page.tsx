import { Suspense, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import useSWR from "swr";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LuArrowUpDown, LuEye } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineEdit } from "react-icons/ai";

import ListLayout from "../ListLayout";
import { IClass } from "~/database/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import DeletePrompt from "~/components/common/DeletePrompt";
import Spinner from "~/components/common/Spinner";
import capitalize from "capitalize";
import { contentKeys, contents } from "./utils";
import { singular } from "pluralize";

export const columns: ColumnDef<IClass>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
          Class Name
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const clz = row.original;
      const { content } = useParams();

      return (
        <div className="flex gap-1 items-center">
          <Button size="icon" variant="outline" asChild className="h-8 w-10">
            <Link to={clz.id.toString()}>
              <LuEye className="w-3.5 h-3.5 text-slate-700" />
            </Link>
          </Button>
          <Button size="icon" variant="outline" asChild className="h-8 w-10">
            <Link to={`${clz.id.toString()}/edit`}>
              <AiOutlineEdit className="w-3.5 h-3.5 text-slate-700" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="outline"
            asChild
            className="h-8 w-10 border-red-200 hover:bg-red-300/10"
          >
            <DeletePrompt
              element={singular(content!)}
              itemId={clz.id}
              onDelete={contents[content! as keyof typeof contents].delete}
            >
              <RiDeleteBin6Line className="w-3.5 h-3.5 text-red-500" />
            </DeletePrompt>
          </Button>
        </div>
      );
    },
  },
];

export default function ContentsPage() {
  const { content } = useParams();

  if (!content || !contentKeys.includes(content)) {
    return <Navigate to="/" />;
  }

  return (
    <ListLayout title={capitalize(content)}>
      <Suspense fallback={<Spinner />}>
        <ContentsPageInner />
      </Suspense>
    </ListLayout>
  );
}

function ContentsPageInner() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const { content } = useParams();
  const { data } = useSWR(
    [content],
    contents[content! as keyof typeof contents].readAll,
    {
      suspense: true,
    }
  );
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder={`Filter ${content}...`}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
