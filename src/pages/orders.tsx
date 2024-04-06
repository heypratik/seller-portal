import { useEffect, useState } from "react"
import Layout from "./layout";
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
} from "../../shadcn/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadcn/components/ui/popover"


interface Data {
  orders: Orders[]; // Array of categories
  currentPage: number; // Current page number
  totalPages: number; // Total number of pages
}

interface Orders {
  customerOrderId: number;
  customerName: string;
  fulfillmentStatus: string;
  orderDate: string;
  productPaymentStatus: string;
  productTotal: string;
}

export default function Orders({ session, ordersData, sellerData }: any) {
  const router = useRouter();
  const [data, setData] = useState<Data>({
    orders: [], // Initialize with an empty array for categories
    currentPage: 0,
    totalPages: 0,
  });

  const [search, setSearch] = useState('')

  const [parentCheckbox, setParentCheckbox] = useState(false)
  const [childCheckbox, setChildCheckbox] = useState(false)

  const [resultNumber, setResultNumber] = useState(10)
  const [activePageNumber, setActivePageNumber] = useState(1)

  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [paymentFilter, setPaymentFilter] = useState<string[]>([])
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
        if (statusFilter.includes("Fulfilled") && statusFilter.includes("Unfulfilled") && statusFilter.includes("Cancelled")) {
          setStatusFilter([])
        } else {
          setStatusFilter(["Fulfilled", "Unfulfilled", "Cancelled"])
        }
      } else {
        setStatusFilter(prevState => [...prevState, event.target.name])
      }
    }
  };

  function handleClick(customerid: number) {
    router.push(`/orders/${customerid}`).then(() => window.location.href = `/orders/${customerid}`);
  }

  const handlePaymentFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (paymentFilter.includes(event.target.name)) {
      setPaymentFilter(prevState => prevState.filter((item: any) => item !== event.target.name))
    } else {
      if (event.target.name == "all") {
        if (paymentFilter.includes("Paid") && paymentFilter.includes("FAILED")) {
          setPaymentFilter([])
        } else {
          setPaymentFilter(["Paid", "FAILED"])
        }
      } else {
        setPaymentFilter(prevState => [...prevState, event.target.name])
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
  }, [parentCheckbox])

  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      setData({ orders: result?.orders, currentPage: result?.pagination?.currentPage, totalPages: result?.pagination?.totalPages });
    }
    fetchData();

  }, [resultNumber, activePageNumber, categoryFilter, statusFilter, search, paymentFilter]);

  async function getData() {
    if (search) {
      try {
        const searchPage = search.length == 1 ? 1 : activePageNumber
        if (search.length == 1) {
          setActivePageNumber(1)
        }

        // `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/user/${sellerData?.data?.id}?page=1&limit=20`

        // const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/search/${sellerData?.data?.id}?searchTerm=${search}&page=${searchPage}&limit=${resultNumber}&productPaymentStatus=${paymentFilter.join(',')}&fulfillmentStatus=${statusFilter.join(',')}`)

        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/search/${sellerData?.data?.Brands[0]?.id}?searchTerm=${search}&page=${searchPage}&limit=${resultNumber}&productPaymentStatus=${paymentFilter.join(',')}&fulfillmentStatus=${statusFilter.join(',')}`)
        const productsData = await productsResponse.json()
        return productsData
      } catch (error) {
        return { orders: [], currentPage: "1", totalPages: 1 }
      }

    } else {
      try {
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/brand/${sellerData?.data?.Brands[0]?.id}?fulfillmentStatus=${statusFilter.join(',')}&paymentStatus=${paymentFilter.join(',')}&page=${activePageNumber}&limit=${resultNumber}`)
        const productsData = await productsResponse.json()
        return productsData
      } catch (error) {
        return { currentPage: 1, totalPages: 1, orders: [] }
      }
    }
  }


  function notification(success: boolean, message: string | undefined) {
    if (success) {
      toast.success(message!)
    } else {
      toast.error(message || 'An error occurred')
    }

  }


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
                          <h1 className=' text-[#F12D4D] text-2xl mr-8 font-semibold'>Orders</h1>
                          <div className="flex items-center bg-[#f9f9f9] px-4 py-2 w-[385px] rounded-md">
                            <AiOutlineSearch color="#2a2a2a" fontSize="25px" className=" mr-4" />
                            <input
                              placeholder="Search Orders"
                              type="text"
                              className="w-full bg-[#f9f9f9] border-none outline-none"
                              onChange={(e) => { setSearch(e.target.value) }}
                            />
                          </div>

                        </div>

                        <div className="flex-1 flex items-end justify-end">

                          <Popover>
                            <PopoverTrigger className="flex items-center justify-center mr-4 px-5 py-2 bg-[#F12D4D] rounded-md text-white font-semibold">
                              <FiFilter className="mr-2" /> Filters</PopoverTrigger>
                            <PopoverContent>
                              <div className="flex flex-col items-center justify-center">
                                <div className="flex items-center w-full"><label><input type="checkbox" checked={statusFilter.includes("Fulfilled") && statusFilter.includes("Unfulfilled") && statusFilter.includes("Cancelled")} onChange={(e) => handleStatusFilter(e)} name="all" /> All</label></div>
                                <div className="mt-2 flex items-center w-full"><label><input type="checkbox" checked={statusFilter.includes("Fulfilled")} name="Fulfilled" onChange={(e) => handleStatusFilter(e)} /> Fulfilled</label></div>
                                <div className="mt-2 flex items-center w-full"><label><input type="checkbox" checked={statusFilter.includes("Unfulfilled")} name="Unfulfilled" onChange={(e) => handleStatusFilter(e)} /> Unfulfilled</label></div>
                                <div className="mt-2 flex items-center w-full"><label><input type="checkbox" checked={statusFilter.includes("Cancelled")} name="Cancelled" onChange={(e) => handleStatusFilter(e)} /> Cancelled</label></div>

                                <div className="mt-2 flex items-center w-full"><p className="font-bold text-base my-2">Payment Status</p></div>
                                <div className="mt-1 flex items-center w-full"><label><input type="checkbox" checked={paymentFilter.includes("Paid")} name="Paid" onChange={(e) => handlePaymentFilter(e)} /> Paid</label></div>
                                <div className="mt-1 flex items-center w-full"><label><input type="checkbox" checked={paymentFilter.includes("FAILED")} name="FAILED" onChange={(e) => handlePaymentFilter(e)} /> Failed</label></div>
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
                            <th className="py-3 px-4 bg-gray-100 border-b text-left">Order ID</th>
                            <th className="py-3 px-4 bg-gray-100 border-b text-left">Order Date</th>
                            <th className="py-3 px-4 bg-gray-100 border-b text-left">Buyer</th>
                            <th className="py-3 px-4 bg-gray-100 border-b text-left">Fullfillment Status  </th>
                            <th className="py-3 px-4 bg-gray-100 border-b text-left">Payment Status </th>
                            <th className="py-3 px-4 bg-gray-100 border-b text-left">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data && data?.orders?.map((row: any, index: any) => (
                            <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={(e) => handleClick(row.id)}>
                              <td className="py-2 px-4 border-b"><input type="checkbox" value={row.customerOrderId} name="childCheckbox" id="childCheckbox" /></td>
                              <td className="py-2 px-4 border-b">#{row?.id?.split("-")[0].toUpperCase()}</td>
                              <td className="py-2 px-4 border-b">{`${new Date(row?.createdAt).toLocaleDateString('en-US', {
                                // weekday: 'short', 
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}`}</td>
                              <td className="py-4 px-4 border-b">{row.customerName}</td>
                              <td className="py-4 px-4 border-b"><span className={`${row.status.toUpperCase() === 'UNFULFILLED' ? 'bg-yellow-500' : 'bg-gray-400'} text-white px-4 py-1 text-sm rounded-xl`}>{row.status.toUpperCase()}</span></td>
                              <td className="py-4 px-4 border-b"><span className={`${row.paymentStatus.toUpperCase() === 'PAID' ? 'bg-green-500' : 'bg-red-500'} text-white px-4 py-1 text-sm rounded-xl`}>{row.paymentStatus.toUpperCase()}</span></td>
                              <td className="py-4 px-4 border-b">${row.finalAmount}</td>
                              {/* <Dialog>
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
                               </Dialog> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {data?.orders && data?.orders?.length < 1 && <div className="w-full flex items-center justify-center absolute top-1/4">No Orders Found</div>}
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

  // Get the seller data using the email that the user is logged in with
  // const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/user/${sellerData?.data?.Brands[0]?.id}?page=1&limit=20`)
  // const ordersData = await orderResponse.json()
  // if (!ordersData.success) {
  //   return {
  //     redirect: {
  //       destination: '/auth/signup',
  //       permanent: false
  //     }
  //   }
  // }


  return {
    props: { session, sellerData },
  }
}