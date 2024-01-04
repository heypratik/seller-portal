import React, { useEffect, useState, useRef, useCallback } from 'react'
import Layout from '../layout'
import Breadcrums from '../../../components/Breadcrums'
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { getSession, useSession } from 'next-auth/react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import Link from 'next/link';
import { de, ro } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { AiOutlinePlusSquare, AiFillDelete, AiOutlineCloudUpload } from 'react-icons/ai'
import { v4 as uuidv4 } from 'uuid';
import { MdKeyboardArrowDown } from "react-icons/md";


interface VariantOption {
    id: number;
    values: { id: number; value: string }[];
}

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

const CustomImage = ({ objectKey, token, removeImage }: { objectKey: string, token: string, removeImage: any }) => {
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
        <div className="relative group w-[10%] mr-2 mt-4 ">
            <img
                src={imageData}
                alt={`custom-${imageData}`}
                className="w-full h-full border-2 border-gray-200 rounded-md prod-images"
            />

            <div className="absolute inset-0 bg-gray-500 opacity-0 rounded-md group-hover:opacity-50 flex justify-center items-center">
                <span onClick={() => removeImage(objectKey)} className="text-white text-3xl font-bold cursor-pointer">×</span>
            </div>
        </div>
    ) : (
        <div>Loading image...</div>
    );
};

