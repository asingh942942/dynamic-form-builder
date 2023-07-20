import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const AddForm = () => {
  const [formName, setFormName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to add a new form
      const response = await axios.post("/api/form", { name: formName });
      console.log(response.data);

      // Close the modal and reset the form name
      setIsModalOpen(false);
      setFormName("");

      // Reload page to display most recently added form
      navigate("/loggedin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button
        style={{ borderRadius: "25px", boxShadow: "none" }}
        variant="contained"
        onClick={() => setIsModalOpen(true)}
      >
        Add Form
      </Button>
      {isModalOpen && (
        <div className="modal">
          <form onSubmit={handleFormSubmit}>
            <label>
              Form Name:
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddForm;
