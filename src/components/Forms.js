import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const FormsPage = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      // Send a GET request to fetch the forms associated with the user
      const response = await axios.get("/api/forms");
      setForms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditForm = (formId) => {
    // Handle the "Edit Form" button click
    console.log("Editing form with ID:", formId);

    // Navigate to /editform route with formID as a parameter
    navigate(`/editform/${formId}`);
  };

  const handleDeleteForm = async (formId) => {
    try {
      // Send a POST request to delete the form with the specified ID
      await axios.delete(`/api/form/${formId}`);

      // Refetch the forms to update the list after deletion
      fetchForms();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="forms-container">
      <h2 className="form-heading">Your Forms</h2>
      <div className="forms">
        {forms.map((form) => (
          <div className="form" key={form._id}>
            <h3 className="form-title">{form.name}</h3>
            <Button variant="text" onClick={() => handleEditForm(form._id)}>
              Edit Form
            </Button>
            <Button
              variant="text"
              onClick={() => handleDeleteForm(form._id)}
              style={{ color: "red" }}
            >
              Delete Form
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormsPage;
