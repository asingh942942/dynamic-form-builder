import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { Card, Grid } from "@mui/material";

const AddField = ({ currentForm }) => {
  const [question, setQuestion] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [numOptions, setNumOptions] = useState(0);
  const [options, setOptions] = useState([]);
  const [fields, setFields] = useState([]);
  const [fetchedFields, setFetchedFields] = useState([]);
  const [formName, setFormName] = useState("");

  const getFields = async () => {
    try {
      const response = await axios.get(`/api/fields/${currentForm}`);
      setFormName(response.data.formName);
      setFetchedFields(response.data.formData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFields();
  }, []);

  const handleAddField = () => {
    if (question.trim() === "") {
      return; // Do not add empty questions
    }

    if (fieldType === "text" || fieldType === "number") {
      // Add text or number field
      const newField = {
        question,
        type: fieldType,
      };
      setFields([...fields, newField]);
    } else {
      // Add radio or checkboxes field
      const newField = {
        question,
        type: fieldType,
        answerOptions: options,
      };
      setFields([...fields, newField]);
    }

    // Reset the input values
    setQuestion("");
    setFieldType("");
    setNumOptions(0);
    setOptions([]);
  };

  const handleFieldTypeChange = (e) => {
    const selectedFieldType = e.target.value;
    setFieldType(selectedFieldType);

    if (selectedFieldType === "radio" || selectedFieldType === "checkbox") {
      setShowOptionsPopup(true);
    } else {
      setShowOptionsPopup(false);
    }
  };

  const handleNumOptionsChange = (e) => {
    const num = parseInt(e.target.value);
    setNumOptions(num);

    // Generate initial options array with empty values
    const initialOptions = Array(num).fill("");
    setOptions(initialOptions);
  };

  const handleOptionChange = (e, index) => {
    const updatedOptions = [...options];
    updatedOptions[index] = e.target.value;
    setOptions(updatedOptions);
  };

  const handleSubmitForm = async () => {
    try {
      // Send a POST request to add the form fields
      const response = await axios.post(`/api/addfields/${currentForm}`, {
        fields,
      });

      // Reset the form fields
      setFields([]);

      console.log(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const renderFieldForm = () => {
    if (fieldType === "text" || fieldType === "number") {
      return (
        <div className="form-content">
          <h2>{formName}</h2>
          <label>
            Question:
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </label>
          <button onClick={handleAddField}>Add Field</button>
        </div>
      );
    } else {
      return (
        <div className="form-content">
          <h2>{formName}</h2>
          <label>
            Question:
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </label>
          <div className="options-popup">
            <h3>Options</h3>
            <label>
              Number of Options:
              <input
                type="number"
                value={numOptions}
                onChange={handleNumOptionsChange}
              />
            </label>
            {options.map((option, index) => (
              <label key={index}>
                Option {index + 1}:
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(e, index)}
                />
              </label>
            ))}
            <button onClick={handleAddField}>Add Field</button>
          </div>
        </div>
      );
    }
  };

  const handleDeleteField = async (fieldId) => {
    try {
      // Send a DELETE request to delete the form with the specified ID
      await axios.delete(`/api/field/${currentForm}/${fieldId}`);

      console.log(fieldId);

      // Refetch the forms to update the list after deletion
      getFields();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <div className="sidebar">
            {renderFieldForm()}
            <h3>Options</h3>
            <ul>
              <li>
                <input
                  type="radio"
                  name="fieldType"
                  value="text"
                  checked={fieldType === "text"}
                  onChange={handleFieldTypeChange}
                />
                Text
              </li>
              <li>
                <input
                  type="radio"
                  name="fieldType"
                  value="radio"
                  checked={fieldType === "radio"}
                  onChange={handleFieldTypeChange}
                />
                Radio
              </li>
              <li>
                <input
                  type="radio"
                  name="fieldType"
                  value="checkbox"
                  checked={fieldType === "checkbox"}
                  onChange={handleFieldTypeChange}
                />
                Checkbox
              </li>
              <li>
                <input
                  type="radio"
                  name="fieldType"
                  value="number"
                  checked={fieldType === "number"}
                  onChange={handleFieldTypeChange}
                />
                Number
              </li>
            </ul>
            {showOptionsPopup && (
              <button onClick={handleAddField}>Add Field</button>
            )}
            {!showOptionsPopup && (
              <button onClick={handleSubmitForm}>Submit Form</button>
            )}
          </div>
        </Grid>
        <Grid item xs={12} md={9} container>
          <div className="field-form">
            {fields.length > 0 && (
              <div className="fields-list">
                <Grid item xs={12}>
                  <h3>Fields:</h3>
                </Grid>
                <ul>
                  {fields.map((field, index) => (
                    <Grid key={index} item xs={12}>
                      <Card>
                        <h3>{field.question}</h3>
                        {field.answerOptions && (
                          <ul>
                            {field.answerOptions.map((option, i) => (
                              <li key={i}>{option}</li>
                            ))}
                          </ul>
                        )}
                      </Card>
                    </Grid>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="current-form-fields">
            {/* Display the fetched fields data */}
            <h3>Fetched Fields:</h3>
            <ul>
              {fetchedFields.map((field, index) => (
                <li key={index}>
                  <h3>{field.question}</h3>
                  {field.answerOptions && (
                    <ul>
                      {field.answerOptions.map((option, i) => (
                        <li key={i}>{option}</li>
                      ))}
                    </ul>
                  )}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteField(field._id)}
                  >
                    Delete Field
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default AddField;
