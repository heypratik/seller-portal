import { useState, useEffect } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const ProductPage = () => {
    // Dummy data
    const dummyData = {
        sellerId: 11,
        brandId: 7,
        productName: "TEST PRODUCT",
        productCategory: "Health & Beauty",
        productColor: "NULL",
        productSize: "NULL",
        productSizeValue: 0,
        productQuantity: 0,
        productDescription: "TESST ",
        productSku: "SKU1234564",
        productSubCategory: [
            "Tools & Accessories"
        ],
        productPrice: 0,
        productCost: 0,
        productMargin: 0,
        productKeywordArray: [
            "TEST KEYWORDS"
        ],
        productImagesArray: [
            "f834d41a-fecd-473d-9718-7d2177cf09bd",
            "9e91887f-ca24-4b59-b6b6-b79b51b106ac"
        ],
        productVariations: [
            {
                id: "0b37bc36-1260-4559-895c-ec14c69696c1",
                options: [
                    "Gray",
                    "Mercedes"
                ],
                price: "50",
                stock: "10",
                sku: "",
                mediaObjectKey: "f834d41a-fecd-473d-9718-7d2177cf09bd"
            },
            {
                id: "1e3521e8-50cc-40a8-870a-0c5238fac369",
                options: [
                    "Gray",
                    "BMW"
                ],
                price: "60",
                stock: 0,
                sku: "",
                mediaObjectKey: "f834d41a-fecd-473d-9718-7d2177cf09bd"
            },
            {
                id: "9e702f8d-32c9-4724-af39-c21ce3637799",
                options: [
                    "Blue",
                    "Mercedes"
                ],
                price: "50",
                stock: "10",
                sku: "",
                mediaObjectKey: "9e91887f-ca24-4b59-b6b6-b79b51b106ac"
            },
            {
                id: "ede3d970-7a22-429c-b366-c3b76229738d",
                options: [
                    "Blue",
                    "BMW"
                ],
                price: "60",
                stock: "10",
                sku: "",
                mediaObjectKey: "9e91887f-ca24-4b59-b6b6-b79b51b106ac"
            }
        ],
        variantOptions: [
            {
                id: "d3d35d86-d38c-4ce4-a7ad-b34fe73dbf36",
                name: "Color",
                values: [
                    {
                        id: "cc02f5c0-b5b0-481c-98e9-ed705ed4fa93",
                        value: "Gray",
                        hex: "#ababab"
                    },
                    {
                        id: "cde32a40-6a94-473a-8cde-2111e6bc63fe",
                        value: "Blue",
                        hex: "#001eff"
                    }
                ]
            },
            {
                id: "bdcf4bb0-0085-43a6-9880-30fbff17d712",
                name: "Brand",
                values: [
                    {
                        id: "ab9701b6-1699-4d3d-afc1-edef09b114ca",
                        value: "Mercedes",
                        hex: ""
                    },
                    {
                        id: "57477134-1a05-406f-8f24-f296ae40dbc9",
                        value: "BMW",
                        hex: ""
                    }
                ]
            }
        ],
        productType: "Variable Product",
        productCollections: [
            13
        ]
    }

    // Product state
    const [selectedVariation, setSelectedVariation] = useState([]);
    const [activeVariation, setActiveVariation] = useState({});
    const [productImages, setProductImages] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [tempmemory, setTempMemory] = useState([]);

    // Image fetching logic
    // API Configurations
    const baseURL = "https://dev.mybranzapi.link";
    const postMediaEndpoint = "media/single";
    const mediaEndpoint = "media/%s";
    const token = "fb507a0b75e0f62f65b798424555733f";

    useEffect(() => {
        const fetchImage = async (objectKey) => {
            try {
                const response = await fetch(`${baseURL}/${mediaEndpoint.replace(/%s/, objectKey)}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const blob = await response.blob();
                    setProductImages((prevImages) => [...prevImages, URL.createObjectURL(blob)]);
                }
            } catch (error) {
                console.log("Error fetching image:", error);
            }


        };

        dummyData.productImagesArray.forEach((image) => {
            fetchImage(image);
        });
    }, [selectedVariation]);

    const CustomImage = ({ objectKey, token }) => {
        const [imageData, setImageData] = useState(null);
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
                        const imageUrl = URL.createObjectURL(blob);
                        setImageData(imageUrl);
                    }
                } catch (error) {
                    updateCache(objectKey, null);
                }
            }

            fetchImage();
        }, [objectKey]);

        return imageData ? (
            <img
                src={imageData}
                alt={`custom-${imageData}`}
                className="w-full h-full border-2 border-gray-200 rounded-md prod-images"
            />
        ) : (
            <div className='text-xs'>Loading image...</div>
        );
    };


    function handleVariationSelection(name, value) {
        setSelectedVariation((prev) => {
            const newVariation = { ...prev };
            newVariation[name] = value;
            return newVariation;
        });
    }

    function matchVariation() {
        const matchedVariation = dummyData.productVariations.find((variation) => {
            return Object.keys(selectedVariation).every((key) => {
                return variation.options.includes(selectedVariation[key]);
            });
        });

        if (matchedVariation) {
            return matchedVariation;
        }
    }

    useEffect(() => {
        const matchedVariation = matchVariation();
        if (matchedVariation) {
            setActiveVariation(matchedVariation);
        }
    }, [selectedVariation]);

    console.log(activeVariation.mediaObjectKey);

    return (
        <div className='flex mt-10'>
            <div className='flex-1 px-10 flex flex-col items-center justify-center'>
                <div>
                    <main>
                        {activeVariation && (
                            <CustomImage objectKey={activeVariation.mediaObjectKey} token={token} />
                        )}
                    </main>
                </div>
                <div className='flex items-center justify-center'>
                    {productImages.map((image, index) => (
                        <div key={index}>
                            <img src={image} alt="product" />
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex-1 px-10'>
                <h1 className='text-2xl font-bold'>{dummyData.productName}</h1>
                <p className='mt-2 text-base '>{dummyData.productSku}</p>
                {dummyData.variantOptions.map((option) => (
                    <div className='mt-6' key={option.id}>
                        <p className='font-semibold' >{option.name}</p>
                        <div className='flex'>
                            {option.values.map((value) => (
                                <div key={value.id}>
                                    {value.hex.includes("#") ? (
                                        <div
                                            onClick={() => {
                                                handleVariationSelection(option.name, value.value);
                                            }}
                                            className={`bg-[#000] mt-2 mr-4 rounded-full cursor-pointer ${Object.keys(selectedVariation).includes(option.name) && selectedVariation[option.name] === value.value && "border border-black"}`}
                                        >
                                            <div
                                                className='w-4 h-4 rounded-full'
                                                style={{ backgroundColor: value.hex }}
                                            ></div>
                                        </div>
                                    ) : (
                                        <p className={`${Object.keys(selectedVariation).includes(option.name) && selectedVariation[option.name] === value.value && "bg-gray-100 border border-black"} border border-gray-100 py-2 px-4 mr-4 rounded-md cursor-pointer`} onClick={(e) => handleVariationSelection(option.name, value.value)}>{value.value}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {setActiveVariation && (
                    <div className='mt-6'>
                        <p className='text-base font-semibold'>Price</p>
                        <p>${activeVariation.price}</p>
                    </div>
                )}

                <div className='mt-6 flex'>
                    <button className='bg-black text-white py-2 px-4 rounded-md'>Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
