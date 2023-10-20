import React, { useState, useCallback, useRef, useEffect } from "react"
import Layout from "./layout"
import Breadcrums from "../../components/Breadcrums"
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { getSession, useSession } from 'next-auth/react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { CountryDropdown } from 'react-country-region-selector';
import Link from "next/link";


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

// API Configurations
const baseURL = "https://dev.mybranzapi.link";
const postMediaEndpoint = "media/single";
const mediaEndpoint = "media/%s";
const token = "fb507a0b75e0f62f65b798424555733f";

const categories: CategoryType = {
    "Health & Beauty": ["Bath & Body", "Makeup", "Skin Care", "Hair Care", "Nails", "Salon & Spa Equipment", "Fragrance", "Tools & Accessories", "Shaving & Hair Removal"],
    "Clothing": ["Dresses", "Tops & Tees", "Sweaters", "Jeans", "Pants", "Skirts", "Activewear", "Swimsuits & Cover Ups", "Lingerie, Sleep & Lounge", "Coats & Jackets", "Suits & Blazers", "Socks"],
    "Accessories": ["Scarves & Wraps", "Sunglasses", "Belts", "Wallets"],
    "Footwear": ["Athletic", "Boots", "Fashion Sneakers", "Flats", "Outdoor", "Pumps & Heels", "Loafers & Slip-Ons", "Slippers", "Oxfords", "Sandals", "Work & Safety"],
    "Watches": ["Luxury", "Sport"],
    "Jewelry": ["Necklaces", "Rings", "Earrings", "Bracelets", "Wedding & Engagement"],
    "Bags": ["Cross-body bags", "Shoulder bags", "Wallets", "Handbags", "Clutches", "Purse", "Tote Bags"],
};

