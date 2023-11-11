const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

// Set up the session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Connect to MongoDB using Mongoose
mongoose
  .connect(
    "mongodb+srv://bluesky:findatlas@cluster0.tbqhse0.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((e) => console.log(e));

// User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Form Schema
const formSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  fields: [
    {
      question: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      answerOptions: {
        type: [String],
      },
    },
  ],
});

// Response Schema
const responseSchema = new mongoose.Schema({
  form_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  formData: [
    {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  ],
});

// Form Model
const Form = mongoose.model("Form", formSchema);

// Response Model
const Response = mongoose.model("Response", responseSchema);

// User Model
const User = mongoose.model("User", userSchema);

app.get("/api/check-auth", (req, res) => {
  // Logic to check the user's authentication status
  if (req.session.userId) {
    // User is authenticated
    res.json({
      isLoggedIn: true,
    });
  } else {
    // User is not authenticated
    res.json({ isLoggedIn: false });
  }
});

// Register user route
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Set the user ID in the session
    req.session.userId = user._id;

    res.status(200).json({
      message: "User logged in successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Logout route
app.post("/api/logout", (req, res) => {
  // Destroy the session
  req.session.destroy();

  res.status(200).json({ message: "User logged out successfully" });
});

// Get forms route
app.get("/api/forms", async (req, res) => {
  try {
    const userId = req.session.userId; // Assuming you have user authentication and the user ID is stored in the session

    // Query forms associated with the current user's ID
    const forms = await Form.find({ user_id: userId });

    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Get route to fetch a form by its ID
app.get("/api/form/:formId", async (req, res) => {
  const formId = req.params.formId;

  try {
    // Query the form using the provided formId
    const form = await Form.findById(formId);

    if (!form) {
      // If no form is found with the given ID, return a 404 status code
      return res.status(404).json({ message: "Form not found" });
    }

    // If the form is found, return it as the response
    res.json(form);
  } catch (error) {
    // Handle any errors that occur during the query
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Post forms route
app.post("/api/form", async (req, res) => {
  try {
    const { name } = req.body;

    // Create a new form instance
    const newForm = new Form({
      user_id: req.session.userId, // Get logged in user's session id
      name,
      fields: [],
    });

    // Save the form to the database
    const savedForm = await newForm.save();

    res.status(201).json(savedForm);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Delete route to delete a form by ID
app.delete("/api/form/:formId", async (req, res) => {
  const formId = req.params.formId;
  try {
    // Assuming you have the Form schema defined in Mongoose
    await Form.findByIdAndRemove(formId);
    res.json({ message: "Form deleted successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the form" });
  }
});

// Add form fields route using formId as parameter
app.post("/api/addfields/:formId", async (req, res) => {
  try {
    const { formId } = req.params;
    const { fields } = req.body;

    // Find the form by ID
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Get the current fields in the form
    const currentFields = form.fields;

    // Update the form's fields
    form.fields = [...currentFields, ...fields];
    await form.save();

    // Send the updated form with the new fields to the frontend
    res.json({ message: "Fields added successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Get form fields route using formId as parameter
app.get("/api/fields/:formId", async (req, res) => {
  try {
    const { formId } = req.params;

    // Find the form by ID
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Get the current fields in the form
    const currentFields = form.fields;

    // Send the updated form with the new fields to the frontend
    res.json({ formName: form.name, formData: currentFields });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Delete form field using formId and fieldId
app.delete("/api/field/:formId/:fieldId", async (req, res) => {
  try {
    const formId = req.params.formId;
    const fieldId = req.params.fieldId;

    // Find the form in the database by its ID
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Find the field to be deleted by its ID and remove it from the form's fields array
    form.fields = form.fields.filter(
      (field) => field._id.toString() !== fieldId
    );

    // Save the updated form in the database
    await form.save();

    res.json({ message: "Field deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Post response data
app.post("/api/response", async (req, res) => {
  try {
    const { formId, formData } = req.body;

    // Check if the formId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({ message: "Invalid formId" });
    }

    // Create a new response document in the Response schema
    const response = new Response({
      form_id: formId,
      formData: formData,
    });

    // Save the response data to the database
    await response.save();

    return res.status(201).json({ message: "Form data saved successfully" });
  } catch (error) {
    console.error("Error saving form data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get all responses based on formId
app.get("/api/form/:formId/responses", async (req, res) => {
  try {
    const formId = req.params.formId;

    // Check if the formId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({ message: "Invalid formId" });
    }

    // Find all responses that have the specified form_id
    const responses = await Response.find({ form_id: formId });

    return res.status(200).json({ responses });
  } catch (error) {
    console.error("Error fetching responses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
const port = 8000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
