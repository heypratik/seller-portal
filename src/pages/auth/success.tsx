import React from 'react'
import Link from 'next/link';

export default function Success() {
    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <div className='flex-[0.7] w-full h-full p-4  bg-[#fff] flex justify-center flex-col py-10 px-10 overflow-auto'>
                <div className='flex justify-center items-center'>
                    <img width={'15%'} src='/logo.svg' />
                </div>

                <div className='bg-[#fff]'>
                    <h1 className='text-center text-4xl pt-10 font-medium text-[#f12d4d]'>Thanks for your interest in joining our community</h1>

                    <p className='mt-6 text-center w-full'>We will review your application and <br></br>reach out soon with a decision.</p>
                </div>
            </div>
            <div className='flex-1 bg-[url("/success.png")] bg-cover bg-center w-full h-full '> </div>

        </div >
    )
}
