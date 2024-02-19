import React, { useState, useCallback, useRef, useEffect, memo, useMemo } from "react"
import Layout from "./layout"
import Breadcrums from "../../components/Breadcrums"
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { getSession, useSession } from 'next-auth/react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { CiSquarePlus } from "react-icons/ci";
import { CountryDropdown } from 'react-country-region-selector';
import Link from "next/link";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { set } from "date-fns";



interface SellerData {
    data: {
        Brands: any[];
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

const CustomImage = memo(function CustomImage({ objectKey, token }: { objectKey: string, token: string }) {
    const [imageData, setImageData] = useState<string | null>(null);

    useEffect(() => {
        async function fetchImage() {
            try {
                const response = await fetch(`${baseURL}/${mediaEndpoint.replace(/%s/, objectKey)}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const blob = await response.blob();
                    setImageData(URL.createObjectURL(blob));
                }
            } catch (error) {
                console.log("Error fetching image:", error);
            }
        }

        fetchImage();
    }, []);

    return imageData ? (
        <img
            src={imageData}
            alt={`custom-${imageData}`}
            className="w-[100px] h-[100px] border-2 rounded-md border-gray-200 prod-images cursor-pointer object-cover"
        />
    ) : (
        <div>
            <AiOutlineLoading3Quarters className="spinner" />
        </div>
    );
})

export default function Brand({ sellerData, interestData }: { sellerData: SellerData, interestData: any }) {

    const [brand, setBrand] = useState(sellerData.data.Brands[0])


    const [category, setCategory] = useState(brand?.brandCategory ? brand?.brandCategory : '');
    const [subCategory, setSubCategory] = useState(brand?.brandSubCategory ? brand?.brandSubCategory : []);

    const [logoObjectKey, setLogoObjectKey] = useState<any>(null);
    const [displayPictureObjectKey, setDisplayPictureObjectKey] = useState<any>(null);
    const fileInputRef = useRef<any>(null);

    const [loading, setLoading] = useState(false)

    const [countryValue, setCountryValue] = useState(brand?.businessCountry ? brand?.businessCountry : '');

    const [shippingTimesOne, setShippingTimesOne] = useState(brand?.brandShippingTimes ? brand?.brandShippingTimes.split(' ')[0] : 1);
    const [shippingTimesTwo, setShippingTimesTwo] = useState(brand?.brandShippingTimes ? brand?.brandShippingTimes.split(' ')[2] : 3);

    //Array Combobox for Sub Category 
    const [inputValue, setInputValue] = useState("");
    const [filteredOptions, setFilteredOptions] = useState<any>([]);
    const [selectedOption, setSelectedOption] = useState<any>([]);
    const [allOptions, setAllOptions] = useState(['']);
    const [showCombobox, setShowCombobox] = useState(false);

    useEffect(() => {
        // Filter options based on the input value
        const filtered = allOptions.filter((option) =>
            option.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredOptions(filtered);
    }, [inputValue, allOptions]);

    useEffect(() => {
        setAllOptions(categories[category] || []);
    }, [category]);

    //Array Combobox for Sub Category ^

    //String Combobox for Business Name 
    const [businessNameInputValue, setBusinessNameInputValue] = useState(brand?.brandDisplayName ? brand?.brandDisplayName : "");
    const [businessNamefilteredOptions, setBusinessNamefilteredOptions] = useState<any>([]);
    const [businessNameSelectedOption, setBusinessNameSelectedOption] = useState<any>('');
    const [businessNameOptions, setBusinessNameOptions] = useState(interestData.data || []);
    const [showBusinessNameCombobox, setShowBusinessNameCombobox] = useState(false);
    const [interestId, setInterestId] = useState(null)

    useEffect(() => {
        // Filter options based on the input value
        const filtered = businessNameOptions.filter((option: any) => {
            return option.name.toLowerCase().includes(businessNameInputValue.toLowerCase())
        })

        setBusinessNamefilteredOptions(filtered);
    }, [businessNameInputValue, businessNameOptions]);

    // useEffect(() => {
    //     setBusinessNameOptions(categories[category] || []);
    // }, [category]);

    //String Combobox for Business Name ^

    useEffect(() => {
        formik.setFieldValue('brandShippingTimes', `${shippingTimesOne} to ${shippingTimesTwo} Days`)
    }, [shippingTimesOne, shippingTimesTwo])


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
        fd.append("uid", "97");

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
            interestId: null,
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
            brandPriceRange: brand?.brandPriceRange ? brand?.brandPriceRange : "",
            brandShippingTimes: `${shippingTimesOne} to ${shippingTimesTwo} Days`
        },
        onSubmit
    })

    useEffect(() => {
        formik.setFieldValue('businessName', brand?.legalBusinessName)
    }, [])

    async function onSubmit(values: { businessName: string; displayName: string; category: string; businessAddress: string, businessCountry: string, brandSubCategory: [], brandAvailability: string, brandType: string, brandTargetGender: string, brandTargetAgeGroup: string, brandIncomeBracket: string, brandPriceRange: string, brandShippingTimes: string, interestId?: number | null }) {

        setLoading(true)
        // Check if all fields have a value

        // remove interestid from values to check because it can be null
        let valuesToCheck = { ...values }
        delete valuesToCheck?.interestId

        if (!Object.values(valuesToCheck).every(v => v)) {
            notification(false, "Please fill out all the fields.");
            setLoading(false)
            return;
        }

        if (subCategory.length < 1) {
            notification(false, "Please select at least one sub-category.");
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
                        interestId: interestId ? interestId : null,
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
                        brandPriceRange: values.brandPriceRange,
                        brandShippingTimes: values.brandShippingTimes,
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
                        interestId: interestId ? interestId : null,
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
                        brandPriceRange: values.brandPriceRange,
                        brandShippingTimes: values.brandShippingTimes

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

    function handleShippingTimes(e: any) {
        e.preventDefault()
        e.stopPropagation()
        if (e.target.name === 'shippingTimesOne') {
            if (e.target.value >= 0) {
                setShippingTimesOne(e.target.value)
            }
        } else {
            if (e.target.value >= 0) {
                setShippingTimesTwo(e.target.value)
            }
        }
    }

    const handleOptionClick = (option: any) => {
        if (!subCategory.includes(option)) {
            const newOptions = [...subCategory, option];
            setSubCategory(newOptions);
            formik.setFieldValue('brandSubCategory', newOptions);
        }
        setAllOptions(allOptions.filter((item: any) => item !== option));
        setInputValue('');
        setShowCombobox(false);
    };

    const handleRemoveOption = (option: any) => {
        setAllOptions([...allOptions, option]);
        const newOptions = subCategory.filter((item: any) => item !== option);
        setSubCategory(newOptions);
        formik.setFieldValue('brandSubCategory', newOptions);
    }


    const renderOptions = (forField: any) => {
        if (forField === 'subcategory') {
            return (
                <ul className="w-full border bg-white border-gray-200 rounded-b-md shadow-[rgba(0,_0,_0,_0.2)_0px_20px_20px_-7px] absolute top-11 right-0 max-h-32 overflow-y-scroll">
                    {inputValue && !filteredOptions.includes(inputValue) && (
                        <li className="hover:bg-blue-600 hover:text-white px-3 py-1 cursor-pointer flex items-center"
                            onClick={() => handleOptionClick(inputValue)}>
                            <CiSquarePlus className="mr-1" fontSize='20px' /> {inputValue}
                        </li>)
                    }
                    {filteredOptions.map((option: any, index: any) => (
                        <li className="hover:bg-blue-600 hover:text-white px-3 py-1 cursor-pointer" key={index} onClick={() => handleOptionClick(option)}>
                            {option}
                        </li>
                    ))}
                </ul >
            )
        }

        if (forField === 'businessName') {
            return (
                <ul className="w-full border bg-white border-gray-200 rounded-b-md shadow-[rgba(0,_0,_0,_0.2)_0px_20px_20px_-7px] absolute top-11 right-0 max-h-32 overflow-y-scroll">
                    {businessNameInputValue && !businessNamefilteredOptions.map((business: any) => business.name).includes(businessNameInputValue) && (
                        <li className="hover:bg-blue-600 hover:text-white px-3 py-1 cursor-pointer flex items-center"
                            onClick={() => {
                                setBusinessNameSelectedOption(businessNameInputValue),
                                    setBusinessNameInputValue(businessNameInputValue),
                                    setShowBusinessNameCombobox(false);
                                formik.setFieldValue('displayName', businessNameInputValue)
                                setInterestId(null)
                                formik.setFieldValue('interestId', null)
                            }}>
                            <CiSquarePlus className="mr-1" fontSize='20px' /> {businessNameInputValue}
                        </li>)
                    }
                    {businessNamefilteredOptions.map((option: any, index: any) => (
                        <li className="hover:bg-blue-600 hover:text-white px-3 py-1 cursor-pointer" key={index} onClick={() => {
                            setBusinessNameSelectedOption(option.name),
                                setBusinessNameInputValue(option.name),
                                formik.setFieldValue('displayName', option.name)
                            setShowBusinessNameCombobox(false)
                            setInterestId(option.id)
                            formik.setFieldValue('interestId', option.id)
                        }}>
                            {option.name}
                        </li>
                    ))}
                </ul >
            )
        }
    }

    return (
        <Layout>
            <Toaster position="top-center" reverseOrder={true} />
            <div className="py-6 h-full">
                <div className="mx-auto px-4 sm:px-6 md:px-8">
                    <Breadcrums parent={"Brands"} childarr={["Product"]} />
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

                                        {showBusinessNameCombobox && <div onClick={() => setShowBusinessNameCombobox(false)} className="absolute inset-0 bg-black opacity-0 w-full h-full"></div>}
                                        <div className="w-[22.5rem] relative">
                                            <input
                                                className="mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none  w-[22.5rem] h-10 rounded-md mb-0"
                                                type="text"
                                                value={businessNameInputValue}
                                                onFocus={() => setShowBusinessNameCombobox(true)}
                                                onChange={(e) => setBusinessNameInputValue(e.target.value)}
                                                placeholder="Search Brand"
                                            />
                                            {(showBusinessNameCombobox) && renderOptions('businessName')}
                                        </div>
                                        {/* <input {...formik.getFieldProps('displayName')} type="text" id="display-name" name="displayName" className="mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[rgb(221,221,221)]  text-lg h-10 focus:outline-none  w-[22.5rem] rounded-md mb-6" /> */}

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
                                            {logoObjectKey && <CustomImage objectKey={logoObjectKey} token={token} />}
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
                                        {displayPictureObjectKey && <CustomImage objectKey={displayPictureObjectKey} token={token} />}

                                    </div>
                                </div>

                                {/* LINE 4 */}

                                <div className="w-full flex items-start justify-between">
                                    <div className="flex-1">
                                        <label htmlFor="category" className="mt-4 block text-base font-medium text-[#30323E] mb-2"> Brand Category*</label>

                                        <select {...formik.getFieldProps('category')} id="category" name="category" className="mt-1 px-4  bg-[#F7F9FA] border shadow-sm border-[#DDDDDD]  text-base focus:outline-none  w-[22.5rem] rounded-md h-10 mb-6" value={category} onChange={(e) => { setCategory(e.target.value); formik.setFieldValue('brandSubCategory', []); setSubCategory([]); }} >
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

                                        {showCombobox && <div onClick={() => setShowCombobox(false)} className="absolute inset-0 bg-black opacity-0 w-full h-full"></div>}
                                        <div className="w-[22.5rem] relative">
                                            <input
                                                className="mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none  w-[22.5rem] h-10 rounded-md mb-0"
                                                type="text"
                                                value={inputValue}
                                                onFocus={() => setShowCombobox(true)}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                placeholder="Search/Add Sub-Category"
                                            />
                                            {(showCombobox || inputValue) && renderOptions('subcategory')}
                                            {subCategory.length > 0 && <div className="mt-1">{subCategory.map((option: any, index: any) =>
                                                <div key={index} className="bg-gray-200 m-1 text-sm rounded-sm py-1 px-2 inline-block"><span className="flex items-center">{option}<RiDeleteBack2Fill className="ml-2 cursor-pointer" onClick={() => handleRemoveOption(option)} /></span></div>
                                            )}</div>}
                                        </div>
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

                                {/* LINE 7 */}

                                <div className=" w-full flex items-center justify-between">
                                    <div className="flex-1">
                                        <label htmlFor="brandPriceRange" className="mt-4 block text-base font-medium text-[#30323E] mb-2">Shipping Times*</label>
                                        <div className="flex items-center justify-start">
                                            <input value={shippingTimesOne} type="number" id="shippingTimesOne" name="shippingTimesOne" className="mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none mr w-[5rem] h-10 mr-2 rounded-md mb-3" placeholder="1" onChange={(e) => handleShippingTimes(e)} /> to
                                            <input value={shippingTimesTwo} type="number" id="shippingTimesTwo" name="shippingTimesTwo" className="mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none  w-[5rem] h-10 mr-2 ml-2 rounded-md mb-3" placeholder="3" onChange={(e) => handleShippingTimes(e)} />
                                            Days

                                        </div>
                                    </div>

                                    <div className="flex-1">

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

    // Get all interest from interest table
    const interestResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/brands/interests`)
    const interestData = await interestResponse.json()

    return {
        props: {
            session,
            sellerData,
            interestData,
        }
    }
}