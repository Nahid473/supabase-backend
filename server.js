const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("SUPABASE_URL or SUPABASE_KEY is missing.");
  process.exit(1);
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// Home / health check
app.get("/", (req, res) => {
  res.json({
    message: "Supabase backend is working!",
    status: "online"
  });
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*");

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Add a user
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "name and email are required"
      });
    }

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: name,
          email: email
        }
      ])
      .select();

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    res.status(201).json({
      message: "User added successfully",
      user: data[0]
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
