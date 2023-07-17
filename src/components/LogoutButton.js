import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Send a POST request to the logout route
      const response = await axios.post("/api/logout");
      console.log(response.data);

      // navigate to / route
      navigate("/");

      // Handle success, e.g., redirect to login or display success message
    } catch (error) {
      console.error(error.response.data);
      // Handle error, e.g., display error message
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
