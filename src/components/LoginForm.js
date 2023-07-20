import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the login route
      const response = await axios.post("/api/login", { username, password });
      console.log(response.data);

      if (response.data.message === "User logged in successfully") {
        // navigate to /loggdin route
        navigate("/loggedin");
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <form onSubmit={handleLogin}>
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
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
