import React, { useEffect, useState, useRef } from "react";
import Layout from "../layout"
import Papa from "papaparse";
import { FaShopify } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import toast, { Toaster } from 'react-hot-toast';
import { getSession } from 'next-auth/react'


export default function Import({ sellerData }: { sellerData: any }) {
    const [file, setFile] = useState();
    const [array, setArray] = useState<any>([]);
    const fileInputRef = useRef<any>(null);
    const [loading, setLoading] = useState(false)

    const handleOnChange = (e: any) => {
        setFile(e.target.files[0]);
    };


    async function csvFileToArray(string: any) {
        await Papa.parse(string, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (result: any) => {
                setArray(result.data);
            },
            error: (error: any) => {
                console.error("CSV parsing error:", error);
            },
        });
    };

    async function handleOnSubmit(e: any) {

        // if (loading) return;

        e.preventDefault();

        if (file && typeof window !== "undefined") {
            const fileReader = new FileReader();
            fileReader.onload = async function (event) {
                const text = event?.target?.result;
                await csvFileToArray(text);
            };

            fileReader.readAsText(file);
        }
    };


    async function transformArray(parsedArray: any[]) {

        parsedArray.forEach((item) => {
            item['brandId'] = sellerData?.data?.Brands[0]?.id
        });

        return parsedArray;
    }

    async function uploadProductsToDatabase() {
        const parsedArray = array;
        const reviewObjs = await transformArray(parsedArray);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews/add/import`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reviewObjs),
        });

        const data = await response.json();
        if (data.success) {
            setLoading(false)
            fileInputRef.current.value = '';
            setArray([]);

            notification(true, "Reviews Added successfully.");
        } else {
            setLoading(false)
            notification(false, "Error adding reviews.");
        }
    }

    useEffect(() => {
        if (array.length > 0) {
            setLoading(true)
            uploadProductsToDatabase();
        }
    }, [array])

    function notification(success: boolean, message: string | undefined) {
        if (success) {
            toast.success(message!)
        } else {
            toast.error(message || 'An error occurred')
        }

    }

    return (
        <Layout>
            <Toaster position="top-center" reverseOrder={true} />
            <div className="rounded-md border">
                <div className="py-6 h-screen">
                    <div className="mx-auto px-4 sm:px-6 md:px-8 pb-24 bg-[#f9f9f9]">
                        <div className="py-0">
                            <div className="bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] rounded-lg p-7 ">
                                <div>
                                    <div className="flex items-center justify-between py-4">
                                        <h1 className=' text-[#F12D4D] text-2xl mr-8 font-semibold'>Import Reviews</h1>
                                    </div>
                                    <form className="flex items-center">
                                        <input type={"file"} id={"csvFileInput"} ref={fileInputRef} accept={".csv"} onChange={handleOnChange} className=" w-[22.5rem] h-11 mr-5 text-base text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none   file:bg-[#F12D4D] file:text-sm file:font-semibold file:text-gray-200 file:px-4  file:h-full file:mr-5 file:cursor-pointer file:border-0 file:border-gray-300" />

                                        <button disabled={loading} className="flex gap-2 items-center justify-center mr-4 px-5 py-2 bg-[#95bf47]  border border-[#95bf47] rounded-md text-white font-semibold" onClick={(e) => { handleOnSubmit(e); }} >{loading && <div><AiOutlineLoading3Quarters className='spinner' /></div>} <FaShopify /> IMPORT FROM SHOPIFY </button>

                                    </form>

                                    <br />

                                    <div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
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

    if (!sellerData?.data?.isPlanActive) {
        return {
            redirect: {
                destination: '/account',
                permanent: false
            }
        }
    }


    return {
        props: { session, sellerData },
    }
}