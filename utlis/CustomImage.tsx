import { useState, useEffect } from "react";
import { CiImageOn } from 'react-icons/ci'

const baseURL = "https://dev.mybranzapi.link";
const postMediaEndpoint = "media/single";
const mediaEndpoint = "media/%s";
const token = "fb507a0b75e0f62f65b798424555733f";

const CustomImage = ({ objectKey, removeImage, cache, updateCache, width, height }: { objectKey: string, removeImage: any, cache: any, updateCache: any, width: string, height: string }) => {
    const [imageData, setImageData] = useState<string | null>(null);
    useEffect(() => {
        const fetchImage = async () => {
            if (cache[objectKey]) {
                setImageData(cache[objectKey])
            } else {
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
                        updateCache(objectKey, imageUrl);
                    }
                } catch (error) {
                    updateCache(objectKey, null);
                    console.log("Error fetching image:", error);
                }
            }
        };

        fetchImage();
    }, [objectKey]);

    return imageData ? (
        <img
            src={imageData}
            alt={`custom-${imageData}`}
            className={`w-[${width}] h-[${height}] border-2 object-cover border-gray-200 rounded-md prod-images`}
        />
    ) : (
        <div className={`bg-gray-50 rounded-md w-[${width}] h-[${height}] border shadow-sm border-[#DDDDDD] flex items-center justify-center`}>
            <CiImageOn color='#818181' fontSize="20px" />
        </div>
    );
};

export default CustomImage;
