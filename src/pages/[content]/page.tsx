import { Suspense, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
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
  Body1,
  Button,
  Checkbox,
  Input,
  makeStyles,
  SearchBox,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  tokens,
} from "@fluentui/react-components";
import capitalize from "capitalize";
import { contentKeys, contents } from "./utils";
import { singular } from "pluralize";
import {
  ArrowLeft16Filled,
  ArrowLeft16Regular,
  ArrowRight16Filled,
  ArrowRight16Regular,
  bundleIcon,
  ChevronUpDown16Filled,
  ChevronUpDown16Regular,
  Delete16Filled,
  Delete16Regular,
  Edit16Filled,
  Edit16Regular,
  Eye16Filled,
  Eye16Regular,
} from "@fluentui/react-icons";
import { ask } from "@tauri-apps/plugin-dialog";

const ArrowUpDown = bundleIcon(ChevronUpDown16Filled, ChevronUpDown16Regular);
const ArrowLeft = bundleIcon(ArrowLeft16Filled, ArrowLeft16Regular);
const ArrowRight = bundleIcon(ArrowRight16Filled, ArrowRight16Regular);
const Eye = bundleIcon(Eye16Filled, Eye16Regular);
const Edit = bundleIcon(Edit16Filled, Edit16Regular);
const Delete = bundleIcon(Delete16Filled, Delete16Regular);

const useStyles = makeStyles({
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
  Awaited<ReturnType<typeof contents.classes.readAll>>[number]
>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onChange={(_, data) => table.toggleAllPageRowsSelected(!!data.checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(_, data) => row.toggleSelected(!!data.checked)}
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
          appearance="subtle"
          icon={<ArrowUpDown />}
          iconPosition="after"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Class Name
        </Button>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const clz = row.original;
      const navigate = useNavigate();
      const classes = useStyles();

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
  const classes = useStyles();

  return (
    <div>
      <div className={classes.searchContainer}>
        <SearchBox
          placeholder={`Filter ${content}...`}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(_, data) =>
            table.getColumn("name")?.setFilterValue(data.value)
          }
          className={classes.search}
        />
      </div>
      <div>
        <Table>
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
                  className="h-24 text-center"
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
