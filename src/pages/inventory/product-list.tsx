import React from 'react'
import Layout from '../layout'
import Breadcrums from '../../../components/Breadcrums'

export default function ProductList() {
    return (
        <Layout>
            <div className="py-6 h-screen">
                <div className="mx-auto px-4 sm:px-6 md:px-8 ">
                    <Breadcrums parent={"Inventory"} childarr={["Add Product"]} />
                </div>
                <div className="mx-auto px-4 sm:px-6 md:px-8 pb-24">
                    {/* Replace with your content */}
                    <div className="py-4">
                        <div className="bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] rounded-lg p-7">
                            <h1 className=' text-[#F12D4D] text-2xl font-semibold'>Product Listing</h1>
                            <div className='flex w-full h-full'>
                                <div className='flex-1'>
                                    <h3 className=' text-xl font-medium mt-6'>Product Name*</h3>
                                    <input type="text" id="name" name="name" className="bg-[#f7f9fa] outline-none focus:outline-none mt-4 rounded-md px-5 py-4 w-[470px]" placeholder='Enter Product Name' />

                                    <h3 className=' text-xl font-medium mt-14'>Product Category*</h3>
                                    <select className='mt-4 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[470px]'>
                                        <option value="English">Select Product Category</option>
                                        <option value="Spanish">Category 1</option>
                                    </select>

                                    <h3 className=' text-xl font-medium mt-14'>Product Options*</h3>
                                    <div className='flex items-center justify-start mt-4'>
                                        <div>
                                            <select className='mr-3 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]'>
                                                <option value="English">Color</option>
                                                <option value="Spanish">Category 1</option>
                                            </select>
                                        </div>

                                        <div>
                                            <select className='mr-3 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]'>
                                                <option value="English">Size</option>
                                                <option value="Spanish">Category 1</option>
                                            </select>
                                        </div>

                                        <div>
                                            <select className='outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]'>
                                                <option value="English">Quantity</option>
                                                <option value="Spanish">Category 1</option>
                                            </select>
                                        </div>
                                    </div>

                                    <h3 className=' text-xl font-medium mt-14'>Product Description*</h3>
                                    <textarea rows={3} id="description" name="description" className="bg-[#f7f9fa] outline-none focus:outline-none mt-4 rounded-md px-5 py-4 w-[470px]" placeholder='Enter Product Description' />
                                </div>
                                <div className='flex-1'>
                                    <h3 className=' text-xl font-medium mt-6'>Product SKU*</h3>
                                    <input type="text" id="name" name="name" className="bg-[#f7f9fa] outline-none focus:outline-none mt-4 rounded-md px-5 py-4 w-[470px]" placeholder='Enter Product ID' />

                                    <h3 className=' text-xl font-medium mt-14'>Product Sub Category(1)*</h3>
                                    <select className='mt-4 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[470px]'>
                                        <option value="English">Select Product Category</option>
                                        <option value="Spanish">Category 1</option>
                                    </select>

                                    <h3 className=' text-xl font-medium mt-14'>Price*</h3>
                                    <div className='flex items-center justify-start mt-4'>
                                        <div>
                                            <select className='mr-3 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]'>
                                                <option value="English">Price</option>
                                                <option value="Spanish">Category 1</option>
                                            </select>
                                        </div>

                                        <div>
                                            <select className='mr-3 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]'>
                                                <option value="English">Cost</option>
                                                <option value="Spanish">Category 1</option>
                                            </select>
                                        </div>

                                        <div>
                                            <select className='outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]'>
                                                <option value="English">Margin</option>
                                                <option value="Spanish">Category 1</option>
                                            </select>
                                        </div>
                                    </div>

                                    <h3 className=' text-xl font-medium mt-14'>Product Keywords*</h3>
                                    <textarea rows={3} id="description" name="description" className="bg-[#f7f9fa] outline-none focus:outline-none mt-4 rounded-md px-5 py-4 w-[470px]" placeholder='Enter Product Description' />
                                </div>
                            </div>
                            <div className="mt-14">
                                <button className="w-[164px] h-[56px] bg-[#F12D4D] rounded-md text-white text-[18px] font-semibold mr-[72px]">Next</button>

                                <button className="w-[164px] h-[56px] bg-[#EAEAEA] rounded-md text-[#979797] text-[18px] font-normal mr-[72px]">Cancel</button>

                            </div>
                        </div>
                    </div>
                    {/* /End replace */}
                </div>
            </div>
        </Layout>
    )
}
