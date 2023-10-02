import React, { useEffect, useState } from 'react'
import Layout from '../layout'
import Breadcrums from '../../../components/Breadcrums'
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { getSession, useSession } from 'next-auth/react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import Link from 'next/link';
import { ro } from 'date-fns/locale';
import { useRouter } from 'next/router';

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

type CategoryType = {
    "Health & Beauty": string[];
    "Clothing": string[];
    "Accessories": string[];
    "Footwear": string[];
    "Watches": string[];
    "Jewelry": string[];
    "Bags": string[];
    [key: string]: string[] | undefined;
};


const categories: CategoryType = {
    "Health & Beauty": ["Bath & Body", "Makeup", "Skin Care", "Hair Care", "Nails", "Salon & Spa Equipment", "Fragrance", "Tools & Accessories", "Shaving & Hair Removal"],
    "Clothing": ["Dresses", "Tops & Tees", "Sweaters", "Jeans", "Pants", "Skirts", "Activewear", "Swimsuits & Cover Ups", "Lingerie, Sleep & Lounge", "Coats & Jackets", "Suits & Blazers", "Socks"],
    "Accessories": ["Scarves & Wraps", "Sunglasses", "Belts", "Wallets"],
    "Footwear": ["Athletic", "Boots", "Fashion Sneakers", "Flats", "Outdoor", "Slippers", "Pumps & Heels", "Sandals", "Loafers & Slip-Ons", "Outdoor", "Slippers", "Oxfords", "Sandals", "Work & Safety"],
    "Watches": ["Luxury", "Sport"],
    "Jewelry": ["Necklaces", "Rings", "Earrings", "Bracelets", "Wedding & Engagement"],
    "Bags": ["Cross-body bags", "Shoulder bags", "Wallets", "Handbags", "Clutches", "Purse", "Tote Bags"],
};

