// Define the API URL for fetching data
const API_URL = "http://127.0.0.1:8000";
let intervalId;

// Track previous values to avoid redundant logging
let previousSteps = 0;
let previousCalories = 0;

// Function to check if a user is logged in
function isUserLoggedIn() {
  const token = localStorage.getItem("accessToken");
  return !!token;
}

// Select elements
const stepsElement = document.getElementById("current-steps");
const caloriesElement = document.getElementById("current-calories");

async function checkTokenAndRefresh() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    window.location.href = "/login";
    return;
  }
}

async function initializeUserData() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.warn("User is not logged in.");
    return;
  }

  try {
    // Fetch steps for the current day
    const stepsResponse = await fetch(`${API_URL}/steps/current-day`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const caloriesResponse = await fetch(`${API_URL}/calories/current-day`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (stepsResponse.ok && caloriesResponse.ok) {
      const stepsData = await stepsResponse.json();
      const caloriesData = await caloriesResponse.json();
      previousSteps = stepsData.steps || 0;
      previousCalories = caloriesData.calories || 0;

      // Update UI with initial values
      stepsElement.textContent = previousSteps.toLocaleString();
      caloriesElement.textContent = previousCalories.toFixed(2);
      console.log("Initialized user data:", {
        previousSteps,
        previousCalories,
      });
    } else {
      console.error("Failed to initialize user data.");
    }
  } catch (error) {
    console.error("Error initializing user data:", error);
  }
}

// Fetch and populate bar chart data
async function fetchBarChartData(endpoint, elementId, yAxisMax, yAxisStep) {
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`Failed to fetch data from ${endpoint}`);

    const data = await response.json();
    const transformedData = data.map((item) => ({
      label: new Date(item.timestamp).toLocaleTimeString(),
      value: item.value,
    }));

    drawBarChart(transformedData, elementId, yAxisMax, yAxisStep);
  } catch (error) {
    console.error(`Error fetching bar chart data for ${endpoint}:`, error);
  }
}

// Function to update steps and calories on the page
async function updateStepsAndCalories() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.warn("User is not logged in.");
    return;
  }
  try {
    const response = await fetch(`${API_URL}/data/steps-calories`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok)
      throw new Error("Failed to fetch steps and calories data.");

    const { steps, calories } = await response.json();

    // Update steps and calories on the page
    stepsElement.textContent = steps.toLocaleString();
    caloriesElement.textContent = calories.toFixed(2);
  } catch (error) {
    console.error("Error updating steps and calories:", error);
  }
}

async function sendStepsToBackend(steps) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.warn("User is not logged in.");
    return;
  }
  try {
    const response = await fetch(`${API_URL}/steps/data-visualization`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ step_count: steps }),
    });

    if (!response.ok) {
      throw new Error("Failed to log steps to backend.");
    }

    console.log("Steps logged successfully.");
  } catch (error) {
    console.error("Error sending steps to backend:", error);
  }
}

async function sendCaloriesToBackend(calories) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.warn("User is not logged in.");
    return;
  }
  try {
    const response = await fetch(`${API_URL}/calories/data-visualization`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ calories_burned: calories }),
    });

    if (!response.ok) {
      throw new Error("Failed to log calories to backend.");
    }

    console.log("Calories logged successfully.");
  } catch (error) {
    console.error("Error sending calories to backend:", error);
  }
}

// Fetch Arduino data and update the monitor
async function fetchArduinoData() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.warn("User is not logged in.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/arduino/data`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch Arduino data.");

    const data = await response.json();
    document.getElementById("current-steps").innerText = data.steps;
    document.getElementById("current-calories").innerText =
      data.calories.toFixed(2);

    // Log only when steps or calories increase
    if (data.steps > previousSteps) {
      await sendStepsToBackend(data.steps);
      previousSteps = data.steps;
    }

    if (data.calories > previousCalories) {
      await sendCaloriesToBackend(data.calories);
      previousCalories = data.calories;
    }
  } catch (error) {
    console.error("Error fetching Arduino data:", error);
    document.getElementById("current-steps").innerText = "Error";
    document.getElementById("current-calories").innerText = "Error";
  }
}

let currentEndAngle = 0;
// Update the circular graph for steps
async function updateCircularGraph() {
  try {
    const response = await fetch(`${API_URL}/api/v1/arduino/data`);
    if (!response.ok) throw new Error("Failed to fetch Arduino data.");

    const { steps, max_steps = 100 } = await response.json();

    const radius = 90;
    const svg = d3
      .select("#steps-circle-container")
      .html("") // Clear previous graph
      .append("svg")
      .attr("width", 200)
      .attr("height", 200)
      .append("g")
      .attr("transform", "translate(100, 100)");

    const backgroundArc = d3
      .arc()
      .innerRadius(70)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    svg.append("path").attr("d", backgroundArc).attr("fill", "#ddd");

    const progressArc = d3
      .arc()
      .innerRadius(70)
      .outerRadius(radius)
      .startAngle(0);

    const progressPath = svg
      .append("path")
      .datum({ endAngle: 0 })
      .attr("d", progressArc)
      .attr("fill", "#00f");

    const targetEndAngle = (steps / max_steps) * 2 * Math.PI;

    progressPath
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate(
          d.endAngle,
          (steps / max_steps) * 2 * Math.PI
        );
        return function (t) {
          d.endAngle = interpolate(t);
          return progressArc(d);
        };
      });

    currentEndAngle = targetEndAngle;

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .text(`${steps} / ${max_steps}`);
  } catch (error) {
    console.error("Error updating circular graph:", error);
  }
}

// Draw a bar chart
function drawBarChart(data, elementId, yAxisMax, yAxisStep) {
  const width = 400; // Adjust for better spacing
  const height = 300;
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };

  const svg = d3
    .select(`#${elementId}`)
    .html("") // Clear existing chart
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.label))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, yAxisMax])
    .range([height - margin.bottom, margin.top]);

  const yTicks = d3.range(0, yAxisMax + yAxisStep, yAxisStep);

  const tooltip = d3
    .select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("border", "1px solid #ddd")
    .style("padding", "10px")
    .style("border-radius", "5px")
    .style("visibility", "hidden")
    .style("z-index", "10");

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale).tickValues(yTicks));

  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.label))
    .attr("y", (d) => yScale(d.value))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - margin.bottom - yScale(d.value))
    .attr("fill", "#00796b")
    .on("mouseover", (event, d) => {
      tooltip
        .html(`Time: ${d.label}<br>Value: ${d.value}`)
        .style("visibility", "visible");
    })
    .on("mousemove", (event) => {
      tooltip
        .style("top", `${event.pageY - 20}px`)
        .style("left", `${event.pageX + 10}px`);
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });
}

// Initialize the visualizations
function initializeVisualizations() {
  if (!isUserLoggedIn()) {
    console.warn("User is not logged in. Visualizations will not start.");
    return;
  }

  clearInterval(intervalId);

  // Fetch data for steps and calories bar charts
  fetchBarChartData("steps/data-history", "steps-bar-chart", 100, 10);
  fetchBarChartData("calories/data-history", "calories-bar-chart", 5, 1);

  intervalId = setInterval(() => {
    fetchArduinoData(); // Update the monitor
    updateCircularGraph(); // Update the circular graph
  }, 1000); // Poll every second
}

document.addEventListener("DOMContentLoaded", initializeVisualizations);