export default function BrandEnroll({ sellerData, brandData }: { sellerData: SellerData, brandData: any }) {

    const [brand, setBrand] = useState(brandData?.data[0])

    const [category, setCategory] = useState(brand?.brandCategory ? brand?.brandCategory : '');
    const [subCategory, setSubCategory] = useState(brand?.brandSubCategory ? brand?.brandSubCategory : '');

    const [logoObjectKey, setLogoObjectKey] = useState<any>(null);
    const [displayPictureObjectKey, setDisplayPictureObjectKey] = useState<any>(null);
    const fileInputRef = useRef<any>(null);

    const [loading, setLoading] = useState(false)

    const [logoLoading, setLogoLoading] = useState(false)

    const [countryValue, setCountryValue] = useState(brand?.businessCountry ? brand?.businessCountry : '');

    const { data: session } = useSession()

    const handleFormSubmit = (e: any) => {
        e.preventDefault()
    }

    useEffect(() => {
        if (brand) {
            setLogoObjectKey(brand?.brandLogoObjectKey)
            setDisplayPictureObjectKey(brand?.brandDisplayPictureObjectKey)
        }
    }, [brand])

    const uploadFile = (file: any, token: string) => {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("type", "POST");

        return fetch(`${baseURL}/${postMediaEndpoint}`, {
            method: 'POST',
            body: fd,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    };

    const handleImageChange = useCallback(
        async (e: any, variableToUpdate: any) => {
            const files: File[] = Array.from(e.target.files);
            if (files.length > 0) {
                let uploadedKeys: string | null = null;
                for (const file of files) {
                    try {
                        const response = await uploadFile(file, token);
                        if (response.status === 'success' && response.data.objectKey) {
                            uploadedKeys = response.data.objectKey;
                        } else {
                            console.error("Failed to upload image:", file.name);
                            notification(false, `Upload Failed: ${file?.name}`);
                        }
                    } catch (error) {
                        console.error("Error uploading the image:", file.name, error);
                        notification(false, `Upload Failed: ${file?.name}`);
                    }
                }
                variableToUpdate(uploadedKeys);
            }
        },
        [token]
    );

    const CustomImage = ({ objectKey, token, onClick }: { objectKey: string, token: string, onClick: any }) => {
        const [imageData, setImageData] = useState<string | null>(null);

        useEffect(() => {
            const fetchImage = async () => {
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
                        setImageData(URL.createObjectURL(blob));
                    }
                } catch (error) {
                    console.log("Error fetching image:", error);
                }
            };

            fetchImage();
        }, [objectKey, token]);

        return imageData ? (
            <img
                src={imageData}
                alt={`custom-${imageData}`}
                onClick={() => fileInputRef.current?.click()}
                className="w-[100px] h-[100px] border-2 border-gray-200 prod-images cursor-pointer object-cover"
            />

        ) : (
            <div><AiOutlineLoading3Quarters className='spinner' /></div>
        );
    };


    // {
    //     "id": 2,
    //     "sellerId": 2,
    //     "legalBusinessName": "aas",
    //     "brandDisplayName": "assawdddd",
    //     "brandCategory": "option2",
    //     "brandLogoObjectKey": "TEST",
    //     "brandDisplayPictureObjectKey": "TEST",
    //     "businessAddress": "sddsa",
    //     "active": true,
    //     "createdAt": "2023-07-07T17:17:24.319Z",
    //     "updatedAt": "2023-07-07T17:17:24.319Z",
    //     "SellerId": 2
    // }

    const formik = useFormik({
        initialValues: {
            businessName: brand?.legalBusinessName ? brand?.legalBusinessName : "",
            displayName: brand?.brandDisplayName ? brand?.brandDisplayName : "",
            category: brand?.brandCategory ? brand?.brandCategory : "",
            brandSubCategory: brand?.brandSubCategory ? brand?.brandSubCategory : "",
            businessAddress: brand?.businessAddress ? brand?.businessAddress : "",
            brandAvailability: brand?.brandAvailability ? brand?.brandAvailability : "",
            businessCountry: brand?.businessCountry ? brand?.businessCountry : "",
            brandType: brand?.brandType ? brand?.brandType : "",
            brandTargetGender: brand?.brandTargetGender ? brand?.brandTargetGender : "",
            brandTargetAgeGroup: brand?.brandTargetAgeGroup ? brand?.brandTargetAgeGroup : "",
            brandIncomeBracket: brand?.brandIncomeBracket ? brand?.brandIncomeBracket : "",
            brandPriceRange: brand?.brandPriceRange ? brand?.brandPriceRange : ""
        },
        onSubmit
    })

    async function onSubmit(values: { businessName: string; displayName: string; category: string; businessAddress: string, businessCountry: string, brandSubCategory: string, brandAvailability: string, brandType: string, brandTargetGender: string, brandTargetAgeGroup: string, brandIncomeBracket: string, brandPriceRange: string }) {
        setLoading(true)

        // Check if all fields have a value
        if (!Object.values(values).every(v => v)) {
            notification(false, "Please fill out all the fields.");
            setLoading(false)
            return;
        }


        // Checks if brand is true then its an update
        try {
            if (brand) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/brands/update/${brand?.id}`, {
                    method: 'PATCH',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sellerId: sellerData?.data?.id,
                        legalBusinessName: values.businessName,
                        brandDisplayName: values.displayName,
                        brandCategory: values.category,
                        businessAddress: values.businessAddress,
                        brandDisplayPictureObjectKey: displayPictureObjectKey ? displayPictureObjectKey : "",
                        brandLogoObjectKey: logoObjectKey ? logoObjectKey : "",
                        businessCountry: values.businessCountry,
                        brandSubCategory: values.brandSubCategory,
                        brandAvailability: values.brandAvailability,
                        brandType: values.brandType,
                        brandTargetGender: values.brandTargetGender,
                        brandTargetAgeGroup: values.brandTargetAgeGroup,
                        brandIncomeBracket: values.brandIncomeBracket,
                        brandPriceRange: values.brandPriceRange
                    })
                });
                const data = await response.json();

                if (data.success) {
                    notification(true, "Brand updated successfully.");
                    setLoading(false);
                } else {
                    notification(false, "Something went wrong");
                    setLoading(false);
                }
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/brands/register`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sellerId: sellerData?.data?.id,
                        legalBusinessName: values.businessName,
                        brandDisplayName: values.displayName,
                        brandCategory: values.category,
                        businessAddress: values.businessAddress,
                        brandDisplayPictureObjectKey: displayPictureObjectKey ? displayPictureObjectKey : "",
                        brandLogoObjectKey: logoObjectKey ? logoObjectKey : "",
                        businessCountry: values.businessCountry,
                        brandSubCategory: values.brandSubCategory,
                        brandAvailability: values.brandAvailability,
                        brandType: values.brandType,
                        brandTargetGender: values.brandTargetGender,
                        brandTargetAgeGroup: values.brandTargetAgeGroup,
                        brandIncomeBracket: values.brandIncomeBracket,
                        brandPriceRange: values.brandPriceRange
                    })
                });
                const data = await response.json();

                if (data.success) {
                    setBrand(data.data)
                    notification(true, "Brand registered successfully.");
                    setLoading(false);
                } else {
                    notification(false, "Something went wrong");
                    setLoading(false);
                }
            }
        } catch (error) {
            notification(false, "Something went wrong");
            console.error(error);
            setLoading(false);
            // Handle the error
        }

        setLoading(false)
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
            <div className="py-6 h-screen">
                <div className="mx-auto px-4 sm:px-6 md:px-8">
                    <Breadcrums parent={"Brand Enroll"} childarr={["Product"]} />
                </div>
                <div className="mx-auto px-4 sm:px-6 md:px-8">
                    <div className="py-4">
                        <div className="bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] rounded-lg p-7">
                            <h3 className="text-[#F12D4D] font-semibold text-2xl mb-3">Brand Information</h3>

                            <form onSubmit={formik.handleSubmit} >
                                <div className="w-full flex items-center justify-between">
                                    <div className="flex-1">
                                        <label htmlFor="business" className=" block text-base font-medium text-[#30323E] mb-2">Legal business Name*</label>

                                        <input {...formik.getFieldProps('businessName')} type="text" id="business-name" name="businessName" className="mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none  w-[22.5rem] h-10 rounded-md mb-3" placeholder="Enter Brand Name" />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="display" className="mt-4 block text-base font-medium text-[#30323E] mb-2"> Brand Display Name*</label>

                                        <input {...formik.getFieldProps('displayName')} type="text" id="display-name" name="displayName" className="mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[rgb(221,221,221)]  text-lg h-10 focus:outline-none  w-[22.5rem] rounded-md mb-6" />

                                    </div>
                                </div>

                                {/* LINE 2 */}

                                <div className="w-full flex items-center justify-between">
                                    <div className="flex-1">
                                        <label htmlFor="business" className=" block text-base font-medium text-[#30323E] mb-2">Business Street Address*</label>

                                        <input {...formik.getFieldProps('businessAddress')} type="text" id="businessAddress" name="businessAddress" className="mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none  w-[22.5rem] h-10 rounded-md mb-3" placeholder="1 XYZ Street" />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="businessCountry" className="mt-4 block text-base font-medium text-[#30323E] mb-2">Country*</label>

                                        {/* <input {...formik.getFieldProps('businessCountry')} type="text" id="businessCountry" name="businessCountry" className="mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[rgb(221,221,221)]  text-lg h-10 focus:outline-none  w-[22.5rem] rounded-md mb-6" /> */}
                                        <CountryDropdown {...formik.getFieldProps('businessCountry')} id="businessCountry" name="businessCountry" onChange={(e) => {
                                            formik.setFieldValue('businessCountry', e)
                                            setCountryValue(e)
                                        }} value={countryValue} classes='mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[rgb(221,221,221)]  text-lg h-10 focus:outline-none  w-[22.5rem] rounded-md mb-6' />

                                    </div>
                                </div>

                                {/* LINE 3 */}

                                <div className="w-full flex items-center justify-between">
                                    <div className="flex-1">
                                        <label htmlFor="logo" className="mt-4 block text-base font-medium text-[#30323E] mb-2"> Brand Logo* </label>


                                        <span className="flex items-start flex-col justify-start">
                                            <input
                                                id="brandLogoObjectKey"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, setLogoObjectKey)}
                                                className=" w-[22.5rem] h-10 text-base text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none   file:bg-[#F12D4D] file:text-sm file:font-semibold file:text-gray-200 file:px-4  file:h-full file:mr-5 mb-6 file:cursor-pointer file:border-0 file:border-gray-300  "
                                            />
                                            {logoObjectKey && <CustomImage objectKey={logoObjectKey} token={token} onClick={sellerData} />}
                                        </span>
                                    </div >
                                    <div className="flex-1">
                                        <label htmlFor="picture" className="mt-4  block text-base font-medium text-[#30323E] mb-2"> Brand display Picture* </label>

                                        <input
                                            id="picture"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleImageChange(e, setDisplayPictureObjectKey)
                                            }}
                                            className=" w-[22.5rem] mb-6 h-10 text-base text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none   file:bg-[#F12D4D] file:text-sm file:font-semibold file:text-gray-200 file:px-4 file:py-2 file:h-full file:mr-5 file:cursor-pointer file:border-0 file:border-gray-300  "
                                        />
                                        {displayPictureObjectKey && <CustomImage objectKey={displayPictureObjectKey} token={token} onClick={sellerData} />}

                                    </div>
                                </div>

                                {/* LINE 4 */}

                                <div className="w-full flex items-center justify-between">
                                    <div className="flex-1">
                                        <label htmlFor="category" className="mt-4 block text-base font-medium text-[#30323E] mb-2"> Brand Category*</label>

                                        <select {...formik.getFieldProps('category')} id="category" name="category" className="mt-1 px-4  bg-[#F7F9FA] border shadow-sm border-[#DDDDDD]  text-base focus:outline-none  w-[22.5rem] rounded-md h-10 mb-6" value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory(''); formik.handleChange(e); }} >
                                            <option className="text-base" value="">Select Category</option>
                                            {Object.keys(categories).map((cat) => (
                                                <option className="text-base" key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex-1">
                                        <label htmlFor="brandSubCategory" className="mt-4 block text-base font-medium text-[#30323E] mb-2"> Brand Sub-Category*</label>

                                        <select {...formik.getFieldProps('brandSubCategory')} id="brandSubCategory" name="brandSubCategory" className="mt-1 px-4  bg-[#F7F9FA] border shadow-sm border-[#DDDDDD]  text-base focus:outline-none  w-[22.5rem] rounded-md h-10 mb-6" value={subCategory} onChange={(e) => {
                                            formik.handleChange(e); setSubCategory(e.target.value)
                                        }} disabled={!category}>
                                            <option className="text-base text-[#30323E] " value="">Select Sub-Category</option>
                                            {category && categories[category]?.map((subCat) => (
                                                <option className="text-base text-[#30323E] " key={subCat} value={subCat}>
                                                    {subCat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* LINE 5 */}

                                <div className="w-full flex items-center justify-between">
                                    <div className="flex-1">
                                        <label htmlFor="brandAvailability" className="mt-4 block text-base font-medium text-[#30323E] mb-2">Brand Availability*</label>


                                        <select {...formik.getFieldProps('brandAvailability')} id="brandAvailability" name="brandAvailability" className="mr-4 mt-1 px-4  bg-[#F7F9FA] border shadow-sm border-[#DDDDDD]  text-base focus:outline-none  w-[22.5rem] rounded-md h-10 mb-2">
                                            <option defaultValue="true" className="text-base text-[#30323E] ">Select Availability</option>
                                            <option className="text-base" value="Local">Local</option>
                                            <option className="text-base" value="National">National</option>
                                            <option className="text-base" value="International">International</option>
                                        </select>
                                    </div >
                                    <div className="flex-1">
                                        <label htmlFor="brandType" className="mt-4  block text-base font-medium text-[#30323E] mb-2">Brand Type*</label>

                                        <select {...formik.getFieldProps('brandType')} id="brandType" name="brandType" className="mr-4 mt-1 px-4  bg-[#F7F9FA] border shadow-sm border-[#DDDDDD]  text-base focus:outline-none  w-[22.5rem] rounded-md h-10 mb-2">
                                            <option defaultValue="true" className="text-base text-[#30323E] ">Brand Type</option>
                                            <option className="text-base" value="Luxury">Luxury</option>
                                            <option className="text-base" value="Affordable">Affordable</option>
                                            <option className="text-base" value="Vegan">Vegan</option>
                                            <option className="text-base" value="Fastfashion">Fast-fashion</option>
                                            <option className="text-base" value="Activewear">Activewear</option>
                                            <option className="text-base" value="Ethical">Ethical</option>
                                            <option className="text-base" value="Ecofriendly">Eco-friendly</option>
                                            <option className="text-base" value="Sustainable">Sustainable</option>
                                        </select>
                                    </div>
                                </div>

                                {/* LINE 6 */}

                                <div className=" w-full flex items-center justify-between">
                                    <div className="flex-1">
                                        <label htmlFor="brandTargetGender" className="mt-4 block text-base font-medium text-[#30323E] mb-2">Target Demographic*</label>
                                        <div className="flex items-center justify-start">
                                            <select {...formik.getFieldProps('brandTargetGender')} id="brandTargetGender" name="brandTargetGender" className="mr-4 mt-1 px-4  bg-[#F7F9FA] border shadow-sm border-[#DDDDDD]  text-base focus:outline-none  w-[10.5rem] rounded-md h-10 mb-2">
                                                <option defaultValue="true" className="text-base text-[#30323E] ">Select Gender</option>
                                                <option className="text-base" value="Men">Men</option>
                                                <option className="text-base" value="Women">Women</option>
                                                <option className="text-base" value="Unisex">Unisex</option>
                                                <option className="text-base" value="Kids">Kids</option>
                                            </select>

                                            <select {...formik.getFieldProps('brandTargetAgeGroup')} id="brandTargetAgeGroup" name="brandTargetAgeGroup" className="mr-4 mt-1 px-4  bg-[#F7F9FA] border shadow-sm border-[#DDDDDD]  text-base focus:outline-none  w-[10.5rem] rounded-md h-10 mb-2">

                                                <option className="text-base text-[#30323E] ">Age</option>
                                                <option value={"under 10"} className="text-base text-[#30323E] ">0-10</option>

                                                <option className="text-base" value={"under 18"}>10-18</option>
                                                <option className="text-base" value={"under 25"}>18-25</option>
                                                <option className="text-base" value={"under 50"}>25-50</option>
                                                <option className="text-base" value={"above 50"}>50 & Above</option>
                                                <option className="text-base" value={"all"}>All</option>
                                            </select>

                                            <select {...formik.getFieldProps('brandIncomeBracket')} id="brandIncomeBracket" name="brandIncomeBracket" className="mr-4 mt-1 px-4  bg-[#F7F9FA] border shadow-sm border-[#DDDDDD]  text-base focus:outline-none  w-[10.5rem] rounded-md h-10 mb-2">
                                                <option defaultValue="true" className="text-base text-[#30323E] ">Income Bracket</option>
                                                <option className="text-base" value="Low 10%">Low 10%</option>
                                                <option className="text-base" value="Low 25%">Low 25%</option>
                                                <option className="text-base" value="Low 50%">Low 50%</option>
                                                <option className="text-base" value="Top 50%">Top 50%</option>
                                                <option className="text-base" value="Top 25%">Top 25%</option>
                                                <option className="text-base" value="Top 10%">Top 10%</option>
                                                <option className="text-base" value="Top 5%">Top 5%</option>
                                                <option className="text-base" value="Top 1%">Top 1%</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <label htmlFor="brandPriceRange" className="mt-4 block text-base font-medium text-[#30323E] mb-2">Price Range*</label>
                                        <div className="flex items-center justify-start">
                                            <select {...formik.getFieldProps('brandPriceRange')} id="brandPriceRange" name="brandPriceRange" className="mr-4 mt-1 px-4  bg-[#F7F9FA] border shadow-sm border-[#DDDDDD]  text-base focus:outline-none  w-[22.5rem] rounded-md h-10 mb-2">
                                                <option defaultValue="true" className="text-base text-[#30323E] ">Select Price Range</option>
                                                <option className="text-base" value="BudgetFriendly">Budget-Friendly ($)</option>
                                                <option className="text-base" value="MidRange">Mid-Range ($$)</option>
                                                <option className="text-base" value="Premium">Premium ($$$)</option>
                                            </select>

                                        </div>
                                    </div>

                                </div>



                                {/* submit button */}

                                <div className="mt-16 flex">
                                    <button type="submit" className="w-32 h-11 bg-[#F12D4D] flex items-center justify-center rounded-md text-white text-base font-semibold mr-5 cursor-pointer" value="Save">{loading ? <AiOutlineLoading3Quarters className='spinner' /> : `Save`}</button>

                                    <Link href='/dashboard'><button type="button" className="w-32 h-11 bg-[#EAEAEA] rounded-md text-[#979797] text-base font-normal cursor-pointer">Cancel</button></Link>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* /End replace */}
                </div>
            </div >
        </Layout >
    )
}

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

    // Get the brands associated with the seller using the seller id
    const brandResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/brands/search/${sellerData?.data?.id}`)
    const brandData = await brandResponse.json()

    return {
        props: {
            session,
            sellerData,
            brandData
        }
    }
}