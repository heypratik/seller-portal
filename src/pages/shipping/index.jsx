import React, { useEffect, useState } from 'react';

const dummyData = {
    "Asia": [
        "Afghanistan",
        "Armenia",
        "Azerbaijan",
        "Bahrain",
        "Bangladesh",
        "Bhutan",
        "Brunei",
        "Cambodia",
        "China",
        "Cyprus",
        "East Timor",
        "Georgia",
        "Hong Kong",
        "India",
        "Indonesia",
        "Iran",
        "Iraq",
        "Israel",
        "Japan",
        "Jordan",
        "Kazakhstan",
        "Kuwait",
        "Kyrgyzstan",
        "Laos",
        "Lebanon",
        "Macao",
        "Malaysia",
        "Maldives",
        "Mongolia",
        "Myanmar",
        "Nepal",
        "North Korea",
        "Oman",
        "Pakistan",
        "Palestine",
        "Philippines",
        "Qatar",
        "Saudi Arabia",
        "Singapore",
        "South Korea",
        "Sri Lanka",
        "Syria",
        "Tajikistan",
        "Thailand",
        "Turkey",
        "Turkmenistan",
        "United Arab Emirates",
        "Uzbekistan",
        "Vietnam",
        "Yemen"
    ],
    "Europe": [
        "Albania",
        "Andorra",
        "Austria",
        "Belarus",
        "Belgium",
        "Bosnia and Herzegovina",
        "Bulgaria",
        "Croatia",
        "Czech Republic",
        "Denmark",
        "England",
        "Estonia",
        "Faroe Islands",
        "Finland",
        "France",
        "Germany",
        "Gibraltar",
        "Greece",
        "Holy See (Vatican City State)",
        "Hungary",
        "Iceland",
        "Ireland",
        "Italy",
        "Latvia",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "North Macedonia",
        "Malta",
        "Moldova",
        "Monaco",
        "Montenegro",
        "Netherlands",
        "Northern Ireland",
        "Norway",
        "Poland",
        "Portugal",
        "Romania",
        "Russian Federation",
        "San Marino",
        "Scotland",
        "Serbia",
        "Slovakia",
        "Slovenia",
        "Spain",
        "Svalbard and Jan Mayen",
        "Sweden",
        "Switzerland",
        "Ukraine",
        "United Kingdom",
        "Wales"
    ],
    "Africa": [
        "Algeria",
        "Angola",
        "Benin",
        "Botswana",
        "British Indian Ocean Territory",
        "Burkina Faso",
        "Burundi",
        "Cameroon",
        "Cape Verde",
        "Central African Republic",
        "Chad",
        "Comoros",
        "Congo",
        "Djibouti",
        "Egypt",
        "Equatorial Guinea",
        "Eritrea",
        "Ethiopia",
        "Gabon",
        "Gambia",
        "Ghana",
        "Guinea",
        "Guinea-Bissau",
        "Ivory Coast",
        "Kenya",
        "Lesotho",
        "Liberia",
        "Libyan Arab Jamahiriya",
        "Madagascar",
        "Malawi",
        "Mali",
        "Mauritania",
        "Mauritius",
        "Mayotte",
        "Morocco",
        "Mozambique",
        "Namibia",
        "Niger",
        "Nigeria",
        "Reunion",
        "Rwanda",
        "Saint Helena",
        "Sao Tome and Principe",
        "Senegal",
        "Seychelles",
        "Sierra Leone",
        "Somalia",
        "South Africa",
        "South Sudan",
        "Sudan",
        "Swaziland",
        "Tanzania",
        "The Democratic Republic of Congo",
        "Togo",
        "Tunisia",
        "Uganda",
        "Western Sahara",
        "Zambia",
        "Zimbabwe"
    ],
    "Oceania": [
        "American Samoa",
        "Australia",
        "Christmas Island",
        "Cocos (Keeling) Islands",
        "Cook Islands",
        "Fiji Islands",
        "French Polynesia",
        "Guam",
        "Kiribati",
        "Marshall Islands",
        "Micronesia, Federated States of",
        "Nauru",
        "New Caledonia",
        "New Zealand",
        "Niue",
        "Norfolk Island",
        "Northern Mariana Islands",
        "Palau",
        "Papua New Guinea",
        "Pitcairn",
        "Samoa",
        "Solomon Islands",
        "Tokelau",
        "Tonga",
        "Tuvalu",
        "United States Minor Outlying Islands",
        "Vanuatu",
        "Wallis and Futuna"
    ],
    "North America": [
        "Anguilla",
        "Antigua and Barbuda",
        "Aruba",
        "Bahamas",
        "Barbados",
        "Belize",
        "Bermuda",
        "Canada",
        "Cayman Islands",
        "Costa Rica",
        "Cuba",
        "Dominica",
        "Dominican Republic",
        "El Salvador",
        "Greenland",
        "Grenada",
        "Guadeloupe",
        "Guatemala",
        "Haiti",
        "Honduras",
        "Jamaica",
        "Martinique",
        "Mexico",
        "Montserrat",
        "Netherlands Antilles",
        "Nicaragua",
        "Panama",
        "Puerto Rico",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Pierre and Miquelon",
        "Saint Vincent and the Grenadines",
        "Trinidad and Tobago",
        "Turks and Caicos Islands",
        "United States",
        "Virgin Islands, British",
        "Virgin Islands, U.S."
    ],
    "Antarctica": [
        "Antarctica",
        "Bouvet Island",
        "French Southern territories",
        "Heard Island and McDonald Islands",
        "South Georgia and the South Sandwich Islands"
    ],
    "South America": [
        "Argentina",
        "Bolivia",
        "Brazil",
        "Chile",
        "Colombia",
        "Ecuador",
        "Falkland Islands",
        "French Guiana",
        "Guyana",
        "Paraguay",
        "Peru",
        "Suriname",
        "Uruguay",
        "Venezuela"
    ]
}

