import React from "react";
import AddField from "./AddField";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";

const EditForm = () => {
  const { formId } = useParams();

  return (
    <>
      <Navbar />
      <div>
        <AddField currentForm={formId} />
      </div>
    </>
  );
};

export default EditForm;
