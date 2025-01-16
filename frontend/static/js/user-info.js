document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "http://127.0.0.1:8000"; // Backend API base URL
  const token = localStorage.getItem("accessToken");

  // Redirect to login if no token is found
  if (!token) {
    alert("Please log in to access your profile.");
    window.location.href = "/login";
    return;
  }

  try {
    // Fetch user info from the backend
    const response = await fetch(`${API_URL}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const userData = await response.json();

      // Update UI with user info
      document.getElementById("user-name").textContent = userData.name || "N/A";
      document.getElementById("user-age").textContent = userData.age || "N/A";
      document.getElementById("user-height").textContent = userData.height
        ? `${userData.height} cm`
        : "N/A";
      document.getElementById("user-weight").textContent = userData.weight
        ? `${userData.weight} kg`
        : "N/A";
    } else if (response.status === 401) {
      // Handle unauthorized access
      alert("Session expired. Please log in again.");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    } else {
      // Handle other errors
      alert("Failed to fetch user info. Please try again.");
      console.error("Failed to fetch user info:", await response.json());
    }
  } catch (error) {
    // Handle network or other errors
    console.error("An error occurred while fetching user info:", error);
    alert("An error occurred. Please log in again.");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  }
});
