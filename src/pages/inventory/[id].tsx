import React, { useEffect, useState, useRef, useCallback } from 'react'
import Layout from '../layout';
import Breadcrums from '../../../components/Breadcrums';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { getSession, useSession } from 'next-auth/react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlinePlusSquare, AiFillDelete, AiOutlineCloudUpload } from 'react-icons/ai'
import { v4 as uuidv4 } from 'uuid';
import { MdKeyboardArrowDown } from "react-icons/md";
import { set } from 'date-fns';
import { CiImageOn } from 'react-icons/ci'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { FaCheckCircle } from "react-icons/fa";
import inventoryValidate from '../../../forms/inventoryValidate';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../shadcn/components/ui/dialog"
import CustomImage from '../../../utlis/CustomImage';

interface VariantOption {
    id: number;
    values: { id: number; value: string }[];
}

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


const categories: CategoryType = {
    "Health & Beauty": ["Bath & Body", "Makeup", "Skin Care", "Hair Care", "Nails", "Salon & Spa Equipment", "Fragrance", "Tools & Accessories", "Shaving & Hair Removal"],
    "Clothing": ["Dresses", "Tops & Tees", "Sweaters", "Jeans", "Pants", "Skirts", "Activewear", "Swimsuits & Cover Ups", "Lingerie, Sleep & Lounge", "Coats & Jackets", "Suits & Blazers", "Socks"],
    "Accessories": ["Scarves & Wraps", "Sunglasses", "Belts", "Wallets"],
    "Footwear": ["Athletic", "Boots", "Fashion Sneakers", "Flats", "Outdoor", "Slippers", "Pumps & Heels", "Loafers & Slip-Ons", "Oxfords", "Sandals", "Work & Safety"],
    "Watches": ["Luxury", "Sport"],
    "Jewelry": ["Necklaces", "Rings", "Earrings", "Bracelets", "Wedding & Engagement"],
    "Bags": ["Cross-body bags", "Shoulder bags", "Wallets", "Handbags", "Clutches", "Purse", "Tote Bags"],
};


// API Configurations
const baseURL = "https://dev.mybranzapi.link";
const postMediaEndpoint = "media/single";
const mediaEndpoint = "media/%s";
const token = "fb507a0b75e0f62f65b798424555733f";

