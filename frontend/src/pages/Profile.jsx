import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../Context/Usercontext";

const Profile = () => {
  const { authToken } = useContext(UserContext);
  const [user, setUser] = useState(null); // State for user data
  const [editing, setEditing] = useState(false); // Toggle form visibility
  const [name, setName] = useState(""); // Input for name
  const [email, setEmail] = useState(""); // Input for email
  const [message, setMessage] = useState(""); // Success/error message

  // Fetch user data on component mount
  useEffect(() => {
    if (!authToken) return;

    fetch("http://localhost:5000/api/routes/user", {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setName(data.name); // Pre-fill name input
        setEmail(data.email); // Pre-fill email input
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, [authToken]);
  // Handle profile update
  const handleUpdate = (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    fetch("http://localhost:5000/api/routes/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage("Profile updated successfully! ✅");
          setUser({ ...user, name, email }); // Update user state
          setEditing(false); // Hide edit form
        } else {
          setMessage("Error updating profile ❌");
        }
      })
      .catch(() => setMessage("An error occurred ❌"));
  };

  // If not logged in, show message
  if (!authToken) {
    return <h2 className="text-center">Please log in to view your profile.</h2>;
  }

  // Show loading message while fetching user data
  if (!user) {
    return <h2 className="text-center">Loading...</h2>;
  }

  return (
    <div className="container py-5">
      <h2 className="text-center">Profile</h2>

      {/* Display success/error messages */}
      {message && <p className="text-center">{message}</p>}

      {/* User Info Display */}
      {!editing ? (
        <div className="card p-4">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button className="btn btn-primary mt-3" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        </div>
      ) : (
        /* Edit Profile Form */
        <form className="card p-4" onSubmit={handleUpdate}>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-between gap-2 mt-3">
            <button type= "submit" className="btn btn-success w-50"> Save Changes </button>
            <button type="button" className="btn btn-secondary w-50" onClick={()=> setEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
