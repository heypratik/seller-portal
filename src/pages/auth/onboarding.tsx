import React, { useState } from 'react'
import Link from 'next/link';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { useRouter } from 'next/router';


export default function OnBoard() {
    const router = useRouter()

    const [countryValue, setCountryValue] = useState('')
    const [regionValue, setRegionValue] = useState('')


    function next() {
        router.push('/auth/success')
    }

    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <div className='flex-[0.8] bg-[url("/login.png")] bg-cover bg-center w-full h-full '></div>
            <div className='flex-[1] w-full h-full p-4 bg-[#f9f8f8] flex justify-start flex-col py-10 px-10 overflow-auto'>
                <div className='flex justify-end items-end'>
                    <img width={'8%'} src='/logo.svg' />
                </div>

                <div className=' bg-[#f9f8f8]'>
                    <h1 className=' text-center font-normal text-4xl pt-10 '><span className=' font-medium text-[#f12d4d]'>Tell us about</span> Your Brand</h1>

                    <div className='w-full py-14 flex justify-center m-auto flex-col'>
                        <label>
                            <p className=' text-md font-medium'>Legal company name*</p>
                            <input className='outline-none w-full border border-brand-border-sec rounded-md px-4 py-3 mt-2' type="text" placeholder="Legal company name*" />
                        </label>

                        <label>
                            <p className=' mt-6 text-md font-medium'>Brand Display name*</p>
                            <input className=' outline-none w-full border border-brand-border-sec rounded-md px-4 py-3 mt-2' type="password" placeholder="john-doe@gmail.com" />
                        </label>

                        <label>
                            <p className=' mt-6 text-md font-medium'>Address fields*</p>
                            <input className='outline-none w-full border border-brand-border-sec rounded-md px-4 py-3 mt-2' type="password" placeholder="Address Line" />
                            <input className='outline-none w-full border border-brand-border-sec rounded-md px-4 py-3 mt-3' type="password" placeholder=" Zip Code" />
                            <input className='outline-none w-full border border-brand-border-sec rounded-md px-4 py-3 mt-3' type="password" placeholder="City" />
                            <RegionDropdown country={countryValue} onChange={(e) => setRegionValue(e)} classes='outline-none w-full border border-brand-border-sec rounded-md px-4 py-3 mt-3' value={regionValue} />
                            <CountryDropdown onChange={(e) => setCountryValue(e)} value={countryValue} classes='mt-4 border w-full border-brand-border px-4 h-12 rounded text-brand-text' />
                        </label>

                        <label>
                            <p className=' mt-6 text-md font-medium'>Phone Number*</p>
                            <input className='outline-none w-full border border-brand-border-sec rounded-md px-4 py-3 mt-2' type="password" placeholder="+1 225-458-9642" />
                        </label>

                        <button onClick={next} className='py-3 text-white bg-[#f12d4d] w-full rounded-md text-xl font-semibold mt-7'>Next</button>
                    </div>
                </div>
            </div>
        </div >
    )
}