export default function ProductList({ sellerData, productData, collecionData }: { sellerData: SellerData, productData: any, collecionData: any }) {

    function decideCountry() {
        if (sellerData?.data?.Brands[0]?.businessCountry == 'India') {
            return '₹'
        } else {
            return '$'
        }
    }

    const router = useRouter();
    const { id } = router.query;

    const [cache, setCache] = useState({});

    const handleCacheUpdate = (key: any, value: any) => {
        setCache(prevCache => ({ ...prevCache, [key]: value }));
    };

    const [loading, setLoading] = useState(false)
    const [productCategory, setProductCategory] = useState<string>(sellerData?.data?.Brands[0]?.brandCategory);
    const [subCategory, setSubCategory] = useState<any>([]);
    const [subCategoryOpen, setSubCategoryOpen] = useState(false);
    const [collectionOpen, setCollectionOpen] = useState(false);
    const [prodMargin, setProdMargin] = useState<number>(0)
    const [isPageUpdate, setIsPageUpdate] = useState(false)

    const [variantOptions, setVariantOptions] = useState<any[]>([])
    const [variationValues, setVariationValues] = useState<any[]>([]);

    const [variationKeys, setVariationKeys] = useState<any[]>([])

    const [productTypeTableOpen, setProductTypeTableOpen] = useState("type")
    const [productType, setProductType] = useState("Single Product")

    const [objectKeys, setObjectKeys] = useState<any[]>([]);
    const fileInputRef = useRef<any>(null);


    const [productCollections, setProductCollections] = useState<any[]>([]); // Collection this product belongs to
    const [allCollectionData, setAllCollectionData] = useState<any[]>([]); // All collections of a brand fetched from the API

    const [tempArrForVariationOptions, setTempArrForVariationOptions] = useState<any[]>([]) // Temporary array to store the variation options id to see if we need to automatically add a new variation option input field

    useEffect(() => {

        if (collecionData !== null && id === "new") {
            setAllCollectionData(collecionData.data.collections)
        }

    }, [])


    function handleVariationChange(e: any, id: number) {
        setVariationValues((prevVariationValues: any) =>
            prevVariationValues.map((variation: any) => {
                if (variation.id !== id) {
                    return variation;
                }

                return { ...variation, [e.target.name]: e.target.value };
            })
        );

    }

    const formik = useFormik({
        initialValues: {
            productName: '',
            productCategory: productCategory ? productCategory : '',
            productColor: '',
            productSize: '',
            productSizeValue: '',
            productQuantity: '',
            productDescription: '',
            productSku: '',
            productSubCategory: subCategory ? subCategory : [],
            productPrice: '',
            compareAtPrice: '',
            productCost: '',
            productMargin: "",
            productKeywords: '',
            productType: productType ? productType : '',
            productCollections: productCollections ? productCollections : []
        },
        validate: inventoryValidate,
        onSubmit
    })

    const productNameError = formik.errors.productName && formik.touched.productName
    const skuError = formik.errors.productSku && formik.touched.productSku
    const productKeywordsError = formik.errors.productKeywords && formik.touched.productKeywords
    const productPriceError = formik.errors.productPrice && formik.touched.productPrice
    const productSizeValueError = formik.errors.productSizeValue && formik.touched.productSizeValue
    const productQuantityError = formik.errors.productQuantity && formik.touched.productQuantity
    const productCostError = formik.errors.productCost && formik.touched.productCost
    const compareAtPriceError = formik.errors.compareAtPrice && formik.touched.compareAtPrice

    console.log("HELLO", formik.errors)

    const { values, setFieldValue } = formik;

    function removeImage(key: string) {
        const newKeys = objectKeys.filter((k) => k !== key);
        setCache((prevCache: any) => {
            const newCache = { ...prevCache };
            delete newCache[key];
            return newCache;
        });
        setObjectKeys(newKeys);
    }

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
        async (e: any) => {
            const files: File[] = Array.from(e.target.files);  // Convert FileList to Array
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (files.length > 0) {
                const uploadedKeys: string[] = [];
                for (const file of files) {
                    if (file.size > maxSize) {
                        notification(false, `${file.name} larger than 10mb (skipped)`);
                        continue; // Skip this file
                    }

                    try {

                        const uploadPromise = uploadFile(file, token);

                        toast.promise(
                            uploadPromise,
                            {
                                loading: 'Uploading...',
                                success: `Uploaded ${file.name} successfully!`,
                                error: `Failed to upload ${file.name}`
                            }
                        );

                        const response = await uploadPromise;
                        if (response.status === 'success' && response.data.objectKey) {
                            uploadedKeys.push(response.data.objectKey);
                        } else {
                            console.error("Failed to upload image:", file.name);
                            notification(false, `Upload Failed: ${file?.name}`);
                        }
                    } catch (error) {
                        console.error("Error uploading the image:", file.name, error);
                        notification(false, `Upload Failed: ${file?.name}`);
                    }
                }
                setObjectKeys(prevKeys => [...prevKeys, ...uploadedKeys]);  // Merge old and new objectKeys
            }
        },
        [token]
    );

    useEffect(() => {
        const marginValue = parseInt(values?.productPrice) - parseInt(values?.productCost);
        setFieldValue("productMargin", marginValue.toString());

        if (values?.productPrice && values?.productCost) {
            setProdMargin(parseInt(values?.productPrice) - parseInt(values?.productCost));
        }
    }, [values.productCost, values.productPrice, setFieldValue]);


    async function onSubmit(values: { productName: string, productCategory: string, productColor: string, productSize: string, productQuantity: string, productDescription: string, productSku: string, productSubCategory: any, productPrice: string, productCost: string, productMargin: string, productKeywords: string, productSizeValue: string, productType: string, compareAtPrice: string }) {
        setLoading(true)

        if (objectKeys.length === 0) {
            notification(false, "Please upload at least one product image.");
            setLoading(false);
            return;
        }

        if (subCategory.length === 0) {
            notification(false, "Please select at least one product subcategory.");
            setLoading(false);
            return;
        }

        // Create a copy of values excluding the optional fields
        const requiredValues: { [key: string]: any } = { ...values };

        if (productType != "Single Product") {
            delete requiredValues.productColor;
            delete requiredValues.productQuantity;
            delete requiredValues.productMargin;
            delete requiredValues.productCost;
            delete requiredValues.productPrice;
            delete requiredValues.productSize;
            delete requiredValues.productSizeValue;
        }

        // Check if all other fields have a value
        if (!Object.values(requiredValues).every(v => v)) {
            notification(false, "Please fill out all the required fields.");
            setLoading(false);
            return;
        }

        // Remove productVariations with empty options
        const filteredVariationValues = variationValues.filter(
            (variation) => variation.options.length > 0
        );

        setVariationValues(filteredVariationValues);

        const filteredVariantOptions = variantOptions.map((variation) => {
            return {
                ...variation,
                values: variation.values.filter((value: any) => value.value !== "")
            };
        });

        setVariantOptions(filteredVariantOptions);

        try {
            if (isPageUpdate) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory/products/${sellerData?.data?.id}/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sellerId: sellerData?.data?.id,
                        brandId: sellerData?.data?.Brands?.[0]?.id ? sellerData?.data?.Brands?.[0]?.id : 0,
                        productName: values.productName,
                        productCategory: values.productCategory,
                        productColor: values.productColor ? values.productColor : 'NULL',
                        productSize: values.productSize ? values.productSize : 'NULL',
                        productSizeValue: values.productSizeValue ? values.productSizeValue : 0,
                        productQuantity: values.productQuantity ? values.productQuantity : 0,
                        productDescription: values.productDescription ? values.productDescription : 'NULL',
                        productSku: values.productSku.trim(),
                        productSubCategory: values.productSubCategory,
                        productPrice: values.productPrice ? values.productPrice : 0,
                        compareAtPrice: values.compareAtPrice ? values.compareAtPrice : 0,
                        productCost: values.productCost ? values.productCost : 0,
                        productMargin: Number(values.productMargin) ? Number(values.productMargin) : 0,
                        productKeywordArray: values.productKeywords.split(","),
                        productImagesArray: objectKeys,
                        productVariations: filteredVariationValues,
                        variantOptions: filteredVariantOptions,
                        productType: values.productType,
                        productCollections: productCollections
                    })
                })
                const data = await response.json();

                if (data.success) {
                    notification(true, "Product Updated successfully.");
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

            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory/add/product`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sellerId: sellerData?.data?.id,
                        brandId: sellerData?.data?.Brands?.[0]?.id ? sellerData?.data?.Brands?.[0]?.id : 0,
                        productName: values.productName,
                        productCategory: values.productCategory,
                        productColor: values.productColor ? values.productColor : 'NULL',
                        productSize: values.productSize ? values.productSize : 'NULL',
                        productSizeValue: values.productSizeValue ? values.productSizeValue : 0,
                        productQuantity: values.productQuantity ? values.productQuantity : 0,
                        productDescription: values.productDescription ? values.productDescription : 'NULL',
                        productSku: values.productSku.trim(),
                        productSubCategory: values.productSubCategory,
                        productPrice: values.productPrice ? values.productPrice : 0,
                        compareAtPrice: values.compareAtPrice ? values.compareAtPrice : 0,
                        productCost: values.productCost ? values.productCost : 0,
                        productMargin: Number(values.productMargin) ? Number(values.productMargin) : 0,
                        productKeywordArray: values.productKeywords.split(","),
                        productImagesArray: objectKeys,
                        productVariations: filteredVariationValues,
                        variantOptions: filteredVariantOptions,
                        productType: values.productType,
                        productCollections: productCollections
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

    function generateVariants(options: VariantOption[]): string[][] {
        console.log(options);
        const result: string[][] = [];

        function generateCombinations(index: number, currentCombination: string[]): void {
            if (index === options.length) {
                result.push([...currentCombination]);
                return;
            }

            const currentOption = options[index];
            for (const value of currentOption.values) {
                if (value.value !== "") {
                    generateCombinations(index + 1, [...currentCombination, value.value]);
                }
            }
        }

        generateCombinations(0, []);

        return result;
    }

    useEffect(() => {
        if (variantOptions.length > 0) {
            setVariationKeys(generateVariants(variantOptions));
        }
    }, [variantOptions])

    useEffect(() => {
        const oldVariationValues = variationValues;
        setVariationValues(() => {
            const newVariationValues = variationKeys.map((variation: any) => {
                // Check if the variation already exists in oldVariationValues
                const existingVariation = oldVariationValues.find(
                    (v) =>
                        v.options.length === variation.length &&
                        v.options.slice().sort().every((option: any, index: any) => option === variation.slice().sort()[index])
                );

                if (existingVariation) {
                    // If the variation exists, return the existing variation
                    return existingVariation;
                } else {
                    // If the variation doesn't exist, create a new one
                    return {
                        id: uuidv4(),
                        options: variation[0] == "" ? [] : variation,
                        price: 0,
                        stock: 0,
                        compareAtPrice: 0,
                        sku: "",
                        mediaObjectKey: "",
                    };
                }
            });

            return newVariationValues;
        });
    }, [variationKeys]);

    function addOptionsAttributes(id: any) {
        const newVariations = variantOptions.map((variation, index) => {
            if (variation.id === id) {
                return { ...variation, values: [...variation.values, { id: uuidv4(), value: "", hex: "" }] }
            }
            return variation;
        })
        setVariantOptions(newVariations);
    }

    async function addOptions(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setVariantOptions([{ id: uuidv4(), name: "", values: [{ id: uuidv4(), value: "", hex: "" }] }, ...variantOptions])
    }



    function deleteVariation(id: number) {
        const newVariations = variantOptions.filter((variation) => variation.id !== id);
        setVariantOptions(newVariations);
    }

    function deleteVariationAttribute(variationId: number, valueId: number) {
        const newVariations = variantOptions.map((variation) => {
            if (variation.id !== variationId) {
                return variation;
            }

            return {
                ...variation,
                values: variation.values.filter((val: any) => val.id !== valueId)
            };
        });

        setVariantOptions(newVariations);
    }

    function handleInputChange(e: any, variationId: number, valueType: any, valueId: any) {

        if (valueType === "value") {
            if (!tempArrForVariationOptions.includes(valueId)) addOptionsAttributes(variationId)

            if (!tempArrForVariationOptions.includes(valueId)) setTempArrForVariationOptions([...tempArrForVariationOptions, valueId])
        }

        const { value } = e.target;

        setVariantOptions(prevVariations =>
            prevVariations.map(variation => {
                if (variation.id !== variationId) {
                    return variation;
                }

                if (!valueType) {  // Change is for the variation name
                    return { ...variation, name: value };
                }

                // Change is for a variation value property
                return {
                    ...variation,
                    values: variation.values.map((val: any) => {
                        if (val.id !== valueId) {
                            return val;
                        }
                        return { ...val, [valueType]: value };
                    })
                };
            })
        );
    }

    const inputClass = `mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none  w-[22.5rem] h-10 rounded-md mb-3`

    const labelClass = `mt-6 block text-base font-medium text-[#30323E] mb-2`

    // Update Page
    useEffect(() => {
        if (id !== "new" && id !== undefined && id !== null && id !== "" && typeof (Number(id)) === 'number') {
            setIsPageUpdate(true)
            const fetchProduct = async () => {
                try {
                    if (productData) {
                        const product = productData.data;
                        const productCollectionNumberArray = product.productCollections && product.productCollections.length > 0 ? product.productCollections.map((id: any) => Number(id)) : [];
                        setFieldValue("productName", product.productName || "");
                        setFieldValue("productCategory", sellerData.data.Brands[0].brandCategory || "");
                        setFieldValue("productColor", product.productColor || "");
                        setFieldValue("productSize", product.productSize || "");
                        setFieldValue("productSizeValue", product.productSizeValue || "");
                        setFieldValue("productQuantity", product.productQuantity || 0);
                        setFieldValue("productDescription", product.productDescription || "");
                        setFieldValue("productSku", product.productSku || "");
                        setFieldValue("productSubCategory", product.productSubCategory || "");
                        setFieldValue("productPrice", product.productPrice || 0);
                        setFieldValue("compareAtPrice", product.compareAtPrice || 0);
                        setFieldValue("productCost", product.productCost || 0);
                        setFieldValue("productMargin", product.productMargin || "");
                        setFieldValue("productKeywords", product.productKeywordArray.join(",") || '');
                        setFieldValue("productType", product.productType);
                        setFieldValue("productCollections", productCollectionNumberArray);
                        setVariantOptions(product.variantOptions || []);
                        setVariationValues(product.productVariations || []);
                        setObjectKeys(product.productImagesArray || []);
                        setProductType(product.productType);
                        setProductCategory(sellerData.data.Brands[0].brandCategory);
                        setSubCategory(product.productSubCategory);
                        setAllCollectionData(productData.collections)
                        setProductCollections(productCollectionNumberArray)
                    } else {
                        window.location.href = "/inventory/new";
                        // router.push('/inventory/new');

                        //FIX This so we check this on server & just pass the data to the page
                    }
                } catch (error) {

                    console.error(error);
                }
            }
            fetchProduct();
        }
    }, [id])

    function simulateEscapeClick() {
        const escapeKeyEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            keyCode: 27,
            code: 'Escape',
            which: 27,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(escapeKeyEvent);
    }


    return (
        <Layout>
            <Toaster position="top-center" reverseOrder={true} />
            <div className="py-6 h-screen">
                <div className="mx-auto px-4 sm:px-6 md:px-8 ">
                    <Breadcrums parent={"Inventory"} childarr={[`${isPageUpdate ? "Update Product" : "Add Product"}`]} />
                </div>
                <div className="mx-auto px-4 sm:px-6 md:px-8 pb-24">
                    {/* Replace with your content */}
                    <div className="py-4">
                        <form onSubmit={formik.handleSubmit} className='flex justify-center gap-4'>
                            <div className="bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] rounded-lg p-7  flex-1">
                                <h1 className=' text-[#F12D4D] text-2xl font-semibold'>Product Listing</h1>

                                <div className="w-full flex items-center justify-between">
                                    <div className="flex-1">
                                        <label htmlFor="business" className={labelClass}>Product Name*</label>

                                        <input {...formik.getFieldProps('productName')} type="text" id="productName" name="productName" className={`${inputClass} ${productNameError && '!border-red-500'}`} placeholder='Enter Product Name' />
                                        {productNameError && <p className='text-red-500 text-xs absolute'> {formik.errors.productName}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="business" className={labelClass}>Product SKU*</label>

                                        <input {...formik.getFieldProps('productSku')} type="text" id="productSku" name="productSku" className={`${inputClass} ${skuError && '!border-red-500'}`} placeholder='Enter Product SKU' />
                                        {skuError && <p className='text-red-500 text-xs absolute'> {formik.errors.productSku}</p>}
                                    </div>
                                </div>

                                {/* NEW LINE */}

                                <div className="w-full flex items-center justify-between">
                                    <div className="flex-1">
                                        <label htmlFor="productImages" className={labelClass}>Product Images*</label>
                                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }} multiple />
                                        <div onClick={() => fileInputRef.current?.click()} className=' cursor-pointer border-dashed border-2 border-red-600 rounded-lg flex flex-col items-center justify-center py-4'>
                                            <p className='my-2 text-black text-lg'>Jpg, Png</p>
                                            <p className='my-2 text-gray-400 text-base'>File not Exceed 10mb</p>
                                            <button type='reset' className='flex items-center bg-red-600 text-white py-2 px-3 rounded-md my-2'> <AiOutlineCloudUpload fontSize="20" className='mr-2' />Upload</button>
                                        </div>
                                        <div className='flex items-center justify-start flex-wrap'>
                                            {objectKeys.map((key, index) => {
                                                if (key.includes("http")) {
                                                    return (
                                                        <div key={index} className="relative group w-[10%] mr-2 mt-4 ">
                                                            <img
                                                                key={index}
                                                                src={key}
                                                                alt={`custom-${key}`}
                                                                className="w-full h-full border-2 border-gray-200 rounded-md prod-images"
                                                            />

                                                            <div className="absolute inset-0 bg-gray-500 opacity-0 rounded-md group-hover:opacity-50 flex justify-center items-center">
                                                                <span onClick={() => removeImage(key)} className="text-white text-3xl font-bold cursor-pointer">×</span>
                                                            </div>
                                                        </div>
                                                    )
                                                } else if (!key.includes("http")) {
                                                    return <div key={index} className="relative group w-[10%] mr-2 mt-4 ">
                                                        <CustomImage key={index} objectKey={key} removeImage={removeImage} cache={cache} updateCache={handleCacheUpdate} width='full' height='full' />
                                                        <div className="absolute inset-0 bg-gray-500 opacity-0 rounded-md group-hover:opacity-50 flex justify-center items-center">
                                                            <span onClick={() => {
                                                                removeImage(key),
                                                                    setCache((prevCache: any) => {
                                                                        const newCache = { ...prevCache };
                                                                        delete newCache[key];
                                                                        return newCache;
                                                                    });
                                                            }
                                                            } className="text-white text-3xl font-bold cursor-pointer">×</span>
                                                        </div>
                                                    </div>

                                                } else {
                                                    return null
                                                }

                                            })}
                                        </div>
                                    </div>
                                </div>


                                <div className="w-full flex items-center justify-between">
                                    <div className="w-full">
                                        <label htmlFor="variations" className={labelClass}>Product Data</label>
                                        <div className='w-full bg-[#f7f9fa] flex flex-col border'>
                                            <div className='flex-[0.3] flex border-r'>
                                                <div onClick={() => setProductTypeTableOpen("type")} className={`font-semibold border-gray-200 border w-full py-3 hover:bg-[#f23250] hover:text-white hover:font-semibold cursor-pointer px-4 ${productTypeTableOpen == "type" && "bg-[#f23250] text-white font-semibold"}`}>Product Type</div>
                                            </div>


                                            <div className='flex-[1] p-4'>
                                                {productTypeTableOpen === "type" && (
                                                    <div className='productType'>
                                                        <select {...formik.getFieldProps('productType')} id="productType" name="productType" value={productType} className={inputClass} onChange={(e) => { setProductType(e.target.value); formik.handleChange(e); }}>
                                                            <option className="text-base text-[#30323E] ">Single Product</option>
                                                            <option className="text-base text-[#30323E] ">Variable Product</option>
                                                        </select>
                                                    </div>
                                                )}


                                                {productType == 'Single Product' && (
                                                    <>
                                                        <div className="flex-1">
                                                            <label htmlFor="business" className={labelClass}>Product Options*</label>

                                                            <div className='flex items-center justify-start'>
                                                                <div>
                                                                    <select {...formik.getFieldProps('productColor')} name='productColor' id="productColor" className='mr-3 outline-none focus:outline-none border-brand-border rounded bg-white text-brand-text px-5 py-4 w-[148px]'>
                                                                        <option value="English">Color</option>
                                                                        <option value="Spanish">Sub Category 1</option>
                                                                        <option value="Spanish">Sub Category 2</option>
                                                                        <option value="Spanish">Sub Category 3</option>
                                                                    </select>
                                                                    <p className='text-center text-sm italic text-gray-600'>(Color)</p>
                                                                </div>

                                                                <>
                                                                    <div>
                                                                        <input type='number' {...formik.getFieldProps('productSizeValue')} name='productSizeValue' placeholder='Size Value' id="productSizeValue" className={`mr-3 outline-none focus:outline-none border-brand-border rounded bg-white text-brand-text px-5 py-4 w-[148px]  ${productSizeValueError && 'border !border-red-500'}`} />
                                                                        <p className='text-center text-sm italic text-gray-600'>(Size Value)</p>
                                                                        {productSizeValueError && <p className='text-red-500 text-xs absolute'> {formik.errors.productSizeValue}</p>}
                                                                    </div>
                                                                    <div>
                                                                        <select {...formik.getFieldProps('productSize')} name='productSize' id="productSize" className='mr-3 outline-none focus:outline-none border-brand-border rounded bg-white text-brand-text px-5 py-4 w-[148px]'>
                                                                            <option value="">Size</option>
                                                                            <option value="inch">Inch</option>
                                                                            <option value="cm">cm</option>
                                                                            <option value="mm">mm</option>
                                                                            <option value="ft">ft</option>
                                                                            <option value="grams">Grams</option>
                                                                            <option value="kg">kg</option>
                                                                            <option value="ml">ml</option>
                                                                            <option value="fl">fl</option>
                                                                            <option value="oz">oz</option>
                                                                        </select>
                                                                        <p className='text-center text-sm italic text-gray-600'>(Size)</p>
                                                                    </div>
                                                                </>

                                                                <div>
                                                                    <input type='number' {...formik.getFieldProps('productQuantity')} name='productQuantity' placeholder='Quantity' id="productQuantity" className={`mr-3 outline-none focus:outline-none border-brand-border rounded bg-white text-brand-text px-5 py-4 w-[148px] ${productQuantityError && 'border !border-red-500'}`} />
                                                                    <p className='text-center text-sm italic text-gray-600'>(Quantity)</p>
                                                                    {productQuantityError && <p className='text-red-500 text-xs absolute'> {formik.errors.productQuantity}</p>}

                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div className="flex-1">
                                                            <label htmlFor="business" className={labelClass}>Price*</label>
                                                            <div className='flex items-center justify-start mt-4'>
                                                                <div>
                                                                    <div className={`flex items-center mr-3 outline-none focus:outline-none border border-white rounded bg-white text-brand-text px-5 py-4 w-[148px] ${compareAtPriceError && 'border !border-red-500'}`}>
                                                                        {<p className='mr-1'>{decideCountry()}</p>}<input type='number' {...formik.getFieldProps('compareAtPrice')} name='compareAtPrice' id="compareAtPrice" className={`w-full focus:outline-none`} placeholder='Compare Price' />

                                                                    </div>
                                                                    <p className='text-center text-sm italic text-gray-600'>(Compare At Price)</p>
                                                                    {compareAtPriceError && <p className='text-red-500 text-xs absolute'>{formik.errors.compareAtPrice}</p>}
                                                                </div>
                                                                <div>
                                                                    <div className={`flex items-center mr-3 outline-none focus:outline-none border border-white rounded bg-white text-brand-text px-5 py-4 w-[148px] ${productPriceError && 'border !border-red-500'}`}>
                                                                        {<p className='mr-1'>{decideCountry()}</p>}<input type='number' {...formik.getFieldProps('productPrice')} name='productPrice' id="productPrice" className={`w-full focus:outline-none`} placeholder='Price' />

                                                                    </div>
                                                                    <p className='text-center text-sm italic text-gray-600'>(Price)</p>
                                                                    {productPriceError && <p className='text-red-500 text-xs absolute'> {formik.errors.productPrice}</p>}
                                                                </div>

                                                                <div>

                                                                    <div className={`flex items-center mr-3 outline-none focus:outline-none border border-white rounded bg-white text-brand-text px-5 py-4 w-[148px] ${productCostError && 'border !border-red-500'}`}>
                                                                        {<p className='mr-1'>{decideCountry()}</p>}<input type='number' {...formik.getFieldProps('productCost')} name='productCost' id="productCost" className='w-full focus:outline-none' placeholder='COGS' />
                                                                    </div>
                                                                    <p className='text-center text-sm italic text-gray-600'>(COGS)</p>
                                                                    {productCostError && <p className='text-red-500 text-xs absolute'> {formik.errors.productPrice}</p>}
                                                                </div>

                                                                <div>
                                                                    <div className='flex items-center mr-3 outline-none focus:outline-none border border-white rounded bg-white text-brand-text px-5 py-4 w-[148px]'>
                                                                        {<p className='mr-1'>{decideCountry()}</p>}<input type='number' {...formik.getFieldProps('productMargin')} name='productMargin' id="productMargin" className='w-full focus:outline-none' placeholder={`Margin: $${prodMargin && prodMargin}`} />
                                                                    </div>
                                                                    <p className='text-center text-sm italic text-gray-600'>(Margin)</p>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}


                                                {productType == 'Variable Product' && (
                                                    <div className='variations'>
                                                        {variantOptions.length < 3 && <button onClick={(e) => addOptions(e)} className=' px-3 py-2 bg-[#f12d4d] text-white font-semibold rounded-md text-sm'>+ Add Variations</button>}
                                                        {variantOptions.map((variation, index) => (
                                                            <div className='variationChild bg-white mt-4 border border-gray-200 rounded-md' key={variation.id}>
                                                                <div className=' mt-4 p-4 flex flex-col justify-between items-start border-b-2'>
                                                                    <p className='text-sm mb-2'>Variation Name</p>
                                                                    <div className='flex justify-between w-full'>
                                                                        <span className='w-full'>
                                                                            <input
                                                                                type='text'
                                                                                className=' border px-2 py-2 bg-transparent w-full rounded-md'
                                                                                value={variation.name}
                                                                                placeholder='Color / Size / Material'
                                                                                onChange={(e) => handleInputChange(e, variation.id, null, null)}

                                                                            />
                                                                        </span>
                                                                        <div className='p-2 flex items-center justify-center'>
                                                                            {/* <AiOutlinePlusSquare onClick={(e) => addOptionsAttributes(variation.id)} className='cursor-pointer text-base ' /> */}
                                                                            <AiFillDelete onClick={(e) => deleteVariation(variation.id)} className='cursor-pointer ml-4 text-base' />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <p className='text-sm mb-2 px-4 pt-4'>Variation Values</p>
                                                                {variation.values.map((value: any) => (
                                                                    <div className='flex bg-white py-2 px-4 justify-between w-full' id={value.id} key={value.id}>
                                                                        <input
                                                                            name='value'
                                                                            type='text'
                                                                            className='flex-1 border p-2 rounded-md h-10'
                                                                            value={value.value}
                                                                            placeholder='Add Variation Value'
                                                                            onChange={(e) => {
                                                                                handleInputChange(e, variation.id, "value", value.id)
                                                                            }}
                                                                        />
                                                                        {(variation.name.toLowerCase().includes('color') || variation.name.toLowerCase().includes('colour')) && <input
                                                                            name='hex'
                                                                            type='color'
                                                                            className='flex-[0.1] ml-2 h-10 bg-white rounded-md'
                                                                            value={value?.hex ? value?.hex : "#000000"}
                                                                            placeholder='HEX Code (ex: #000000)'
                                                                            onChange={(e) => {
                                                                                handleInputChange(e, variation.id, "hex", value.id)
                                                                            }}
                                                                        />}
                                                                        <p className='flex-[0.1] text-base flex items-center justify-end'>
                                                                            {variation.values.length > 1 && value.value && <AiFillDelete className='cursor-pointer' onClick={(e) => deleteVariationAttribute(variation.id, value.id)} />}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}


                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {productType == "Variable Product" && variationValues.length > 0 && variationValues[0].options.length > 0 && <>
                                    <div className='bg-white p-2 mt-4 overflow-x-scroll border border-gray-200 rounded-md w-full'>
                                        <div className="variationKeys border-b border-gray-300 flex items-center justify-between px-2 w-full max-2xl">
                                            <div className=" bg-gray-50 rounded-md h-[30px] w-[40px] border shadow-sm border-[#DDDDDD] flex items-center justify-center invisible">
                                            </div>
                                            <p className=" break-words text-sm mx-1 px-1 flex-1 flex-shrink-1 w-0 invisible">Red</p>

                                            <p className="rounded-md mx-2 text-gray-400 flex-1 flex-shrink-1 w-0 text-sm text-center">Compare At Price</p>
                                            <p className="rounded-md mx-2 text-gray-400 flex-1 flex-shrink-1 w-0 text-sm text-center">Price</p>
                                            <p className="rounded-md mx-2 text-gray-400 flex-1 flex-shrink-1 w-0 text-sm text-center">SKU</p>
                                            <p className="rounded-md mx-2 text-gray-400 flex-1 flex-shrink-1 w-0 text-sm text-center">Stock</p>

                                        </div>
                                        {variationValues.length > 0 && variationValues.map((variation, index) => {
                                            if (variation.options && variation.options.length > 0) {
                                                return (
                                                    <div key={index} className='variationKeys mt-4 flex items-center justify-between p-2 w-full max-2xl'>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                {
                                                                    variation?.mediaObjectKey ?
                                                                        (
                                                                            variation.mediaObjectKey.includes('http') ?
                                                                                (
                                                                                    <div className=' bg-gray-50 rounded-md h-[40px] w-[40px] border shadow-sm border-[#DDDDDD] flex items-center justify-center'>
                                                                                        <img src={variation?.mediaObjectKey} alt="variation" className=" cursor-pointer w-10 h-10 rounded-md" />
                                                                                    </div>
                                                                                )
                                                                                :
                                                                                (
                                                                                    !variation.mediaObjectKey.includes('http') ?
                                                                                        (
                                                                                            // Another action for HTTPS
                                                                                            <div className=' bg-gray-50 rounded-md h-[40px] w-[40px] border shadow-sm border-[#DDDDDD] flex items-center justify-center'>
                                                                                                {Object.keys(cache).length === objectKeys.length ? <CustomImage key={index} objectKey={variation?.mediaObjectKey} removeImage={removeImage} cache={cache} updateCache={handleCacheUpdate} width='full' height='full' /> : <div className=' bg-gray-50 rounded-md h-[40px] w-[40px] border shadow-sm border-[#DDDDDD] flex items-center justify-center'>
                                                                                                    {/* Different component or action */}
                                                                                                    <CiImageOn color='#818181' fontSize="20px" className='cursor-pointer' />
                                                                                                </div>}
                                                                                            </div>
                                                                                        )
                                                                                        :
                                                                                        (
                                                                                            // If neither HTTP nor HTTPS
                                                                                            <div className=' bg-gray-50 rounded-md h-[40px] w-[40px] border shadow-sm border-[#DDDDDD] flex items-center justify-center'>
                                                                                                <CustomImage key={index} objectKey={variation?.mediaObjectKey}
                                                                                                    width='full' height='full' removeImage={removeImage} cache={cache} updateCache={handleCacheUpdate} />
                                                                                            </div>
                                                                                        )
                                                                                )
                                                                        )
                                                                        :
                                                                        (
                                                                            // Handle case when mediaObjectKey is not defined
                                                                            <div className=' bg-gray-50 rounded-md h-[40px] w-[40px] border shadow-sm border-[#DDDDDD] flex items-center justify-center'>
                                                                                {/* Different component or action */}
                                                                                <CiImageOn color='#818181' fontSize="20px" className='cursor-pointer' />
                                                                            </div>
                                                                        )
                                                                }
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <div className="flex flex-col items-center justify-center">
                                                                        <DialogTitle>Select image to add as a variation image</DialogTitle>
                                                                    </div>
                                                                </DialogHeader>
                                                                <div className=' max-h-64 overflow-y-scroll flex items-center justify-start flex-wrap'>
                                                                    {objectKeys?.map((key, index) => {
                                                                        if (key?.includes("http")) {
                                                                            return (
                                                                                <div key={index} className="relative group w-[30%] mr-2 mt-4 ">
                                                                                    <img
                                                                                        key={index}
                                                                                        src={key}
                                                                                        alt={`custom-${key}`}
                                                                                        className="w-full h-full border-2 border-gray-200 rounded-md prod-images"
                                                                                    />

                                                                                    <div className="absolute inset-0 bg-gray-500 opacity-0 rounded-md group-hover:opacity-50 flex justify-center items-center">
                                                                                        <span onClick={() => {
                                                                                            simulateEscapeClick(),
                                                                                                setVariationValues((prevVariationValues: any) =>
                                                                                                    prevVariationValues.map((allvar: any) => {
                                                                                                        if (allvar.id !== variation.id) {
                                                                                                            return allvar;
                                                                                                        }

                                                                                                        return { ...variation, mediaObjectKey: key };
                                                                                                    })
                                                                                                );
                                                                                        }} className="text-white text-3xl font-bold cursor-pointer"><FaCheckCircle /></span>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        } else if (!key.includes("https")) {
                                                                            return <div key={index} className="relative group w-[30%] mr-2 mt-4 rrr">
                                                                                <CustomImage key={index} objectKey={key} width='full' height='full' removeImage={removeImage} cache={cache} updateCache={handleCacheUpdate} />
                                                                                <div className="absolute inset-0 bg-gray-500 opacity-0 rounded-md group-hover:opacity-50 flex justify-center items-center">
                                                                                    <span onClick={() => {
                                                                                        simulateEscapeClick(),
                                                                                            setVariationValues((prevVariationValues: any) =>
                                                                                                prevVariationValues.map((allvar: any) => {
                                                                                                    if (allvar.id !== variation.id) {
                                                                                                        return allvar;
                                                                                                    }

                                                                                                    return { ...variation, mediaObjectKey: key };
                                                                                                })
                                                                                            );
                                                                                    }} className="text-white text-3xl font-bold cursor-pointer"><FaCheckCircle /></span>
                                                                                </div>
                                                                            </div>
                                                                        } else {
                                                                            return null
                                                                        }

                                                                    })}
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                        <p className=' break-words text-sm mx-1 px-1 flex-1 flex-shrink-1 w-0'>{variation?.options?.toString().split(",").join(" / ")}</p>
                                                        <div className='border border-gray-300 rounded-md  mx-1 px-1 py-1 flex-1 flex-shrink-1 w-0 flex items-center'>
                                                            {<p className='mr-1'>{decideCountry()}</p>}<input className='focus:outline-none w-full' type='text' placeholder='Compare at Price' name="compareAtPrice" value={variation.compareAtPrice} id={variation.id} onChange={(e) => handleVariationChange(e, variation.id)} />
                                                        </div>
                                                        <div className='border border-gray-300 rounded-md  mx-1 px-1 py-1 flex-1 flex-shrink-1 w-0 flex items-center'>
                                                            {<p className='mr-1'>{decideCountry()}</p>}<input className='focus:outline-none w-full' type='text' placeholder='Price' name="price" value={variation.price} id={variation.id} onChange={(e) => handleVariationChange(e, variation.id)} />
                                                        </div>
                                                        <input className='border border-gray-300 rounded-md  mx-1 px-1 py-1 flex-1 flex-shrink-1 w-0' type='text' placeholder='SKU' name="sku" value={variation.sku} id={variation.id} onChange={(e) => handleVariationChange(e, variation.id)} />
                                                        <input className='border border-gray-300 rounded-md  mx-1 px-1 py-1 flex-1 flex-shrink-1 w-0' type='text' placeholder='Stock' name="stock" value={variation.stock} id={variation.id} onChange={(e) => handleVariationChange(e, variation.id)} /></div>
                                                );
                                            } else {
                                                // Render nothing if variation.options is empty
                                                return null;
                                            }
                                        })}
                                    </div>
                                </>}

                                {/* NEW LINE */}

                                <div className="">
                                    <div className="flex-1">
                                        <label htmlFor="business" className={labelClass}>Product Description*</label>
                                        <textarea {...formik.getFieldProps('productDescription')} rows={3} id="productDescription" name="productDescription" className="bg-[#f7f9fa] outline-none focus:outline-none mt-4 rounded-md px-5 py-4 w-full" placeholder='Enter Product Description' />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="business" className={labelClass}>Product Keywords*</label>

                                        <textarea {...formik.getFieldProps('productKeywords')} rows={3} id="productKeywords" name="productKeywords" className={`bg-[#f7f9fa] outline-none focus:outline-none mt-4 rounded-md px-5 py-4 w-full ${productKeywordsError && '!border-red-500 border'}`} placeholder='Enter Product Description' />
                                        {productKeywordsError && <p className='text-red-500 text-xs absolute'> {formik.errors.productKeywords}</p>}
                                    </div>
                                </div>

                                {/* NEW LINE */}


                                <div className="mt-16 flex">
                                    <button disabled={Object.keys(formik.errors).length > 0} type="submit" className="m-w-32 h-11 bg-[#F12D4D] px-5 flex items-center justify-center rounded-md text-white text-base font-semibold mr-5 cursor-pointer disabled:cursor-not-allowed" value="Add">{loading ? <AiOutlineLoading3Quarters className='spinner' /> : `${isPageUpdate ? "Update Product" : "Add Product"}`}</button>

                                    <Link href="/inventory/products"><button type="button" className="w-32 h-11 bg-[#EAEAEA] rounded-md text-[#979797] text-base font-normal cursor-pointer">Cancel </button></Link>
                                </div>
                                {Object.keys(formik.errors).length > 0 && <p className='text-red-500 mt-2 text-sm'>Solve the above errors to add product</p>}
                            </div>
                            <div className='sidebar bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] rounded-lg p-7 flex-[0.3]'>
                                <div className="flex-1">
                                    <label htmlFor="productCategory" className={labelClass}>Product Category*</label>

                                    <select {...formik.getFieldProps('productCategory')} id="productCategory" name="productCategory" className={inputClass} value={productCategory} onChange={(e) => {
                                        setSubCategory([]);
                                        formik.setFieldValue('productSubCategory', []);
                                        setProductCategory(e.target.value);
                                        formik.setFieldValue('productCategory', e.target.value);
                                    }}>
                                        <option className="text-base" value="">Select Category</option>
                                        {Object.keys(categories).map((cat) => (
                                            <option className="text-base" key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex-1">
                                    <label className={labelClass}>Product Sub-Category*</label>
                                    <div className={`mt-1 px-0 py-2 bg-[#F7F9FA] border shadow-sm border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none  w-[22.5rem] h-10 rounded-md mb-3`} id="productSubCategory" onClick={(e) => setSubCategoryOpen(true)}>
                                        {productCategory && subCategoryOpen && <div onClick={(e) => { e.stopPropagation(); setSubCategoryOpen(false); }} className='w-full min-h-[150vh] opacity-0 bg-black absolute top-0 right-0'></div>}
                                        <span className='flex items-center justify-between'><p className='flex items-center opacity-50 ml-3'>{subCategory.length === 0 && "Select Sub-Category"}
                                            {subCategory && subCategory.length > 0 && subCategory.map((subCat: any, index: number) => (
                                                <span key={index} className='inline-block mx-1 bg-[#F12D4D] text-white text-xs px-2 py-1 rounded-md'>{subCat}</span>
                                            ))}
                                        </p>
                                            <MdKeyboardArrowDown className='mr-2' fontSize="20px" /></span>
                                        {productCategory && subCategoryOpen && <div className="dropdown z-10 relative mt-2 shadow-[rgba(0,_0,_0,_0.2)_0px_20px_20px_-7px] px-3 py-2 bg-white border border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none w-[22.5rem] rounded-md">
                                            {productCategory && categories[productCategory]?.map((subCat) => (
                                                <div key={subCat} className="checkbox-option flex items-center ">
                                                    <input type="checkbox" id={subCat} name={subCat} value={subCat} checked={subCategory.includes(subCat)} onChange={(e) => {
                                                        const isChecked = e.target.checked; const updatedSubCategories = isChecked ? [...subCategory, subCat] : subCategory.filter((category: any) => category !== subCat); setSubCategory(updatedSubCategories); formik.setFieldValue('productSubCategory', updatedSubCategories);
                                                    }} />
                                                    <label htmlFor={subCat} className=" w-full text-base text-[#30323E] ml-2 cursor-pointer"> {subCat} </label>
                                                </div>
                                            ))}
                                        </div>}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <label className={labelClass}>Product Collection</label>
                                    <div className={`mt-1 px-0 py-2 bg-[#F7F9FA] border shadow-sm border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none  w-[22.5rem] h-10 rounded-md mb-3`} id="productSubCategory" onClick={(e) => setCollectionOpen(true)}>
                                        {collectionOpen && <div onClick={(e) => { e.stopPropagation(); setCollectionOpen(false); }} className='w-full min-h-[150vh] opacity-0 bg-black absolute top-0 right-0'></div>}
                                        <span className='flex items-center justify-between'>
                                            <p className='flex items-center opacity-50 ml-3'>{"Select Collections"}
                                                {/* {allCollectionData && allCollectionData.length > 0 && allCollectionData.map((collection: any, index: number) => (
                                                <span key={index} className='inline-block mx-1 bg-[#F12D4D] text-white text-xs px-2 py-1 rounded-md'>{collection}</span>
                                            ))} */}
                                            </p>
                                            <MdKeyboardArrowDown className='mr-2' fontSize="20px" /></span>
                                        {collectionOpen && <div className="dropdown z-10 relative mt-2 shadow-[rgba(0,_0,_0,_0.2)_0px_20px_20px_-7px] px-3 py-2 bg-white border border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none w-[22.5rem] rounded-md">
                                            {allCollectionData.length === 0 && <p className='text-center text-sm text-gray-400'>No Collections Available.<br></br><Link href="/collections/new" className='text-black text-sm underline'>Add Collections</Link></p>}
                                            {allCollectionData && allCollectionData?.map((collection) => (
                                                <div key={collection.id} className="checkbox-option flex items-center ">
                                                    <input type="checkbox" id={collection.id} name={collection.collectionName} value={collection.collectionName} checked={productCollections.includes(collection.id)} onChange={(e) => {
                                                        const isChecked = e.target.checked; const updatedCollectionIds = isChecked ? [...productCollections, collection.id] : productCollections.filter((id: any) => id !== collection.id); setProductCollections(updatedCollectionIds); formik.setFieldValue('productCollections', updatedCollectionIds);
                                                    }} />
                                                    <label htmlFor={collection.id} className=" w-full text-base text-[#30323E] ml-2 cursor-pointer"> {collection.collectionName} </label>
                                                </div>
                                            ))}
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    {/* /End replace */}
                </div>
            </div >
        </Layout >
    )
}


export async function getServerSideProps({ req, params }: any) {
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


    if (!sellerData?.data?.isPlanActive) {
        return {
            redirect: {
                destination: '/account',
                permanent: false
            }
        }
    }

    // Get Product if its a update page
    const { id } = params;

    let productData = null;
    if (id !== "new" && id !== undefined && id !== null && id !== "" && typeof (Number(id)) === 'number') {
        const productResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory/products/${sellerData?.data?.Brands?.[0]?.id}/${sellerData.data.id}/${id}`)
        const data = await productResponse.json();
        if (!data.success) {
            return {
                redirect: {
                    destination: '/inventory/new',
                    permanent: false
                }
            }
        }

        if (data.success) {
            productData = data;
        }
    }

    let collecionData = null;
    if (id === "new") {
        const collectionResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/collections/get/forbrand/${sellerData?.data?.Brands?.[0]?.id}?page=1&limit=10000`)
        const collectionData = await collectionResponse.json();
        if (collectionData.success) {
            collecionData = collectionData;
        }
    }

    return {
        props: { session, sellerData, productData, collecionData },
    }
}