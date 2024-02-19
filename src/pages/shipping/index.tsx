import React, { useEffect, useState, useRef } from 'react';
import { getSession, useSession } from 'next-auth/react'
import Layout from '../layout';
import Breadcrums from '../../../components/Breadcrums';
import toast, { Toaster } from 'react-hot-toast';
import { AnyCnameRecord } from 'dns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../shadcn/components/ui/dialog"
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { v4 as uuidv4 } from 'uuid';
import { BsThreeDots } from "react-icons/bs";
import { GiHazardSign } from "react-icons/gi";
import { BsPencil, BsTrash3Fill } from 'react-icons/bs'
import { FaGlobe } from "react-icons/fa";
import { set } from 'date-fns';

// const dummyData = {
//     "Asia": [
//         "Afghanistan",
//         "Armenia",
//         "Azerbaijan",
//         "Bahrain",
//         "Bangladesh",
//         "Bhutan",
//         "Brunei",
//         "Cambodia",
//         "China",
//         "Cyprus",
//         "East Timor",
//         "Georgia",
//         "Hong Kong",
//         "India",
//         "Indonesia",
//         "Iran",
//         "Iraq",
//         "Israel",
//         "Japan",
//         "Jordan",
//         "Kazakhstan",
//         "Kuwait",
//         "Kyrgyzstan",
//         "Laos",
//         "Lebanon",
//         "Macao",
//         "Malaysia",
//         "Maldives",
//         "Mongolia",
//         "Myanmar",
//         "Nepal",
//         "North Korea",
//         "Oman",
//         "Pakistan",
//         "Palestine",
//         "Philippines",
//         "Qatar",
//         "Saudi Arabia",
//         "Singapore",
//         "South Korea",
//         "Sri Lanka",
//         "Syria",
//         "Tajikistan",
//         "Thailand",
//         "Turkey",
//         "Turkmenistan",
//         "United Arab Emirates",
//         "Uzbekistan",
//         "Vietnam",
//         "Yemen"
//     ],
//     "Europe": [
//         "Albania",
//         "Andorra",
//         "Austria",
//         "Belarus",
//         "Belgium",
//         "Bosnia and Herzegovina",
//         "Bulgaria",
//         "Croatia",
//         "Czech Republic",
//         "Denmark",
//         "England",
//         "Estonia",
//         "Faroe Islands",
//         "Finland",
//         "France",
//         "Germany",
//         "Gibraltar",
//         "Greece",
//         "Holy See (Vatican City State)",
//         "Hungary",
//         "Iceland",
//         "Ireland",
//         "Italy",
//         "Latvia",
//         "Liechtenstein",
//         "Lithuania",
//         "Luxembourg",
//         "North Macedonia",
//         "Malta",
//         "Moldova",
//         "Monaco",
//         "Montenegro",
//         "Netherlands",
//         "Northern Ireland",
//         "Norway",
//         "Poland",
//         "Portugal",
//         "Romania",
//         "Russian Federation",
//         "San Marino",
//         "Scotland",
//         "Serbia",
//         "Slovakia",
//         "Slovenia",
//         "Spain",
//         "Svalbard and Jan Mayen",
//         "Sweden",
//         "Switzerland",
//         "Ukraine",
//         "United Kingdom",
//         "Wales"
//     ],
//     "Africa": [
//         "Algeria",
//         "Angola",
//         "Benin",
//         "Botswana",
//         "British Indian Ocean Territory",
//         "Burkina Faso",
//         "Burundi",
//         "Cameroon",
//         "Cape Verde",
//         "Central African Republic",
//         "Chad",
//         "Comoros",
//         "Congo",
//         "Djibouti",
//         "Egypt",
//         "Equatorial Guinea",
//         "Eritrea",
//         "Ethiopia",
//         "Gabon",
//         "Gambia",
//         "Ghana",
//         "Guinea",
//         "Guinea-Bissau",
//         "Ivory Coast",
//         "Kenya",
//         "Lesotho",
//         "Liberia",
//         "Libyan Arab Jamahiriya",
//         "Madagascar",
//         "Malawi",
//         "Mali",
//         "Mauritania",
//         "Mauritius",
//         "Mayotte",
//         "Morocco",
//         "Mozambique",
//         "Namibia",
//         "Niger",
//         "Nigeria",
//         "Reunion",
//         "Rwanda",
//         "Saint Helena",
//         "Sao Tome and Principe",
//         "Senegal",
//         "Seychelles",
//         "Sierra Leone",
//         "Somalia",
//         "South Africa",
//         "South Sudan",
//         "Sudan",
//         "Swaziland",
//         "Tanzania",
//         "The Democratic Republic of Congo",
//         "Togo",
//         "Tunisia",
//         "Uganda",
//         "Western Sahara",
//         "Zambia",
//         "Zimbabwe"
//     ],
//     "Oceania": [
//         "American Samoa",
//         "Australia",
//         "Christmas Island",
//         "Cocos (Keeling) Islands",
//         "Cook Islands",
//         "Fiji Islands",
//         "French Polynesia",
//         "Guam",
//         "Kiribati",
//         "Marshall Islands",
//         "Micronesia, Federated States of",
//         "Nauru",
//         "New Caledonia",
//         "New Zealand",
//         "Niue",
//         "Norfolk Island",
//         "Northern Mariana Islands",
//         "Palau",
//         "Papua New Guinea",
//         "Pitcairn",
//         "Samoa",
//         "Solomon Islands",
//         "Tokelau",
//         "Tonga",
//         "Tuvalu",
//         "United States Minor Outlying Islands",
//         "Vanuatu",
//         "Wallis and Futuna"
//     ],
//     "North America": [
//         "Anguilla",
//         "Antigua and Barbuda",
//         "Aruba",
//         "Bahamas",
//         "Barbados",
//         "Belize",
//         "Bermuda",
//         "Canada",
//         "Cayman Islands",
//         "Costa Rica",
//         "Cuba",
//         "Dominica",
//         "Dominican Republic",
//         "El Salvador",
//         "Greenland",
//         "Grenada",
//         "Guadeloupe",
//         "Guatemala",
//         "Haiti",
//         "Honduras",
//         "Jamaica",
//         "Martinique",
//         "Mexico",
//         "Montserrat",
//         "Netherlands Antilles",
//         "Nicaragua",
//         "Panama",
//         "Puerto Rico",
//         "Saint Kitts and Nevis",
//         "Saint Lucia",
//         "Saint Pierre and Miquelon",
//         "Saint Vincent and the Grenadines",
//         "Trinidad and Tobago",
//         "Turks and Caicos Islands",
//         "United States",
//         "Virgin Islands, British",
//         "Virgin Islands, U.S."
//     ],
//     "Antarctica": [
//         "Antarctica",
//         "Bouvet Island",
//         "French Southern territories",
//         "Heard Island and McDonald Islands",
//         "South Georgia and the South Sandwich Islands"
//     ],
//     "South America": [
//         "Argentina",
//         "Bolivia",
//         "Brazil",
//         "Chile",
//         "Colombia",
//         "Ecuador",
//         "Falkland Islands",
//         "French Guiana",
//         "Guyana",
//         "Paraguay",
//         "Peru",
//         "Suriname",
//         "Uruguay",
//         "Venezuela"
//     ]
// }

