import { DataTable } from "./data-table"
import { useEffect, useState } from "react"
import Layout from "../layout"
import toast, { Toaster } from 'react-hot-toast';
import { getSession, useSession } from 'next-auth/react'
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai'
import { FiFilter } from 'react-icons/fi'
import { useRouter } from "next/router";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../shadcn/components/ui/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../../shadcn/components/ui/popover"

import { BsPencil, BsTrash3Fill } from 'react-icons/bs'

interface Data {
    categories: string[]; // Array of categories
    products: Product[]; // Array of products
    currentPage: number; // Current page number
    totalPages: number; // Total number of pages
}

interface Product {
    id: number;
    productName: string;
    productQuantity: number;
    productPrice: number;
    productCost: number;
    productCategory: string;
    productImage: string;
}

export default function Products({ session, sellerData }: any) {
    const router = useRouter();
    const [data, setData] = useState<Data>({
        categories: [], // Initialize with an empty array for categories
        products: [],
        currentPage: 0,
        totalPages: 0,
    });

    const [search, setSearch] = useState('')

    const [parentCheckbox, setParentCheckbox] = useState(false)
    const [childCheckbox, setChildCheckbox] = useState(false)

    const [resultNumber, setResultNumber] = useState(10)
    const [activePageNumber, setActivePageNumber] = useState(1)

    const [statusFilter, setStatusFilter] = useState<string[]>([])
    const [categoryFilter, setCategoryFilter] = useState<string[]>([])

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (categoryFilter.includes(event.target.name)) {
            setCategoryFilter(prevState => prevState.filter((item: any) => item !== event.target.name))
        } else {
            setCategoryFilter(prevState => [...prevState, event.target.name])
        }
    };

    const handleStatusFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (statusFilter.includes(event.target.name)) {
            setStatusFilter(prevState => prevState.filter((item: any) => item !== event.target.name))
        } else {
            if (event.target.name == "all") {
                if (statusFilter.includes("Available") && statusFilter.includes("OS")) {
                    setStatusFilter([])
                } else {
                    setStatusFilter(["Available", "OS"])
                }
            } else {
                setStatusFilter(prevState => [...prevState, event.target.name])
            }
        }
    };

    useEffect(() => {
        if (parentCheckbox) {
            document.querySelectorAll<HTMLInputElement>('input[name="childCheckbox"]').forEach((el) => {
                el.checked = true;
            });
        } else {
            document.querySelectorAll<HTMLInputElement>('input[name="childCheckbox"]').forEach((el) => {
                el.checked = false;
            });
        }
    },
        [parentCheckbox])

    useEffect(() => {
        async function fetchData() {
            const result = await getData()
            setData(result)
        }
        fetchData()
    }, [resultNumber, activePageNumber, categoryFilter, statusFilter, search])

    async function getData() {
        if (search) {
            try {
                const searchPage = search.length == 1 ? 1 : activePageNumber
                if (search.length == 1) {
                    setActivePageNumber(1)
                }
                const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory/products/search/${sellerData.data.id}?searchTerm=${search}&page=${searchPage}&limit=${resultNumber}&productCategory=${categoryFilter.join(',')}&status=${statusFilter.join(',')}`)
                const productsData = await productsResponse.json()
                const products = productsData.data
                return products
            } catch (error) {
                return { currentPage: 1, totalPages: 1, products: [] }
            }

        } else {
            try {
                const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory/products/${sellerData.data.id}?page=${activePageNumber}&limit=${resultNumber}&productCategory=${categoryFilter.join(',')}&status=${statusFilter.join(',')}`)
                const productsData = await productsResponse.json()
                const products = productsData.data
                return products
            } catch (error) {
                return { currentPage: 1, totalPages: 1, products: [] }
            }
        }
    }

    async function handleDelete(productID: number) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory/products/${sellerData.data.id}/${productID}`, {
                method: 'DELETE',
                headers: { "Content-Type": "application/json", },
            })
            const Deletedata = await response.json()
            if (Deletedata.success) {
                notification(true, "Product Deleted");
                setData((prevState) => ({
                    ...prevState,
                    products: (prevState?.products || []).filter((product: Product) => product.id !== productID)
                }));
            } else {
                console.log("Something went wrong")
                notification(false, "Something went wrong");
            }
        } catch (error) {
            console.log(error)
            notification(false, "Something went wrong");
        }
    }

    function notification(success: boolean, message: string | undefined) {
        if (success) {
            toast.success(message!)
        } else {
            toast.error(message || 'An error occurred')
        }

    }

    console.log(data)


    return (
        <Layout>
            <>
                <Toaster position="top-center" reverseOrder={true} />
                <div>
                    <div className="rounded-md border">
                        <div className="py-6 h-screen">
                            <div className="mx-auto px-4 sm:px-6 md:px-8 pb-24 bg-[#f9f9f9]">
                                {/* Replace with your content */}
                                <div className="py-0">
                                    <div className="bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] rounded-lg p-7 ">
                                        <div>
                                            <div className="flex items-center justify-between py-4">
                                                <div className="flex flex-1 justify-start items-center">
                                                    <h1 className=' text-[#F12D4D] text-2xl mr-8 font-semibold'>Inventory</h1>
                                                    <div className="flex items-center bg-[#f9f9f9] px-4 py-2 w-[385px] rounded-md">
                                                        <AiOutlineSearch color="#2a2a2a" fontSize="25px" className=" mr-4" />
                                                        <input
                                                            placeholder="Filter Product..."
                                                            type="text"
                                                            className="w-full bg-[#f9f9f9] border-none outline-none"
                                                            onChange={(e) => { setSearch(e.target.value) }}
                                                        />
                                                    </div>

                                                </div>

                                                <div className="flex-1 flex items-end justify-end">
                                                    <Link href={`/inventory/product-list`}><button className="flex items-center justify-center mr-4 px-5 py-2 bg-[#F12D4D] rounded-md text-white font-semibold">
                                                        <AiOutlinePlus className="mr-2" /> Add Product</button></Link>
                                                    <Popover>
                                                        <PopoverTrigger className="flex items-center justify-center mr-4 px-5 py-2 bg-[#F12D4D] rounded-md text-white font-semibold">
                                                            <FiFilter className="mr-2" /> Filters</PopoverTrigger>
                                                        <PopoverContent>
                                                            <div className="flex flex-col items-center justify-center">
                                                                <div className="flex items-center w-full"><label><input type="checkbox" checked={statusFilter.includes("Available") && statusFilter.includes("OS")} onChange={(e) => handleStatusFilter(e)} name="all" /> All</label></div>
                                                                <div className="mt-2 flex items-center w-full"><label><input type="checkbox" checked={statusFilter.includes("Available")} name="Available" onChange={(e) => handleStatusFilter(e)} /> Available</label></div>
                                                                <div className="mt-2 flex items-center w-full"><label><input type="checkbox" checked={statusFilter.includes("OS")} name="OS" onChange={(e) => handleStatusFilter(e)} /> Out Of Stock</label></div>

                                                                <div className="mt-2 flex items-center w-full"><p className="font-bold text-base my-2">Categories</p></div>
                                                                {data?.categories?.map((category: any, index: number) => (
                                                                    <div key={index} className="mt-1 flex items-center w-full"><label><input type="checkbox" checked={categoryFilter.includes(category)} name={category} onChange={(e) => handleCheckboxChange(e)} /> {category}</label></div>
                                                                ))}
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>

                                                </div>

                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-between min-h-[76vh] relative">
                                            <table className=" mt-10 min-w-full bg-white border rounded-md border-gray-200">
                                                <thead>
                                                    <tr>
                                                        <th className="py-2 px-4 bg-gray-100 border-b text-left"><input type="checkbox" checked={parentCheckbox} onChange={(e) => setParentCheckbox(prevState => !prevState)} name="parentCheckbox" id="parentCheckbox" /></th>
                                                        <th className="py-2 px-4 bg-gray-100 border-b text-left">Status</th>
                                                        <th className="py-2 px-4 bg-gray-100 border-b text-left">Image</th>
                                                        <th className="py-2 px-4 bg-gray-100 border-b text-left">Product ID</th>
                                                        <th className="py-2 px-4 bg-gray-100 border-b text-left">Product Name</th>
                                                        <th className="py-2 px-4 bg-gray-100 border-b text-left">Quantity</th>
                                                        <th className="py-2 px-4 bg-gray-100 border-b text-left">Price</th>
                                                        <th className="py-2 px-4 bg-gray-100 border-b text-left">Fee</th>
                                                        <th className="py-2 px-4 bg-gray-100 border-b text-left">Category</th>
                                                        <th className="py-2 px-4 bg-gray-100 border-b text-left">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data && data?.products?.map((row, index) => (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="py-2 px-4 border-b"><input type="checkbox" value={row.id} name="childCheckbox" id="childCheckbox" /></td>
                                                            <td className="py-2 px-4 border-b">{row.productQuantity > 0 ? 'Available' : 'Out of Stock'}</td>
                                                            <td className="py-2 px-4 border-b">
                                                                <img src={row.productImage} alt="Product" className="w-10 h-10" />
                                                            </td>
                                                            <td className="py-2 px-4 border-b">{row.id}</td>
                                                            <td className="py-2 px-4 border-b">{row.productName}</td>
                                                            <td className="py-2 px-4 border-b">{row.productQuantity}</td>
                                                            <td className="py-2 px-4 border-b">{row.productPrice}</td>
                                                            <td className="py-2 px-4 border-b">{row.productCost}</td>
                                                            <td className="py-2 px-4 border-b">{row.productCategory}</td>
                                                            <td className="py-2 px-4 border-b">
                                                                <div className="flex items-center">
                                                                    <Link href={`/inventory/product-update/${row.id}`}><BsPencil fontSize={"16px"} className="mr-3 cursor-pointer" /></Link>
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <BsTrash3Fill fontSize={"16px"} className="cursor-pointer" />
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <div className="flex flex-col items-center justify-center">
                                                                                    <BsTrash3Fill fontSize={"25px"} className="cursor-pointer mb-4" />
                                                                                    <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
                                                                                </div>
                                                                            </DialogHeader>
                                                                            <div className="flex items-center justify-between mt-4 ">
                                                                                <DialogPrimitive.Close asChild>
                                                                                    <button className="flex-1 mr-2 text-white font-bold rounded-md px-3 py-2 bg-[#F12D4D]" onClick={() => handleDelete(row.id)}>Confirm</button>
                                                                                </DialogPrimitive.Close>
                                                                                <DialogPrimitive.Close asChild>
                                                                                    <button className="flex-1 ml-2 text-gray-400 font-bold rounded-md px-3 py-2 bg-[#F5F5F5]" type="submit">Cancel</button>
                                                                                </DialogPrimitive.Close>
                                                                            </div>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                </div >
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {data?.products && data?.products?.length < 1 && <div className="w-full flex items-center justify-center absolute top-1/4">No Product Data Found</div>}
                                        </div>
                                        <div className="flex items-center justify-between py-4">
                                            <div>
                                                <select onChange={(e) => setResultNumber(Number(e.target.value))} className="border rounded-sm py-1 px-4">
                                                    <option defaultValue={10} value="10">10 Result Per Page</option>
                                                    <option defaultValue={20} value="20">20 Result Per Page</option>
                                                    <option defaultValue={50} value="50">50 Result Per Page</option>
                                                    <option defaultValue={100} value="100">100 Result Per Page</option>
                                                </select>
                                            </div>
                                            <div>
                                                <button onClick={(e) => setActivePageNumber(prevState => prevState - 1)} className="border mr-2 rounded-sm py-1 px-4" disabled={!!data?.currentPage && data?.currentPage == 1}>Previous</button>
                                                <button onClick={(e) => setActivePageNumber(prevState => prevState + 1)} className="border rounded-sm py-1 px-4" disabled={!!data?.currentPage && data?.currentPage == data?.totalPages}> Next </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /End replace */}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </Layout >
    )
}


export async function getServerSideProps({ req }: any) {
    const session = await getSession({ req })

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false,
            },
        }
    }

    // Get the seller data using the email that the user is logged in with
    const sellerResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sellers/seller/${session?.user?.email}`)
    const sellerData = await sellerResponse.json()
    if (!sellerData.success) {
        return {
            redirect: {
                destination: '/auth/signup',
                permanent: false
            }
        }
    }


    return {
        props: { session, sellerData },
    }
}