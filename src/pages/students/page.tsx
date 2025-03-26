import { Suspense, useState } from "react";
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

import ListLayout from "../ListLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Button,
  Checkbox,
  Input,
  makeStyles,
  Body1,
  tokens,
  SearchBox,
  Spinner,
} from "@fluentui/react-components";
import {
  ArrowLeft12Regular,
  ArrowLeft16Filled,
  ArrowLeft16Regular,
  ArrowRight12Regular,
  ArrowRight16Filled,
  ArrowRight16Regular,
  bundleIcon,
  ChevronUpDown20Filled,
  ChevronUpDown20Regular,
  Delete16Filled,
  Delete16Regular,
  Edit16Filled,
  Edit16Regular,
  Eye16Filled,
  Eye16Regular,
} from "@fluentui/react-icons";
import * as student from "~/database/actions/student";
import { ask } from "@tauri-apps/plugin-dialog";
import { useNavigate } from "react-router";

const Eye = bundleIcon(Eye16Filled, Eye16Regular);
const Edit = bundleIcon(Edit16Filled, Edit16Regular);
const Delete = bundleIcon(Delete16Filled, Delete16Regular);
const ChevronUpDown = bundleIcon(ChevronUpDown20Filled, ChevronUpDown20Regular);
const ArrowLeft = bundleIcon(ArrowLeft16Filled, ArrowLeft16Regular);
const ArrowRight = bundleIcon(ArrowRight16Filled, ArrowRight16Regular);

const useStyles = makeStyles({
  container: {},
  searchContainer: {
    display: "flex",
    alignItems: "center",
    paddingTop: "1rem",
    paddingBottom: "1rem",
  },
  search: {
    flex: 1,
    maxWidth: "400px",
  },
  title: {
    fontWeight: 500,
    marginBottom: "0.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  },
  card: {
    width: "360px",
    maxWidth: "100%",
    height: "fit-content",
  },
  text: { margin: 0 },
  actionContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.5rem",
  },
  deleteAction: {
    backgroundColor: tokens.colorStatusDangerForeground3,
    color: tokens.colorStatusDangerBackground1,
    ":hover": {
      backgroundColor: tokens.colorStatusDangerForegroundInverted,
    },
    ":hover:active": {
      backgroundColor: tokens.colorStatusDangerForeground2,
    },
  },
  noResult: {
    height: "6rem",
    textAlign: "center",
  },
  controlContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1rem",
    columnGap: "0.5rem",
    paddingBottom: "1rem",
    paddingTop: "1rem",
  },
  stat: {
    color: tokens.colorNeutralForeground1Static,
  },
  paginationContainer: {
    display: "flex",
    gap: "0.5rem",
  },
});

export const columns: ColumnDef<
  Awaited<ReturnType<typeof student.readAll>>[number]
>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(!!e.target.checked)}
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
    size: 500,
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          icon={<ChevronUpDown />}
          iconPosition="after"
          appearance="subtle"
        >
          Student Name
        </Button>
      );
    },
  },
  {
    accessorKey: "class",
    header: ({ column }) => {
      return (
        <Button
          appearance="subtle"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          icon={<ChevronUpDown />}
          iconPosition="after"
        >
          Class
        </Button>
      );
    },
  },
  {
    accessorKey: "batch",
    header: ({ column }) => {
      return (
        <Button
          appearance="subtle"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          icon={<ChevronUpDown />}
          iconPosition="after"
        >
          Batch
        </Button>
      );
    },
  },
  // {
  //   accessorKey: "paymentStatus",
  //   header: "Payment",
  //   enableSorting: false,
  //   cell: ({ row }) => {
  //     const status = row.original.paymentStatus;

  //     return (
  //       <span
  //         className={cn(
  //           "px-2 py-1 bg-red-200 text-red-800 rounded-md text-xs inline-flex items-center font-medium",
  //           status === "unpaid"
  //             ? "bg-red-200 text-red-800"
  //             : "bg-green-200 text-green-800"
  //         )}
  //       >
  //         <svg
  //           className="w-3 h-3 inline-block mr-1"
  //           fill="none"
  //           height="24"
  //           stroke="currentColor"
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           strokeWidth="2"
  //           viewBox="0 0 24 24"
  //           width="24"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
  //           <path d="M7 7h.01" />
  //         </svg>
  //         {status.toUpperCase()}
  //       </span>
  //     );
  //   },
  // },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const clz = row.original;
      const classes = useStyles();
      const navigate = useNavigate();

      return (
        <div className={classes.actionContainer}>
          <Button icon={<Eye />} onClick={() => navigate(`./${clz.id}`)} />
          <Button
            icon={<Edit />}
            onClick={() => navigate(`./${clz.id?.toString()}/edit`)}
          />
          <Button
            icon={<Delete />}
            className={classes.deleteAction}
            onClick={async () => {
              await ask(
                `This action cannot be undone. This will permanently delete the ${clz.id}.`,
                {
                  cancelLabel: "Cancel",
                  okLabel: "Continue",
                  kind: "warning",
                  title: "Are you absolutely sure?",
                }
              );

              // if (yes) {
              //   await student.remove(clz.id);
              // }
            }}
          />
        </div>
      );
    },
  },
];

export default function StudentsPage() {
  return (
    <ListLayout title="Students">
      <Suspense fallback={<Spinner />}>
        <StudentsPageInner />
      </Suspense>
    </ListLayout>
  );
}

function StudentsPageInner() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const { data } = useSWR(["students"], student.readAll, {
    suspense: true,
  });
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
  const classes = useStyles();

  return (
    <div>
      <div className={classes.searchContainer}>
        <SearchBox
          placeholder="Filter students..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(_, data) =>
            table.getColumn("name")?.setFilterValue(data.value)
          }
          className={classes.search}
        />
      </div>
      <div>
        <Table arial-label="Students list table">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHeaderCell key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHeaderCell>
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
                  className={classes.noResult}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className={classes.controlContainer}>
        <Body1 className={classes.stat}>
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </Body1>
        <div className={classes.paginationContainer}>
          <Button
            appearance="outline"
            size="medium"
            onClick={table.previousPage}
            disabled={!table.getCanPreviousPage()}
            icon={<ArrowLeft />}
          >
            Previous
          </Button>
          <Button
            appearance="outline"
            size="medium"
            onClick={table.nextPage}
            disabled={!table.getCanNextPage()}
            icon={<ArrowRight />}
            iconPosition="after"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
