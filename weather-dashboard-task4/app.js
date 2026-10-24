(() => {
  const form = document.querySelector("#form"), city = document.querySelector("#city");
  const submit = document.querySelector("#submit"), status = document.querySelector("#status");
  const results = document.querySelector("#results"), errorPanel = document.querySelector("#error");
  let lastCity = "New Delhi", requestId = 0;
  document.querySelector("#year").textContent = new Date().getFullYear();

  function describe(code) {
    if (code === 0) return ["Clear sky","☀"];
    if ([1,2].includes(code)) return ["Partly cloudy","🌤"];
    if (code === 3) return ["Overcast","☁"];
    if ([45,48].includes(code)) return ["Fog","🌫"];
    if ([51,53,55,56,57].includes(code)) return ["Drizzle","🌦"];
    if ([61,63,65,66,67,80,81,82].includes(code)) return ["Rain","🌧"];
    if ([71,73,75,77,85,86].includes(code)) return ["Snow","❄"];
    if ([95,96,99].includes(code)) return ["Thunderstorm","⛈"];
    return ["Mixed conditions","🌥"];
  }
  async function getJSON(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`The weather service returned an error (${response.status}).`);
    return response.json();
  }
  async function search(query) {
    query = query.trim();
    if (!query) { city.focus(); return; }
    const thisRequest = ++requestId;
    lastCity = query; submit.disabled = true; submit.textContent = "Searching…";
    status.hidden = false; status.textContent = `Searching weather for ${query}…`; errorPanel.hidden = true;
    try {
      const geo = new URL("https://geocoding-api.open-meteo.com/v1/search");
      geo.search = new URLSearchParams({name:query,count:"8",language:"en",format:"json"});
      const places = await getJSON(geo);
      if (thisRequest !== requestId) return;
      if (!places.results?.length) throw new Error(`No city named “${query}” was found. Check the spelling or try a nearby city.`);
      const place = places.results.find(p => p.feature_code === "PPLC") || places.results[0];
      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.search = new URLSearchParams({
        latitude:place.latitude,longitude:place.longitude,
        current:"temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
        daily:"weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
        forecast_days:"5",timezone:"auto"
      });
      const data = await getJSON(url);
      if (thisRequest !== requestId) return;
      render(place,data); results.hidden = false; status.textContent = `Weather loaded for ${place.name}.`;
    } catch (err) {
      if (thisRequest !== requestId) return;
      results.hidden = true; errorPanel.hidden = false;
      document.querySelector("#error-text").textContent = err instanceof TypeError
        ? "A network error occurred. Check your internet connection and try again."
        : (err.message || "Weather could not be loaded. Please try again.");
      status.textContent = "Weather could not be loaded.";
    } finally {
      if (thisRequest === requestId) { submit.disabled = false; submit.textContent = "Search ↗"; }
    }
  }
  function render(place,data) {
    const c = data.current, u = data.current_units, [desc,icon] = describe(c.weather_code);
    document.querySelector("#place").textContent = [place.name,place.admin1,place.country].filter((v,i,a)=>v&&a.indexOf(v)===i).join(", ");
    document.querySelector("#time").textContent = `Local time · ${c.time.replace("T"," ")}`;
    document.querySelector("#icon").textContent = icon;
    document.querySelector("#temp").textContent = `${Math.round(c.temperature_2m)}°`;
    document.querySelector("#condition").textContent = desc;
    document.querySelector("#feels").textContent = `Feels like ${Math.round(c.apparent_temperature)}${u.apparent_temperature}`;
    document.querySelector("#m-feels").textContent = `${Math.round(c.apparent_temperature)}${u.apparent_temperature}`;
    document.querySelector("#humidity").textContent = `${c.relative_humidity_2m}${u.relative_humidity_2m}`;
    document.querySelector("#wind").textContent = `${Math.round(c.wind_speed_10m)} ${u.wind_speed_10m}`;
    document.querySelector("#summary").textContent = c.is_day ? `It's ${desc.toLowerCase()} right now. Here's your local weather update.` : `It's ${desc.toLowerCase()} tonight. Here's your local weather update.`;
    const days = document.querySelector("#days"); days.replaceChildren();
    data.daily.time.forEach((date,i) => {
      const [condition,symbol] = describe(data.daily.weather_code[i]);
      const card = document.createElement("article"); card.className = "day";
      const heading = document.createElement("h3"); heading.textContent = i===0 ? "Today" : new Intl.DateTimeFormat(undefined,{weekday:"short"}).format(new Date(`${date}T12:00:00`));
      const iconEl = document.createElement("div"); iconEl.className = "ico"; iconEl.setAttribute("aria-hidden","true"); iconEl.textContent = symbol;
      const detail = document.createElement("p"); detail.textContent = condition;
      const temps = document.createElement("div"); temps.className = "temps";
      const high = document.createElement("span"); high.textContent = `${Math.round(data.daily.temperature_2m_max[i])}°`;
      const low = document.createElement("span"); low.textContent = `${Math.round(data.daily.temperature_2m_min[i])}°`;
      temps.append(high,low); card.append(heading,iconEl,detail,temps); days.append(card);
    });
    document.querySelector("#updated").textContent = `Data time: ${c.time.replace("T"," ")} · Temperatures in ${u.temperature_2m}.`;
  }
  form.addEventListener("submit",e=>{e.preventDefault();search(city.value);});
  document.querySelectorAll("[data-city]").forEach(b=>b.addEventListener("click",()=>{city.value=b.dataset.city;search(b.dataset.city);}));
  document.querySelector("#retry").addEventListener("click",()=>search(lastCity));
  search("New Delhi");
})();