import React, { useState } from 'react'
import Link from 'next/link';
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import toast, { Toaster } from 'react-hot-toast';


export default function Login() {

    const router = useRouter();

    const [loading, setLoading] = useState(false)

    function handlepagechange() {
        router.push('/resetpassword')
    }

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function submitFunction() {
        setLoading(true)
        const status = await signIn("credentials", {
            redirect: false,
            email: email,
            password: password,
            callbackUrl: "/dashboard"
        })

        if (status?.ok) {
            notification(true, "Login Successful")
            setLoading(false)
            router.push("/dashboard")
        } else {
            // notify user the error message from status.error
            notification(false, status?.error)
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

    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <Toaster position="top-center" reverseOrder={true} />
            <div className=' bg-[url("/login.png")] bg-cover bg-center w-full h-full '> </div>

            <div className=' w-full h-full p-4  bg-[#f9f8f8] flex justify-start flex-col py-10 px-10 overflow-auto'>
                <div className='flex justify-end items-end'>
                    <img width={'8%'} src='/logo.svg' />
                </div>

                <div className=' bg-[#f9f8f8]'>
                    <h1 className=' text-center font-normal text-4xl pt-10 '><span className=' font-medium text-[#f12d4d]'>Welcome</span> Back!</h1>

                    <div className='w-full py-14 max-w-md flex justify-center m-auto flex-col'>
                        <label>
                            <p className=' text-md font-medium'>Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='outline-none shadow-[0px_3px_0px_0px_#00000024] w-full border border-brand-border-sec rounded-md px-4 py-3 mt-2' type="email" placeholder="john-doe@gmail.com" />
                        </label>

                        <label>
                            <p className=' mt-6 text-md font-medium'>Password</p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className=' outline-none shadow-[0px_3px_0px_0px_#00000024] w-full border border-brand-border-sec rounded-md px-4 py-3 mt-2' type="password" placeholder="Atleast 6 Characters" />
                        </label>

                        <p onClick={() => handlepagechange()} className=' cursor-pointer text-right underline text-[#646464c8] mt-7'>Forgot your password?</p>

                        <button onClick={submitFunction} disabled={password.length < 7 || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)}
                            className='h-12 text-white bg-[#f12d4d] flex items-center justify-center w-full rounded-md text-xl font-semibold mt-7'>{loading ? <AiOutlineLoading3Quarters className='spinner' /> : `Login`}</button>
                    </div>

                    <p className=' text-center w-full'>New to MyBranz? <Link href='/auth/signup'><span className=' font-medium text-[#f12d4d]'>Sign up</span></Link></p>
                </div>
            </div>
        </div >
    )
}
