import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../Context/Usercontext";
import AdCard from "../components/AdCard";

const MyAds = () => {
    const { authToken } = useContext(UserContext);
    const [myAds, setMyAds] = useState([]);
    const [editingAd, setEditingAd] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMyAds = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/ad/my-ads", {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch your ads.");
            }

            const data = await res.json();
            setMyAds(data.my_ads);
        } catch (error) {
            console.error("Error fetching your ads:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (adId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this ad?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:5000/api/ad/delete_ads/${adId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!res.ok) throw new Error("Failed to delete ad.");

            setMyAds((prev) => prev.filter((ad) => ad.id !== adId));
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/ad/update_ads/${editingAd.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(editingAd),
            });

            if (!res.ok) throw new Error("Failed to update ad.");

            const updatedAd = await res.json();
            setMyAds((prev) =>
                prev.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad))
            );
            setEditingAd(null);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        if (authToken) {
            fetchMyAds();
        }
    }, [authToken]);

    return (
        <div className="container mt-4">
            <h2>My Ads</h2>
            {loading ? (
                <p>Loading...</p>
            ) : myAds.length === 0 ? (
                <p>You haven't posted any ads yet.</p>
            ) : (
                <div className="row">
                    {myAds.map((ad) => (
                        <div className="col-md-4 mb-3" key={ad.id}>
                            <AdCard
                                ad={ad}
                                onDelete={() => handleDelete(ad.id)}
                                showActions={true}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
    {
        editingAd && (
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    value={editingAd.title}
                    onChange={(e) =>
                        setEditingAd({ ...editingAd, title: e.target.value })
                    }
                    required
                />
                <input
                    type="text"
                    value={editingAd.description}
                    onChange={(e) =>
                        setEditingAd({ ...editingAd, description: e.target.value })
                    }
                    required
                />
                <input
                    type="number"
                    value={editingAd.price}
                    onChange={(e) =>
                        setEditingAd({ ...editingAd, price: e.target.value })
                    }
                    required
                />
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditingAd(null)}>Cancel</button>
            </form>
        )
    }
};

export default MyAds;