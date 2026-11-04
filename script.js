const weatherContainer = document.querySelector("#weather");
const updatedLabel = document.querySelector("#weather-updated");
const refreshButton = document.querySelector("#refresh-weather");

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=51.1784&longitude=-115.5708&current=temperature_2m,apparent_temperature,wind_speed_10m&timezone=America%2FEdmonton";

const CACHE_KEY = "alberta-trails-weather";
const CACHE_DURATION = 10 * 60 * 1000;
let requestInProgress = null;

function showMessage(message) {
  // textContent prevents API or error text from being interpreted as HTML.
  weatherContainer.textContent = message;
}

function renderWeather(current) {
  const values = [
    ["Temperature", `${current.temperature_2m} °C`],
    ["Feels like", `${current.apparent_temperature} °C`],
    ["Wind speed", `${current.wind_speed_10m} km/h`]
  ];

  weatherContainer.replaceChildren();
  for (const [label, value] of values) {
    const item = document.createElement("div");
    item.className = "weather-item";

    const strong = document.createElement("strong");
    strong.textContent = value;

    const caption = document.createElement("span");
    caption.textContent = label;

    item.append(strong, caption);
    weatherContainer.append(item);
  }
}

function readCache() {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    return Date.now() - parsed.savedAt < CACHE_DURATION ? parsed.data : null;
  } catch {
    return null;
  }
}

function saveCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
      savedAt: Date.now(),
      data
    }));
  } catch {
    // Storage may be unavailable; the live request can still succeed.
  }
}

async function fetchWeather(forceRefresh = false) {
  if (requestInProgress) return requestInProgress;

  if (!forceRefresh) {
    const cached = readCache();
    if (cached) {
      renderWeather(cached.current);
      updatedLabel.textContent = "Showing recently cached data (up to 10 minutes old).";
      return;
    }
  }

  refreshButton.disabled = true;
  showMessage("Loading current weather…");

  requestInProgress = (async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(WEATHER_URL, {
        signal: controller.signal,
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error(`Weather service returned ${response.status}.`);
      }

      const data = await response.json();
      const current = data?.current;
      const required = ["temperature_2m", "apparent_temperature", "wind_speed_10m"];

      if (!current || !required.every((key) => Number.isFinite(current[key]))) {
        throw new Error("Weather service returned incomplete data.");
      }

      const safeCurrent = {
        temperature_2m: current.temperature_2m,
        apparent_temperature: current.apparent_temperature,
        wind_speed_10m: current.wind_speed_10m
      };

      renderWeather(safeCurrent);
      saveCache({ current: safeCurrent });
      updatedLabel.textContent = `Updated: ${new Date().toLocaleTimeString()}`;
    } catch (error) {
      const message = error.name === "AbortError"
        ? "Weather request timed out. Please try again."
        : "Live weather is temporarily unavailable. Check your connection and try again.";
      showMessage(message);
      updatedLabel.textContent = "";
    } finally {
      clearTimeout(timeoutId);
      refreshButton.disabled = false;
      requestInProgress = null;
    }
  })();

  return requestInProgress;
}

refreshButton.addEventListener("click", () => fetchWeather(true));
fetchWeather();
