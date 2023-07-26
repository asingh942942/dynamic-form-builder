import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewResponses = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const response = await axios.get(`/api/form/${formId}/responses`);
      setResponses(response.data.responses);
    } catch (error) {
      console.error("Error fetching responses:", error);
    }
  };

  return (
    <div>
      <h2>View Responses</h2>
      {responses.map((response, index) => (
        <div
          key={index}
          style={{ border: "1px solid black", padding: "10px", margin: "10px" }}
        >
          <h3>Response {index + 1}</h3>
          <pre>{JSON.stringify(response.formData, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
};

export default ViewResponses;
