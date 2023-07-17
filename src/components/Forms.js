import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormsPage = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        // Send a GET request to fetch the forms associated with the user
        const response = await axios.get("/api/forms");
        setForms(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchForms();
  }, []);

  const handleEditForm = (formId) => {
    // Handle the "Edit Form" button click
    console.log("Editing form with ID:", formId);

    // Navigate to /editform route with formID as a parameter
    navigate(`/editform/${formId}`);
  };

  return (
    <div>
      <h1>Forms</h1>
      {forms.map((form) => (
        <div key={form._id}>
          <h3>{form.name}</h3>
          <button onClick={() => handleEditForm(form._id)}>Edit Form</button>
        </div>
      ))}
    </div>
  );
};

export default FormsPage;
