import * as React from "react"
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai'
import { FiFilter } from 'react-icons/fi'

import {
    ColumnDef,
    getFilteredRowModel,
    ColumnFiltersState,
    getPaginationRowModel,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../shadcn/components/ui/table"

import { Input } from "../../../shadcn/components/ui/input"
import { Button } from "../../../shadcn/components/ui/button"



interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {

    const [rowSelection, setRowSelection] = React.useState({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )


    const table = useReactTable({
        data,
        onRowSelectionChange: setRowSelection,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        columns,
        getCoreRowModel: getCoreRowModel(), state: {
            rowSelection,
            columnFilters
        },
    })

    // function setCheckboxF() {
    //     table.getColumn("prodName")?.setFilterValue("3")
    // }


    return (
        <>
            <div>
                <div>
                    <div className="flex items-center justify-between py-4">
                        <div className="flex flex-1 justify-start items-center">
                            <h1 className=' text-[#F12D4D] text-2xl mr-8 font-semibold'>Inventory</h1>
                            <div className="flex items-center bg-[#f9f9f9] px-4 py-2 w-[385px] rounded-md">
                                <AiOutlineSearch color="#2a2a2a" fontSize="25px" />
                                <Input
                                    placeholder="Filter Product..."
                                    value={(table.getColumn("productName")?.getFilterValue() as string) ?? ""}
                                    onChange={(event) =>
                                        table.getColumn("productName")?.setFilterValue(event.target.value)
                                    }
                                    className="max-w-sm bg-[#f9f9f9] border-none outline-none"
                                />
                            </div>

                        </div>

                        <div className="flex-1 flex items-end justify-end">
                            <button className="flex items-center justify-center mr-4 px-5 py-2 bg-[#F12D4D] rounded-md text-white font-semibold">
                                <AiOutlinePlus className="mr-2" /> Add Product</button>

                            <button className="flex items-center justify-center mr-4 px-5 py-2 bg-[#F12D4D] rounded-md text-white font-semibold">
                                <FiFilter className="mr-2" /> Filters</button>

                        </div>

                    </div>
                </div>
                <div className="rounded-md border">
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
                                        )
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
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
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
        </>
    )
}

export default function Inventory() {

}