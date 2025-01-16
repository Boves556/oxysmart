document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const termsCheckbox = document.getElementById("terms-checkbox").checked;

  // Validate password strength
  if (!/[A-Z]/.test(password) || !/[\W_]/.test(password)) {
    alert(
      "Password must contain at least one uppercase letter and one special character."
    );
    return;
  }

  // Validate password match
  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return;
  }

  // Validate Terms and Conditions
  if (!termsCheckbox) {
    alert("You must agree to the Terms and Conditions to sign up.");
    return;
  }

  // Collect user input
  const data = {
    name: document.getElementById("name").value || null,
    age: parseInt(document.getElementById("age").value, 10) || null,
    height: parseFloat(document.getElementById("height").value) || null,
    weight: parseFloat(document.getElementById("weight").value) || null,
    email: document.getElementById("email").value,
    password,
  };

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    alert("Please enter a valid email address.");
    return;
  }

  try {
    // Send signup data to the backend
    const response = await fetch("http://127.0.0.1:8000/api/v1/users/signup", {
      method: "POST",
      headers: {
        Accept: "application/json", // Ensure server returns JSON
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Signup successful! Redirecting to login page...");
      window.location.href = "/login";
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.detail}`);
    }
  } catch (error) {
    console.error("Signup failed:", error);
    alert("An error occurred. Please try again.");
  }
});

// Toggle password visibility
document.getElementById("toggle-password").addEventListener("click", () => {
  const passwordInput = document.getElementById("password");
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  document.getElementById("toggle-password").textContent =
    type === "password" ? "Show" : "Hide";
});

// Toggle confirm password visibility
document
  .getElementById("toggle-confirm-password")
  .addEventListener("click", () => {
    const confirmPasswordInput = document.getElementById("confirm-password");
    const type = confirmPasswordInput.type === "password" ? "text" : "password";
    confirmPasswordInput.type = type;
    document.getElementById("toggle-confirm-password").textContent =
      type === "password" ? "Show" : "Hide";
  });
