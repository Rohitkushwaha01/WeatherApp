const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const ipApiUrl = "https://api.ipfind.com/me?auth=YOUR-API-KEY"
  https.get(ipApiUrl, function(response){
    response.on("data", function(data){
      const ipData = JSON.parse(data);
      const ipcity = ipData.city;
      console.log(ipcity)
      weatherhttp(req, res, ipcity);
    })
  })
});

app.post("/", (req, res) => {
  const data = req.body.city
  weatherhttp(req, res, data);
});


function weatherhttp(req, res, data){
  const cityName = data;
  const apikey = "YOUR-API-KEY";
  const units = "metric";
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    apikey +
    "&units=" +
    units;

  https.get(apiUrl, function (response) {
    if (response.statusCode === 200) {
      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        const Temp = weatherData.main.temp;
        const minTemp = weatherData.main.temp_min;
        const maxTemp = weatherData.main.temp_max;
        const Windspeed = weatherData.wind.speed;
        const Pressure = weatherData.main.pressure;
        const Humidity = weatherData.main.humidity;
        const Visibility = weatherData.visibility;
        const weatherStatus = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const iconUrl = "http://openweathermap.org/img/wn/"+ icon +"@2x.png"

        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fullDate = date.toLocaleDateString('en-US', options);

        res.render("weather", {
          city: cityName,
          temperature: Temp,
          icon: iconUrl,
          speed:Windspeed,
          pressure:Pressure,
          humidity:Humidity,
          visibility: Visibility,
          weatherstatus: weatherStatus,
          currentdate: fullDate,
          mintemp: minTemp,
          maxtemp: maxTemp
        });
      });
    } else {
      res.write("404 Error");
    }
  });
}

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
