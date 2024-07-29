// Mock data to simulate user authentication
let users = [];

let container = document.getElementById("container");

toggle = () => {
  container.classList.toggle("sign-in");
  container.classList.toggle("sign-up");
};

window.addEventListener("load", () => {
  container.classList.add("sign-in");
});

// Handle user registration
document
  .getElementById("register-button")
  .addEventListener("click", function () {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById(
      "register-confirm-password"
    ).value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Simulate signup process
    users.push({ username, password });
    alert("User registered successfully");
  });

// Handle user login
document.getElementById("login-button").addEventListener("click", function () {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  // Simulate login process
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    alert("Login successful");
    window.location.href = "dashboard.html"; // Redirect to dashboard on successful login
  } else {
    alert("Invalid username or password");
  }
});

// Mock social login buttons (Google and Facebook)
document.getElementById("google-signup").addEventListener("click", function () {
  alert("Google signup not implemented");
});

document
  .getElementById("facebook-signup")
  .addEventListener("click", function () {
    alert("Facebook signup not implemented");
  });

document.getElementById("google-login").addEventListener("click", function () {
  alert("Google login not implemented");
});

document
  .getElementById("facebook-login")
  .addEventListener("click", function () {
    alert("Facebook login not implemented");
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

document
  .getElementById("create-event-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("event-title").value;
    const description = document.getElementById("event-description").value;
    const date = document.getElementById("event-date").value;
    const time = document.getElementById("event-time").value;
    const location = document.getElementById("event-location").value;
    const price = document.getElementById("ticket-price").value;

    const response = await fetch("/create-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, date, time, location, price }),
    });

    const result = await response.json();
    alert(result.message);

    if (response.ok) {
      // Optionally, update the events list
      fetchEvents();
    }
  });

async function fetchEvents() {
  const response = await fetch("/events");
  const events = await response.json();

  const eventItems = document.getElementById("event-items");
  eventItems.innerHTML = "";

  events.forEach((event) => {
    const li = document.createElement("li");
    li.textContent = `${event.title} - ${event.date} - ${event.time} - ${event.location} - $${event.price}`;
    eventItems.appendChild(li);
  });
}

// Fetch events on page load
fetchEvents();
