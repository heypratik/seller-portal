import React, { useState } from 'react'
import Layout from '../layout'
import toast, { Toaster } from 'react-hot-toast';
import Breadcrums from '../../../components/Breadcrums';
import { HiOutlineExclamationCircle, HiOutlineCheckCircle } from 'react-icons/hi'
import { BsPencil } from 'react-icons/bs'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { RxCrossCircled } from 'react-icons/rx'
import { useFormik } from 'formik';
import { getSession, useSession } from 'next-auth/react'
import Link from 'next/link';
import { useRouter } from 'next/router'


function OrderID({ orderData, sellerData }: { orderData: any, sellerData: any }) {

    const orderDetails = orderData.data

    const [editingField, setEditingField] = useState<string>();
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    console.log(router?.query?.orderId?.[0])



    const formik = useFormik({
        initialValues: {
            orderNotes: "No Notes",
            customerName: orderDetails?.customerName ? orderDetails?.customerName : "No Name",
            customerEmail: orderDetails?.customerEmail ? orderDetails?.customerEmail : "No Email",
            customerPhone: orderDetails?.customerPhoneNumber ? orderDetails?.customerPhoneNumber : "No Phone Number",
            customerShippingAddress: orderDetails?.customerAddress ? orderDetails?.customerAddress : "No Address",
            customerShippingCountry: orderDetails?.customerCountry ? orderDetails?.customerCountry : "No Country",
            customerPincode: orderDetails?.customerPincode ? orderDetails?.customerPincode : "No Pincode",
            customerBillingAddress: orderDetails?.billingAddress ? orderDetails?.billingAddress : "No Address",
            customerBillingCountry: orderDetails?.billingCountry ? orderDetails?.billingCountry : "No Country",
            customerBillingPincode: orderDetails?.billingPincode ? orderDetails?.billingPincode : "No Pincode",
        },
        onSubmit
    })

    async function onSubmit(values: { orderNotes: string, customerName: string, customerEmail: string, customerPhone: string, customerShippingAddress: string, customerShippingCountry: string, customerPincode: string, customerBillingAddress: string, customerBillingCountry: string, customerBillingPincode: string }) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/update-details/${sellerData?.data?.id}/${router?.query?.orderId?.[0]}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })

            const data = await response.json();

            if (data.success) {
                setEditingField('')
                notification(true, "Updated successfully.");
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
            <>
                <Toaster position="top-center" reverseOrder={true} />
                <div>
                    <div className="rounded-md border">
                        <div className="py-6 h-screen">
                            <div className="mx-auto px-4 sm:px-6 md:px-8 pb-24 bg-[#f9f9f9]">
                                {/* Replace with your content */}
                                <div className="py-0">
                                    <form onSubmit={formik.handleSubmit} >
                                        <div className="bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] rounded-lg p-7 ">
                                            <h3 className="text-[#F12D4D] font-semibold text-2xl mb-6">Order Information</h3>
                                            <section className='mb-8'>
                                                <div className=' mt-2 flex items-center'>
                                                    <h1 className='mr-5 text-2xl font-bold text-gray-900'>{`#${orderDetails?.customerOrderId}`}</h1>
                                                    {orderDetails?.fulfillmentStatus === 'Unfulfilled' ? <span className='mr-5 bg-yellow-200 text-sm py-1 px-4 rounded-full flex items-center'>
                                                        <HiOutlineExclamationCircle className='mr-2' />
                                                        <p className=''>{orderDetails?.fulfillmentStatus}</p>
                                                    </span> : <span className='mr-5 bg-green-600 font-medium text-white text-sm py-1 px-4 rounded-full flex items-center'>
                                                        <AiOutlineCheckCircle className='mr-2' />
                                                        <p className=''>{orderDetails?.fulfillmentStatus}</p>
                                                    </span>
                                                    }
                                                    <button className='mr-5 bg-gray-200 text-sm text-gray-800 font-medium rounded-lg py-1 px-3'>Refund</button>
                                                    <select className='mr-5 bg-gray-200 text-sm text-gray-800 font-medium rounded-lg py-1 px-3'>
                                                        <option>More Options</option>
                                                        <option>Cancel Order</option>

                                                    </select>
                                                </div>
                                                <span className='font-normal text-sm text-gray-600'>{`${new Date(orderDetails?.orderDate).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })} from Online Store`}</span>
                                            </section>

                                            <div className='parentdiv flex items-start'>
                                                <div className='flex-1 mr-6'>
                                                    <div className='bg-gray-100 mb-6 rounded-lg p-4 '>
                                                        {orderDetails?.fulfillmentStatus === 'Unfulfilled' ? <span className='mb-5 flex items-center'>
                                                            <HiOutlineExclamationCircle filter='drop-shadow(0px 0px 5px rgb(255 19 3 / 0.6)' fontSize='24px' fill='#fff' color='red' />
                                                            <p className='font-semibold ml-4'>{orderDetails?.fulfillmentStatus} (1)</p>
                                                        </span> : <span className='mb-5 flex items-center'>
                                                            <HiOutlineCheckCircle filter='drop-shadow(0px 0px 5px rgb(35 138 87 / 0.6)' fontSize='24px' fill='#fff' color='#238a57' />
                                                            <p className='font-semibold ml-4'>{orderDetails?.fulfillmentStatus} (1)</p>
                                                        </span>}
                                                        {/* Product Card  */}
                                                        {orderDetails?.Inventories?.map((item: any, index: any) => {
                                                            return (
                                                                <div key={index} className='flex mt-4 items-center justify-between'>
                                                                    <div className='flex items-center'>
                                                                        <img width="40px" height="80px" src={item?.productImage} />
                                                                        <div className='ml-4'>
                                                                            <p className=' font-normal text-gray-700'>{item?.productName}</p>
                                                                            <p className='font-normal text-gray-700'>{`SKU: ${item?.productSku}`}</p>
                                                                        </div>
                                                                    </div>
                                                                    <p className=' font-normal text-gray-700'>{`$${item?.productPrice} X ${item?.OrderDetails?.quantity}`}</p>

                                                                    <p className=' font-normal text-gray-700'>{`$${item?.productPrice * item?.OrderDetails?.quantity}`}</p>
                                                                </div>
                                                            )
                                                        })}



                                                        {orderDetails?.fulfillmentStatus == "Unfulfilled" &&
                                                            <>
                                                                <hr className='my-4' />
                                                                <div className='flex justify-end'>
                                                                    <Link href={`/orders/fulfill/${orderDetails?.orderId}`}> <button className='bg-[#f12d4d] text-white font-medium py-3 px-4 rounded-md border border-[#f12d4d] '>Mark As Fulfilled</button></Link>
                                                                </div>
                                                            </>}
                                                    </div>

                                                    {/* Payment Card */}
                                                    <div className='bg-gray-100 mb-6 rounded-lg p-4 '>
                                                        {orderDetails?.productPaymentStatus === "Paid" ? <span className='mb-5 flex items-center'>
                                                            <HiOutlineCheckCircle filter='drop-shadow(0px 0px 5px rgb(35 138 87 / 0.6)' fontSize='24px' fill='#fff' color='#238a57' />
                                                            <p className='font-semibold ml-4'>{orderDetails?.productPaymentStatus}</p>
                                                        </span> : <span className='mb-5 flex items-center'>
                                                            <HiOutlineExclamationCircle filter='drop-shadow(0px 0px 5px rgb(255 19 3 / 0.6)' fontSize='24px' fill='#fff' color='red' />
                                                            <p className='font-semibold ml-4'>{orderDetails?.productPaymentStatus}</p>
                                                        </span>}

                                                        <div className='flex justify-between mb-3'>
                                                            <div className='flex w-full'>
                                                                <p className='flex-[0.3] font-normal text-gray-700'>Subtotal</p>
                                                                <p className='flex-1 font-normal text-gray-700'>{`${orderDetails?.Inventories?.length} ${orderDetails?.Inventories.length > 1 ? "Items" : "Item"}`}</p>
                                                                {/* We are counting number of items right now & not the quantity. It can be 1 product but 3 quantity but we are counting it as 1 item. */}
                                                            </div>
                                                            <p className=' font-normal text-gray-700'>{`$${orderDetails?.productSubtotal}`}</p>
                                                        </div>

                                                        <div className='flex justify-between mb-3'>
                                                            <div className='flex w-full'>
                                                                <p className='flex-[0.3] font-normal text-gray-700'>Shipping</p>
                                                                <p className='flex-1 font-normal text-gray-700'>US Global</p>
                                                            </div>
                                                            <p className=' font-normal text-gray-700'>{`$${orderDetails?.productShipping}`}</p>
                                                        </div>

                                                        <div className='flex justify-between mb-3'>
                                                            <div className='flex w-full'>
                                                                <p className='flex-[0.3] font-normal text-gray-700'>Tax</p>
                                                                <p className='flex-1 font-normal text-gray-700'>GST 10%</p>
                                                            </div>
                                                            <p className=' font-normal text-gray-700'>{`$${orderDetails?.productTaxes}`}</p>
                                                        </div>

                                                        <div className='flex justify-between mb-3'>
                                                            <div className='flex w-full'>
                                                                <p className='flex-1 font-bold text-gray-700'>Total</p>
                                                            </div>
                                                            <p className=' font-bold text-gray-700'>{`$${orderDetails?.productTotal}`}</p>
                                                        </div>

                                                        <hr className='my-4' />

                                                        <div className='flex justify-between mb-3'>
                                                            <div className='flex w-full'>
                                                                <p className='flex-1 font-normal text-gray-700'>Paid by Customer</p>
                                                            </div>
                                                            <p className=' font-normal text-gray-700'>{`$${orderDetails?.productTotal}`}</p>
                                                        </div>

                                                    </div>
                                                </div>

                                                {/* Order Meta Details */}
                                                <div className='flex-[0.5] mr-6'>
                                                    <div className='bg-gray-100 mb-6 rounded-lg p-4 '>
                                                        <span className='flex items-center justify-between'><p className='font-semibold'>Notes</p>
                                                            {editingField == "notes" ? <div className='flex items-center'>
                                                                <button type='submit'><AiOutlineCheckCircle className='cursor-pointer mr-2' fontSize="20px" /></button>
                                                                <RxCrossCircled onClick={() => setEditingField('')} className='cursor-pointer' fontSize="20px" />
                                                            </div> : <BsPencil onClick={() => setEditingField("notes")} className=' cursor-pointer' />}
                                                        </span>
                                                        {editingField !== "notes" && <p className='font-normal text-sm mt-2 text-gray-700'>{formik?.values?.orderNotes ? formik.values.orderNotes : "No notes"}</p>}
                                                        {editingField == "notes" && <textarea {...formik.getFieldProps('orderNotes')} name="orderNotes" id="orderNotes" placeholder='No Notes' className='border border-gray-300 rounded-md w-full mt-2 p-2' />}
                                                    </div>
                                                    <div className='bg-gray-100 rounded-lg  p-4 '>
                                                        <section className='mb-4'>
                                                            <span className='flex items-center justify-between'><p className='font-semibold'>Customer</p>
                                                                {editingField == "customer" ? <div className='flex items-center'>
                                                                    <button type='submit'><AiOutlineCheckCircle className='cursor-pointer mr-2' fontSize="20px" /></button>
                                                                    <RxCrossCircled onClick={() => setEditingField('')} className='cursor-pointer' fontSize="20px" />
                                                                </div> : <BsPencil onClick={() => setEditingField("customer")} className=' cursor-pointer' />}
                                                            </span>
                                                            {editingField !== "customer" && <p className='font-normal text-sm mt-2 text-gray-700'>{formik?.values?.customerName ? formik.values.customerName : "No Name"}</p>}
                                                            {editingField == "customer" && <input type="text" {...formik.getFieldProps('customerName')} name="customerName" id="customerName" placeholder='John Doe' className='border border-gray-300 rounded-md w-full mt-2 p-2' />}
                                                        </section>

                                                        <section className='mb-6'>
                                                            <span className='flex items-center justify-between'><p className='font-semibold'>Contact Information</p>
                                                                {editingField == "contact" ? <div className='flex items-center'>
                                                                    <button type='submit'><AiOutlineCheckCircle className='cursor-pointer mr-2' fontSize="20px" /></button>
                                                                    <RxCrossCircled onClick={() => setEditingField('')} className='cursor-pointer' fontSize="20px" />
                                                                </div> : <BsPencil onClick={() => setEditingField("contact")} className=' cursor-pointer' />}
                                                            </span>
                                                            {editingField !== "contact" && <p className='font-normal text-sm mt-2 text-gray-700'>{formik?.values?.customerEmail ? formik.values.customerEmail : "No Email"}</p>}
                                                            {editingField == "contact" && <input type="text" {...formik.getFieldProps('customerEmail')} name="customerEmail" id="customerEmail" placeholder='John Doe' className='border border-gray-300 rounded-md w-full mt-2 p-2' />}

                                                            {editingField !== "contact" && <p className='font-normal text-sm mt-2 text-gray-700'>{formik?.values?.customerPhone ? formik.values.customerPhone : "No Phone Number"}</p>}
                                                            {editingField == "contact" && <input type="text" {...formik.getFieldProps('customerPhone')} name="customerPhone" id="customerPhone" placeholder='John Doe' className='border border-gray-300 rounded-md w-full mt-2 p-2' />}
                                                        </section>

                                                        <section className='mb-6'>
                                                            <span className='flex items-center justify-between'><p className='font-semibold'>Shipping Address</p>
                                                                <BsPencil onClick={() => setEditingField("shipping")} className=' cursor-pointer' /></span>
                                                            <p className='mt-1 text-sm'>{formik?.values?.customerName}</p>
                                                            <p className='mt-1 text-sm'>{formik?.values?.customerShippingAddress}</p>
                                                            <p className='mt-1 text-sm'>{formik?.values?.customerPincode}</p>
                                                            <p className='mt-1 text-sm'>{formik?.values?.customerShippingCountry}</p>
                                                            <p className='mt-1 text-sm'>{formik?.values?.customerPhone}</p>
                                                            <p className='mt-1 text-sm underline'>View map</p>
                                                        </section>

                                                        <section className='mb-6'>
                                                            <p className='font-semibold'>Billing Address</p>
                                                            <p className='mt-1 text-sm text-gray-400'>Same as shipping Address</p>

                                                        </section>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </Layout >
    )
}

export default OrderID

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

    const { url } = req

    const productId = url.split('/').pop()

    // Get the seller data using the email that the user is logged in with
    const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/seller/${sellerData?.data?.id}/order/${productId}`)
    const orderData = await orderResponse.json()
    if (!orderData.success) {
        return {
            redirect: {
                destination: '/orders',
                permanent: false
            }
        }
    }

    return {
        props: { session, orderData, sellerData },
    }
}

