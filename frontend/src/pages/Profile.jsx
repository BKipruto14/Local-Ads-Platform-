import React, { useContext } from "react";
import { UserContext } from "../Context/Usercontext";

const Profile = () => {
  const { authToken } = useContext(UserContext);

  if (!authToken) {
    return <h2 className="text-center">Please log in to view your profile.</h2>;
  }

  return (
    <div className="container py-5">
      <h2 className="text-center">Profile Page</h2>
      <p>Welcome to your profile!</p>
    </div>
  );
};

export default Profile;
