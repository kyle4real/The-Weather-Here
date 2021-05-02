const express = require("express");
const Datastore = require("nedb");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`starting server at ${port}`);
});
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const database = new Datastore("database.db");
database.loadDatabase();

app.get("/api", (req, res) => {
    database.find({}, (err, data) => {
        if (err) {
            res.end();
            return;
        }
        res.json(data);
    });
});

app.post("/api", (req, res) => {
    const data = req.body;
    const timeStamp = Date.now();
    data.timeStamp = timeStamp;
    database.insert(data);
    res.json(data);
});

app.get("/weather/:latlon", async (req, res) => {
    const latlon = req.params.latlon.split(",");
    const lat = latlon[0];
    const lon = latlon[1];

    const api_key = process.env.API_KEY;
    const weather_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const aq_url = `http://api.openaq.org/v2/latest?coordinates=${lat},${lon}&radius=10000`; // &radius=10000
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    const data = {
        weather: weather_data,
        air_quality: aq_data,
    };
    res.json(data);
});
