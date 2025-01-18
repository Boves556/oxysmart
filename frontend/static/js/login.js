document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect input values as a plain JavaScript object
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Send the JSON payload
    const response = await fetch("http://127.0.0.1:8000/api/v1/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Ensure the payload is JSON
    });

    if (response.ok) {
      const { access_token } = await response.json();
      localStorage.setItem("accessToken", access_token);
      alert("Login successful!");
      window.location.href = "/dashboard"; // Redirect after successful login
    } else {
      const error = await response.json();
      alert(`Error: ${error.detail}`);
    }
  } catch (err) {
    console.error("Login failed:", err);
    alert("An error occurred. Please try again.");
  }
});

// Show password toggle functionality
document
  .getElementById("show-password")
  .addEventListener("change", function () {
    const passwordField = document.getElementById("password");
    passwordField.type = this.checked ? "text" : "password";
  });
