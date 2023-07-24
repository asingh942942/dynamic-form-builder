import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

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

  const handleViewForm = (formId) => {
    navigate(`/form/${formId}`); // Navigate to the new "ViewFormPage" with the formId as a parameter
  };

  return (
    <>
      {forms.map((form) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={form._id}>
          <Card style={{ borderRadius: 10 }} elevation={0}>
            <CardContent>
              <h3 className="form-title">{form.name}</h3>
              <Button variant="text" onClick={() => handleEditForm(form._id)}>
                Edit Form
              </Button>
              <div style={{ display: "inline-block" }}>
                <Button variant="text" onClick={() => handleViewForm(form._id)}>
                  View Form
                </Button>
                <Button
                  variant="text"
                  onClick={() => handleDeleteForm(form._id)}
                  style={{ color: "red" }}
                >
                  Delete Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  );
};

export default FormsPage;
