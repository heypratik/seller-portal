import React, { useState, useEffect } from 'react'
import Layout from '../layout'
import toast, { Toaster } from 'react-hot-toast';
import { HiOutlineExclamationCircle, HiOutlineCheckCircle } from 'react-icons/hi'
import { BsPencil } from 'react-icons/bs'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { RxCrossCircled } from 'react-icons/rx'
import { useFormik } from 'formik';
import { getSession, useSession } from 'next-auth/react'
import Link from 'next/link';
import { useRouter } from 'next/router'
import { CiImageOn } from 'react-icons/ci'

// API Configurations
const baseURL = "https://dev.mybranzapi.link";
const postMediaEndpoint = "media/single";
const mediaEndpoint = "media/%s";
const token = "fb507a0b75e0f62f65b798424555733f";

const CustomImage = ({ objectKey, token, removeImage, cache, updateCache }: { objectKey: string, token: string, removeImage: any, cache: any, updateCache: any }) => {
    const [imageData, setImageData] = useState<string | null>(null);
    useEffect(() => {
        const fetchImage = async () => {
            if (cache[objectKey]) {
                setImageData(cache[objectKey])
            } else {
                try {
                    const response = await fetch(
                        `${baseURL}/${mediaEndpoint.replace(/%s/, objectKey)}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    if (response.ok) {

                        const blob = await response.blob();
                        const imageUrl = URL.createObjectURL(blob);
                        setImageData(imageUrl);
                        updateCache(objectKey, imageUrl);
                    }
                } catch (error) {
                    updateCache(objectKey, null);
                    console.log("Error fetching image:", error);
                }
            }
        };

        fetchImage();
    }, [objectKey]);

    return imageData ? (
        <img
            src={imageData}
            alt={`custom-${imageData}`}
            className="w-[40px] h-[40px] border-2 object-cover border-gray-200 rounded-md prod-images"
        />
    ) : (
        <div className='text-xs'>Loading image...</div>
    );
};


function OrderID({ orderData, sellerData }: { orderData: any, sellerData: any }) {

    const [cache, setCache] = useState({});

    const handleCacheUpdate = (key: any, value: any) => {
        setCache(prevCache => ({ ...prevCache, [key]: value }));
    };

    const orderDetails = orderData.orders[0]

    console.log(orderDetails)

    // console.log(sellerData.data.Brands[0])

    const [editingField, setEditingField] = useState<string>();
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const formik = useFormik({
        initialValues: {
            orderNotes: orderDetails?.orderNotes ? orderDetails?.orderNotes : "No Notes",
            customerShippingName: orderDetails?.shipping_address?.name ? orderDetails?.shipping_address?.name : "No Name",
            customerShippingEmail: orderDetails?.shipping_address?.email ? orderDetails?.shipping_address?.email : "No Email",
            customerShippingAddress: orderDetails?.shipping_address?.address ? orderDetails?.shipping_address?.address : "No Address",
            customerShippingCountry: orderDetails?.shipping_address?.country ? orderDetails?.shipping_address?.country : "No Country",
            customerPincode: orderDetails?.shipping_address?.pincode ? orderDetails?.shipping_address?.pincode : "No Pincode",

            customerEmail: orderDetails?.billing_address?.email ? orderDetails?.billing_address?.email : "No Email",
            customerName: orderDetails?.billing_address?.name ? orderDetails?.billing_address?.name : "No Name",
            customerPhone: orderDetails?.billing_address?.mobileNumber ? orderDetails?.billing_address?.mobileNumber : "No Phone Number",
            customerBillingAddress: orderDetails?.billing_address?.address ? orderDetails?.billing_address?.address : "No Address",
            customerBillingCountry: orderDetails?.billing_address?.country ? orderDetails?.billing_address?.country : "No Country",
            customerBillingPincode: orderDetails?.billing_address?.pincode ? orderDetails?.billing_address?.pincode : "No Pincode",
        },
        onSubmit
    })

    async function onSubmit(values: { orderNotes: string, customerName: string, customerEmail: string, customerPhone: string, customerShippingAddress: string, customerShippingCountry: string, customerPincode: string, customerBillingAddress: string, customerBillingCountry: string, customerBillingPincode: string, customerShippingName: string }) {
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
                                                    <h1 className='mr-5 text-2xl font-bold text-gray-900'>{`#${orderDetails?.id.toUpperCase()}`}</h1>
                                                    {
                                                        orderDetails?.paymentStatus === 'FAILED' ? <span className='text-white mr-5 bg-red-500 text-sm py-1 px-4 rounded-full flex items-center'>
                                                            <HiOutlineExclamationCircle className='mr-2 text-white' />
                                                            <p className=''>{orderDetails?.paymentStatus}</p>
                                                        </span> : <span className='mr-5 bg-green-600 font-medium text-white text-sm py-1 px-4 rounded-full flex items-center'>
                                                            <AiOutlineCheckCircle className='mr-2' />
                                                            <p className=''>{orderDetails?.paymentStatus}</p>
                                                        </span>
                                                    }
                                                    {orderDetails?.paymentStatus == "PAID" && orderDetails?.status === 'Unfulfilled' && <span className='mr-5 bg-yellow-200 text-sm py-1 px-4 rounded-full flex items-center'>
                                                        <HiOutlineExclamationCircle className='mr-2' />
                                                        <p className=''>{orderDetails?.status}</p>
                                                    </span>}
                                                    {orderDetails?.paymentStatus == "PAID" && orderDetails?.status !== 'Unfulfilled' && <span className='mr-5 bg-green-600 font-medium text-white text-sm py-1 px-4 rounded-full flex items-center'>
                                                        <AiOutlineCheckCircle className='mr-2' />
                                                        <p className=''>{orderDetails?.status}</p>
                                                    </span>}
                                                    {/* <button className='mr-5 bg-gray-200 text-sm text-gray-800 font-medium rounded-lg py-1 px-3'>Refund</button> */}
                                                    <select className='mr-5 bg-gray-200 text-sm text-gray-800 font-medium rounded-lg py-1 px-3'>
                                                        <option>More Options</option>
                                                        <option>Cancel Order</option>

                                                    </select>
                                                </div>
                                                <span className='font-normal text-sm text-gray-600'>{`${new Date(orderDetails?.createdAt).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })} from MyBranz App`}</span>
                                            </section>

                                            <div className='parentdiv flex items-start'>
                                                <div className='flex-1 mr-6'>
                                                    <div className='bg-gray-100 mb-6 rounded-lg p-4 '>
                                                        {orderDetails?.status === 'Unfulfilled' ? <span className='mb-5 flex items-center'>
                                                            <HiOutlineExclamationCircle filter='drop-shadow(0px 0px 5px rgb(255 19 3 / 0.6)' fontSize='24px' fill='#fff' color='red' />
                                                            <p className='font-semibold ml-4'>{orderDetails?.status}</p>
                                                        </span> : <span className='mb-5 flex items-center'>
                                                            <HiOutlineCheckCircle filter='drop-shadow(0px 0px 5px rgb(35 138 87 / 0.6)' fontSize='24px' fill='#fff' color='#238a57' />
                                                            <p className='font-semibold ml-4'>{orderDetails?.status}</p>
                                                        </span>}
                                                        {/* Product Card  */}
                                                        <div className="grid grid-cols-6 gap-4">
                                                            <div className="col-span-4 font-semibold text-gray-700">Product Name</div>
                                                            <div className="col-span-1 font-semibold text-gray-700">Price</div>
                                                            <div className="col-span-1 font-semibold text-gray-700">Total</div>
                                                        </div>
                                                        {orderDetails?.orderItems?.map((item: any, index: any) => {
                                                            function returnPrice(item: any) {
                                                                if (item?.productVariationId) {
                                                                    return item?.ordered_products[0]?.productVariations.find((variation: any) => variation.id === item?.productVariationId)?.price
                                                                } else {
                                                                    return item?.ordered_products[0]?.productPrice
                                                                }
                                                            }

                                                            function returnVariations(item: any) {

                                                                if (item?.productVariationId) {
                                                                    let finalObject = []
                                                                    const names = [];
                                                                    for (let i = 0; i < item?.ordered_products[0]?.variantOptions.length; i++) {
                                                                        names.push(item?.ordered_products[0]?.variantOptions[i].name);
                                                                    }
                                                                    const variations = item?.ordered_products[0]?.productVariations.find((variation: any) => variation.id === item?.productVariationId)?.options

                                                                    for (let i = 0; i < names.length; i++) {
                                                                        let obj = { name: names[i], value: variations[i] };
                                                                        finalObject.push(obj);
                                                                    }

                                                                    return finalObject.map((variation: any, index: any) => {
                                                                        return `${variation.name}: ${variation.value}`
                                                                    }).join(', ')
                                                                } else {
                                                                    return "No Variations"
                                                                }
                                                            }

                                                            function returnImage(item: any) {
                                                                if (item?.ordered_products[0]?.productImagesArray) {
                                                                    if (item?.ordered_products[0]?.productImagesArray[0].includes('http')) {
                                                                        return <img width="40px" height="80px" className='rounded-md border shadow-sm border-[#DDDDDD]' src={item?.ordered_products[0]?.productImagesArray} />
                                                                    } else {
                                                                        return <CustomImage objectKey={item?.ordered_products[0]?.productImagesArray[0]} token={token} removeImage={null} cache={cache} updateCache={handleCacheUpdate} />
                                                                    }
                                                                } else {
                                                                    return <div className=' bg-gray-50 rounded-md h-[40px] w-[40px] border shadow-sm border-[#DDDDDD] flex items-center justify-center'>
                                                                        <CiImageOn color='#818181' fontSize="20px" />
                                                                    </div>
                                                                }
                                                            }

                                                            return (
                                                                <>

                                                                    <div key={index} className="mt-4 grid grid-cols-6 gap-4 items-center">
                                                                        <div className="col-span-4 flex items-center">
                                                                            <div>{returnImage(item)}</div>
                                                                            <div className="ml-4">
                                                                                <p className="font-normal text-gray-700 truncate">{item?.ordered_products[0]?.productName}</p>
                                                                                <p className="text-sm font-normal text-gray-400">{`SKU: ${item?.ordered_products[0]?.productSku}`}</p>
                                                                                {item?.productVariationId && <p className="text-sm font-normal text-gray-400">{`Variation: ${returnVariations(item)}`}</p>}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-span-1 font-normal text-gray-700">{`$${returnPrice(item)} X ${Number(item?.quantity)}`}</div>
                                                                        <div className="col-span-1 font-normal text-gray-700">{`$${Number(returnPrice(item)) * Number(item?.quantity)}`}</div>
                                                                    </div>
                                                                </>
                                                            )
                                                        })}



                                                        {orderDetails?.status == "Unfulfilled" &&
                                                            <>
                                                                <hr className='my-4' />
                                                                <div className='flex justify-end'>
                                                                    <Link href={`/orders/fulfill/${orderDetails?.id}`}> <button className='bg-[#f12d4d] text-white font-medium py-3 px-4 rounded-md border border-[#f12d4d] '>Mark As Fulfilled</button></Link>
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
                                                                <p className='flex-1 font-normal text-gray-700'>{`${orderDetails?.orderedItems?.length} ${orderDetails?.Inventories?.length > 1 ? "Items" : "Item"}`}</p>
                                                                {/* We are counting number of items right now & not the quantity. It can be 1 product but 3 quantity but we are counting it as 1 item. */}
                                                            </div>
                                                            <p className=' font-normal text-gray-700'>{`$${orderDetails?.totalMrp}`}</p>
                                                        </div>

                                                        <div className='flex justify-between mb-3'>
                                                            <div className='flex w-full'>
                                                                <p className='flex-[0.3] font-normal text-gray-700'>Shipping</p>
                                                                <p className='flex-1 font-normal text-gray-700'>US Global</p>
                                                            </div>
                                                            <p className=' font-normal text-gray-700'>{`$${orderDetails?.productShipping}`}</p>
                                                        </div>

                                                        {/* <div className='flex justify-between mb-3'>
                                                                <div className='flex w-full'>
                                                                    <p className='flex-[0.3] font-normal text-gray-700'>Tax + Fees</p>
                                                                    <p className='flex-1 font-normal text-gray-700'>Convenience Fee</p>
                                                                </div>
                                                                <p className=' font-normal text-gray-700'>{`$${orderDetails?.convenienceFee}`}</p>
                                                            </div>

                                                            <div className='flex justify-between mb-3'>
                                                                <div className='flex w-full'>
                                                                    <p className='flex-[0.3] font-normal text-gray-700'>Discount</p>
                                                                    <p className='flex-1 font-normal text-gray-700'>Coupon Code</p>
                                                                </div>
                                                                <p className=' font-normal text-gray-700'>{`$${orderDetails?.discount}`}</p>
                                                            </div> */}

                                                        <div className='flex justify-between mb-3'>
                                                            <div className='flex w-full'>
                                                                <p className='flex-1 font-bold text-gray-700'>Total</p>
                                                            </div>
                                                            <p className=' font-bold text-gray-700'>{`$${orderDetails?.finalAmount}`}</p>
                                                        </div>

                                                        <hr className='my-4' />

                                                        <div className='flex justify-between mb-3'>
                                                            <div className='flex w-full'>
                                                                <p className='flex-1 font-normal text-gray-700'>Paid by Customer</p>
                                                            </div>
                                                            <p className=' font-normal text-gray-700'>{`$${orderDetails?.finalAmount}`}</p>
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
                                                                {editingField == "shipping" ? <div className='flex items-center'>
                                                                    <button type='submit'><AiOutlineCheckCircle className='cursor-pointer mr-2' fontSize="20px" /></button>
                                                                    <RxCrossCircled onClick={() => setEditingField('')} className='cursor-pointer' fontSize="20px" />
                                                                </div> : <BsPencil onClick={() => setEditingField("shipping")} className=' cursor-pointer' />}
                                                            </span>
                                                            <p className='mt-1 text-sm'>{formik?.values?.customerShippingName}</p>
                                                            {editingField == "shipping" ? <input type="text" {...formik.getFieldProps('customerShippingAddress')} name="customerShippingAddress" id="customerShippingAddress" placeholder='123 Main St.' className='border border-gray-300 rounded-md w-full mt-2 p-2' /> : <p className='mt-1 text-sm'>{formik?.values?.customerShippingAddress}</p>}

                                                            {editingField == "shipping" ? <input type="text" {...formik.getFieldProps('customerPincode')} name="customerPincode" id="customerPincode" placeholder='Pincode 9001' className='border border-gray-300 rounded-md w-full mt-2 p-2' /> : <p className='mt-1 text-sm'>{formik?.values?.customerPincode}</p>}

                                                            {editingField == "shipping" ? <input type="text" {...formik.getFieldProps('customerShippingCountry')} name="customerShippingCountry" id="customerShippingCountry" placeholder='USA' className='border border-gray-300 rounded-md w-full mt-2 p-2' /> : <p className='mt-1 text-sm'>{formik?.values?.customerShippingCountry}</p>}

                                                            <p className='mt-1 text-sm'>{formik?.values?.customerPhone}</p>
                                                            <a target='_blank' rel='noreferrer' href={`https://www.google.com/maps/search/?api=1&query=${formik?.values?.customerShippingAddress}+${formik?.values?.customerPincode},${formik?.values?.customerShippingCountry}`}><p className='mt-1 text-sm underline'>View map</p></a>
                                                        </section>

                                                        <section className='mb-6'>
                                                            <span className='flex items-center justify-between'><p className='font-semibold'>Billing Address</p>
                                                                {editingField == "billing" ? <div className='flex items-center'>
                                                                    <button type='submit'><AiOutlineCheckCircle className='cursor-pointer mr-2' fontSize="20px" /></button>
                                                                    <RxCrossCircled onClick={() => setEditingField('')} className='cursor-pointer' fontSize="20px" />
                                                                </div> : <BsPencil onClick={() => setEditingField("billing")} className=' cursor-pointer' />}
                                                            </span>
                                                            <p className='mt-1 text-sm'>{formik?.values?.customerName}</p>
                                                            {editingField == "billing" ? <input type="text" {...formik.getFieldProps('customerBillingAddress')} name="customerBillingAddress" id="customerBillingAddress" placeholder='123 Main St.' className='border border-gray-300 rounded-md w-full mt-2 p-2' /> : <p className='mt-1 text-sm'>{formik?.values?.customerBillingAddress}</p>}

                                                            {editingField == "billing" ? <input type="text" {...formik.getFieldProps('customerBillingPincode')} name="customerBillingPincode" id="customerBillingPincode" placeholder='Pincode 9001' className='border border-gray-300 rounded-md w-full mt-2 p-2' /> : <p className='mt-1 text-sm'>{formik?.values?.customerBillingPincode}</p>}

                                                            {editingField == "billing" ? <input type="text" {...formik.getFieldProps('customerBillingCountry')} name="customerBillingCountry" id="customerBillingCountry" placeholder='USA' className='border border-gray-300 rounded-md w-full mt-2 p-2' /> : <p className='mt-1 text-sm'>{formik?.values?.customerBillingCountry}</p>}

                                                            <p className='mt-1 text-sm'>{formik?.values?.customerPhone}</p>
                                                            <a target='_blank' rel='noreferrer' href={`https://www.google.com/maps/search/?api=1&query=${formik?.values?.customerBillingAddress}+${formik?.values?.customerBillingPincode},${formik?.values?.customerBillingCountry}`}><p className='mt-1 text-sm underline'>View map</p></a>
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

    if (!sellerData?.data?.isPlanActive) {
        return {
            redirect: {
                destination: '/account',
                permanent: false
            }
        }
    }

    const { url } = req

    const productId = url.split('/').pop()

    // Get the seller data using the email that the user is logged in with
    const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/1/${productId}`)
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

