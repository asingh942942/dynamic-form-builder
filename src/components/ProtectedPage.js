import React from "react";
import Forms from "./Forms";
import AddForm from "./AddForm";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";

const ProtectedPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to check the user's authentication status
  const checkAuthStatus = async () => {
    try {
      // Send a GET request to a route that checks if the user is logged in
      const response = await axios.get("/api/check-auth");
      setIsLoggedIn(response.data.isLoggedIn);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  // Call the checkAuthStatus function when the component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return isLoggedIn ? (
    <div>
      <Navbar login="none" signup="none" />
      <h1>Welcome, User!</h1>
      <Forms />
      <AddForm />
    </div>
  ) : (
    <>
      <Navbar dashboard="none" logout="none" />
      <Alert className="login-alert" severity="error">
        Log in to access this page!
      </Alert>
    </>
  );
};

export default ProtectedPage;