const ShippingZoneSelector = () => {
    const [selectedContinents, setSelectedContinents] = useState({});
    const [selectedCountries, setSelectedCountries] = useState({});

    console.log(selectedContinents);
    console.log(selectedCountries);

    const handleContinentChange = (continent) => {
        const newSelectedContinents = { ...selectedContinents };
        const newSelectedCountries = { ...selectedCountries };
        if (newSelectedContinents[continent]) {
            delete newSelectedContinents[continent];
            delete newSelectedCountries[continent];
        } else {
            newSelectedContinents[continent] = true;
            newSelectedCountries[continent] = dummyData[continent].reduce((acc, country) => {
                acc[country] = true;
                return acc;
            }, {});
        }
        setSelectedContinents(newSelectedContinents);
        setSelectedCountries(newSelectedCountries);
    };

    const handleCountryChange = (continent, country) => {
        const newSelectedCountries = { ...selectedCountries };
        newSelectedCountries[continent] = {
            ...newSelectedCountries[continent],
            [country]: !newSelectedCountries[continent]?.[country]
        };

        // If all countries of a continent are selected, select the continent
        if (Object.keys(newSelectedCountries[continent]).length === dummyData[continent].length) {
            setSelectedContinents(prev => ({ ...prev, [continent]: true }));
        } else {
            setSelectedContinents(prev => {
                const updatedSelectedContinents = { ...prev };
                delete updatedSelectedContinents[continent];
                return updatedSelectedContinents;
            });
        }

        // Check if all countries under the continent are deselected
        const allCountriesDeselected = Object.values(newSelectedCountries[continent]).every(value => !value);
        if (allCountriesDeselected) {
            // If all countries are deselected, also deselect the continent
            setSelectedContinents(prev => {
                const updatedSelectedContinents = { ...prev };
                delete updatedSelectedContinents[continent];
                return updatedSelectedContinents;
            });
        }

        setSelectedCountries(newSelectedCountries);
    };

    return (
        <div className='w-full'>
            <input type="text" placeholder="Search" />
            {Object.keys(dummyData).map((continent, index) => (
                <div className='p-5' key={index}>
                    <input
                        type="checkbox"
                        checked={selectedContinents[continent] || false}
                        onChange={() => handleContinentChange(continent)}
                    />
                    {continent}
                    <ul className='px-5'>
                        {dummyData[continent].map((country, index) => (
                            <li key={index}>
                                <input
                                    type="checkbox"
                                    checked={selectedCountries[continent]?.[country] || false}
                                    onChange={() => handleCountryChange(continent, country)}
                                />
                                {country}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default ShippingZoneSelector;
