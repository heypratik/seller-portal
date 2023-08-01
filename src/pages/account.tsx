import React, { useState } from 'react'
import Layout from './layout'
import Breadcrums from '../../components/Breadcrums'
import { GoPencil } from 'react-icons/go'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useFormik } from 'formik';
import { getSession, useSession } from 'next-auth/react'
import toast, { Toaster } from 'react-hot-toast';

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

function Account({ sellerData, accountData }: { sellerData: SellerData, accountData: any }) {

    const sellerAccountData = accountData?.data?.seller
    const brandAccountData = accountData?.data?.brand

    const [loading, setLoading] = useState(false)
    const [editingInput, setEditingInput] = useState<string>("")

    const formik = useFormik({
        initialValues: {
            sellerName: sellerAccountData ? sellerAccountData?.name : '',
            password: sellerAccountData ? sellerAccountData?.password : '',
            bDisplayName: brandAccountData ? brandAccountData?.brandDisplayName : '',
            sellerEmail: sellerAccountData ? sellerAccountData?.email : '',
            companyName: brandAccountData ? brandAccountData?.legalBusinessName : '',
            mobileNumber: '',
        },
        onSubmit
    })

    async function onSubmit(values: { sellerName: string, password: string, bDisplayName: string, sellerEmail: string, companyName: string, mobileNumber: string }) {
        setLoading(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sellers/account/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sellerId: sellerData?.data?.id,
                    sellerName: values.sellerName,
                    password: values.password,
                    bDisplayName: values.bDisplayName,
                    sellerEmail: values.sellerEmail,
                    companyName: values.companyName,
                    mobileNumber: values.mobileNumber,
                })
            })
            const data = await response.json();
            if (data.success) {
                notification(true, "Updated successfully.");
                setLoading(false);
                setEditingInput("");
            } else {
                notification(false, "Something went wrong");
                setLoading(false);
                setEditingInput("");
            }
        } catch (error) {
            setEditingInput("");
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
            <form onSubmit={formik.handleSubmit} className='py-6 h-screen'>
                <div className="py-6 h-screen">
                    <div className="mx-auto px-4 sm:px-6 md:px-8">
                        <Breadcrums parent={"Edit Profile"} childarr={[]} />
                    </div>
                    <div className="mx-auto px-4 sm:px-6 md:px-8">
                        {/* Replace with your content */}
                        <div className="py-4">
                            <div className="bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] p-7 rounded-lg">
                                <div className='flex items-center mb-10'>
                                    <img width="100px" height="100px" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOSIZ6hZseAPKb42yOVWSqt00bWSi8yusbMQ&usqp=CAU' className=' rounded-full' />
                                    <h3 className=' text-xl font-medium ml-6'>{sellerAccountData ? sellerAccountData?.name : "Lorem Ipsum"}</h3>
                                </div>
                                <div className='flex items-center w-full'>
                                    <div className='flex-1'>
                                        <h3 className=' text-xl font-medium mt-6'>Seller Name*</h3>
                                        <div className='flex items-center justify-between bg-[#f7f9fa] outline-none focus:outline-none mt-4 border border-[#DDDDDD] rounded-md px-5 py-4 w-[470px]'><input {...formik.getFieldProps('sellerName')} disabled={editingInput !== "sellerName"} type="text" id="sellerName" name="sellerName" className="bg-[#f7f9fa] outline-none focus:outline-none w-full" placeholder='Lorem Ipsum' />
                                            <GoPencil fontSize={20} onClick={() => setEditingInput("sellerName")} className=' cursor-pointer' />
                                        </div>

                                        <h3 className=' text-xl font-medium mt-6'>Password*</h3>
                                        <div className='flex items-center justify-between bg-[#f7f9fa] outline-none focus:outline-none mt-4 border border-[#DDDDDD] rounded-md px-5 py-4 w-[470px]'><input {...formik.getFieldProps('password')} disabled={editingInput !== "password"} type="password" id="password" name="password" className="bg-[#f7f9fa] outline-none focus:outline-none w-full" placeholder='******' />
                                            <GoPencil fontSize={20} onClick={() => setEditingInput("password")} className=' cursor-pointer' />
                                        </div>

                                        <h3 className=' text-xl font-medium mt-6'>Brand Display Name*</h3>
                                        <div className='flex items-center justify-between bg-[#f7f9fa] outline-none focus:outline-none mt-4 border border-[#DDDDDD] rounded-md px-5 py-4 w-[470px]'><input {...formik.getFieldProps('bDisplayName')} disabled={editingInput !== "bDisplayName"} type="text" id="bDisplayName" name="bDisplayName" className="bg-[#f7f9fa] outline-none focus:outline-none w-full" placeholder='Lorem Ipsum' />
                                            <GoPencil fontSize={20} onClick={() => setEditingInput("bDisplayName")} className=' cursor-pointer' />
                                        </div>

                                    </div>
                                    <div className='flex-1'>
                                        <h3 className=' text-xl font-medium mt-6'>Email Address*</h3>
                                        <div className='flex items-center justify-between bg-[#f7f9fa] outline-none focus:outline-none mt-4 border border-[#DDDDDD] rounded-md px-5 py-4 w-[470px]'><input {...formik.getFieldProps('sellerEmail')} disabled={editingInput !== "sellerEmail"} type="text" id="sellerEmail" name="sellerEmail" className="bg-[#f7f9fa] outline-none focus:outline-none w-full" placeholder='abc@xyz.com' />
                                            <GoPencil fontSize={20} onClick={() => setEditingInput("sellerEmail")} className=' cursor-pointer' />
                                        </div>

                                        <h3 className=' text-xl font-medium mt-6'>Legal Company Name*</h3>
                                        <div className='flex items-center justify-between bg-[#f7f9fa] outline-none focus:outline-none mt-4 border border-[#DDDDDD] rounded-md px-5 py-4 w-[470px]'><input {...formik.getFieldProps('companyName')} disabled={editingInput !== "companyName"} type="email" id="companyName" name="companyName" className="bg-[#f7f9fa] outline-none focus:outline-none w-full" placeholder='Lorem Ipsum Inc' />
                                            <GoPencil fontSize={20} onClick={() => setEditingInput("companyName")} className=' cursor-pointer' />
                                        </div>

                                        <h3 className=' text-xl font-medium mt-6'>Mobile No*</h3>
                                        <div className='flex items-center justify-between bg-[#f7f9fa] outline-none focus:outline-none mt-4 border border-[#DDDDDD] rounded-md px-5 py-4 w-[470px]'><input {...formik.getFieldProps('mobileNumber')} disabled={editingInput !== "mobileNumber"} type="email" id="mobileNumber" name="mobileNumber" className="bg-[#f7f9fa] outline-none focus:outline-none w-full" placeholder='+91 987456321' />
                                            <GoPencil fontSize={20} onClick={() => setEditingInput("mobileNumber")} className=' cursor-pointer' />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="w-32 h-11 mt-16 bg-[#F12D4D] flex items-center justify-center rounded-md text-white text-base font-semibold mr-10 cursor-pointer" value="Next">{loading ? <AiOutlineLoading3Quarters className='spinner' /> : `Save`}</button>
                            </div>
                        </div>
                        {/* /End replace */}
                    </div>
                </div>
            </form>
        </Layout>
    )
}

export default Account

export async function getServerSideProps({ req }: any) {
    const session = await getSession({ req })

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login',
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

    // Get the seller data using the email that the user is logged in with
    const accountResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sellers/account/${sellerData?.data?.id}`)
    const accountData = await accountResponse.json()
    if (!accountData.success) {
        return {
            props: {
                session,
                sellerData,
                accountData: null
            }
        }
    }


    return {
        props: {
            session,
            sellerData,
            accountData
        }
    }
}
