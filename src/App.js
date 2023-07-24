import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedPage from "./components/ProtectedPage";
import EditForm from "./components/EditForm";
import ViewForm from "./components/ViewForm";
import { useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
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

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route exact path="/login" element={<LoginForm />} />
        <Route exact path="/signup" element={<RegisterForm />} />
        <Route exact path="/loggedin" element={<ProtectedPage />} />
        <Route exact path="/editform/:formId" element={<EditForm />} />
        <Route exact path="/form/:formId" element={<ViewForm />} />
      </Routes>
    </Router>
  );
}

export default App;
