import { useEffect, useState } from "react"
import Layout from "../layout";
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
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { TbActivityHeartbeat } from "react-icons/tb";
import { BsCreditCard2Back, BsCurrencyDollar } from 'react-icons/bs'
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "../../../shadcn/lib/utils";
import { Button } from "../../../shadcn/components/ui/button";
import { Calendar } from "../../../shadcn/components/ui/calendar";



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

const getIntroOfPage = (label) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

  function convertTo12HourFormat(time) {
    const [hour, minute] = time.split(':').map(Number);

    let period = "AM";
    let adjustedHour = hour;

    if (hour > 12) {
      adjustedHour = hour - 12;
      period = "PM";
    } else if (hour === 12) {
      period = "PM";
    } else if (hour === 0) {
      adjustedHour = 12;
    }

    return `${adjustedHour}:${minute} ${period}`;
  }

  if (timePattern.test(label)) {
    return `Time: ${convertTo12HourFormat(label)}`;
  } else {
    return `Date: ${label}`;
  }

  return '';
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-2 rounded-md">
        <p className="intro">{getIntroOfPage(label)}</p>
        <p className="label">{`Total Orders : ${payload[0].value}`}</p>
        <p className="label">{`Total Revenue : ${payload[1].value}`}</p>
      </div>
    );
  }

  return null;
};

export default function Orders({ session, ordersData, sellerData }: any) {


  const chartData = [
    {
      "name": "14:12",
      "orders": 2,
      "total": 100
    },
    {
      "name": "14:15",
      "orders": 2,
      "total": 100
    }
  ]

  const recentSales = [
    {
      "customer_name": "Leri Doe",
      "product_total": 100
    },
    {
      "customer_name": "Keri Doe",
      "product_total": 100
    }
  ]

  const [timeFrame, setTimeFrame] = useState('last7days')
  const [data, setData] = useState()

  console.log(data)

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const result = await getData()
      setData(result)
    }
    fetchData()
  }, [timeFrame])

  async function getData() {
    try {
      const dashboardResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/dashboard/${sellerData?.data?.id}/${timeFrame}`)
      const dashboardData = await dashboardResponse.json()
      return dashboardData
    } catch (error) {
      return { "success": false, "totalRevenue": null, "salesCount": 0, "barChartData": [], "recentSales": [] }
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
                          <h1 className=' text-[#F12D4D] text-2xl mr-8 font-semibold'>Dashboard</h1>
                        </div>

                        <select onChange={(e) => setTimeFrame(e.target.value)} className='mr-5 text-sm text-gray-800 font-medium rounded py-1 px-3'>
                          <option selected={timeFrame === "today"} value="today" >Today</option>
                          <option selected={timeFrame === "last7days"} value="last7days" >Last 7 Days</option>
                          <option selected={timeFrame === "last30days"} value="last30days" >Last 30 Days</option>
                        </select>
                      </div>

                      <div className="flex justify-start">
                        <div className="flex-[1] mr-4 p-6 rounded-lg shadow-[rgba(6,_24,_44,_0.2)_0px_0px_3px_0.2px]">
                          <div className="flex justify-between">
                            <p className=" font-semibold text-sm text-gray-700">Total Revenue</p>
                            <BsCurrencyDollar />
                          </div>
                          <p className="font-bold text-3xl mt-2">{data?.totalRevenue ? `$${data?.totalRevenue}` : `$0`}</p>
                          <p className="font-semibold text-xs text-gray-500 mt-1">+0% Increase from Last Month</p>
                        </div>
                        <div className="flex-[1] mr-4 p-6 rounded-lg shadow-[rgba(6,_24,_44,_0.2)_0px_0px_3px_0.2px]">
                          <div className="flex justify-between">
                            <p className=" font-semibold text-sm text-gray-700">Sales</p>
                            <BsCreditCard2Back />
                          </div>
                          <p className="font-bold text-3xl mt-2">{data?.salesCount ? `${data?.salesCount}` : `0`}</p>
                          <p className="font-semibold text-xs text-gray-500 mt-1">+0% Increase from Last Month</p>
                        </div>
                        <div className="flex-[1] mr-4 p-6 rounded-lg shadow-[rgba(6,_24,_44,_0.2)_0px_0px_3px_0.2px]">
                          <div className="flex justify-between">
                            <p className=" font-semibold text-sm text-gray-700">Sessions</p>
                            <TbActivityHeartbeat />
                          </div>
                          <p className="font-bold text-3xl mt-2">0</p>
                          <p className="font-semibold text-xs text-gray-500 mt-1">+0% Increase from Last Month</p>
                        </div>

                      </div>

                      <div className="flex mt-5">
                        <div className="flex-[1] mr-4 pr-6 pl-0 pt-6 pb-3 rounded-lg shadow-[rgba(6,_24,_44,_0.2)_0px_0px_3px_0.2px] relative">
                          {/* <div className=" z-10 pointer-events-none absolute w-full h-full bg-white opacity-50 flex items-center justify-center">No Data</div> */}
                          <ResponsiveContainer width="100%" height={350}>
                            {/* <BarChart data={chartData}> */}
                            <BarChart data={data?.barChartData ? data?.barChartData : chartData}>
                              <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar dataKey="orders" stackId="a" fill="#f12c4d" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="total" stackId="a" fill="#f12c4d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex-[0.6] mr-4 p-6 rounded-lg shadow-[rgba(6,_24,_44,_0.2)_0px_0px_3px_0.2px] relative">
                          <div class="w-full h-2/5 bg-gradient-to-t from-white via-white to-transparent absolute bottom-0 right-0 rounded-md"></div>

                          <p className=" font-semibold text-md text-gray-700">Recent Sales</p>
                          {data?.recentSales?.length > 0 && <p className="font-semibold text-xs text-gray-500 mt-1 underline"><a href="/orders">View All Orders</a></p>}
                          {data?.recentSales?.length > 0 ? data?.recentSales?.map((sale, index) => {
                            return (
                              <div key={index} className="mt-4 flex items-center justify-between">
                                <p className="font-semibold text-base text-gray-700">{sale?.customer_name}</p>
                                <p className="font-semibold text-base text-gray-700">+${sale?.product_total}</p>
                              </div>
                            )
                          })
                            : <p className="font-semibold text-xs text-gray-500 mt-1">You've made no sales.</p>
                          }
                        </div>
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
  const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/limited/seller/${sellerData?.data?.id}`)
  const ordersData = await orderResponse.json()
  if (!ordersData.success) {
    return {
      redirect: {
        destination: '/auth/signup',
        permanent: false
      }
    }
  }


  return {
    props: { session, ordersData, sellerData },
  }
}