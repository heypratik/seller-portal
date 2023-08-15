import React, { useState } from 'react';

const categories = {
    "Health & Beauty": ["Bath & Body", "Makeup", "Skin Care", "Hair Care", "Nails", "Salon & Spa Equipment", "Fragrance", "Tools & Accessories", "Shaving & Hair Removal"],
    "Clothing": ["Dresses", "Tops & Tees", "Sweaters", "Jeans", "Pants", "Skirts", "Activewear", "Swimsuits & Cover Ups", "Lingerie, Sleep & Lounge", "Coats & Jackets", "Suits & Blazers", "Socks"],
    "Accessories": ["Scarves & Wraps", "Sunglasses", "Belts", "Wallets"],
    "Footwear": ["Athletic", "Boots", "Fashion Sneakers", "Flats", "Outdoor", "Slippers", "Pumps & Heels", "Sandals", "Loafers & Slip-Ons", "Outdoor", "Slippers", "Oxfords", "Sandals", "Work & Safety"],
    "Watches": ["Luxury", "Sport"],
    "Jewelry": ["Necklaces", "Rings", "Earrings", "Bracelets", "Wedding & Engagement"],
    "Bags": ["Cross-body bags", "Shoulder bags", "Wallets", "Handbags", "Clutches", "Purse", "Tote Bags"],
    "Gender": ["Men", "Women", "Unisex", "Kids"],
    "Income Bracket": ["Low 10%", "Low 25%", "Low 50%", "Top 50%", "Top 25%", "Top 10%", "Top 5%", "Top 1%"],
    "Availability": ["Local", "National", "International"]
};

function MyComponent() {
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');

    return (
        <div>
            <select value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory('') }} >
                <option value="">Select Category</option>
                {Object.keys(categories).map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>

            <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} disabled={!category}>
                <option value="">Select Sub-Category</option>
                {category && categories[category].map((subCat) => (
                    <option key={subCat} value={subCat}>
                        {subCat}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default MyComponent;