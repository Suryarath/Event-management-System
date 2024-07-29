const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "event_management",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  console.log("Signup request received:", { username, password });

  const hash = bcrypt.hashSync(password, 10);
  console.log("Hashed password:", hash);

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hash],
    (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ message: "Error registering user" });
      }
      console.log("User registered:", result);
      res.status(200).json({ message: "User registered successfully" });
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Login request received:", { username, password });

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ message: "Error logging in" });
      }

      if (results.length > 0) {
        const user = results[0];
        console.log("User found:", user);
        if (bcrypt.compareSync(password, user.password)) {
          console.log("Password match");
          res.status(200).json({ message: "Login successful" });
        } else {
          console.log("Password mismatch");
          res.status(401).json({ message: "Invalid username or password" });
        }
      } else {
        console.log("User not found");
        res.status(401).json({ message: "Invalid username or password" });
      }
    }
  );
});

app.post("/create-event", (req, res) => {
  const { title, description, date, time, location, price } = req.body;

  const query =
    "INSERT INTO events (title, description, date, time, location, price) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [title, description, date, time, location, price],
    (err, result) => {
      if (err) {
        console.error("Error creating event:", err);
        return res.status(500).json({ message: "Error creating event" });
      }
      res.status(200).json({
        message: "Event created successfully",
        eventId: result.insertId,
      });
    }
  );
});

// Endpoint to fetch events (optional, for displaying the events list)
app.get("/events", (req, res) => {
  db.query("SELECT * FROM events", (err, results) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res.status(500).json({ message: "Error fetching events" });
    }
    res.status(200).json(results);
  });
});

app.listen(5500, () => {
  console.log("Server is running on port 5500");
});
