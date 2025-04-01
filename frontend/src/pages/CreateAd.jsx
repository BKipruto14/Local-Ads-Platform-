import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/Usercontext";

function CreateAd() {
const { authToken } = useContext(UserContext);
const navigate = useNavigate();

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [price, setPrice] = useState("");

const handleCreateAd = async (e) => {
e.preventDefault();

try {
const response = await fetch("http://localhost:5000/api/ad/create_ads", {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${authToken}`,
},
body: JSON.stringify({ title, description, price }),
});

const data = await response.json();

if (response.ok) {
alert("Ad created successfully!");
navigate("/browse-ads");
} else {
alert(data.error || "Failed to create ad");
}
} catch (error) {
console.error("Error creating ad:", error);
alert("Server error");
}
};

return (
<div className="container py-5">
<h2 className="text-center mb-4">Create New Ad</h2>
<form onSubmit={handleCreateAd} className="shadow p-4 bg-white rounded">
<div className="mb-3">
<label>Title</label>
<input type="text" className="form-control" required value={title} onChange={(e) => setTitle(e.target.value)} />
</div>
<div className="mb-3">
<label>Description</label>
<textarea className="form-control" required value={description} onChange={(e) => setDescription(e.target.value)} />
</div>
<div className="mb-3">
<label>Price</label>
<input type="number" className="form-control" required value={price} onChange={(e) => setPrice(e.target.value)} />
</div>
<button type="submit" className="btn btn-success w-100">Post Ad</button>
</form>
</div>
);
}

export default CreateAd;