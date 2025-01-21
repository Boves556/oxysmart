document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "http://127.0.0.1:8000";
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("Please log in to access your profile.");
    window.location.href = "/login";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const userData = await response.json();

      document.getElementById("user-name").textContent = userData.name || "N/A";
      document.getElementById("user-age").textContent = userData.age || "N/A";
      document.getElementById("user-height").textContent = userData.height
        ? `${userData.height} cm`
        : "N/A";
      document.getElementById("user-weight").textContent = userData.weight
        ? `${userData.weight} kg`
        : "N/A";
    } else if (response.status === 401) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    } else {
      alert("Failed to fetch user info. Please try again.");
      console.error("Failed to fetch user info:", await response.json());
    }
  } catch (error) {
    console.error("An error occurred while fetching user info:", error);
    alert("An error occurred. Please log in again.");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  }
});
