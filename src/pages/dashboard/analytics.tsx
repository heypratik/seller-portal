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
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, AreaChart, Area, Tooltip, CartesianGrid } from "recharts"
import { TbActivityHeartbeat } from "react-icons/tb";
import { BsCreditCard2Back, BsCurrencyDollar } from 'react-icons/bs'
import { addDays, format } from "date-fns"
// import { DateRange } from "react-day-picker"
import { cn } from "../../../shadcn/lib/utils";
import { Button } from "../../../shadcn/components/ui/button";
// import { Calendar } from "../../../shadcn/components/ui/calendar";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { BsCalendar2Event } from 'react-icons/bs'


const chartData = [
    {
        name: "Jan",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Feb",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Mar",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Apr",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "May",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Jun",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Jul",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Aug",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Sep",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Oct",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Nov",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Dec",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
]

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
    const router = useRouter();

    const [data, setData] = useState<any>([])
    console.log(data)
    const [date, setDate] = useState<DateRange | undefined>({ from: new Date(), to: addDays(new Date(), 7) })

    const [state, setState] = useState([
        {
            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    console.log(state)
    console.log(data)
    console.log(format(state[0]?.startDate, "yyyy-MM-dd"))

    useEffect(() => {
        async function fetchData() {
            const result = await getData()
            setData(result)
        }
        fetchData()
    }, [state])

    async function getData() {
        try {
            const analyticsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/analytics/${sellerData?.data?.id}?startDate=${format(state[0]?.startDate, "yyyy-MM-dd")}&endDate=${format(state[0]?.endDate, "yyyy-MM-dd")}`)
            const analyticsdData = await analyticsResponse.json()
            return analyticsdData
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
                                                    <h1 className=' text-[#F12D4D] text-2xl mr-8 font-semibold'>Analytics</h1>
                                                </div>

                                                {/* <select className='mr-5 text-sm text-gray-800 font-medium rounded py-1 px-3'>
                          <option>Today</option>
                          <option>Last 7 Days</option>
                          <option>Last 30 Days</option>
                          <option>Last 90 Days</option>

                        </select> */}

                                                <div className={cn("grid gap-2")}>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                id="date"
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-[300px] justify-start text-left font-normal",
                                                                    !date && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <BsCalendar2Event className="mr-2 h-4 w-4" />
                                                                {state[0]?.startDate ? (
                                                                    state[0]?.endDate ? (
                                                                        <>
                                                                            {format(state[0]?.startDate, "LLL dd, y")} -
                                                                            {" "}
                                                                            {format(state[0]?.endDate, "LLL dd, y")}
                                                                        </>
                                                                    ) : (
                                                                        format(new Date(), "LLL dd, y")
                                                                    )
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <DateRange
                                                                editableDateInputs={true}
                                                                onChange={item => setState([item.selection])}
                                                                moveRangeOnFirstSelection={false}
                                                                ranges={state} rangeColors={['#f33e5b', '#3ecf8e', '#fed14c']} />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>

                                            <div className="flex mt-5">
                                                <div className="flex-[1] mr-4 pr-6 pl-0 pt-6 pb-3 rounded-lg shadow-[rgba(6,_24,_44,_0.2)_0px_0px_3px_0.2px]">
                                                    <ResponsiveContainer width="100%" height={350}>
                                                        <BarChart data={data?.barChartOrders ? data?.barChartOrders : chartData}>
                                                            {/* <BarChart data={chartData}> */}
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

                                                            <Bar dataKey="orders" fill="#f12c4d" radius={[4, 4, 0, 0]} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                                <div className="flex-[0.6] mr-4 p-6 rounded-lg shadow-[rgba(6,_24,_44,_0.2)_0px_0px_3px_0.2px]">
                                                    <ResponsiveContainer width="100%" height={350}>
                                                        {/* <AreaChart data={chartData}> */}
                                                        <AreaChart data={data?.barChartRevenue}>
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
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <Tooltip />
                                                            <Area type="monotone" dataKey="revenue" fill="#f12c4d" />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
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