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
          <h3>
            Introducing our DynamicFormBuilder – the ultimate tool to
            revolutionize your form creation process! With cutting-edge features
            and unparalleled flexibility, our platform empowers you to design,
            customize, and deploy dynamic forms effortlessly.
          </h3>
        </div>
        <div className="landing-page-image">
          <img src={headerImg} alt="Vector style laptop" />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
