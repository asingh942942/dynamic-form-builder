import React, { useState } from "react";
import axios from "axios";
import { Fab, Box, Button, Modal, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const AddForm = () => {
  const [formName, setFormName] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to add a new form
      const response = await axios.post("/api/form", { name: formName });
      console.log(response.data);

      // Close the modal and reset the form name
      handleClose();
      setFormName("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Fab
        color="primary"
        aria-label="add"
        variant="contained"
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>
      {
        <Modal open={open} onClose={handleClose}>
          <form className="modal" onSubmit={handleFormSubmit}>
            <Box>
              <TextField
                variant="outlined"
                type="text"
                value={formName}
                label="Form Name"
                onChange={(e) => setFormName(e.target.value)}
              />
            </Box>
            <Button type="submit">Submit</Button>
          </form>
        </Modal>
      }
    </div>
  );
};

export default AddForm;
