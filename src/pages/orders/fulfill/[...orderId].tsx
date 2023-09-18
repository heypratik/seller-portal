import React, { useState } from 'react'
import Layout from '../../layout'
import toast, { Toaster } from 'react-hot-toast';
import Breadcrums from '../../../../components/Breadcrums';
import { HiOutlineExclamationCircle, HiOutlineCheckCircle } from 'react-icons/hi'
import { BsPencil } from 'react-icons/bs'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { RxCrossCircled } from 'react-icons/rx'
import { useFormik } from 'formik';
import { getSession, useSession } from 'next-auth/react'


export default function OrderID() {

    const [editingField, setEditingField] = useState<string>();

    const formik = useFormik({
        initialValues: {
            orderTrackingNumber: "",
            orderShippingCarrier: "",
        },
        onSubmit
    })

    async function onSubmit(values: any) { }

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
                                        <section className='mb-8'>
                                            <div className=' mt-2 flex items-center'>
                                                <h1 className='mr-5 text-2xl font-bold text-gray-900'>#MB500578</h1>
                                            </div>
                                        </section>

                                        <div className='parentdiv flex items-start'>
                                            <div className='flex-1 mr-6'>
                                                <div className='bg-gray-100 mb-6 rounded-lg p-4 '>
                                                    <span className='mb-5 flex items-center'>
                                                        <HiOutlineExclamationCircle filter='drop-shadow(0px 0px 5px rgb(255 19 3 / 0.6)' fontSize='24px' fill='#fff' color='red' />
                                                        <p className='font-semibold ml-4'>Unfulfilled (1)</p></span>
                                                    {/* Product Card  */}
                                                    <div className='flex items-center justify-between'>
                                                        <div className='flex items-center'>
                                                            <img width="40px" height="80px" src='https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE=' />
                                                            <div className='ml-4'>
                                                                <p className=' font-normal text-gray-700'>Mens T-shirt</p>
                                                                <p className='font-normal text-gray-700'>SKU: 001</p>
                                                            </div>
                                                        </div>

                                                        <p className=' font-normal text-gray-700'>$200 X 1</p>

                                                        <p className=' font-normal text-gray-700'>$200</p>
                                                    </div>
                                                    <hr className='my-4' />
                                                    <p className=' font-semibold'>Tracking Information</p>
                                                    <div className='flex items-center mt-4'>
                                                        <div className='mr-2 flex flex-col w-full'>
                                                            <label>Tracking Number</label>
                                                            <input type="text" placeholder='Enter tracking number' className='mt-2 flex-1 border border-gray-300 rounded-lg py-1 px-3' />
                                                        </div>
                                                        <div className='ml-2 flex flex-col w-full'>
                                                            <label>Shipping Carrier</label>
                                                            <input type="text" placeholder='Shipping Carrier' className='mt-2 flex-1 border border-gray-300 rounded-lg py-1 px-3' />
                                                        </div>
                                                    </div>
                                                    <hr className='my-8' />

                                                    <p className=' font-semibold'>Notify Customer of Shipment</p>
                                                    <div className='flex items-center mt-2'>
                                                        <input type="checkbox" className='mr-2 w-4 h-4' />
                                                        <p>Send shipment details to customer now</p>
                                                    </div>
                                                </div>

                                            </div>

                                            {/* Order Meta Details */}
                                            <div className='flex-[0.5] mr-6'>

                                                <div className='bg-gray-100 rounded-lg  p-4 '>

                                                    <section className='mb-6'>
                                                        <span className='flex items-center justify-between'><p className='font-semibold'>Shipping Address</p>
                                                            <BsPencil onClick={() => setEditingField("shipping")} className=' cursor-pointer' /></span>
                                                        <p className='mt-1 text-sm'>John Doe</p>
                                                        <p className='mt-1 text-sm'>256 North Ave.</p>
                                                        <p className='mt-1 text-sm'>Chicago IL, 60657</p>
                                                        <p className='mt-1 text-sm'>United States</p>
                                                        <p className='mt-1 text-sm'>+1 123 456 789</p>
                                                        <p className='mt-1 text-sm underline'>View map</p>
                                                    </section>

                                                </div>

                                                <div className='bg-gray-100 rounded-lg  p-4 mt-4 '>

                                                    <section className='mb-6'>
                                                        <span className='flex items-center justify-between'><p className='font-semibold mb-5'>Summary</p></span>
                                                        <button className='w-full rounded-md bg-black text-white text-center p-2'>Fulfill Item</button>
                                                    </section>

                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
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

    const { url } = req

    const productId = url.split('/').pop()

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
    const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/seller/${sellerData?.data?.id}/order/${productId}`)
    const orderData = await orderResponse.json()
    if (!orderData.success) {
        return {
            redirect: {
                destination: '/auth/signup',
                permanent: false
            }
        }
    }

    return {
        props: { session, orderData },
    }
}

