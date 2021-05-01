const mymap = L.map("theMap").setView([0, 0], 1);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

getData();

async function getData() {
    const response = await fetch("/api");
    const data = await response.json();

    const sortedData = data.sort((a, b) => {
        return b.timeStamp - a.timeStamp;
    });

    const container = document.getElementById("logs");
    for (item of sortedData) {
        const marker = L.marker([item.lat, item.lon]).addTo(mymap);
        let txt = `${item.weather.name} (${item.lat}°, ${item.lon}°) is currently
        ${item.weather.weather[0].main} with a temperature of
        ${item.weather.main.temp.toFixed(0)}°F.`;
        if (item.aq.value < 0) {
            txt += ` No air quality reading.`;
        } else {
            txt += ` The concentration of particle matter
            (${item.aq.parameter}) is ${item.aq.value}
            ${item.aq.unit}, last read on ${item.aq.lastUpdated}.`;
        }

        marker.bindPopup(txt);

        const root = document.createElement("p");
        root.setAttribute("class", "alert-primary");
        const coords = document.createElement("h5");
        const date = document.createElement("h6");
        const description = document.createElement("p");

        coords.textContent = `${item.weather.name} (${item.lat}°, ${item.lon}°)`;
        const dateString = new Date(item.timeStamp).toLocaleString();
        date.textContent = dateString;
        description.textContent = txt;

        root.append(coords, date, description);
        container.append(root);
    }
}
