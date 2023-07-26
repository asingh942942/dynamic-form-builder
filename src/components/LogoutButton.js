import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Send a POST request to the logout route
      const response = await axios.post("/api/logout");
      console.log(response.data);

      // navigate to / route
      navigate("/");
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <Button
      style={{
        all: "unset",
        borderRadius: "25px",
        boxShadow: "none",
        cursor: "pointer",
        fontWeight: 500,
      }}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
