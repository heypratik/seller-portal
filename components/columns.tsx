"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "../shadcn/components/ui/checkbox"
import { BsPencil, BsTrash3Fill } from 'react-icons/bs'
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string
    status: "Available" | "Out of Stock"
    productImage: string
    productSku: number
    productName: string
    productQuantity: number
    productPrice: number
    productCost: number
    productCategory: string
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
        id: "productImage",
        header: ({ table }) => (
            <>Image</>
        ),
        cell: ({ row }) => (
            <img width="50" height="50" src={row.getValue("productImage")} alt="Image" />
        ),
        enableSorting: false,
        enableHiding: false,
        accessorKey: "productImage",

    },
    {
        accessorKey: "id",
        header: "Product ID",
    },
    {
        accessorKey: "productName",
        header: "Product Name",
    },
    {
        accessorKey: "productQuantity",
        header: "Quantity",
    },
    {
        accessorKey: "productPrice",
        header: "Price",
    },
    {
        accessorKey: "productCost",
        header: "Fee",
    },
    {
        accessorKey: "productCategory",
        header: "Category",
    },
    {
        id: "actions",
        accessorKey: 'id',
        header: () => <>Actions</>,
        cell: ({ row }) => (
            <div className="flex items-center">
                <Link href={`/inventory/products/${row.getValue("id")}`}><BsPencil fontSize={"16px"} className="mr-3 cursor-pointer" onClick={() => console.log(row.getValue("id"))} /></Link>
                <BsTrash3Fill fontSize={"16px"} className="cursor-pointer" onClick={() => console.log(row.getValue("id"))} />
            </div >
        ),
        enableSorting: false,
        enableHiding: false,
    },
];