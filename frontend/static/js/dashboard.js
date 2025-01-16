const API_URL = "http://127.0.0.1:8000"; // Backend API base URL

document.addEventListener("DOMContentLoaded", function () {
  // Handle checklist submission
  const checklistSubmitButton = document.getElementById("checklist-submit");
  const checklistItems = document.querySelectorAll(
    '#checklist input[type="checkbox"]'
  );
  const checklistMessage = document.createElement("p");
  const checklistSection = document.getElementById("hiking-checklist");

  checklistSubmitButton.addEventListener("click", function () {
    let missingItems = [];

    checklistItems.forEach((item) => {
      if (!item.checked) {
        missingItems.push(item.id);
      }
    });

    if (missingItems.length > 0) {
      checklistMessage.textContent = `You may want to add these items: ${missingItems.join(
        ", "
      )}.`;
      checklistMessage.style.color = "red";
    } else {
      checklistMessage.textContent =
        "Your checklist is complete! You are ready for your hike!";
      checklistMessage.style.color = "green";
    }

    // Append the message below the button
    checklistSection.appendChild(checklistMessage);
  });

  // Fun facts section
  const factElement = document.getElementById("fact");

  function fetchFunFacts() {
    const localFunFacts = getLocalFunFacts();
    if (localFunFacts.length > 0) {
      setupFunFacts(localFunFacts);
    } else {
      factElement.textContent = "No fun facts available.";
      factElement.style.color = "red";
    }
  }

  function setupFunFacts(funFacts) {
    let shuffledFacts = shuffleArray([...funFacts]); // Start with a shuffled copy of funFacts
    let currentFactIndex = 0;

    function updateFunFact() {
      factElement.textContent = shuffledFacts[currentFactIndex];
      factElement.style.color = "green"; // Set the text color to green for fun
      currentFactIndex++;

      // If we reach the end of the shuffled list, reshuffle and restart
      if (currentFactIndex >= shuffledFacts.length) {
        shuffledFacts = shuffleArray([...funFacts]);
        currentFactIndex = 0;
      }
    }

    // Show the first fact immediately and update every 5 seconds
    updateFunFact();
    setInterval(updateFunFact, 5000);
  }

  function getLocalFunFacts() {
    return [
      "Hiking can boost your mood and reduce stress!",
      "Spending time outdoors improves mental clarity and focus!",
      "Hiking strengthens your muscles and improves cardiovascular health.",
      "Drinking water before you feel thirsty is essential for hydration.",
      "A first aid kit is an essential item for every hike.",
      "The best time to hike is early in the morning or late afternoon.",
      "Always check the weather forecast before heading out on a hike.",
      "You burn up to 500 calories per hour while hiking!",
      "Staying hydrated improves endurance on long hikes!",
      "The highest hiking trail in the world is in Nepal, at over 5,000 meters!",
      "A whistle can be a lifesaver in emergencies.",
      "Proper footwear reduces the risk of injuries.",
      "Layering clothes helps regulate your body temperature.",
    ];
  }

  // Utility function to shuffle an array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Checklist data
  const checklistData = [
    { id: "first-aid", name: "First Aid Kit", checked: true },
    { id: "flashlight", name: "Flashlight", checked: false },
    { id: "water-bottle", name: "Water Bottle", checked: true },
    { id: "map", name: "Map", checked: false },
    { id: "snacks", name: "Snacks", checked: false },
  ];

  // Populate the checklist using the predefined data
  populateChecklist(checklistData);

  function populateChecklist(checklistData) {
    const checklist = document.getElementById("checklist");
    checklist.innerHTML = ""; // Clear existing items
    checklistData.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<input type="checkbox" id="${item.id}" ${
        item.checked ? "checked" : ""
      } /> ${item.name}`;
      checklist.appendChild(li);
    });
  }

  // Handle logout
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("userId"); // Clear user session
      window.location.href = "/login"; // Redirect to login page
    });
  }

  // Initialize the dashboard
  fetchFunFacts(); // Initialize fun facts
});
