import React from "react";
import Navbar from "./Navbar";
import headerImg from "../images/header-img.png";

const LandingPage = () => {
  return (
    <>
      <Navbar dashboard="none" logout="none" />
      <div className="landing-page">
        <div className="landing-page-info">
          <h1>Dynamic Form Builder</h1>
          <h2>Create and manage forms with ease</h2>
        </div>
        <div className="landing-page-image">
          <img src={headerImg} alt="Vector style laptop" />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
