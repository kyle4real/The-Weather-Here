if ("geolocation" in navigator) {
    console.log("geolocation available");
    navigator.geolocation.getCurrentPosition(async (position) => {
        let lat, lon, weather, aq;
        try {
            lat = position.coords.latitude.toFixed(2);
            lon = position.coords.longitude.toFixed(2);

            const api_url = `/weather/${lat},${lon}`;
            const api_response = await fetch(api_url);
            const api_json = await api_response.json();

            weather = api_json.weather;

            document.getElementById("coords").textContent = `${lat}°, ${lon}°`;
            document.getElementById("location").textContent = weather.name;
            document.getElementById("summary").textContent = weather.weather[0].main;
            document.getElementById("temperature").textContent = weather.main.temp.toFixed(0);

            aq = api_json.air_quality.results[0].measurements[0];

            document.getElementById("aq_parameter").textContent = aq.parameter;
            document.getElementById("aq_value").textContent = aq.value;
            document.getElementById("aq_units").textContent = aq.unit;
            document.getElementById("aq_date").textContent = aq.lastUpdated;
        } catch (error) {
            console.log("something went wrong!");
            console.error(error);

            aq = { value: -1 };
            document.getElementById("aq_parameter").textContent = "";
            document.getElementById("aq_value").textContent = ` No air quality reading.`;
            document.getElementById("aq_units").textContent = "";
            document.getElementById("aq_date").textContent = "";
        }
        const data = { lat, lon, weather, aq };
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        const db_response = await fetch("/api", options);
        const db_json = await db_response.json();
        console.log(db_json);
    });
} else {
    console.log("geolocation not available");
}
