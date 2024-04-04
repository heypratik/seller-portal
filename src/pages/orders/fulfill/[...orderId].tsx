import React, { useState, useEffect } from 'react'
import Layout from '../../layout'
import toast, { Toaster } from 'react-hot-toast';
import { HiOutlineExclamationCircle, HiOutlineCheckCircle } from 'react-icons/hi'
import { BsPencil } from 'react-icons/bs'
import { getSession } from 'next-auth/react'
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


export default function OrderID({ orderData }: { orderData: any }) {

    const orderDetails = orderData
    const [editingTrackingNumber, setEditingTrackingNumber] = useState<any>([]);
    const [editingField, setEditingField] = useState<string>();
    const [cache, setCache] = useState({});

    const handleCacheUpdate = (key: any, value: any) => {
        setCache(prevCache => ({ ...prevCache, [key]: value }));
    };

    function returnPrice(item: any) {
        if (item?.productVariationId) {
            return item?.ordered_products[0]?.productVariations.find((variation: any) => variation.id === item?.productVariationId)?.price
        } else {
            return item?.ordered_products[0]?.productPrice
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

    function handleInputChange(e: any, id: any, type: any) {
        const value = e.target.value;
        const existingIndex = editingTrackingNumber.findIndex((item: any) => item.id === id);

        if (existingIndex !== -1) {
            // If the object with the same ID already exists, update it
            const updatedEditingTrackingNumber = [...editingTrackingNumber];
            updatedEditingTrackingNumber[existingIndex] = {
                ...updatedEditingTrackingNumber[existingIndex],
                [type]: value,
            };
            setEditingTrackingNumber(updatedEditingTrackingNumber);
        } else {
            // If the object with the ID doesn't exist, create a new one
            const newItem = { id, [type]: value };
            setEditingTrackingNumber([...editingTrackingNumber, newItem]);
        }
    }

    async function handleSubmit() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/fulfill-order/${orderDetails?.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editingTrackingNumber),
        });

        const data = await response.json();

        if (data.success) {
            notification(true, 'Tracking Number Added successfully')
        } else {
            notification(false, 'Something Went Wrong')
        }
    }

    function notification(success: boolean, message: string | undefined) {
        if (success) {
            toast.success(message!)
        } else {
            toast.error(message || 'An error occurred')
        }

    }

    useEffect(() => {
        if (orderDetails?.orderItems) {
            const newEditingTrackingNumber = orderDetails?.orderItems.map((item: any) => ({
                id: item.id,
                tracking: item?.shipmentTrackingNo || '',
                carrier: item?.shipmentCarrier || '',
            }));
            setEditingTrackingNumber(newEditingTrackingNumber);
        }
    }, [orderDetails]);

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
                                                <h1 className='mr-5 text-2xl font-bold text-gray-900'>#{orderDetails?.id}</h1>
                                            </div>
                                        </section>

                                        <div className='flex items-start justify-start'>
                                            <div className='flex-1 flex-col'>
                                                {orderDetails?.orderItems?.map((item: any, index: number) => (
                                                    <div key={index} className='parentdiv flex items-start'>
                                                        <div className='flex-1 mr-6'>
                                                            <div className='bg-gray-100 mb-6 rounded-lg px-4 py-6 '>
                                                                <span className='mb-5 flex items-center'>
                                                                    {item?.shipmentTrackingNo ? <HiOutlineCheckCircle className='text-green-500' /> : <HiOutlineExclamationCircle className='text-red-500' />}
                                                                    <p className='font-semibold ml-4'>{item?.shipmentTrackingNo ? 'Fulfilled' : 'Unfulfilled'}</p></span>
                                                                {/* Product Card  */}
                                                                <div className='flex items-center justify-between'>
                                                                    <div className='flex items-center'>
                                                                        <div>{returnImage(item)}</div>
                                                                        <div className='ml-4'>
                                                                            <p className=' font-normal text-gray-700'>{item.ordered_products[0].productName}</p>
                                                                        </div>
                                                                    </div>

                                                                    <p className=' font-normal text-gray-700'>{`$${returnPrice(item)} X ${Number(item?.quantity)}`}</p>

                                                                    <p className=' font-normal text-gray-700'>{`$${Number(returnPrice(item)) * Number(item?.quantity)}`}</p>
                                                                </div>
                                                                <hr className='my-4' />
                                                                <p className=' font-semibold'>Tracking Information</p>
                                                                <div className='flex items-center mt-4'>
                                                                    <div className='mr-2 flex flex-col w-full'>
                                                                        <label>Tracking Number</label>
                                                                        <input value={editingTrackingNumber.find((obj: any) => obj.id === item.id)?.tracking || ''} onChange={(e) => handleInputChange(e, item.id, "tracking")} type="text" placeholder='Enter tracking number' className='mt-2 flex-1 border border-gray-300 rounded-lg py-1 px-3' />
                                                                    </div>
                                                                    <div className='ml-2 flex flex-col w-full'>
                                                                        <label>Shipping Carrier</label>
                                                                        <input value={editingTrackingNumber.find((obj: any) => obj.id === item.id)?.carrier || ''} onChange={(e) => handleInputChange(e, item.id, "carrier")} type="text" placeholder='Shipping Carrier' className='mt-2 flex-1 border border-gray-300 rounded-lg py-1 px-3' />
                                                                    </div>
                                                                </div>
                                                                {/* <hr className='my-6' /> */}

                                                                {/* <p className=' font-semibold'>Notify Customer of Shipment</p>
                                                        <div className='flex items-center mt-2'>
                                                            <input type="checkbox" className='mr-2 w-4 h-4' />
                                                            <p>Send shipment details to customer now</p>
                                                        </div> */}

                                                            </div>

                                                        </div>
                                                    </div>
                                                ))}

                                            </div>
                                            <div className='flex-[0.5] mr-6'>
                                                <div className='bg-gray-100 rounded-lg  p-4 '>
                                                    <section className=''>
                                                        <span className='flex items-center justify-between'><p className='font-semibold'>Shipping Address</p>
                                                            {/* <BsPencil onClick={() => setEditingField("shipping")} className=' cursor-pointer' /> */}
                                                        </span>
                                                        <p className='mt-1 text-sm'>{orderDetails.shipping_address.name}</p>
                                                        <p className='mt-1 text-sm'>{orderDetails.shipping_address.address}</p>
                                                        <p className='mt-1 text-sm'>{orderDetails.shipping_address.city}, {orderDetails.shipping_address.state}, {orderDetails.shipping_address.pincode}</p>
                                                        <p className='mt-1 text-sm'>{orderDetails.shipping_address.country}</p>
                                                        <p className='mt-1 text-sm'>{orderDetails.shipping_address.mobileNumber}</p>
                                                        <a target='_blank' rel='noreferrer' href={`https://www.google.com/maps/search/?api=1&query=${orderDetails.shipping_address.address}+${orderDetails.shipping_address.city}+${orderDetails.shipping_address.state}+${orderDetails.shipping_address.pincode}+${orderDetails.shipping_address?.country}`}><p className='mt-1 text-sm underline'>View map</p></a>
                                                    </section>
                                                </div>


                                                <section className='mt-6'>
                                                    <button onClick={() => handleSubmit()} className=' rounded-md bg-[#f12d4d] text-white text-center p-2'>Fulfill Items</button>
                                                </section>

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

    const orderId = url.split('/').pop()
    const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${sellerData?.data?.Brands[0]?.id}/${orderId}`)
    const orderDataJson = await orderResponse.json()
    if (orderDataJson?.orders?.length == 0) {
        return {
            redirect: {
                destination: '/orders',
                permanent: false
            }
        }
    }

    const orderData = orderDataJson.orders[0]

    return {
        props: { sellerData, session, orderData },
    }
}

