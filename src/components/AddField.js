import React, { useState } from "react";
import axios from "axios";

const AddField = ({ currentForm }) => {
  const [question, setQuestion] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [numOptions, setNumOptions] = useState(0);
  const [options, setOptions] = useState([]);
  const [fields, setFields] = useState([]);

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

    if (selectedFieldType === "radio" || selectedFieldType === "checkboxes") {
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

      console.log(response.data.formdata);
    } catch (error) {
      console.error(error);
    }
  };

  const renderFieldForm = () => {
    if (fieldType === "text" || fieldType === "number") {
      return (
        <div className="form-content">
          <h2>Field Form</h2>
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
          <h2>Field Form</h2>
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

  return (
    <div className="field-form">
      <div className="sidebar">
        <h2>Options</h2>
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
              value="checkboxes"
              checked={fieldType === "checkboxes"}
              onChange={handleFieldTypeChange}
            />
            Checkboxes
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
      {renderFieldForm()}
      {fields.length > 0 && (
        <div className="fields-list">
          <h2>Fields:</h2>
          <ul>
            {fields.map((field, index) => (
              <li key={index}>
                <h3>{field.question}</h3>
                {field.answerOptions && (
                  <ul>
                    {field.answerOptions.map((option, i) => (
                      <li key={i}>{option}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddField;
