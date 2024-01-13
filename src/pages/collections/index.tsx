import React, { useState, useRef, useCallback, useEffect } from 'react'
import Layout from '../layout'
import { useFormik } from 'formik';
import { getSession, useSession } from 'next-auth/react'
import toast, { Toaster } from 'react-hot-toast';
import Breadcrums from '../../../components/Breadcrums';
import { AiOutlineLoading3Quarters, AiOutlineCloudUpload } from 'react-icons/ai'
import { useInView } from "react-intersection-observer";
import { CiImageOn } from "react-icons/ci";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
    SheetFooter,
} from "../../../shadcn/components/ui/sheet"

interface Data {
    categories: string[]; // Array of categories
    products: Product[]; // Array of products
    currentPage: number; // Current page number
    totalPages: number; // Total number of pages
}

interface Product {
    id: number;
    productName: string;
    productQuantity: number;
    productPrice: number;
    productCost: number;
    productCategory: string;
    productImage: string;
    productImagesArray: string[];
}


// API Configurations
const baseURL = "https://dev.mybranzapi.link";
const postMediaEndpoint = "media/single";
const mediaEndpoint = "media/%s";
const token = "fb507a0b75e0f62f65b798424555733f";

const CustomImage = ({ objectKey, token, removeImage }: { objectKey: string, token: string, removeImage: any }) => {

    if (objectKey?.includes('http')) {
        return (
            <img
                src={objectKey}
                alt={`custom-${objectKey}`}
                className="w-[35px] h-[35px] rounded-md border shadow-sm border-[#DDDDDD] object-cover"
            />
        )
    }
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
            className="w-[35px] h-[35px] rounded-md border shadow-sm border-[#DDDDDD] object-cover"
        />
    ) : (
        <div className=' bg-gray-50 rounded-md h-[35px] w-[35px] border shadow-sm border-[#DDDDDD] flex items-center justify-center'><CiImageOn color='#818181' /></div>
    );
};

