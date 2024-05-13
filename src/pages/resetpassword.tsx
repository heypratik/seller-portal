import React, { useState } from 'react'
import { MdOutlineError } from "react-icons/md";
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useFormik } from 'formik';
import signupValidate from '../../forms/signupValidate';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router'
import { FaCheckCircle } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

export default function Resetpassword({ token, data }: any) {

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [emailSent, setEmailSent] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            password: "",
            cpassword: "",
        },
        validate: signupValidate,
        onSubmit
    })

    const passwordValidErr = formik.errors.password && formik.touched.password
    const cpasswordValidErr = formik.errors.cpassword && formik.touched.cpassword

    const formDisabled = !formik.values.password || !formik.values.cpassword

    const inputStyles = `outline-none shadow-[0px_3px_0px_0px_#00000024] w-full border border-brand-border-sec rounded-md px-4 py-3 mt-5`

    async function onSubmit(values: { password: string }) {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sellers/resetpassword`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ token: token, password: values.password })
        })
        const data = await response.json()
        if (data.success) {
            notification(true, "Password reset successfully")
            setLoading(false)
            setEmailSent(true)
            router.push('/auth/login')
        } else {
            notification(false, data.message)
            setLoading(false)
        }
    }

    function notification(success: boolean, message: string | undefined) {
        if (success) {
            toast.success(message!)
        } else {
            toast.error(message || 'An error occurred')
        }
    }

    async function sendResetLink(email: string, e: any) {
        e.preventDefault()
        e.stopPropagation()
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sellers/forgotpassword`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ email: email })
        })
        const data = await response.json()
        if (data.success) {
            notification(true, "Password reset link sent successfully")
            setLoading(false)
        } else {
            notification(false, data.message)
            setLoading(false)
        }
    }

    return (
        <>

            {!data.success && data.message === "No Token" && (
                <div className='w-full h-screen flex items-center justify-center'>
                    <Toaster position="top-center" reverseOrder={true} />
                    <div className=' bg-[url("/login.png")] bg-cover bg-center w-full h-full '></div>
                    <div className=' w-full h-full p-4  bg-[#f9f8f8] flex justify-start flex-col py-10 px-10 overflow-auto'>
                        <div className='flex justify-end items-end'>
                            <img width={'8%'} src='/logo.svg' />
                        </div>

                        <div className=' bg-[#f9f8f8]'>
                            <h1 className=' text-center font-normal text-4xl pt-10 '><span className=' font-medium text-[#f12d4d]'>Reset</span>  Password</h1>

                            <div className='w-full mt-12 max-w-xl flex justify-center m-auto flex-col'>
                                {!emailSent && <form>
                                    <input onChange={(e) => setEmail(e.target.value)} name='email' type="email" placeholder="Enter Your Email" className={`${inputStyles} ${cpasswordValidErr && 'border-red-500'}`} />
                                    <button onClick={(e) => sendResetLink(email, e)} className='h-12 flex justify-center items-center text-white bg-[#f12d4d] w-full rounded-md text-xl font-semibold mt-10'>{loading ? <AiOutlineLoading3Quarters className='spinner' /> : `Send Password Reset Link`}</button>
                                </form>}

                                {emailSent &&
                                    <div className='flex items-center justify-center'>
                                        <FaCheckCircle color='green' className='mr-2' /><p className='text-center text-lg font-semibold'>Password reset link sent to your email.</p>
                                    </div>}
                            </div>

                        </div>
                    </div>
                </div >
            )}

            {!data.success && (
                <div className='flex items-center justify-center w-full h-screen'>
                    <MdOutlineError color='red' className='mr-2' fontSize="24px" />Either the URL expired or something went wrong. Please try again.
                </div>
            )}

            {data.success && (

                <div className='w-full h-screen flex items-center justify-center'>
                    <Toaster position="top-center" reverseOrder={true} />
                    <div className=' bg-[url("/login.png")] bg-cover bg-center w-full h-full '></div>
                    <div className=' w-full h-full p-4  bg-[#f9f8f8] flex justify-start flex-col py-10 px-10 overflow-auto'>
                        <div className='flex justify-end items-end'>
                            <img width={'8%'} src='/logo.svg' />
                        </div>

                        <div className=' bg-[#f9f8f8]'>
                            <h1 className=' text-center font-normal text-4xl pt-10 '><span className=' font-medium text-[#f12d4d]'>Reset</span>  Password</h1>

                            <div className='w-full mt-12 max-w-xl flex justify-center m-auto flex-col'>
                                <form onSubmit={formik.handleSubmit}>
                                    <span className={`${inputStyles} ${passwordValidErr && 'border-red-500'} bg-white flex justify-between items-center`}>
                                        <input {...formik.getFieldProps('password')} name='password' type={showPassword ? 'text' : 'password'} placeholder="New Password: Atleast 6 Characters" className='w-full outline-none' />
                                        {showPassword ? <IoEyeOutline onClick={() => setShowPassword(!showPassword)} className=' cursor-pointer' /> : <IoEyeOffOutline onClick={() => setShowPassword(!showPassword)} className=' cursor-pointer' />}
                                    </span>
                                    <span className={`${inputStyles} ${passwordValidErr && 'border-red-500'} bg-white flex justify-between items-center`}>
                                        <input {...formik.getFieldProps('cpassword')} name='cpassword' type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" className='w-full outline-none' />
                                        {showPassword ? <IoEyeOutline onClick={() => setShowPassword(!showPassword)} className=' cursor-pointer' /> : <IoEyeOffOutline onClick={() => setShowPassword(!showPassword)} className=' cursor-pointer' />}
                                    </span>
                                    <button disabled={formDisabled || Object.keys(formik.errors).length > 0} type="submit" className='h-12 flex justify-center items-center text-white bg-[#f12d4d] w-full rounded-md text-xl font-semibold mt-10'>{loading ? <AiOutlineLoading3Quarters className='spinner' /> : `Reset Password`}</button>
                                </form>
                            </div>

                            {/* {signupErrors && <div className='flex items-center justify-center text-sm text-red-500 font-semibold mt-4 text-center w-full'><BiError /> <p className='ml-2'>{signupErrors}</p></div>} */}

                        </div>
                    </div>
                </div >

            )}
        </>
    )
}

export async function getServerSideProps({ query }: any) {
    const { token } = query;
    if (!token) {
        return {
            props: {
                data: { success: false, message: "No Token" }
            }
        }
    } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sellers/verifytoken/${token}`);
        const data = await res.json();
        return {
            props: {
                token,
                data
            }
        }
    }
}