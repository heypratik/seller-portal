import React, { useState, useRef, useCallback, useEffect } from 'react'
import Layout from './layout'
import Breadcrums from '../../components/Breadcrums'
import { GoPencil } from 'react-icons/go'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useFormik } from 'formik';
import { getSession, useSession } from 'next-auth/react'
import toast, { Toaster } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
// import stripe from 'stripe';
import { stripe } from '../../lib/stripe'
import { createCustomer } from '../../lib/createCustomer'
import { useRouter } from 'next/router'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../shadcn/components/ui/dialog"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');

interface SellerData {
    data: {
        id: number;
        name: string;
        email: string;
        password: string;
        active: boolean;
        isPlanActive: boolean;
        stripeCustomerID: string;
        profilePicture: string;
        createdAt: string;
        updatedAt: string;
    };
}

// API Configurations
const baseURL = "https://dev.mybranzapi.link";
const postMediaEndpoint = "media/single";
const mediaEndpoint = "media/%s";
const token = "fb507a0b75e0f62f65b798424555733f";

function Account({ sellerData, accountData, session }: { sellerData: SellerData, accountData: any, session: any }) {

    const router = useRouter()

    const sellerAccountData = sellerData?.data
    const brandAccountData = accountData?.data?.brand

    const [loading, setLoading] = useState(false)
    const [editingInput, setEditingInput] = useState<string>("")

    const [objectKeys, setObjectKeys] = useState<any[]>([sellerAccountData?.profilePicture]);
    const fileInputRef = useRef<any>(null);

    const [customerPortalUrl, setCustomerPortalUrl] = useState<any>(null);
    const [activeSubscription, setActiveSubscription] = useState<any>(null);

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
    }

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


    async function handleSubscribe() {
        if (sellerAccountData?.stripeCustomerID) {
            setLoading(true)
            const customerEmail = sellerAccountData?.email

            if (customerEmail) {
                const stripe = await stripePromise;
                const response = await fetch('/api/stripe/createCheckoutSession', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ planId: process.env.NEXT_PUBLIC_PRODUCTID, customerEmail, stripeCustomerId: sellerAccountData?.stripeCustomerID })
                });
                const session = await response.json();

                if (session && stripe) {
                    const result = await stripe.redirectToCheckout({ sessionId: session.sessionId });
                    if (result.error) {
                        console.error(result.error);
                    }
                }

            } else {
                router.push('/auth/signup')
            }
        }
    }

    // const [hasEffectRun, setHasEffectRun] = useState(false);


    // useEffect(() => {
    //     if (!hasEffectRun) {
    //         async function createCust(email: any) {
    //             if (!sellerAccountData?.stripeCustomerID) {
    //                 const stripeCustomerID = await createCustomer(sellerAccountData.name, sellerAccountData.email);

    //                 const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sellers/account/update`, {
    //                     method: 'PATCH',
    //                     headers: {
    //                         'Content-Type': 'application/json'
    //                     },
    //                     body: JSON.stringify({
    //                         sellerId: sellerData?.data?.id,
    //                         stripeCustomerID: stripeCustomerID
    //                     })
    //                 });

    //                 const data = await response.json();
    //                 // reload page
    //                 if (data.success) {
    //                     router.reload();
    //                 }

    //                 setHasEffectRun(true);
    //             }
    //         }

    //         createCust(sellerAccountData?.email);
    //     }
    // }, [hasEffectRun]);



    useEffect(() => {
        async function fetchCustomerPortalUrl() {
            const customerId = sellerAccountData?.stripeCustomerID
            const response = await fetch('/api/stripe/createCustomerPortalSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ customerId })
            });

            const { url } = await response.json();

            setCustomerPortalUrl(url);
        }

        if (sellerAccountData?.stripeCustomerID) {
            fetchCustomerPortalUrl();
        }

    }, []);

    useEffect(() => {
        async function getCustomerIdByEmail(email: any) {
            const customers = sellerAccountData.stripeCustomerID
            const customer = customers
            const subscriptions = await stripe.subscriptions.list({
                customer: customer,
                status: 'active',
                limit: 3
            });


            if (subscriptions.data.length !== 0) {
                const activeSubscription = subscriptions.data.filter(sub => sub.metadata.platform === 'mybranz')[0]
                setActiveSubscription(activeSubscription)
            }

            if (subscriptions.data.length === 0) {
                const trialSubscriptions = await stripe.subscriptions.list({
                    customer: customers,
                    status: 'trialing',
                    limit: 3
                });

                const activeSubscription = trialSubscriptions.data.filter(sub => sub.metadata.platform === 'mybranz')[0]
                setActiveSubscription(activeSubscription)
            }
        }
        if (sellerAccountData?.stripeCustomerID) {
            getCustomerIdByEmail(sellerAccountData?.email)
        }
    }, []);

    // async function handleUpgrade() {

    //     const stripe = await stripePromise;
    //     const response = await fetch('/api/stripe/createCheckoutSession', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             planId: process.env.NEXT_PUBLIC_PRODUCTID,
    //             customerEmail: sellerAccountData?.email,
    //         })
    //     });

    //     const { sessionId } = await response.json();

    //     const result = await stripe.redirectToCheckout({
    //         sessionId: sessionId
    //     });

    //     if (result.error) {
    //         console.log(result.error.message);
    //     }
    // }

    const [showPopup, setShowPopup] = useState(!sellerData.data.isPlanActive);

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
                                        <div className={`${editingInput == "mobileNumber" && "bg-white"} flex items-center justify-between bg-[#f7f9fa] outline-none focus:outline-none mt-4 border border-[#DDDDDD] rounded-md px-5 py-4 w-[470px]`}><input {...formik.getFieldProps('mobileNumber')} disabled={editingInput !== "mobileNumber"} pattern="^\+?(\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$" type="tel" id="mobileNumber" name="mobileNumber" className={`${editingInput == "mobileNumber" && "bg-white"}  bg-[#f7f9fa] outline-none focus:outline-none w-full`} placeholder='eg: +1 222-22-2222' />
                                            <GoPencil fontSize={20} onClick={() => setEditingInput("mobileNumber")} className=' cursor-pointer' />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="w-32 h-11 mt-16 bg-[#F12D4D] flex items-center justify-center rounded-md text-white text-base font-semibold mr-10 cursor-pointer" value="Next">{loading ? <AiOutlineLoading3Quarters className='spinner' /> : `Save`}</button>

                                <div className='mt-16 flex items-center'>
                                    <h2 className='mr-5 font-semibold text-xl text-[#f33653]'>Billing</h2>
                                    <hr className='flex-1 border-[#f23250]' />
                                </div>

                                <div className="mt-2">
                                    <div className="py-4">
                                        <div className="border flex flex-col justify-center border-gray-200 rounded-lg p-4">
                                            {activeSubscription && <h2 className='text-3xl font-bold'>$29.99</h2>}
                                            <p className='text-lg font-bold'>Subscription {`${activeSubscription ? 'Active' : 'Inactive'}`}</p>
                                            {activeSubscription?.items?.data[0]?.plan?.metadata &&
                                                <div>
                                                    {Object.entries(activeSubscription?.items?.data[0]?.plan?.metadata).map(([key, value]) => (
                                                        <div key={key} className='flex my-3'><p className='mr-2'>{key}</p>:<p className='ml-3  font-semibold '>{typeof value === 'string' || typeof value === 'number' ? value : ''}</p></div>))}
                                                    <p className='text-sm text-gray-600'>Plan renews on {new Date(activeSubscription?.current_period_end * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} </p>
                                                </div>}
                                        </div>
                                        <a href={customerPortalUrl || ""} target='_blank' rel="noreferrer"><button type='button' disabled={!customerPortalUrl} className='bg-[#f23250] font-semibold p-3 text-white rounded-md mt-6 text-base disabled:bg-gray-400 '>Manage billing</button></a>
                                    </div>
                                    {showPopup && !activeSubscription && (
                                        <div className="fixed z-10 inset-0 overflow-y-auto">
                                            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                                </div>

                                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                                                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                        <div className="sm:flex sm:items-start">
                                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                                                    MyBranz Subscription
                                                                </h3>
                                                                <div className="mt-2">
                                                                    <p className="text-sm text-gray-500">
                                                                        Please purchase a subscription to start using MyBranz seller platform.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                        {loading ? <button type="button" onClick={() => handleSubscribe()} className="gap-3 items-center w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#f23150] text-base font-medium text-white hover:bg-[#f23150] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f23150] sm:ml-3 sm:w-auto sm:text-sm"><AiOutlineLoading3Quarters className='spinner' /> Starts at $29.99/m </button> : <button disabled={!sellerAccountData.stripeCustomerID} type="button" onClick={() => handleSubscribe()} className="gap-3 items-center w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#f23150] text-base font-medium text-white hover:bg-[#f23150] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f23150] sm:ml-3 sm:w-auto sm:text-sm">Starts at $29.99/m </button>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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

    if (sellerData?.data.stripeCustomerID == null || sellerData?.data.stripeCustomerID == "") {
        const stripeId = await createCustomer(sellerData?.data.name, sellerData?.data.email)
        sellerData.data.stripeCustomerID = stripeId
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sellers/account/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sellerId: sellerData?.data.id,
                stripeCustomerID: stripeId
            })
        });
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
