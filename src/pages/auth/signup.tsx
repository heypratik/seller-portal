import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useFormik } from 'formik';
import signupValidate from '../../../forms/signupValidate';
import Link from 'next/link';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { BiError } from 'react-icons/bi'
import toast, { Toaster } from 'react-hot-toast';
import { createCustomer } from '../../../lib/createCustomer'
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";


export default function SignUp() {

    const router = useRouter();

    const [signUpSuccessfull, setSignUpSuccessfull] = useState(false)
    const [signupErrors, setSignupErrors] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showPassReq, setShowPassReq] = useState(false)

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            cpassword: "",
        },
        validate: signupValidate,
        onSubmit
    })

    const nameValidErr = formik.errors.name && formik.touched.name
    const emailValidErr = formik.errors.email && formik.touched.email
    const passwordValidErr = formik.errors.password && formik.touched.password
    const cpasswordValidErr = formik.errors.cpassword && formik.touched.cpassword

    const formDisabled = !formik.values.name || !formik.values.email || !formik.values.password || !formik.values.cpassword

    const inputStyles = `outline-none shadow-[0px_3px_0px_0px_#00000024] w-full border border-brand-border-sec rounded-md px-4 py-3 mt-2`

    async function onSubmit(values: { name: string; email: string; password: string }): Promise<void> {

        // Add Button loading state
        // Add Error icon for Error messages
        setLoading(true)

        if (!isStrongPassword(values.password)) {
            notification(false, "Password must contain at least 8 characters, one special character, one letter and one number")
            setLoading(false)
            return
        }

        const stripeCustomerID = await createCustomer(values.name, values.email)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sellers/signup`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ name: values.name.trim(), email: values.email, password: values.password, stripeCustomerID: stripeCustomerID })
        })
        const data = await response.json()
        // {
        //     "success": true,
        //     "message": "Seller signup successful.",
        //     "data": {
        //         "active": true,
        //         "id": 1,
        //         "name": "test1@gmail.com",
        //         "email": "test1@gmail.com",
        //         "password": "68eacb97d86f0c4621fa2b0e17cabd8c",
        //         "updatedAt": "2023-06-06T14:26:16.736Z",
        //         "createdAt": "2023-06-06T14:26:16.736Z"
        //     }
        // }

        if (data.success) {
            notification(true, "Signup Successful")
            setLoading(false)
            setSignUpSuccessfull(true)
            router.push('/brand')
        } else {
            notification(false, "Something went wrong")
            setLoading(false)
            setSignupErrors(data.message)
        }
    }

    function notification(success: boolean, message: string | undefined) {
        if (success) {
            toast.success(message!)
        } else {
            toast.error(message || 'An error occurred')
        }

    }

    function isStrongPassword(password: any) {
        if (password.length < 8) {
            return false;
        }

        // Check if the password contains at least one special character
        const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if (!specialCharacters.test(password)) {
            return false;
        }

        // Check if the password contains both letters and numbers
        const containsLetters = /[a-zA-Z]+/;
        const containsNumbers = /[0-9]+/;
        if (!containsLetters.test(password) || !containsNumbers.test(password)) {
            return false;
        }

        // If all conditions are met, the password is strong
        return true;
    }

    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <Toaster position="top-center" reverseOrder={true} />
            <div className=' bg-[url("/login.png")] bg-cover bg-center w-full h-full '></div>
            <div className=' w-full h-full p-4  bg-[#f9f8f8] flex justify-start flex-col py-10 px-10 overflow-auto'>
                <div className='flex justify-end items-end'>
                    <img width={'8%'} src='/logo.svg' />
                </div>

                <div className=' bg-[#f9f8f8]'>
                    <h1 className=' text-center font-normal text-4xl pt-10 '><span className=' font-medium text-[#f12d4d]'>Become</span>  our Member</h1>

                    <div className='w-full mt-12 max-w-xl flex justify-center m-auto flex-col'>
                        <form onSubmit={formik.handleSubmit}>
                            <div className='flex items-center justify-between'>
                                <label className='flex-1 mr-2'>
                                    <p className=' text-md font-medium'>Name</p>
                                    <input {...formik.getFieldProps('name')} name='name' type="text" placeholder="John Doe" className={`${inputStyles} ${nameValidErr && 'border-red-500'}`} />
                                </label>

                                <label className='flex-1 ml-2'>
                                    <p className='text-md font-medium'>Email</p>
                                    <input {...formik.getFieldProps('email')} name='email' type="email" placeholder="john-doe@gmail.com" className={`${inputStyles} ${emailValidErr && 'border-red-500'}`} />
                                </label>
                            </div>

                            <div className='flex items-center justify-between mt-10'>
                                <label className='flex-1 mr-2'>
                                    <p className='text-md font-medium'>Password</p>
                                    <span className={`${inputStyles} ${passwordValidErr && 'border-red-500'} bg-white flex justify-between items-center`}><input {...formik.getFieldProps('password')} name='password' type={showPassword ? 'text' : 'password'} placeholder="Atleast 6 Characters" className='w-full outline-none' />{showPassword ? <IoEyeOutline onClick={() => setShowPassword(!showPassword)} className=' cursor-pointer' /> : <IoEyeOffOutline onClick={() => setShowPassword(!showPassword)} className=' cursor-pointer' />}</span>
                                </label>

                                <label className='flex-1 ml-2'>
                                    <p className='text-md font-medium'>Confirm Password</p>
                                    <span className={`${inputStyles} ${passwordValidErr && 'border-red-500'} bg-white flex justify-between items-center`}><input {...formik.getFieldProps('cpassword')} name='cpassword' type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" className='w-full outline-none' />{showPassword ? <IoEyeOutline onClick={() => setShowPassword(!showPassword)} className=' cursor-pointer' /> : <IoEyeOffOutline onClick={() => setShowPassword(!showPassword)} className=' cursor-pointer' />}</span>
                                </label>
                            </div>

                            <button disabled={formDisabled || Object.keys(formik.errors).length > 0} type="submit" className='h-12 flex justify-center items-center text-white bg-[#f12d4d] w-full rounded-md text-xl font-semibold mt-12'>{loading ? <AiOutlineLoading3Quarters className='spinner' /> : `Sign up`}</button>
                        </form>
                    </div>

                    {signupErrors && <div className='flex items-center justify-center text-sm text-red-500 font-semibold mt-4 text-center w-full'><BiError /> <p className='ml-2'>{signupErrors}</p></div>}

                    <p className='mt-8 text-center w-full'>Already Have an account? <Link href='/auth/login'><span className=' font-medium text-[#f12d4d]'>Login</span></Link></p>
                </div>
            </div>
        </div >
    )
}
