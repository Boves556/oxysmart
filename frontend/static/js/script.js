document.addEventListener("DOMContentLoaded", () => {
  console.log("Steps and Calories Tracker is working!");

  const API_URL = "http://127.0.0.1:8000";

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      alert("You have been logged out.");
      window.location.href = "/login";
    });
  }
});