export default function ProductList({ sellerData, brandData }: { sellerData: SellerData, brandData: any }) {

    const [loading, setLoading] = useState(false)
    const [productCategory, setProductCategory] = useState<string>();
    const [subCategory, setSubCategory] = useState<string>();
    const [prodMargin, setProdMargin] = useState<number>(0)

    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            productName: '',
            productCategory: '',
            productColor: '',
            productSize: '',
            productQuantity: '',
            productDescription: '',
            productSku: '',
            productSubCategory: subCategory ? subCategory : '',
            productPrice: '',
            productCost: '',
            productMargin: "",
            productKeywords: '',
            productTargetGender: '',
            productAgeGroup: '',
            storeLocation: '',
            productMaterial: '',
            productDeliveryTime: '',
            productPromotionStatus: '',
        },
        onSubmit
    })

    console.log(formik.values)

    useEffect(() => {
        const marginValue = parseInt(formik?.values?.productPrice) - parseInt(formik?.values?.productCost)
        formik.setFieldValue("productMargin", marginValue.toString())
        if (formik?.values?.productPrice && formik?.values?.productCost) {
            setProdMargin(parseInt(formik?.values?.productPrice) - parseInt(formik?.values?.productCost))
        }
    }, [formik.values.productCost, formik.values.productPrice])



    async function onSubmit(values: { productName: string, productCategory: string, productColor: string, productSize: string, productQuantity: string, productDescription: string, productSku: string, productSubCategory: string, productPrice: string, productCost: string, productMargin: string, productKeywords: string, productTargetGender: string, productAgeGroup: string, storeLocation: string, productMaterial: string, productDeliveryTime: string, productPromotionStatus: string }) {
        setLoading(true)

        // Check if all fields have a value
        if (!Object.values(values).every(v => v)) {
            notification(false, "Please fill out all the fields.");
            setLoading(false)
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory/add/product`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sellerId: sellerData?.data?.id,
                    brandId: brandData?.data?.id ? brandData?.data?.id : 0,
                    productName: values.productName,
                    productCategory: values.productCategory,
                    productColor: values.productColor,
                    productSize: values.productSize,
                    productQuantity: values.productQuantity,
                    productDescription: values.productDescription,
                    productSku: values.productSku,
                    productSubCategory: values.productSubCategory,
                    productPrice: values.productPrice,
                    productCost: values.productCost,
                    productMargin: values.productMargin,
                    productKeywordArray: values.productKeywords.split(","),
                    productImage: 'NULL',
                    productTargetGender: values.productTargetGender,
                    productAgeGroup: values.productAgeGroup,
                    storeLocation: values.storeLocation,
                    productMaterial: values.productMaterial,
                    productDeliveryTime: values.productDeliveryTime,
                    productPromotionStatus: values.productPromotionStatus,


                })
            })
            const data = await response.json();

            if (data.success) {
                notification(true, "Product Added successfully.");
                router.push('/inventory/products');
                setLoading(false);
            } else {
                if (data.message) {
                    notification(false, data.message);
                } else {
                    notification(false, "Something went wrong");
                }
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

    const inputClass = `mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none  w-[22.5rem] h-10 rounded-md mb-3`

    const labelClass = `mt-6 block text-base font-medium text-[#30323E] mb-2`

    return (
        <Layout>
            <Toaster position="top-center" reverseOrder={true} />
            <div className="py-6 h-screen">
                <div className="mx-auto px-4 sm:px-6 md:px-8 ">
                    <Breadcrums parent={"Inventory"} childarr={["Add Product"]} />
                </div>
                <div className="mx-auto px-4 sm:px-6 md:px-8 pb-24">
                    {/* Replace with your content */}
                    <div className="py-4">
                        <form onSubmit={formik.handleSubmit} >
                            <div className="bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] rounded-lg p-7">
                                <h1 className=' text-[#F12D4D] text-2xl font-semibold'>Product Listing</h1>

                                <div className="w-full flex items-center justify-between">
                                    <div className="flex-1">
                                        <label htmlFor="business" className={labelClass}>Product Name*</label>

                                        <input {...formik.getFieldProps('productName')} type="text" id="productName" name="productName" className={inputClass} placeholder='Enter Product Name' />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="business" className={labelClass}>Product SKU*</label>

                                        <input {...formik.getFieldProps('productSku')} type="text" id="productSku" name="productSku" className={inputClass} placeholder='Enter Product SKU' />
                                    </div>
                                </div>

                                {/* NEW LINE */}

                                <div className="w-full flex items-center justify-between">
                                    <div className="flex-1">
                                        <label htmlFor="productCategory" className={labelClass}>Product Category*</label>

                                        <select {...formik.getFieldProps('productCategory')} id="productCategory" name="productCategory" className={inputClass} value={productCategory} onChange={(e) => { setProductCategory(e.target.value); setSubCategory(''); formik.setFieldValue('productCategory', e.target.value); }}>
                                            <option className="text-base" value="">Select Category</option>
                                            {Object.keys(categories).map((cat) => (
                                                <option className="text-base" key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="productSubCategory" className={labelClass}>Product Sub-Category*</label>
                                        <select {...formik.getFieldProps('productSubCategory')} id="productSubCategory" name="productSubCategory" className={inputClass} value={subCategory} onChange={(e) => { setSubCategory(e.target.value); formik.setFieldValue('productSubCategory', e.target.value); }} disabled={!productCategory}>
                                            <option className="text-base text-[#30323E] " value="">Select Sub-Category</option>
                                            {productCategory && categories[productCategory]?.map((subCat) => (
                                                <option className="text-base text-[#30323E] " key={subCat} value={subCat}>
                                                    {subCat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* NEW LINE */}

                                <div className="w-full flex items-center justify-between">
                                    <div className="flex-1">
                                        <label htmlFor="business" className={labelClass}>Product Options*</label>

                                        <div className='flex items-center justify-start mt-4'>
                                            <div>
                                                <select {...formik.getFieldProps('productColor')} name='productColor' id="productColor" className='mr-3 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]'>
                                                    <option value="English">Color</option>
                                                    <option value="Spanish">Sub Category 1</option>
                                                    <option value="Spanish">Sub Category 2</option>
                                                    <option value="Spanish">Sub Category 3</option>
                                                </select>
                                                <p className='text-center text-sm italic text-gray-600'>(Color)</p>
                                            </div>

                                            <div>
                                                <select {...formik.getFieldProps('productSize')} name='productSize' id="productSize" className='mr-3 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]'>
                                                    <option value="English">Size</option>
                                                    <option value="Spanish">Category 1</option>
                                                </select>
                                                <p className='text-center text-sm italic text-gray-600'>(Size)</p>
                                            </div>

                                            <div>
                                                <input type='number' {...formik.getFieldProps('productQuantity')} name='productQuantity' placeholder='Quantity' id="productQuantity" className="mr-3 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]" />
                                                <p className='text-center text-sm italic text-gray-600'>(Quantity)</p>

                                            </div>
                                        </div>

                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="business" className={labelClass}>Price*</label>
                                        <div className='flex items-center justify-start mt-4'>
                                            <div>
                                                <input type='number' {...formik.getFieldProps('productPrice')} name='productPrice' id="productPrice" className='mr-3 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]' placeholder='Price' />
                                                <p className='text-center text-sm italic text-gray-600'>(Price)</p>
                                            </div>

                                            <div>
                                                <input type='number' {...formik.getFieldProps('productCost')} name='productCost' id="productCost" className='mr-3 outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]' placeholder='COGS' />
                                                <p className='text-center text-sm italic text-gray-600'>(COGS)</p>
                                            </div>

                                            <div>
                                                <input disabled type='number' {...formik.getFieldProps('productMargin')} name='productMargin' id="productMargin" className='outline-none focus:outline-none border-brand-border rounded bg-[#f7f9fa] text-brand-text px-5 py-4 w-[148px]' placeholder={`Margin: $${prodMargin && prodMargin}`} />
                                                <p className='text-center text-sm italic text-gray-600'>(Margin)</p>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* NEW LINE */}

                                <div className="w-full flex items-center justify-between">
                                    <div className="flex-1">
                                        <label htmlFor="business" className={labelClass}>Product Description*</label>
                                        <textarea {...formik.getFieldProps('productDescription')} rows={3} id="productDescription" name="productDescription" className="bg-[#f7f9fa] outline-none focus:outline-none mt-4 rounded-md px-5 py-4 w-[470px]" placeholder='Enter Product Description' />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="business" className={labelClass}>Product Keywords*</label>

                                        <textarea {...formik.getFieldProps('productKeywords')} rows={3} id="productKeywords" name="productKeywords" className="bg-[#f7f9fa] outline-none focus:outline-none mt-4 rounded-md px-5 py-4 w-[470px]" placeholder='Enter Product Description' />
                                    </div>
                                </div>

                                {/* NEW LINE */}

                                <div className="mt-16 flex">
                                    <button type="submit" className="w-32 h-11 bg-[#F12D4D] flex items-center justify-center rounded-md text-white text-base font-semibold mr-5 cursor-pointer" value="Add">{loading ? <AiOutlineLoading3Quarters className='spinner' /> : `Add Product`}</button>

                                    <Link href="/inventory/products"><button type="button" className="w-32 h-11 bg-[#EAEAEA] rounded-md text-[#979797] text-base font-normal cursor-pointer">Cancel </button></Link>
                                </div>
                            </div>
                        </form>
                    </div>
                    {/* /End replace */}
                </div>
            </div>
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

    // Get the brands associated with the seller using the seller id
    const brandResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/brands/search/${sellerData?.data?.id}`)
    const brandData = await brandResponse.json()

    return {
        props: { session, sellerData, brandData },
    }
}