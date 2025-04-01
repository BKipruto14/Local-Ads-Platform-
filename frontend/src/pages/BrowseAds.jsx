import React, { useEffect, useState } from "react";
import AdCard from "../components/AdCard";

function BrowseAds() {
const [ads, setAds] = useState([]);

// Fetch ads from the backend on component mount
useEffect(() => {
const fetchAds = async () => {
try {
const response = await fetch("http://localhost:5000/api/ad/view_ads");
const data = await response.json();
setAds(data.ads); // Set the ads state with the fetched ads
} catch (error) {
console.error("Failed to fetch ads:", error);
}
};

fetchAds();
}, []);

return (
<div className="container py-5">
<h2 className="text-center mb-4">Browse Ads</h2>
<div className="row">
{ads.length === 0 ? (
<p className="text-center">No ads found.</p>
) : (
ads.map((ad) => (
<div key={ad.id} className="col-md-4 mb-4">
<AdCard ad={ad} />
</div>
))
)}
</div>
</div>
);
}

export default BrowseAds;