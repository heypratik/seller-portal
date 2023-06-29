"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "../shadcn/components/ui/checkbox"
import { BsPencil, BsTrash3Fill } from 'react-icons/bs'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string
    status: "Available" | "Out of Stock"
    img: string
    prodId: number
    prodName: string
    quantity: number
    priceShipping: number
    fee: number
    category: string
}

export const columns: ColumnDef<Payment>[] = [
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
        accessorKey: "status",
        header: "Status",
    },
    {
        id: "img",
        header: ({ table }) => (
            <>Image</>
        ),
        cell: ({ row }) => (
            <img width="50" height="50" src={row.getValue("img")} alt="Imagee" />
        ),
        enableSorting: false,
        enableHiding: false,
        accessorKey: "img",

    },
    {
        accessorKey: "prodId",
        header: "Product ID",
    },
    {
        accessorKey: "prodName",
        header: "Product Name",
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },
    {
        accessorKey: "priceShipping",
        header: "Price + Shipping",
    },
    {
        accessorKey: "fee",
        header: "Fee",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        id: "actions",
        header: () => <>Actions</>,
        cell: ({ row }) => (
            <div className="flex items-center">
                <BsPencil fontSize={"16px"} className="mr-3 cursor-pointer" onClick={() => console.log(row.getValue("email"))} />
                <BsTrash3Fill fontSize={"16px"} className="cursor-pointer" onClick={() => console.log(row.getValue("email"))} />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
];