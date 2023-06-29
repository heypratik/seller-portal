import { Payment, columns } from "../../../components/columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react"
import Layout from "../layout"

function Products() {
    const [data, setData] = useState<Payment[]>([])

    useEffect(() => {
        async function fetchData() {
            const result = await getData()
            setData(result)
        }
        fetchData()
    }, [])

    async function getData(): Promise<Payment[]> {
        // Fetch data from your API here.
        return [
            {
                id: "728ed52f",
                status: "Available",
                img: "https://i.imgur.com/yo03exN_d.webp",
                prodId: 1,
                prodName: "Qubo Car Dash Camera Pro Dash Cam from Hero Group | Made in India Dashcam | Full HD 1080p | Wide Angle View | G-Sensor | WiFi | Emergency Recording | Upto 256GB SD Card Supported",
                quantity: 1,
                priceShipping: 1,
                fee: 1,
                category: "Clothing",
            },
            {
                id: "728deed52f",
                status: "Out of Stock",
                img: "https://i.imgur.com/yo03exN_d.webp",
                prodId: 2,
                prodName: "Product 2",
                quantity: 1,
                priceShipping: 1,
                fee: 1,
                category: "Clothing",
            },
            {
                id: "728eikd52f",
                status: "Available",
                img: "https://i.imgur.com/yo03exN_d.webp",
                prodId: 3,
                prodName: "Product 3",
                quantity: 1,
                priceShipping: 1,
                fee: 1,
                category: "Clothing",
            },
            {
                id: "728eikd52f",
                status: "Available",
                img: "https://i.imgur.com/yo03exN_d.webp",
                prodId: 3,
                prodName: "Product 3",
                quantity: 1,
                priceShipping: 1,
                fee: 1,
                category: "Clothing",
            },
            {
                id: "728eikd52f",
                status: "Available",
                img: "https://i.imgur.com/yo03exN_d.webp",
                prodId: 3,
                prodName: "Product 3",
                quantity: 1,
                priceShipping: 1,
                fee: 1,
                category: "Clothing",
            },


            // ...
        ]
    }

    return (
        <Layout>
            <div className="py-6 h-screen">
                <div className="mx-auto px-4 sm:px-6 md:px-8 pb-24 bg-[#f9f9f9]">
                    {/* Replace with your content */}
                    <div className="py-0">
                        <div className="bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] rounded-lg p-7 ">
                            <div className="flex flex-col justify-between min-h-[76vh]">
                                {data.length > 0 ? (
                                    <DataTable columns={columns} data={data} />
                                ) : (
                                    <p>Loading...</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* /End replace */}
                </div>
            </div>
        </Layout>
    )
}

export default Products