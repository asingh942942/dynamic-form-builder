import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the register route
      const response = await axios.post("/api/register", {
        username,
        password,
      });
      console.log(response.data);
      // Handle success, e.g., display success message or redirect to login
    } catch (error) {
      console.error(error.response.data);
      // Handle error, e.g., display error message
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <TextField
        variant="outlined"
        type="text"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        variant="outlined"
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="outlined" type="submit">
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;