export default function ProductList({ sellerData, brandData }: { sellerData: SellerData, brandData: any }) {

    const [loading, setLoading] = useState(false)
    const [productCategory, setProductCategory] = useState<string>();
    const [subCategory, setSubCategory] = useState<any>([]);
    const [subCategoryOpen, setSubCategoryOpen] = useState(false);
    const [prodMargin, setProdMargin] = useState<number>(0)

    const [productVariations, setProductVariations] = useState<any[]>([])


    const [variantOptions, setVariantOptions] = useState<any[]>([])
    const [variationValues, setVariationValues] = useState<any[]>([]);

    const [variationKeys, setVariationKeys] = useState<any[]>([])

    const [productTypeTableOpen, setProductTypeTableOpen] = useState("type")
    const [productType, setProductType] = useState("Single Product")

    const [objectKeys, setObjectKeys] = useState<any[]>([]);
    const fileInputRef = useRef<any>(null);


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

    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            productName: '',
            productCategory: '',
            productColor: '',
            productSize: '',
            productSizeValue: '',
            productQuantity: '',
            productDescription: '',
            productSku: '',
            productSubCategory: subCategory ? subCategory : [],
            productPrice: '',
            productCost: '',
            productMargin: "",
            productKeywords: '',
            productType: productType ? productType : '',
        },
        onSubmit
    })
    const { values, setFieldValue } = formik;

    function removeImage(key: string) {
        const newKeys = objectKeys.filter((k) => k !== key);
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
            const files: File[] = Array.from(e.target.files);  // Convert FileList to array
            if (files.length > 0) {
                const uploadedKeys: string[] = [];
                for (const file of files) {
                    try {
                        const response = await uploadFile(file, token);
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


    async function onSubmit(values: { productName: string, productCategory: string, productColor: string, productSize: string, productQuantity: string, productDescription: string, productSku: string, productSubCategory: any, productPrice: string, productCost: string, productMargin: string, productKeywords: string, productSizeValue: string, productType: string }) {
        setLoading(true)

        // Create a copy of values excluding the optional fields
        const requiredValues: { [key: string]: any } = { ...values };
        delete requiredValues.productColor;
        delete requiredValues.productQuantity;
        delete requiredValues.productMargin;
        delete requiredValues.productCost;
        delete requiredValues.productPrice;
        delete requiredValues.productSize;
        delete requiredValues.productSizeValue;

        // Check if all other fields have a value
        if (!Object.values(requiredValues).every(v => v)) {
            notification(false, "Please fill out all the required fields.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory/add/product`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sellerId: sellerData?.data?.id,
                    brandId: brandData?.data[0]?.id ? brandData?.data[0]?.id : 0,
                    productName: values.productName,
                    productCategory: values.productCategory,
                    productColor: values.productColor ? values.productColor : 'NULL',
                    productSize: values.productSize ? values.productSize : 'NULL',
                    productSizeValue: values.productSizeValue ? values.productSizeValue : 0,
                    productQuantity: values.productQuantity ? values.productQuantity : 0,
                    productDescription: values.productDescription ? values.productDescription : 'NULL',
                    productSku: values.productSku,
                    productSubCategory: values.productSubCategory,
                    productPrice: values.productPrice ? values.productPrice : 0,
                    productCost: values.productCost ? values.productCost : 0,
                    productMargin: Number(values.productMargin) ? Number(values.productMargin) : 0,
                    productKeywordArray: values.productKeywords.split(","),
                    productImagesArray: objectKeys,
                    productVariations: variationValues,
                    variantOptions: variantOptions,
                    productType: values.productType
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

    function generateVariants(options: VariantOption[]): string[][] {
        const result: string[][] = [];

        function generateCombinations(index: number, currentCombination: string[]): void {
            if (index === options.length) {
                result.push([...currentCombination]);
                return;
            }

            const currentOption = options[index];
            for (const value of currentOption.values) {
                generateCombinations(index + 1, [...currentCombination, value.value]);
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
                        sku: "",
                        mediaObjectKey: "",
                    };
                }
            });

            return newVariationValues;
        });
    }, [variationKeys]);

    function addOptions(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setVariantOptions([...variantOptions, { id: uuidv4(), name: "", values: [] }])
    }

    function addOptionsAttributes(id: number) {
        const newVariations = variantOptions.map((variation, index) => {
            if (variation.id === id) {
                return { ...variation, values: [...variation.values, { id: uuidv4(), value: "" }] }
            }
            return variation;
        })
        setVariantOptions(newVariations);
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
                        return { ...val, [valueType]: valueType === "value" ? value : parseFloat(value) };
                    })
                };
            })
        );
    }

    const inputClass = `mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none  w-[22.5rem] h-10 rounded-md mb-3`

    const labelClass = `mt-6 block text-base font-medium text-[#30323E] mb-2`

    console.log(subCategoryOpen)

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
                                        <label htmlFor="productImages" className={labelClass}>Product Images*</label>
                                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }} multiple />
                                        <div onClick={() => fileInputRef.current?.click()} className=' cursor-pointer border-dashed border-2 border-red-600 rounded-lg flex flex-col items-center justify-center py-4'>
                                            <p className='my-2 text-black text-lg'>Jpg, Png</p>
                                            <p className='my-2 text-gray-400 text-base'>File not Exceed 10mb</p>
                                            <button type='reset' className='flex items-center bg-red-600 text-white py-2 px-3 rounded-md my-2'> <AiOutlineCloudUpload fontSize="20" className='mr-2' /> Upload </button>
                                        </div>
                                        <div className='flex items-center justify-start flex-wrap'>
                                            {objectKeys.map((key, index) => (
                                                <CustomImage key={index} objectKey={key} token={token} removeImage={removeImage} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* NEW LINE */}

                                <div className="w-full flex items-center justify-center">
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
                                    {/* <div className="flex-1">
                                        <label htmlFor="productSubCategory" className={labelClass}>Product Sub-Category*</label>
                                        <select {...formik.getFieldProps('productSubCategory')} id="productSubCategory" name="productSubCategory" className={inputClass} value={subCategory} onChange={(e) => { setSubCategory(e.target.value); formik.setFieldValue('productSubCategory', e.target.value); }} disabled={!productCategory}>
                                            <option className="text-base text-[#30323E] " value="">Select Sub-Category</option>
                                            {productCategory && categories[productCategory]?.map((subCat) => (
                                                <option className="text-base text-[#30323E] " key={subCat} value={subCat}>
                                                    {subCat}
                                                </option>
                                            ))}
                                        </select>
                                    </div> */}

                                    <div className="flex-1">
                                        <label className={labelClass}>Product Sub-Category*</label>
                                        <div className={`${inputClass} !px-0`} id="productSubCategory" onClick={(e) => setSubCategoryOpen(true)}>
                                            {productCategory && subCategoryOpen && <div onClick={(e) => { e.stopPropagation(); setSubCategoryOpen(false); }} className='w-full min-h-[150vh] opacity-0 bg-black absolute top-0 right-0'></div>}
                                            <span className='flex items-center justify-between'><p className=' opacity-50 ml-3'>SELECT</p>
                                                <MdKeyboardArrowDown className='mr-2' fontSize="20px" /></span>
                                            {productCategory && subCategoryOpen && <div className="dropdown z-10 relative mt-2 shadow-[rgba(0,_0,_0,_0.2)_0px_20px_20px_-7px] px-3 py-2 bg-white border border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none w-[22.5rem] rounded-md">
                                                {productCategory && categories[productCategory]?.map((subCat) => (
                                                    <div key={subCat} className="checkbox-option flex items-center ">
                                                        <input
                                                            type="checkbox"
                                                            id={subCat}
                                                            name={subCat}
                                                            value={subCat}
                                                            checked={subCategory.includes(subCat)}
                                                            onChange={(e) => {
                                                                const isChecked = e.target.checked;
                                                                const updatedSubCategories = isChecked
                                                                    ? [...subCategory, subCat]
                                                                    : subCategory.filter((category: any) => category !== subCat);

                                                                setSubCategory(updatedSubCategories);
                                                                formik.setFieldValue('productSubCategory', updatedSubCategories);
                                                            }}
                                                        />
                                                        <label htmlFor={subCat} className=" w-full text-base text-[#30323E] ml-2 cursor-pointer">
                                                            {subCat}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full flex items-center justify-between">
                                    <div className="w-full">
                                        <label htmlFor="variations" className={labelClass}>Product Data</label>
                                        <div className='w-full bg-[#f7f9fa] flex border'>
                                            <div className='flex-[0.3] flex-col border-r'>
                                                <div onClick={() => setProductTypeTableOpen("type")} className={`w-full py-3 hover:bg-white cursor-pointer px-4 ${productTypeTableOpen == "type" && "bg-white border-gray-200 border"}`}>Product Type</div>
                                                <div onClick={() => setProductTypeTableOpen("inventory")} className={`${productType == "Variable Product" && " pointer-events-none cursor-not-allowed"} w-full py-3 hover:bg-white cursor-pointer px-4 ${productTypeTableOpen == "inventory" && "bg-white border-gray-200 border"}`}>Inventory <span className='text-xs italic'>{productType == "Variable Product" && "(Disabled)"}</span></div>
                                                <div onClick={() => setProductTypeTableOpen("variations")} className={`${productType == "Single Product" && " pointer-events-none cursor-not-allowed"} w-full py-3 hover:bg-white cursor-pointer px-4 ${productTypeTableOpen == "variations" && "bg-white border-gray-200 border"}`}>Variations <span className='text-xs italic'>{productType == "Single Product" && "(Disabled)"}</span></div>
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

                                                {productTypeTableOpen === "inventory" && (
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
                                                                        <input type='number' {...formik.getFieldProps('productSizeValue')} name='productSizeValue' placeholder='Size Value' id="productSizeValue" className="mr-3 outline-none focus:outline-none border-brand-border rounded bg-white text-brand-text px-5 py-4 w-[148px]" />
                                                                        <p className='text-center text-sm italic text-gray-600'>(Size Value)</p>

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
                                                                    <input type='number' {...formik.getFieldProps('productQuantity')} name='productQuantity' placeholder='Quantity' id="productQuantity" className="mr-3 outline-none focus:outline-none border-brand-border rounded bg-white text-brand-text px-5 py-4 w-[148px]" />
                                                                    <p className='text-center text-sm italic text-gray-600'>(Quantity)</p>

                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div className="flex-1">
                                                            <label htmlFor="business" className={labelClass}>Price*</label>
                                                            <div className='flex items-center justify-start mt-4'>
                                                                <div>
                                                                    <input type='number' {...formik.getFieldProps('productPrice')} name='productPrice' id="productPrice" className='mr-3 outline-none focus:outline-none border border-white rounded bg-white text-brand-text px-5 py-4 w-[148px]' placeholder='Price' />
                                                                    <p className='text-center text-sm italic text-gray-600'>(Price)</p>
                                                                </div>

                                                                <div>
                                                                    <input type='number' {...formik.getFieldProps('productCost')} name='productCost' id="productCost" className='mr-3 outline-none focus:outline-none border border-white rounded bg-white text-brand-text px-5 py-4 w-[148px]' placeholder='COGS' />
                                                                    <p className='text-center text-sm italic text-gray-600'>(COGS)</p>
                                                                </div>

                                                                <div>
                                                                    <input disabled type='number' {...formik.getFieldProps('productMargin')} name='productMargin' id="productMargin" className='mr-3 outline-none focus:outline-none border border-white rounded bg-white text-brand-text px-5 py-4 w-[148px]' placeholder={`Margin: $${prodMargin && prodMargin}`} />
                                                                    <p className='text-center text-sm italic text-gray-600'>(Margin)</p>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {productTypeTableOpen === "variations" && (
                                                    <div className='variations'>
                                                        {variantOptions.length < 3 && <button onClick={(e) => addOptions(e)} className='bg-white p-4'>+ Add Variations Options</button>}
                                                        {variantOptions.map((variation, index) => (
                                                            <div className='variationChild' key={variation.id}>
                                                                <div className='bg-gray-300 mt-4 p-4 flex justify-between'>
                                                                    <span className='w-full'>
                                                                        <p className='text-sm mb-2'>Option Name</p>
                                                                        <input
                                                                            type='text'
                                                                            className=' border px-2 py-2 bg-transparent w-full'
                                                                            value={variation.name}
                                                                            placeholder='Color / Size / Material'
                                                                            onChange={(e) => handleInputChange(e, variation.id, null, null)}

                                                                        />
                                                                    </span>
                                                                    <div className='p-2 flex'>
                                                                        <AiOutlinePlusSquare onClick={(e) => addOptionsAttributes(variation.id)} className='cursor-pointer' />
                                                                        <AiFillDelete onClick={(e) => deleteVariation(variation.id)} className='cursor-pointer ml-4' />
                                                                    </div>
                                                                </div>
                                                                {variation.values.map((value: any) => (
                                                                    <div className='flex bg-white p-4 justify-between' id={value.id} key={value.id}>
                                                                        <input
                                                                            type='text'
                                                                            className='flex-1 border p-2'
                                                                            value={value.value}
                                                                            placeholder='Option Value'
                                                                            onChange={(e) => handleInputChange(e, variation.id, "value", value.id)}
                                                                        />
                                                                        <p className='flex-1 text-sm er'><AiFillDelete onClick={(e) => deleteVariationAttribute(variation.id, value.id)} /></p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {variationValues.length > 0 && variationValues[0].options.length > 0 && <div className='bg-white p-2 mt-4'>
                                                    {variationValues.length > 0 && variationValues.map((variation, index) => {
                                                        if (variation.options && variation.options.length > 0) {
                                                            return (
                                                                <div key={index} className='variationKeys flex items-center justify-between p-2'>
                                                                    <p className='flex-[0.25] text-sm'>{variation?.options?.toString().split(",").join(" / ")}</p>
                                                                    <input className='border border-gray-300 rounded-md flex-[0.25] mx-1 px-1 py-1' type='text' placeholder='Price' name="price" value={variation.price} id={variation.id} onChange={(e) => handleVariationChange(e, variation.id)} />
                                                                    <input className='border border-gray-300 rounded-md flex-[0.25] mx-1 px-1 py-1' type='text' placeholder='SKU' name="sku" value={variation.sku} id={variation.id} onChange={(e) => handleVariationChange(e, variation.id)} />
                                                                    <input className='border border-gray-300 rounded-md flex-[0.25] mx-1 px-1 py-1' type='text' placeholder='Stock' name="stock" value={variation.stock} id={variation.id} onChange={(e) => handleVariationChange(e, variation.id)} />
                                                                </div>
                                                            );
                                                        } else {
                                                            // Render nothing if variation.options is empty
                                                            return null;
                                                        }
                                                    })}
                                                </div>}

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* NEW LINE */}

                                <div className="">
                                    <div className="flex-1">
                                        <label htmlFor="business" className={labelClass}>Product Description*</label>
                                        <textarea {...formik.getFieldProps('productDescription')} rows={3} id="productDescription" name="productDescription" className="bg-[#f7f9fa] outline-none focus:outline-none mt-4 rounded-md px-5 py-4 w-full" placeholder='Enter Product Description' />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="business" className={labelClass}>Product Keywords*</label>

                                        <textarea {...formik.getFieldProps('productKeywords')} rows={3} id="productKeywords" name="productKeywords" className="bg-[#f7f9fa] outline-none focus:outline-none mt-4 rounded-md px-5 py-4 w-full" placeholder='Enter Product Description' />
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