import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewForm = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        // Send a GET request to fetch the form data from the Express route
        const response = await axios.get(`/api/form/${formId}`);
        setForm(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchForm();
  }, [formId]);

  const handleFieldChange = (fieldId, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldId]: value,
    }));
  };

  const handleSubmitForm = async () => {
    try {
      // Send a POST request to submit the form data
      await axios.post("/api/response", {
        formId,
        formData,
      });

      // Handle successful form submission
      console.log("Form submitted successfully!");
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const renderField = (field) => {
    if (field.type === "text" || field.type === "number") {
      return (
        <input
          type={field.type}
          value={formData[field._id] || ""}
          onChange={(e) => handleFieldChange(field._id, e.target.value)}
        />
      );
    } else if (field.type === "radio" || field.type === "checkboxes") {
      return (
        <>
          {field.answerOptions.map((option, index) => (
            <label key={index}>
              <input
                type={field.type}
                name={field._id}
                value={option}
                checked={formData[field._id] === option}
                onChange={(e) => handleFieldChange(field._id, e.target.value)}
              />
              {option}
            </label>
          ))}
        </>
      );
    } else {
      // If the field type is not recognized, show unknown field message
      return <p>Unknown field type: {field.type}</p>;
    }
  };

  return (
    <div>
      {form ? (
        <>
          <h2>{form.name}</h2>
          {form.fields.map((field, index) => (
            <div key={index}>
              <h3>{field.question}</h3>
              {renderField(field)}
            </div>
          ))}
          <button onClick={handleSubmitForm}>Submit</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViewForm;
