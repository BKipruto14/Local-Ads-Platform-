import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);

  return (
    <UserContext.Provider value={{ authToken, setAuthToken }}>
      {children}
    </UserContext.Provider>
  );
};