function ShippingZoneSelector({ accountData }: { accountData: any }) {

    const [allCountries, setAllCountries] = useState<any>({ "Asia": ["Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan", "Brunei", "Cambodia", "China", "Cyprus", "East Timor", "Georgia", "Hong Kong", "India", "Indonesia", "Iran", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan", "Laos", "Lebanon", "Macao", "Malaysia", "Maldives", "Mongolia", "Myanmar", "Nepal", "North Korea", "Oman", "Pakistan", "Palestine", "Philippines", "Qatar", "Saudi Arabia", "Singapore", "South Korea", "Sri Lanka", "Syria", "Tajikistan", "Thailand", "Turkey", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"], "Europe": ["Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Czech Republic", "Denmark", "England", "Estonia", "Faroe Islands", "Finland", "France", "Germany", "Gibraltar", "Greece", "Holy See (Vatican City State)", "Hungary", "Iceland", "Ireland", "Italy", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "North Macedonia", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "Northern Ireland", "Norway", "Poland", "Portugal", "Romania", "Russian Federation", "San Marino", "Scotland", "Serbia", "Slovakia", "Slovenia", "Spain", "Svalbard and Jan Mayen", "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Wales"], "Africa": ["Algeria", "Angola", "Benin", "Botswana", "British Indian Ocean Territory", "Burkina Faso", "Burundi", "Cameroon", "Cape Verde", "Central African Republic", "Chad", "Comoros", "Congo", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Mayotte", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Reunion", "Rwanda", "Saint Helena", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Swaziland", "Tanzania", "The Democratic Republic of Congo", "Togo", "Tunisia", "Uganda", "Western Sahara", "Zambia", "Zimbabwe"], "Oceania": ["American Samoa", "Australia", "Christmas Island", "Cocos (Keeling) Islands", "Cook Islands", "Fiji Islands", "French Polynesia", "Guam", "Kiribati", "Marshall Islands", "Micronesia, Federated States of", "Nauru", "New Caledonia", "New Zealand", "Niue", "Norfolk Island", "Northern Mariana Islands", "Palau", "Papua New Guinea", "Pitcairn", "Samoa", "Solomon Islands", "Tokelau", "Tonga", "Tuvalu", "United States Minor Outlying Islands", "Vanuatu", "Wallis and Futuna"], "North America": ["Anguilla", "Antigua and Barbuda", "Aruba", "Bahamas", "Barbados", "Belize", "Bermuda", "Canada", "Cayman Islands", "Costa Rica", "Cuba", "Dominica", "Dominican Republic", "El Salvador", "Greenland", "Grenada", "Guadeloupe", "Guatemala", "Haiti", "Honduras", "Jamaica", "Martinique", "Mexico", "Montserrat", "Netherlands Antilles", "Nicaragua", "Panama", "Puerto Rico", "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Trinidad and Tobago", "Turks and Caicos Islands", "United States", "Virgin Islands, British", "Virgin Islands, U.S."], "Antarctica": ["Antarctica", "Bouvet Island", "French Southern territories", "Heard Island and McDonald Islands", "South Georgia and the South Sandwich Islands"], "South America": ["Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador", "Falkland Islands", "French Guiana", "Guyana", "Paraguay", "Peru", "Suriname", "Uruguay", "Venezuela"] });

    const [shippingZone, setShippingZone] = useState<any>([]);

    const [dummyData, setDummyData] = useState<any>(allCountries);

    const [selectedContinents, setSelectedContinents] = useState<any>([]);
    const [selectedCountries, setSelectedCountries] = useState<any>({});
    const [closedContinents, setClosedContinents] = useState<any>(["Asia", "Europe", "Africa", "Oceania", "North America", "Antarctica", "South America"]);

    const [shippingZoneName, setShippingZoneName] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const [editingZone, setEditingZone] = useState(null)

    const [shippingProfileName, setShippingProfileName] = useState('')
    const [shippingProfileDescription, setShippingProfileDescription] = useState('')


    const [accountInfo, setAccountInfo] = useState<any>(accountData)
    const [brandId, setBrandId] = useState<any>(accountInfo?.success ? accountInfo?.data?.brand?.id : null)
    const [toUpdateBrandId, setToUpdateBrandId] = useState<any>(accountInfo?.success ? accountInfo?.data?.shippingProfiles : null)

    useEffect(() => {
        if (toUpdateBrandId.length > 0) {
            setShippingProfileName(toUpdateBrandId[0]?.shippingProfileName)
            setShippingProfileDescription(toUpdateBrandId[0]?.shippingProfileDescription)
            setShippingZone(toUpdateBrandId[0]?.shippingZones)
        }
    }, [toUpdateBrandId])


    useEffect(() => {
        // Extract all countries from shippingZone excluding the zone with editingZone ID
        const countriesInShippingZone = shippingZone.reduce((acc: any, zone: any) => {
            if (editingZone && zone.id === editingZone) {
                return acc; // Exclude countries from the zone with editingZone ID
            }
            Object.values(zone.countries).forEach((countries: any) => {
                acc.push(...countries);
            });
            return acc;
        }, []);

        // Remove countries present in shippingZone from dummyData
        const updatedDummyData = { ...allCountries };
        Object.keys(updatedDummyData).forEach(region => {
            updatedDummyData[region] = updatedDummyData[region].filter((country: any) => !countriesInShippingZone.includes(country));
        });

        // Update the state with the modified dummyData
        setDummyData(updatedDummyData);
    }, [shippingZone, editingZone]);

    const [rateName, setRateName] = useState('')
    const [transitTime, setTransitTime] = useState('')
    const [price, setPrice] = useState(0)

    function toggleContinent(continent: any) {
        if (closedContinents.includes(continent)) {
            setClosedContinents(closedContinents.filter((c: any) => c !== continent));
        } else {
            setClosedContinents([...closedContinents, continent]);
        }
    }

    const handleContinentChange = (continent: any) => {
        setSelectedContinents((prevSelectedContinents: any) => {
            const updatedContinents = [...prevSelectedContinents];
            const continentIndex = updatedContinents.indexOf(continent);

            if (continentIndex !== -1) {
                // Remove continent if it's already selected
                updatedContinents.splice(continentIndex, 1);
            } else {
                // Add continent if it's not selected
                updatedContinents.push(continent);
            }

            return updatedContinents;
        });

        setSelectedCountries((prevSelectedCountries: any) => {
            const updatedCountries = { ...prevSelectedCountries };

            if (selectedContinents.includes(continent)) {
                // If the continent is selected, remove its countries
                delete updatedCountries[continent];
            } else {
                // If the continent is not selected, add its countries
                updatedCountries[continent] = dummyData[continent];
            }

            return updatedCountries;
        });
    };

    const handleCountryChange = (continent: any, country: any) => {

        setSelectedCountries((prevSelectedCountries: any) => {
            const updatedCountries = { ...prevSelectedCountries };
            const continentCountries = updatedCountries[continent] || [];

            if (continentCountries.includes(country)) {
                // Remove country if it's already selected
                updatedCountries[continent] = continentCountries.filter((c: any) => c !== country);
            } else {
                // Add country if it's not selected
                updatedCountries[continent] = [...continentCountries, country];
            }

            // const filteredCountries = {};

            // for (const [key, value] of Object.entries(updatedCountries)) {
            //     if (Array.isArray(value) && value.length > 0) {
            //         filteredCountries[key] = value;
            //     }
            // }

            const filteredCountries: Record<string, any> = {};

            for (const [key, value] of Object.entries(updatedCountries)) {
                if (Array.isArray(value) && value.length > 0) {
                    filteredCountries[key] = value;
                }
            }

            return filteredCountries;
        });
    };

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

    function handleDiscard() {
        simulateEscapeClick()
        setEditingZone(null)
        setSelectedCountries({})
        setShippingZoneName('')
    }

    const isCountryAvailableInShippingZone = (country: any, id = null) => {
        // Check if the country is available in any shipping zone
        return shippingZone.some((zone: any) => {
            // If an ID is provided and matches the current zone's ID, skip checking this zone
            if (id !== null && zone.id === id) return false;
            return Object.values(zone.countries).flat().includes(country);
        });
    };

    function handleSave(type: any) {
        if (type === 'save') {
            try {
                const addObj = {
                    id: uuidv4(),
                    shippingZoneName: shippingZoneName,
                    countries: selectedCountries,
                    rates: []
                }
                setShippingZone((prev: any) => [...prev, addObj])
                simulateEscapeClick()

                setSelectedCountries({})
                setShippingZoneName('')
            } catch (error) {
                console.log(error)
            }
        } else if (type === 'update') {
            try {
                const updatedZone = shippingZone.map((zone: any) => {
                    if (zone.id === editingZone) {
                        zone.countries = selectedCountries
                        zone.shippingZoneName = shippingZoneName
                    }
                    return zone
                })
                setShippingZone(updatedZone)
                handleDiscard()
            } catch (error) {
                console.log(error)
            }
        }
    }

    function handleEditZone(zoneid: any) {
        const zone = shippingZone.filter((zone: any) => zone.id === zoneid)[0]
        setShippingZoneName(zone.shippingZoneName)
        setSelectedCountries(zone.countries)
        setEditingZone(zoneid)
        handleEditRef.current?.click()
    }

    // {
    //     id: 1,
    //     shippingZoneName: "Asia",
    //     countries: ["Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan", "Brunei", "Cambodia", "China", "Cyprus", "East Timor", "Georgia", "Hong Kong", "India", "Indonesia", "Iran", "Iraq"],
    //     continents: ["Asia"],
    //     rates: [{ id: 1, name: "Standard", transitTime: "1-2 Days", price: 10 }, { id: 2, name: "Express", transitTime: "1-2 Days", price: 20 }]

    // }

    function removeZone(id: any) {
        setShippingZone((prev: any) => prev.filter((zone: any) => zone.id !== id))
    }

    function removeRate(zoneId: any, rateId: any) {
        setShippingZone((prev: any) => {
            const newZone = prev.map((zone: any) => {
                if (zone.id === zoneId) {
                    zone.rates = zone.rates.filter((rate: any) => rate.id !== rateId)
                }
                return zone
            })
            return newZone
        })
    }

    function addRates(id: any) {
        const rateObj = {
            id: uuidv4(),
            name: rateName,
            transitTime: transitTime,
            price: price
        }

        setShippingZone((prev: any) => {
            const newZone = prev.map((zone: any) => {
                if (zone.id === id) {
                    zone.rates.push(rateObj)
                }
                return zone
            })
            return newZone
        })
        setRateName('')
        setTransitTime('')
        setPrice(0)
        simulateEscapeClick()
    }

    // function handleEdit(rateid: any, zoneid: any) {
    //     const rate = shippingZone.filter((zone: any) => zone.id === rateid)[0].rates.filter((rate: any) => rate.id === zoneid)[0]
    //     setEditingZone(rate.id)
    //     setRateName(rate.name)
    //     setTransitTime(rate.transitTime)
    //     setPrice(rate.price)
    // }

    let handleEditRef = useRef<any>(null);

    const inputClass = `mt-1 px-3 py-2 bg-[#F7F9FA] border shadow-sm border-[#DDDDDD] placeholder-[#9F9F9F] text-base focus:outline-none  w-full h-10 rounded-md mb-3`

    const labelClass = `mt-6 block text-base font-medium text-[#30323E] mb-2`

    function handleDialogClose(e: any) {
        if (e === false) {
            setDialogOpen(false)
            handleDiscard()
        } else {
            setDialogOpen(true)
        }
    }

    async function submitData() {
        if (brandId && toUpdateBrandId.length == 0) {
            try {
                const data = {
                    brandId: brandId,
                    shippingProfileName: shippingProfileName,
                    shippingProfileDescription: shippingProfileDescription,
                    shippingZones: shippingZone
                }
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/shipping`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                const dataRes = await response.json()
                if (dataRes.success) {
                    toast.success('Shipping Profile Created')
                } else {
                    toast.error('Error Creating Shipping Profile')
                }
            } catch (error) {
                console.log(error)
            }
        } else if (brandId && toUpdateBrandId.length > 0) {
            try {
                const data = {
                    brandId: brandId,
                    shippingProfileName: shippingProfileName,
                    shippingProfileDescription: shippingProfileDescription,
                    shippingZones: shippingZone
                }
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/shipping/${toUpdateBrandId[0]?.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                const dataRes = await response.json()
                if (dataRes.success) {
                    toast.success('Shipping Profile Updated')
                } else {
                    toast.error('Error Updating Shipping Profile')
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <Layout>
            <Toaster position="top-center" reverseOrder={true} />
            <div className="py-6 h-screen">
                <div className="mx-auto px-4 sm:px-6 md:px-8 ">
                    <Breadcrums parent={"Inventory"} childarr={["Edit Shipping Profile"]} />
                </div>
                <div className="mx-auto px-4 sm:px-6 md:px-8 pb-24">
                    {/* Replace with your content */}
                    <div className="py-4">
                        <div className='flex justify-center gap-4'>
                            <div className="bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] rounded-lg p-7  flex-1">
                                <h1 className=' text-[#F12D4D] text-2xl font-semibold'>Shipping Profile</h1>
                                <div className='w-full'>
                                    <div className="flex-1">
                                        <label htmlFor="business" className={labelClass}>Shipping Profile Name* <span className='text-gray-500 text-xs font-medium'>(Customers will not see this)</span></label>
                                        <input value={shippingProfileName} onChange={(e) => setShippingProfileName(e.target.value)} type="text" id="productName" name="productName" className={inputClass} placeholder='Enter Product Name' />
                                    </div>

                                    <div className="flex-1">
                                        <label htmlFor="business" className={labelClass}>Shipping Description* <span className='text-gray-500 text-xs font-medium'>(Customers can see in this shipping tab of products)</span></label>
                                        <textarea value={shippingProfileDescription} onChange={(e) => setShippingProfileDescription(e.target.value)} rows={3} id="productName" name="productName" className={`bg-[#f7f9fa] border shadow-sm border-[#DDDDDD] outline-none focus:outline-none mt-4 rounded-md px-5 py-4 w-full`} placeholder='We ship in 3-5 Days. Free Shipping on orders above $100' />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label htmlFor="business" className={labelClass}>Shipping Zones*</label>
                                        <Dialog onOpenChange={(e) => handleDialogClose(e)}>
                                            <DialogTrigger asChild>
                                                <button ref={handleEditRef} className=' border border-red-50 rounded-lg px-2 py-1 bg-[#F12D4D] text-white font-semibold'>Create Shipping Zone</button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <div className="flex flex-col items-center justify-center">
                                                        <DialogTitle>{`${editingZone ? 'Update Shipping Zone' : 'Create Shipping Zone'}`}</DialogTitle>
                                                        <input onChange={(e) => setShippingZoneName(e.target.value)} value={shippingZoneName} className='w-full mt-3 outline-none focus:outline-none border border-zinc-600 rounded bg-white text-brand-text px-3 py-2' type="text" placeholder="Enter shipping zone name" />
                                                        <hr className='w-full my-2' />
                                                    </div>
                                                </DialogHeader>
                                                <div className=' max-h-64 overflow-y-scroll flex items-center justify-start flex-wrap'>
                                                    {Object.keys(dummyData).map((continent, index) => (
                                                        dummyData[continent].length > 0 && (
                                                            <div className='w-full' key={index}>
                                                                <div className='py-1 w-full flex gap-[5px] hover:bg-gray-100'>
                                                                    <label className='px-3 items-center w-full flex gap-[5px] cursor-pointer'>
                                                                        <input
                                                                            type="checkbox"
                                                                            className='flex gap-[5px]'
                                                                            checked={selectedCountries.hasOwnProperty(continent) || false}
                                                                            onChange={() => handleContinentChange(continent)}
                                                                        />
                                                                        {continent}
                                                                    </label>
                                                                    {closedContinents.includes(continent) ? (
                                                                        <RiArrowDropDownLine fontSize="30px" className='cursor-pointer mr-5' onClick={() => toggleContinent(continent)} />
                                                                    ) : (
                                                                        <RiArrowDropUpLine fontSize="30px" className='cursor-pointer mr-5' onClick={() => toggleContinent(continent)} />
                                                                    )}
                                                                </div>
                                                                {closedContinents.includes(continent) ? null : (
                                                                    <ul className={`w-full ${continent}`}>
                                                                        {dummyData[continent].map((country: any, countryIndex: any) => (
                                                                            <li className='py-1 w-full hover:bg-gray-100' key={countryIndex}>
                                                                                <label className='px-6 w-full items-center flex gap-[5px] cursor-pointer'>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className=''
                                                                                        checked={(selectedCountries[continent] || []).includes(country)}
                                                                                        onChange={() => handleCountryChange(continent, country)}
                                                                                    />
                                                                                    {country}
                                                                                </label>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                                <div className='flex justify-end gap-2 items-center w-full'>
                                                    <button onClick={() => handleDiscard()} className=' border border-[#F12D4D] text-[#F12D4D] rounded-lg px-2 py-1'>Discard</button>
                                                    <button onClick={() => {
                                                        if (editingZone) {
                                                            handleSave('update')
                                                        } else {
                                                            handleSave('save')
                                                        }
                                                    }} className=' border border-red-50 rounded-lg px-2 py-1 bg-[#F12D4D] text-white font-semibold'>Save</button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className='border border-gray-200 py-4 px-4 mt-2 rounded-md'>
                                        {shippingZone.length == 0 && <div className='flex items-center bg-[#fff1e4] rounded-md p-2 my-4'>
                                            <GiHazardSign className='mr-2' color='#5e420b' /><p className='text-[#5e420b] '>No shipping zones added. Customers cannot purchase your products.</p>
                                        </div>}
                                        {shippingZone.length > 0 && shippingZone.map((zone: any, index: any) =>
                                            <div key={index} className='mt-4'>
                                                <div className='flex items-center justify-between mb-2'>
                                                    <div className='flex items-center gap-2'>
                                                        <FaGlobe />
                                                        <p className='text-base font-bold'>{zone.shippingZoneName}</p>
                                                    </div>
                                                    <div className='flex items-center justify-end gap-2' >
                                                        <BsPencil fontSize="18px" className='text-gray-500 cursor-pointer' onClick={(e) => handleEditZone(zone.id)} />
                                                        <BsTrash3Fill fontSize="18px" className='text-gray-500 cursor-pointer' onClick={() => removeZone(zone.id)} />
                                                    </div>
                                                </div>

                                                {zone?.rates?.length == 0 &&
                                                    <div className='flex items-center bg-[#fff1e4] rounded-md p-2 my-4'>
                                                        <GiHazardSign className='mr-2' color='#5e420b' /><p className='text-[#5e420b] '>No rates. Customers in this zone won&apos;t be able to complete checkout.</p>
                                                    </div>}

                                                {zone?.rates?.length > 0 && <div className='flex items-center mt-6'>
                                                    <div className='flex-1 font-semibold'><p>Rate Name</p></div>
                                                    <div className='flex-1 font-semibold'><p>Transit Name</p></div>
                                                    <div className='flex-1 font-semibold'><p>Price</p></div>
                                                    <div className='flex-1 flex items-center justify-end gap-2 opacity-0' >
                                                        <BsPencil fontSize="18px" className='text-gray-500 cursor-pointer' />
                                                        <BsTrash3Fill fontSize="18px" className='text-gray-500 cursor-pointer' />
                                                    </div>
                                                </div>}
                                                <hr className='mt-1' />
                                                {zone?.rates?.length > 0 && zone.rates.map((rate: any, index: any) =>
                                                    <div key={index} className='flex items-center py-2 px-2 hover:bg-gray-100'>
                                                        <div className='flex-1'><p>{rate.name}</p></div>
                                                        <div className='flex-1'><p>{rate.transitTime}</p></div>
                                                        <div className='flex-1'><p>{rate.price}</p></div>
                                                        <div className='flex-1 flex items-center justify-end gap-2' >
                                                            <BsTrash3Fill fontSize="18px" className='text-gray-500 cursor-pointer' onClick={(e) => removeRate(zone.id, rate.id)} />
                                                        </div>
                                                    </div>
                                                )}



                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <button className='mt-2 border border-red-50 rounded-lg px-2 py-1 bg-[#F12D4D] text-white font-semibold'>Add Rates</button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <div className="flex flex-col items-center justify-center">
                                                                <DialogTitle>Add rate</DialogTitle>
                                                                <hr className='w-full my-2' />
                                                            </div>
                                                        </DialogHeader>
                                                        <div className='flex items-center justify-start flex-wrap'>
                                                            <label htmlFor="ratename" className={`mt-0 text-base`}>Rate Name*</label>
                                                            <input onChange={(e) => setRateName(e.target.value)} value={rateName} type="text" id="ratename" name="ratename" className={inputClass} placeholder='Express Shipping' />
                                                            <label htmlFor="transittime" className={`mt-2 text-base`}>Transit Time*</label>
                                                            {/* <select className={inputClass}>
                                                        <option value="Economy (6 to 18 business days)">Economy (6 to 18 business days)</option>
                                                        <option value="Standard (6 to 12 business days)">Standard (6 to 12 business days)</option>
                                                        <option value="Express (1 to 5 business days)">Express (1 to 5 business days)</option>
                                                        <option value="Custom (No Transit Time)">Custom (No Transit Time)</option>
                                                    </select> */}
                                                            <input value={transitTime} onChange={(e) => setTransitTime(e.target.value)} type="text" id="transittime" name="transittime" className={inputClass} placeholder='Express (1 to 3 business days)' />
                                                            <label htmlFor="price" className={`mt-2 text-base`}>Price*</label>
                                                            <input value={price} onChange={(e) => setPrice(Number(e.target.value))} type="number" id="price" name="price" className={inputClass} placeholder='$50' />
                                                        </div>
                                                        <div className='flex justify-end gap-2 items-center w-full'>
                                                            <button onClick={() => handleDiscard()} className=' border border-[#F12D4D] text-[#F12D4D] rounded-lg px-2 py-1'>Discard</button>
                                                            <button onClick={() => addRates(zone.id)} className=' border border-red-50 rounded-lg px-2 py-1 bg-[#F12D4D] text-white font-semibold'>Save</button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                                {/* <hr className='my-3' /> */}
                                            </div>

                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='sidebar bg-white shadow-[0_2px_8px_rgb(0,0,0,0.1)] rounded-lg p-7 flex-[0.3]'>
                                <div className="flex justify-end">
                                    <button type="submit" className="m-w-32 h-11 bg-[#fff] border border-[#F12D4D] text-[#F12D4D] px-5 flex items-center justify-center rounded-md text-base font-semibold mr-5 cursor-pointer" value="Add">Cancel</button>
                                    <button onClick={(e) => submitData()} type="submit" className="m-w-32 h-11 bg-[#F12D4D] px-5 flex items-center justify-center rounded-md text-white text-base font-semibold cursor-pointer" value="Add">Save Profile</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>

    );
};

export default ShippingZoneSelector;

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