export default function index({ sellerData }: { sellerData: any }) {
    const { ref, inView } = useInView();

    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<any>(null);
    const [activePageNumber, setActivePageNumber] = useState(0)
    const [resultNumber, setResultNumber] = useState(20)
    const [search, setSearch] = useState('')
    const [objectKeys, setObjectKeys] = useState<any[]>([]);

    const [productApiData, setProductApiData] = useState<Data>({
        categories: [], // Initialize with an empty array for categories
        products: [],
        currentPage: 0,
        totalPages: 0,
    });

    const formik = useFormik({
        initialValues: {
            collectionName: '',
            collectionDescription: '',
            bDisplayName: '',
            sellerEmail: '',
            companyName: '',
            mobileNumber: '',
        },
        onSubmit
    })

    async function onSubmit(values: any) { }

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
        if (inView) {
            setActivePageNumber((prev) => prev + 1);
        }
    }, [inView]);

    useEffect(() => {
        if (activePageNumber !== 0) {
            async function fetchData() {
                const result = await getData()
                setProductApiData((prev) => ({
                    ...prev,
                    products: [...prev.products, ...result.products],
                    currentPage: result.currentPage,
                    totalPages: result.totalPages,
                }))
            }
            fetchData()
        }
    }, [resultNumber, activePageNumber, search])

    async function getData() {
        if (search) {
            try {
                const searchPage = search.length == 1 ? 1 : activePageNumber
                if (search.length == 1) {
                    setActivePageNumber(1)
                }
                const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory/products/search/${sellerData.data.id}?searchTerm=${search}&page=${searchPage}&limit=${resultNumber}`)
                const productsData = await productsResponse.json()
                const products = productsData.data
                return products
            } catch (error) {
                return { currentPage: 1, totalPages: 1, products: [] }
            }

        } else {
            try {
                const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory/products/${sellerData.data.id}?page=${activePageNumber}&limit=${resultNumber}`)
                const productsData = await productsResponse.json()
                const products = productsData.data
                return products
            } catch (error) {
                return { currentPage: 1, totalPages: 1, products: [] }
            }
        }
    }

    const labelClass = `mt-6 block text-base font-medium text-[#30323E] mb-2`

    const inputClass = `mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none  w-full h-10 rounded-md mb-3`

    function notification(success: boolean, message: string | undefined) {
        if (success) {
            toast.success(message!)
        } else {
            toast.error(message || 'An error occurred')
        }

    }

    console.log(productApiData)

    return (
        <Layout>
            <Toaster position="top-center" reverseOrder={true} />
            <form onSubmit={formik.handleSubmit} className='py-6 h-screen'>
                <div className="py-6 h-screen">
                    <div className="mx-auto px-4 sm:px-6 md:px-8">
                        <Breadcrums parent={"Collections"} childarr={[]} />
                    </div>
                    <div className="mx-auto px-4 sm:px-6 md:px-8">
                        {/* Replace with your content */}
                        <div className="py-4 flex justify-center gap-4">
                            <div className="bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] p-7 rounded-lg flex-1">
                                <div className='flex justify-center w-full flex-col'>
                                    <div className='flex-1'>
                                        <label htmlFor="business" className={labelClass}>Collection Name*</label>

                                        <input {...formik.getFieldProps('collectionName')} type="text" id="collectionName" name="collectionName" className={inputClass} placeholder='Collection Name' />

                                    </div>

                                    <div className="flex-1">
                                        <label htmlFor="business" className={labelClass}>Collection Description*</label>
                                        <textarea {...formik.getFieldProps('collectionDescription')} rows={3} id="collectionDescription" name="collectionDescription" className="bg-[#f7f9fa] border shadow-sm border-[#DDDDDD] outline-none focus:outline-none mt-4 rounded-md px-5 py-4 w-full" placeholder='Collection Description' />
                                    </div>

                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <button onClick={(e) => setActivePageNumber(1)}>Open</button>
                                        </SheetTrigger>
                                        <SheetContent className="mr-0">
                                            <SheetHeader>
                                                <SheetTitle>Select Products</SheetTitle>
                                                <SheetDescription>
                                                    Select the products you want to add to this collection.
                                                </SheetDescription>
                                            </SheetHeader>
                                            {productApiData?.products?.length > 0 && productApiData?.products?.map((product: any, index: number) => (
                                                <div key={index} className="checkbox-option flex items-center py-4 border-b border-[#DDDDDD]">
                                                    <input type="checkbox" name={product.id} id={product.id} className='mr-2' />
                                                    <CustomImage objectKey={product?.productImagesArray?.[0]} token={token} removeImage={removeImage} />
                                                    <label htmlFor={product.id} className=" text-sm font-semibold text-black ml-2 cursor-pointer">
                                                        {product.productName}<p className='text-sm text-[#b9b9b9]'>{product.productCategory}</p>
                                                    </label>
                                                </div>
                                            ))}
                                            <SheetFooter>
                                                <SheetClose asChild>
                                                    <span className='text-center text-black font-bold text-base' ref={ref}>-- No More Products Available --</span>
                                                    {/* <span ref={ref}><AiOutlineLoading3Quarters className='spinner' /></span> */}
                                                </SheetClose>
                                            </SheetFooter>
                                        </SheetContent>
                                    </Sheet>
                                </div>

                                <button type="submit" className="w-32 h-11 mt-16 bg-[#F12D4D] flex items-center justify-center rounded-md text-white text-base font-semibold mr-10 cursor-pointer" value="Next">{loading ? <AiOutlineLoading3Quarters className='spinner' /> : `Save`}</button>
                            </div>

                            <div className="sidebar bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] p-7 rounded-lg flex-[0.3]">
                                <div className='flex items-center w-full'>
                                    <div className='flex-1'>
                                        <label htmlFor="productImages" className={labelClass}>Collection Image*</label>
                                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }} multiple />
                                        <div onClick={() => fileInputRef.current?.click()} className=' cursor-pointer border-dashed border-2 border-red-600 rounded-lg flex flex-col items-center justify-center py-4'>
                                            <p className='my-1 text-black text-sm'>Jpg, Png</p>
                                            <p className='my-2 text-gray-400 text-sm'>File not Exceed 10mb</p>
                                            <button type='reset' className='flex text-base items-center bg-red-600 text-white py-1 px-3 rounded-md my-2'> <AiOutlineCloudUpload fontSize="18" className='mr-2' /> Upload </button>
                                        </div>
                                        <div className='flex items-center justify-start flex-wrap'>
                                            {/* {objectKeys.map((key, index) => (
                                                <CustomImage key={index} objectKey={key} token={token} removeImage={removeImage} />
                                            ))} */}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* /End replace */}
                    </div>
                </div>
            </form>
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


    return {
        props: { session, sellerData },
    }
}