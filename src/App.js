import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedPage from "./components/ProtectedPage";
import EditForm from "./components/EditForm";
import ViewForm from "./components/ViewForm";
import ViewResponses from "./components/ViewResponses";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route exact path="/login" element={<LoginForm />} />
        <Route exact path="/signup" element={<RegisterForm />} />
        <Route exact path="/loggedin" element={<ProtectedPage />} />
        <Route exact path="/editform/:formId" element={<EditForm />} />
        <Route exact path="/form/:formId" element={<ViewForm />} />
        <Route
          exact
          path="/viewresponses/:formId"
          element={<ViewResponses />}
        />
      </Routes>
    </Router>
  );
}

export default App;
