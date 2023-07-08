import React, { useState } from "react"
import Layout from "./layout"
import Breadcrums from "../../components/Breadcrums"
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { getSession, useSession } from 'next-auth/react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { request } from "http";

interface SellerData {
    data: {
        id: number;
        name: string;
        email: string;
        password: string;
        active: boolean;
        createdAt: string;
        updatedAt: string;
    };
}

export default function BrandEnroll({ sellerData, brandData }: { sellerData: SellerData, brandData: any }) {

    const [brand, setBrand] = useState(brandData?.data[0])

    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()

    const handleFormSubmit = (e: any) => {
        e.preventDefault()
    }

    // {
    //     "id": 2,
    //     "sellerId": 2,
    //     "legalBusinessName": "aas",
    //     "brandDisplayName": "assawdddd",
    //     "brandCategory": "option2",
    //     "brandLogoObjectKey": "TEST",
    //     "brandDisplayPictureObjectKey": "TEST",
    //     "businessAddress": "sddsa",
    //     "active": true,
    //     "createdAt": "2023-07-07T17:17:24.319Z",
    //     "updatedAt": "2023-07-07T17:17:24.319Z",
    //     "SellerId": 2
    // }

    const formik = useFormik({
        initialValues: {
            businessName: brand?.legalBusinessName ? brand?.legalBusinessName : "",
            displayName: brand?.brandDisplayName ? brand?.brandDisplayName : "",
            category: brand?.brandCategory ? brand?.brandCategory : "",
            businessAddress: brand?.businessAddress ? brand?.businessAddress : "",
        },
        onSubmit
    })


    async function onSubmit(values: { businessName: string; displayName: string; category: string; businessAddress: string }) {
        setLoading(true)

        // Checks if brand is true then its an update
        try {
            if (brand) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/brands/update/${brand?.id}`, {
                    method: 'PATCH',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sellerId: sellerData?.data?.id,
                        legalBusinessName: values.businessName,
                        brandDisplayName: values.displayName,
                        brandCategory: values.category,
                        businessAddress: values.businessAddress,
                        brandDisplayPictureObjectKey: "TEST",
                        brandLogoObjectKey: "TEST"
                    })
                });
                const data = await response.json();

                if (data.success) {
                    notification(true, "Brand updated successfully.");
                    setLoading(false);
                } else {
                    notification(false, "Something went wrong");
                    setLoading(false);
                }
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/brands/register`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sellerId: sellerData?.data?.id,
                        legalBusinessName: values.businessName,
                        brandDisplayName: values.displayName,
                        brandCategory: values.category,
                        businessAddress: values.businessAddress,
                        brandDisplayPictureObjectKey: "TEST",
                        brandLogoObjectKey: "TEST"
                    })
                });
                const data = await response.json();

                if (data.success) {
                    setBrand(data.data)
                    notification(true, "Brand registered successfully.");
                    setLoading(false);
                } else {
                    notification(false, "Something went wrong");
                    setLoading(false);
                }
            }
        } catch (error) {
            notification(false, "Something went wrong");
            console.error(error);
            setLoading(false);
            // Handle the error
        }

        setLoading(false)
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
            <Toaster position="top-center" reverseOrder={true} />
            <div className="py-6 h-screen">
                <div className="mx-auto px-4 sm:px-6 md:px-8">
                    <Breadcrums parent={"Brand Enroll"} childarr={["Product"]} />
                </div>
                <div className="mx-auto px-4 sm:px-6 md:px-8">
                    {/* Replace with your content */}
                    <div className="py-4">
                        <div className="bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] rounded-lg p-7">
                            <h3 className="text-[#F12D4D] font-semibold text-2xl mb-3">Brand Information</h3>

                            <form onSubmit={formik.handleSubmit} >
                                <section className="flex items-start flex-wrap">
                                    {/* left part */}
                                    <div className="w-1/2">
                                        {/* legal business name  */}
                                        <div>
                                            <label htmlFor="business" className=" block text-base font-medium text-[#30323E] mb-2 mt-4">Legal business Name*</label>

                                            <input {...formik.getFieldProps('businessName')} type="text" id="business-name" name="businessName" className="mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none  w-[22.5rem] h-10 rounded-md mb-3" placeholder="Enter Brand Name" />
                                        </div>

                                        {/* brand display name  */}
                                        <div>
                                            <label htmlFor="display" className="mt-4 block text-base font-medium text-[#30323E] mb-2"> Brand Display Name*</label>

                                            <input {...formik.getFieldProps('displayName')} type="text" id="display-name" name="displayName" className="mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[#DDDDDD]  text-lg h-10 focus:outline-none  w-[22.5rem] rounded-md mb-6" />

                                        </div>

                                        {/* brand category  */}
                                        <div>
                                            <label htmlFor="category" className="mt-4 block text-base font-medium text-[#30323E] mb-2"> Brand Category*</label>

                                            <select {...formik.getFieldProps('category')} id="category" name="category" className="mt-1 px-4  bg-[#F7F9FA] border shadow-sm border-[#DDDDDD]  text-base focus:outline-none  w-[22.5rem] rounded-md h-10 mb-2">
                                                <option defaultValue="true" className="text-base text-[#30323E] ">Choose Category</option>
                                                <option className="text-base" value="option1">Option 1</option>
                                                <option className="text-base" value="option2">Option 2</option>
                                                <option className="text-base" value="option3">Option 3</option>
                                                <option className="text-base" value="option4">Option 4</option>
                                            </select>
                                        </div>

                                        {/* brand logo part here  */}

                                        <div>
                                            <label htmlFor="logo" className="mt-4 block text-base font-medium text-[#30323E] mb-2"> Brand Logo* </label>


                                            <input
                                                id="picture"
                                                type="file"
                                                accept="image/*"
                                                //   onChange={(e) => setImage(e.target.files[0])}
                                                className=" w-[22.5rem] h-10 text-base text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none   file:bg-[#F12D4D] file:text-sm file:font-semibold file:text-gray-200 file:px-4  file:h-full file:mr-5 file:cursor-pointer file:border-0 file:border-gray-300  "
                                            />
                                        </div >



                                    </div>

                                    {/* right part  */}
                                    <div>
                                        {/* brand display picture  */}

                                        <div>
                                            <label htmlFor="picture" className="mt-4  block text-base font-medium text-[#30323E] mb-2"> Brand display Picture* </label>

                                            <input
                                                id="picture"
                                                type="file"
                                                accept="image/*"
                                                //   onChange={(e) => setImage(e.target.files[0])}
                                                className=" w-[22.5rem] mb-1 h-10 text-base text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none   file:bg-[#F12D4D] file:text-sm file:font-semibold file:text-gray-200 file:px-4 file:py-2 file:h-full file:mr-5 file:cursor-pointer file:border-0 file:border-gray-300  "
                                            />
                                        </div>



                                        {/* business address  */}
                                        <div>
                                            <label htmlFor="business-address" className="mt-4 block text-base font-medium text-[#30323E] my-2"> Business Address* </label>

                                            <input {...formik.getFieldProps('businessAddress')} type="text" id="business-address" name="businessAddress" className="mt-1 px-3 py-2 bg-[#F7F9FA] border h-10 shadow-sm border-[#DDDDDD]  text-base focus:outline-none  w-[356px] rounded-md " />

                                        </div>
                                    </div>
                                </section>

                                {/* submit button */}

                                <div className="mt-16 flex">
                                    <button type="submit" className="w-32 h-11 bg-[#F12D4D] flex items-center justify-center rounded-md text-white text-base font-semibold mr-20 cursor-pointer" value="Next">{loading ? <AiOutlineLoading3Quarters className='spinner' /> : `Next`}</button>

                                    <button type="button" className="w-32 h-11 bg-[#EAEAEA] rounded-md text-[#979797] text-base font-normal cursor-pointer">Cancel </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* /End replace */}
                </div>
            </div>
        </Layout>
    )
}

export async function getServerSideProps({ req }: any) {
    const session = await getSession({ req })

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
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

    // Get the brands associated with the seller using the seller id
    const brandResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/brands/search/${sellerData?.data?.id}`)
    const brandData = await brandResponse.json()

    return {
        props: {
            session,
            sellerData,
            brandData
        }
    }
}