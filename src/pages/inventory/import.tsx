import React, { useEffect, useState, useRef } from "react";
import Layout from "../layout"
import Papa from "papaparse";
import { v4 as uuidv4 } from 'uuid';
import { parse } from "path";
import { it } from "node:test";
import { FaShopify } from "react-icons/fa";
import { AiOutlinePlusSquare, AiFillDelete, AiOutlineCloudUpload, AiOutlineLoading3Quarters } from 'react-icons/ai'
import toast, { Toaster } from 'react-hot-toast';
import { set } from "date-fns";


const productFields = [
    "Product Name",
    "Product Description",
    "Product SKU",
    "Product Category",
    "Product SubCategory",
    "Product Color",
    "Product Size",
    "Product Size Value",
    "Product Quantity",
    "Product Price",
    "Product Cost",
    "Product Margin",
    "Product Keywords / Tags",
    "Product Images",
];


export default function Import() {
    const [file, setFile] = useState();
    const [array, setArray] = useState<any>([]);
    const fileInputRef = useRef<any>(null);
    const [mappedFields, setMappedFields] = useState<any>([]);
    const [loading, setLoading] = useState(false)

    const handleOnChange = (e: any) => {
        setFile(e.target.files[0]);
    };


    async function csvFileToArray(string: any) {
        await Papa.parse(string, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (result: any) => {
                setArray(result.data);
            },
            error: (error: any) => {
                console.error("CSV parsing error:", error);
            },
        });
    };

    async function handleOnSubmit(e: any) {
        e.preventDefault();

        if (file && typeof window !== "undefined") {
            const fileReader = new FileReader();
            fileReader.onload = async function (event) {
                const text = event?.target?.result;
                await csvFileToArray(text);
            };

            fileReader.readAsText(file);
        }
    };

    function handleChange(e: any) {
        setMappedFields({ ...mappedFields, [e.target.name]: e.target.value });
    }

    const headerKeys = Object.keys(Object.assign({}, ...array));


    function transformToProductObject(parsedArray: any[]) {
        const productObject: { [key: string]: any } = {};
        let resultArray = [];

        parsedArray.forEach((item) => {
            const handle = item.Handle;

            let prodCategory = item['Product Category'] && item['Product Category'].split(' > ')[0]
            let prodSubCategory = item['Product Category'] && item['Product Category'].split(' > ')[1]

            let prodKeywords = item['Tags'] && item['Tags'].split(',').map((item: any) => item.trim())

            if (!productObject[handle]) {
                productObject[handle] = {
                    sellerId: 3,
                    brandId: 3,
                    productName: item.Title || '',
                    productCategory: prodCategory || 'Not Defined',
                    productColor: 'NULL',
                    productSize: 'NULL',
                    productSizeValue: 0,
                    productQuantity: 0,
                    productDescription: item['SEO Description'] || 'TEST', // TODO : Use the SEO description if available, or leave an empty string
                    productSku: item['Variant SKU'] || '',
                    productSubCategory: prodSubCategory ? [prodSubCategory] : [],
                    productPrice: 0,
                    productCost: 0,
                    productMargin: 0,
                    productKeywordArray: prodKeywords || [],
                    productImagesArray: [],
                    productVariations: [],
                    variantOptions: [],
                    productType: 'Variable Product',
                };


            }
            item['Image Src'] && productObject[handle].productImagesArray.push(item['Image Src'])

        });

        //Variation Building
        for (const [key, value] of Object.entries(productObject)) {
            parsedArray.forEach((item) => {
                if (item.Handle == key) {
                    let variationKeys = []
                    item['Option1 Value'] && variationKeys.push(item['Option1 Value'])
                    item['Option2 Value'] && variationKeys.push(item['Option2 Value'])
                    item['Option3 Value'] && variationKeys.push(item['Option3 Value'])

                    const varObj = {
                        id: uuidv4(),
                        options: variationKeys,
                        sku: item['Variant SKU'] || '',
                        price: item['Variant Price'] || 0,
                        stock: item['Variant Inventory Qty'] || 0,
                        compareAtPrice: item['Variant Compare At Price'] || 0,
                        mediaObjectKeys: item["Variant Image"],
                        variantWeightUnit: item['Variant Weight Unit'] || '',
                        variantStatus: item['Status'] || '',
                    }

                    productObject[key].productVariations.push(varObj)
                }
            })
        }


        // Variations Option Building
        for (const [key, value] of Object.entries(productObject)) {
            let optionsArr: any[] = []
            let optionOneValues: any[] = []
            let optionTwoValues: any[] = []
            let optionThreeValues: any[] = []
            parsedArray.forEach((item) => {
                if (item.Handle === key) {

                    if (item['Option1 Value'] !== null) {
                        optionOneValues.push(item['Option1 Value'])
                    }

                    if (item['Option2 Value'] !== null) {
                        optionTwoValues.push(item['Option2 Value'])
                    }

                    if (item['Option3 Value'] !== null) {
                        optionThreeValues.push(item['Option3 Value'])
                    }


                    if (item['Option1 Name'] !== null) {
                        let obj = {
                            id: uuidv4(),
                            name: item['Option1 Name'],
                            values: []
                        }
                        optionsArr.push(obj)
                    }
                    if (item['Option2 Name']) {
                        let obj = {
                            id: uuidv4(),
                            name: item['Option2 Name'],
                            values: []
                        }
                        optionsArr.push(obj)
                    }
                    if (item['Option3 Name']) {
                        let obj = {
                            id: uuidv4(),
                            name: item['Option3 Name'],
                            values: []
                        }
                        optionsArr.push(obj)
                    }
                }
            })
            optionsArr.forEach((item, index) => {
                optionOneValues = [...new Set(optionOneValues)];
                optionTwoValues = [...new Set(optionTwoValues)]
                optionThreeValues = [...new Set(optionThreeValues)]
                if (index === 0) {
                    item.values.push(optionOneValues.map((item) => {
                        return {
                            id: uuidv4(),
                            value: item,
                        }
                    }))
                } else if (index === 1) {
                    item.values.push(optionTwoValues.map((item) => {
                        return {
                            id: uuidv4(),
                            value: item,
                        }
                    }))
                } else if (index === 2) {
                    item.values.push(optionThreeValues.map((item) => {
                        return {
                            id: uuidv4(),
                            value: item,
                        }
                    }))
                }

            })

            productObject[key].variantOptions = [...optionsArr]
        }


        for (const [key, value] of Object.entries(productObject)) {
            resultArray.push(value)
        }
        return resultArray;
    }

    async function uploadProductsToDatabase() {
        const parsedArray = array;
        const productObjects = await transformToProductObject(parsedArray);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory/add/import/product`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productObjects),
        });

        const data = await response.json();
        if (data.success) {
            setLoading(false)
            fileInputRef.current.value = '';
            setArray([]);

            notification(true, "Products Added successfully.");
        } else {
            setLoading(false)
            notification(false, "Error adding products.");
        }
    }

    useEffect(() => {
        if (array.length > 0) {
            setLoading(true)
            uploadProductsToDatabase();
        }
    }, [array])

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
            <div className="rounded-md border">
                <div className="py-6 h-screen">
                    <div className="mx-auto px-4 sm:px-6 md:px-8 pb-24 bg-[#f9f9f9]">
                        <div className="py-0">
                            <div className="bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] rounded-lg p-7 ">
                                <div>
                                    <div className="flex items-center justify-between py-4">
                                        <h1 className=' text-[#F12D4D] text-2xl mr-8 font-semibold'>Import Products</h1>
                                        <select className="mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none  w-[22.5rem] h-10 rounded-md mb-3" name="importer" id="importer">
                                            <option key="shopify" value="shopify">Shopify</option>
                                            <option disabled key="woocommerce" value="woocommerce">WooCommerce (Coming soon)</option>
                                            <option disabled key="custom" value="custom">Custom (Coming soon)</option>
                                        </select>
                                    </div>
                                    <form className="flex items-center">
                                        <input type={"file"} id={"csvFileInput"} ref={fileInputRef} accept={".csv"} onChange={handleOnChange} className=" w-[22.5rem] h-11 mr-5 text-base text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none   file:bg-[#F12D4D] file:text-sm file:font-semibold file:text-gray-200 file:px-4  file:h-full file:mr-5 file:cursor-pointer file:border-0 file:border-gray-300" />

                                        <button disabled={loading} className="flex gap-2 items-center justify-center mr-4 px-5 py-2 bg-[#95bf47]  border border-[#95bf47] rounded-md text-white font-semibold" onClick={(e) => { handleOnSubmit(e); }} >{loading && <div><AiOutlineLoading3Quarters className='spinner' /></div>} <FaShopify /> IMPORT FROM SHOPIFY </button>

                                    </form>

                                    <br />

                                    {/* <table>
                                        <thead>
                                            <tr key={"header"}>
                                                {headerKeys.map((key) => (
                                                    <th key={key}>{key}</th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {array.map((item: any, index: number) => (
                                                <tr key={index}>
                                                    {Object.values(item).map((val: any, index: number) => (
                                                        <td key={index}>{val}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table> */}
                                    <div>

                                        {/* <div >

                                            {productFields.map((key) => (
                                                <div className="flex justify-between mt-2">
                                                    <p>{key}</p>
                                                    <select onChange={(e) => handleChange(e)} className="border border-black" name={key} id={key}>
                                                        <option key="" value=""></option>
                                                        {headerKeys.map((importerFields) => (
                                                            <option key={importerFields} value={importerFields}>{importerFields}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ))}


                                        </div> */}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

