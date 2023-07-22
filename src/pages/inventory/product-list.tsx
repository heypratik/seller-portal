import React, { useState } from 'react'
import Layout from '../layout'
import Breadcrums from '../../../components/Breadcrums'
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { getSession, useSession } from 'next-auth/react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

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

export default function ProductList({ sellerData }: { sellerData: SellerData }) {

    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            productName: '',
            productCategory: '',
            productColor: '',
            productSize: '',
            productQuanity: '',
            productDescription: '',
            productSku: '',
            productSubCategory: '',
            productPrice: '',
            productCost: '',
            productMargin: '',
            productKeywords: '',
        },
        onSubmit
    })

    async function onSubmit(values: { productName: string, productCategory: string, productColor: string, productSize: string, productQuanity: string, productDescription: string, productSku: string, productSubCategory: string, productPrice: string, productCost: string, productMargin: string, productKeywords: string }) {
        setLoading(true)

        try {
            console.log("STARTING")
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory/add/product`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sellerId: sellerData?.data?.id,
                    productName: values.productName,
                    productCategory: values.productCategory,
                    productColor: values.productColor,
                    productSize: values.productSize,
                    productQuanity: values.productQuanity,
                    productDescription: values.productDescription,
                    productSku: values.productSku,
                    productSubCategory: values.productSubCategory,
                    productPrice: values.productPrice,
                    productCost: values.productCost,
                    productMargin: values.productMargin,
                    productKeywordArray: values.productKeywords.split(","), // Was an array of keywords but changed to string. Need to change in backend too the name
                    productImage: 'NULL'

                })
            })
            console.log("ENDED")
            const data = await response.json();

            console.log(data)

            if (data.success) {
                notification(true, "Product Added successfully.");
                setLoading(false);
            } else {
                notification(false, "Something went wrong");
                setLoading(false);
            }

        } catch (error) {
            notification(false, "Something went wrong");
            console.error(error);
            setLoading(false);
        }
        setLoading(false);
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
                <div className="mx-auto px-4 sm:px-6 md:px-8 ">
                    <Breadcrums parent={"Inventory"} childarr={["Add Product"]} />
                </div>
                <div className="mx-auto px-4 sm:px-6 md:px-8 pb-24">
                    {/* Replace with your content */}
                    <div className="py-4">
                        <form onSubmit={formik.handleSubmit} >
                            <div className="bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] rounded-lg p-7">
                                <h1 className=' text-[#F12D4D] text-2xl font-semibold'>Product Listing</h1>
                                <div className='flex w-full h-full'>
                                    <div className='flex-1'>
                                        <h3 className=' text-xl font-medium mt-6'>Product Name*</h3>
                                        <input {...formik.getFieldProps('productName')} type="text" id="productName" name="productName" className="bg-[#f7f9fa] outline-none focus:outline-none mt-4 rounded-md px-5 py-4 w-[470px]" placeholder='Enter Product Name' />

                                        <h3 className=' text-xl font-medium mt-14'>Product Category*</h3>
                                        <select {...formik.getFieldProps('productCategory')} name="productCategory" id="productCategory" className='mt-4 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[470px]'>
                                            <option value="English">Select Product Category</option>
                                            <option value="Spanish">Category 1</option>
                                            <option value="Spanish">Category 2</option>
                                            <option value="Spanish">Category 3</option>
                                        </select>

                                        <h3 className=' text-xl font-medium mt-14'>Product Options*</h3>
                                        <div className='flex items-center justify-start mt-4'>
                                            <div>
                                                <select {...formik.getFieldProps('productColor')} name='productColor' id="productColor" className='mr-3 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]'>
                                                    <option value="English">Color</option>
                                                    <option value="Spanish">Sub Category 1</option>
                                                    <option value="Spanish">Sub Category 2</option>
                                                    <option value="Spanish">Sub Category 3</option>
                                                </select>
                                            </div>

                                            <div>
                                                <select {...formik.getFieldProps('productSize')} name='productSize' id="productSize" className='mr-3 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]'>
                                                    <option value="English">Size</option>
                                                    <option value="Spanish">Category 1</option>
                                                </select>
                                            </div>

                                            <div>
                                                <input type='number' {...formik.getFieldProps('productQuanity')} name='productQuanity' id="productQuanity" className='outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]' />

                                            </div>
                                        </div>

                                        <h3 className='text-xl font-medium mt-14'>Product Description*</h3>
                                        <textarea {...formik.getFieldProps('productDescription')} rows={3} id="productDescription" name="productDescription" className="bg-[#f7f9fa] outline-none focus:outline-none mt-4 rounded-md px-5 py-4 w-[470px]" placeholder='Enter Product Description' />
                                    </div>
                                    <div className='flex-1'>
                                        <h3 className=' text-xl font-medium mt-6'>Product SKU*</h3>
                                        <input {...formik.getFieldProps('productSku')} type="text" id="productSku" name="productSku" className="bg-[#f7f9fa] outline-none focus:outline-none mt-4 rounded-md px-5 py-4 w-[470px]" placeholder='Enter Product ID' />

                                        <h3 className='text-xl font-medium mt-14'>Product Sub Category(1)*</h3>
                                        <select {...formik.getFieldProps('productSubCategory')} name='productSubCategory' id="productSubCategory" className='mt-4 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[470px]'>
                                            <option value="English">Select Product Category</option>
                                            <option value="Spanish">Category 1</option>
                                        </select>

                                        <h3 className=' text-xl font-medium mt-14'>Price*</h3>
                                        <div className='flex items-center justify-start mt-4'>
                                            <div>
                                                <input type='number' {...formik.getFieldProps('productPrice')} name='productPrice' id="productPrice" className='mr-3 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]' />
                                            </div>

                                            <div>
                                                <input type='number' {...formik.getFieldProps('productCost')} name='productCost' id="productCost" className='mr-3 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]' />
                                            </div>

                                            <div>
                                                <input type='number' {...formik.getFieldProps('productMargin')} name='productMargin' id="productMargin" className='outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]' />

                                            </div>
                                        </div>

                                        <h3 className=' text-xl font-medium mt-14'>Product Keywords*</h3>
                                        <textarea {...formik.getFieldProps('productKeywords')} rows={3} id="productKeywords" name="productKeywords" className="bg-[#f7f9fa] outline-none focus:outline-none mt-4 rounded-md px-5 py-4 w-[470px]" placeholder='Enter Product Description' />
                                    </div>
                                </div>
                                <div className="mt-16 flex">
                                    <button type="submit" className="w-32 h-11 bg-[#F12D4D] flex items-center justify-center rounded-md text-white text-base font-semibold mr-10 cursor-pointer" value="Next">{loading ? <AiOutlineLoading3Quarters className='spinner' /> : `Next`}</button>

                                    <button type="button" className="w-32 h-11 bg-[#EAEAEA] rounded-md text-[#979797] text-base font-normal cursor-pointer">Cancel </button>
                                </div>
                            </div>
                        </form>
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