import React, { useState, useRef, useCallback, useEffect } from 'react'
import Layout from './layout'
import Breadcrums from '../../components/Breadcrums'
import { GoPencil } from 'react-icons/go'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useFormik } from 'formik';
import { getSession, useSession } from 'next-auth/react'
import toast, { Toaster } from 'react-hot-toast';

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

// API Configurations
const baseURL = "https://dev.mybranzapi.link";
const postMediaEndpoint = "media/single";
const mediaEndpoint = "media/%s";
const token = "fb507a0b75e0f62f65b798424555733f";

function Account({ sellerData, accountData }: { sellerData: SellerData, accountData: any }) {

    const sellerAccountData = accountData?.data?.seller
    const brandAccountData = accountData?.data?.brand

    const [loading, setLoading] = useState(false)
    const [editingInput, setEditingInput] = useState<string>("")

    const [objectKeys, setObjectKeys] = useState<any[]>([sellerAccountData.profilePicture]);
    const fileInputRef = useRef<any>(null);

    const formik = useFormik({
        initialValues: {
            sellerName: sellerAccountData ? sellerAccountData?.name : '',
            password: sellerAccountData ? sellerAccountData?.password : '',
            bDisplayName: brandAccountData ? brandAccountData?.brandDisplayName : '',
            sellerEmail: sellerAccountData ? sellerAccountData?.email : '',
            companyName: brandAccountData ? brandAccountData?.legalBusinessName : '',
            mobileNumber: '',
        },
        onSubmit
    })

    async function onSubmit(values: { sellerName: string, password: string, bDisplayName: string, sellerEmail: string, companyName: string, mobileNumber: string }) {
        setLoading(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sellers/account/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sellerId: sellerData?.data?.id,
                    sellerName: values.sellerName,
                    password: values.password,
                    bDisplayName: values.bDisplayName,
                    sellerEmail: values.sellerEmail,
                    companyName: values.companyName,
                    mobileNumber: values.mobileNumber,
                    profilePicture: objectKeys[0]
                })
            })
            const data = await response.json();
            if (data.success) {
                notification(true, "Updated successfully.");
                setLoading(false);
                setEditingInput("");
            } else {
                notification(false, "Something went wrong");
                setLoading(false);
                setEditingInput("");
            }
        } catch (error) {
            setEditingInput("");
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
                setObjectKeys([...uploadedKeys]);  // Merge old and new objectKeys
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
                className="w-[100px] h-[100px] border-2 border-gray-200 prod-images cursor-pointer rounded-full object-cover"
            />

        ) : (
            <div><img src="https://itcs.nu.edu.eg/themes/custom/it/assets/images/dummy-avatar.jpeg" className="w-[100px] h-[100px] border-2 border-gray-200 prod-images cursor-pointer rounded-full object-cover" /></div>
        );
    };

    return (
        <Layout>
            <Toaster position="top-center" reverseOrder={true} />
            <form onSubmit={formik.handleSubmit} className='py-6 h-screen'>
                <div className="py-6 h-screen">
                    <div className="mx-auto px-4 sm:px-6 md:px-8">
                        <Breadcrums parent={"Edit Profile"} childarr={[]} />
                    </div>
                    <div className="mx-auto px-4 sm:px-6 md:px-8">
                        {/* Replace with your content */}
                        <div className="py-4">
                            <div className="bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] p-7 rounded-lg">
                                <div className='flex items-center mb-10'>
                                    <div className='flex items-center justify-center flex-col'>
                                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }} />
                                        {objectKeys.map((key, index) => (
                                            <CustomImage key={index} objectKey={key} onClick={() => fileInputRef.current?.click()} token={token} />
                                        ))}
                                        {objectKeys.length == 0 && <img onClick={() => fileInputRef.current?.click()} width="100px" height="100px" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOSIZ6hZseAPKb42yOVWSqt00bWSi8yusbMQ&usqp=CAU' className=' cursor-pointer rounded-full' />}
                                        <p className=' text-xs mt-4 italic'>Click on Image to add/update</p>
                                    </div>
                                    <h3 className=' text-xl font-medium ml-0'>{sellerAccountData ? sellerAccountData?.name : "Lorem Ipsum"}</h3>

                                </div>
                                <div className='flex items-center w-full'>
                                    <div className='flex-1'>
                                        <h3 className=' text-xl font-medium mt-6'>Seller Name*</h3>
                                        <div className={`${editingInput == "sellerName" && "bg-white"} flex items-center justify-between bg-[#f7f9fa] outline-none focus:outline-none mt-4 border border-[#DDDDDD] rounded-md px-5 py-4 w-[470px]`}><input {...formik.getFieldProps('sellerName')} disabled={editingInput !== "sellerName"} type="text" id="sellerName" name="sellerName" className={`${editingInput == "sellerName" && "bg-white"} bg-[#f7f9fa] outline-none focus:outline-none w-full`} placeholder='Lorem Ipsum' />
                                            <GoPencil fontSize={20} onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setEditingInput("sellerName")
                                            }} className=' cursor-pointer' />
                                        </div>

                                        <h3 className=' text-xl font-medium mt-6'>Password*</h3>
                                        <div className={`${editingInput == "password" && "bg-white"} flex items-center justify-between bg-[#f7f9fa] outline-none focus:outline-none mt-4 border border-[#DDDDDD] rounded-md px-5 py-4 w-[470px]`}><input {...formik.getFieldProps('password')} disabled={editingInput !== "password"} type="password" id="password" name="password" className={`${editingInput == "password" && "bg-white"} bg-[#f7f9fa] outline-none focus:outline-none w-full`} placeholder='******' />
                                            <GoPencil fontSize={20} onClick={() => setEditingInput("password")} className=' cursor-pointer' />
                                        </div>

                                        <h3 className=' text-xl font-medium mt-6'>Brand Display Name*</h3>
                                        <div className={`${editingInput == "bDisplayName" && "bg-white"} flex items-center justify-between bg-[#f7f9fa] outline-none focus:outline-none mt-4 border border-[#DDDDDD] rounded-md px-5 py-4 w-[470px]`}><input {...formik.getFieldProps('bDisplayName')} disabled={editingInput !== "bDisplayName"} type="text" id="bDisplayName" name="bDisplayName" className={`${editingInput == "bDisplayName" && "bg-white"} bg-[#f7f9fa] outline-none focus:outline-none w-full`} placeholder='Lorem Ipsum' />
                                            <GoPencil fontSize={20} onClick={() => setEditingInput("bDisplayName")} className=' cursor-pointer' />
                                        </div>

                                    </div>
                                    <div className='flex-1'>
                                        <h3 className=' text-xl font-medium mt-6'>Email Address*</h3>
                                        <div className={`${editingInput == "sellerEmail" && "bg-white"} flex items-center justify-between bg-[#f7f9fa] outline-none focus:outline-none mt-4 border border-[#DDDDDD] rounded-md px-5 py-4 w-[470px]`}><input {...formik.getFieldProps('sellerEmail')} disabled={editingInput !== "sellerEmail"} type="text" id="sellerEmail" name="sellerEmail" className={`${editingInput == "sellerEmail" && "bg-white"} bg-[#f7f9fa] outline-none focus:outline-none w-full`} placeholder='abc@xyz.com' />
                                            <GoPencil fontSize={20} onClick={() => setEditingInput("sellerEmail")} className=' cursor-pointer' />
                                        </div>

                                        <h3 className=' text-xl font-medium mt-6'>Legal Company Name*</h3>
                                        <div className={`${editingInput == "companyName" && "bg-white"} flex items-center justify-between bg-[#f7f9fa] outline-none focus:outline-none mt-4 border border-[#DDDDDD] rounded-md px-5 py-4 w-[470px]`}><input {...formik.getFieldProps('companyName')} disabled={editingInput !== "companyName"} type="email" id="companyName" name="companyName" className={`${editingInput == "companyName" && "bg-white"} bg-[#f7f9fa] outline-none focus:outline-none w-full`} placeholder='Lorem Ipsum Inc' />
                                            <GoPencil fontSize={20} onClick={() => setEditingInput("companyName")} className=' cursor-pointer' />
                                        </div>

                                        <h3 className=' text-xl font-medium mt-6'>Mobile No*</h3>
                                        <div className={`${editingInput == "mobileNumber" && "bg-white"} flex items-center justify-between bg-[#f7f9fa] outline-none focus:outline-none mt-4 border border-[#DDDDDD] rounded-md px-5 py-4 w-[470px]`}><input {...formik.getFieldProps('mobileNumber')} disabled={editingInput !== "mobileNumber"} type="email" id="mobileNumber" name="mobileNumber" className={`${editingInput == "mobileNumber" && "bg-white"} bg-[#f7f9fa] outline-none focus:outline-none w-full`} placeholder='+91 987456321' />
                                            <GoPencil fontSize={20} onClick={() => setEditingInput("mobileNumber")} className=' cursor-pointer' />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="w-32 h-11 mt-16 bg-[#F12D4D] flex items-center justify-center rounded-md text-white text-base font-semibold mr-10 cursor-pointer" value="Next">{loading ? <AiOutlineLoading3Quarters className='spinner' /> : `Save`}</button>
                            </div>
                        </div>
                        {/* /End replace */}
                    </div>
                </div>
            </form>
        </Layout>
    )
}

export default Account

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

    // Get the seller data using the email that the user is logged in with
    const accountResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sellers/account/${sellerData?.data?.id}`)
    const accountData = await accountResponse.json()
    if (!accountData.success) {
        return {
            props: {
                session,
                sellerData,
                accountData: null
            }
        }
    }


    return {
        props: {
            session,
            sellerData,
            accountData
        }
    }
}
