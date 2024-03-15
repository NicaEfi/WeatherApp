/* Declarations for selecting DOM elements */

// Selecting various elements from the DOM for manipulation
const app = document.querySelector('.weather-app'); // Main weather application container
const temp = document.querySelector('.temp'); // Temperature display
const dateOutput = document.querySelector('.date'); // Date display
const timeOutput = document.querySelector('.time'); // Time display
const conditionOutput = document.querySelector('.condition'); // Current weather condition display
const nameOutput = document.querySelector('.name'); // Name of the city
const icon = document.querySelector('.icon'); // Weather condition icon
const cloudOutput = document.querySelector('.cloud'); // Cloud coverage display
const humidityOutput = document.querySelector('.humidity'); // Humidity display
const windOutput = document.querySelector('.wind'); // Wind speed display
const form = document.getElementById('locationInput'); // Form for location input
const search = document.querySelector('.search'); // Search input field
const btn = document.querySelector('.submit'); // Submit button for search
const cities = document.querySelectorAll('.city'); // List of cities for selection

/* Variable for the user-entered city */
let cityInput = "Bucharest"; // Default city set to Bucharest

/* Adding click event for each city in the list */
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData(); // Calling the function to fetch weather data for the selected city
        app.style.opacity = '0'; // Setting the opacity of the main container to 0
    });
})

/* Adding submit event for the search form */
form.addEventListener('submit', (e) => {
    if(search.value.length == 0) {
        alert('Please type in a city name'); // Displaying an alert if the search field is empty
    } else {
        cityInput = search.value;
        fetchWeatherData(); // Calling the function to fetch weather data for the entered city
        search.value = ""; // Resetting the value of the search field
        app.style.opacity = "0"; // Setting the opacity of the main container to 0
    }

    e.preventDefault(); // Preventing form submission
});

/* Function to determine the day of the week */
function dayOfTheWeek(day, month, year)
{
    const weekday = [ 
        'Friday',
        'Saturday', 
        'Sunday', 
        'Monday', 
        'Tuesday', 
        'Wednesday',
        'Thursday'
    ];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
};

/* Function to fetch weather data */
function fetchWeatherData() {
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=1dea9d3eac574037984160525222912&q=${cityInput}&days=7`)
    .then(response => response.json())
    .then(data => {
        console.log(data); // Logging data to console for debugging

        // Displaying current temperature and condition
        temp.innerHTML = data.current.temp_c + "&#176;";
        conditionOutput.innerHTML = data.current.condition.text;

        // Displaying current date and time
        const localDate = new Date(data.location.localtime);
        dateOutput.innerHTML = `${localDate.toDateString()}`;
        timeOutput.innerHTML = `${localDate.toLocaleTimeString()}`;

        // Displaying the name of the city
        nameOutput.innerHTML = data.location.name;

        // Displaying the icon for the current condition
        const iconUrl = data.current.condition.icon;
        icon.src = iconUrl;

        // Displaying other weather details
        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        // Determining the time of day and setting the background accordingly
        let timeOfDay = data.current.is_day ? "day" : "night";
        const code = data.current.condition.code;
        setBackgroundBasedOnWeather(code, timeOfDay);

        // Displaying the weekly forecast 
        const weeklyForecastData = data.forecast.forecastday;
        showWeeklyForecast(weeklyForecastData);

        app.style.opacity = "1"; // Setting the opacity of the main container to 1
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
        alert('City not found, please try again'); // Alerting user if city is not found
        app.style.opacity = "1"; // Setting the opacity of the main container to 1
    });
}


// Function to set background based on weather conditions
function setBackgroundBasedOnWeather(code, timeOfDay) {
  // Setting background image and button background based on weather code and time of day
  if (code == 1000) {
      app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
      btn.style.background = "url(./images/magnifying-glass.gif)";
  } else if (code == 1003 || code == 1006 || code == 1009 || code == 1030 || code == 1069 || code == 1087 || code == 1135 || code == 1273 || code == 1276 || code == 1279 || code == 1282) {
      app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
      btn.style.background = "url(./images/magnifying-glass.gif)";
  } else if (code == 1063 || code == 1069 || code == 1072 || code == 1150 || code == 1153 || code == 1180 || code == 1183 || code == 1186 || code == 1189 || code == 1192 || code == 1195 || code == 1204 || code == 1207 || code == 1240 || code == 1243 || code == 1246 || code == 1249 || code == 1252) {
      app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
      btn.style.background = "url(./images/magnifying-glass.gif)";
  } else {
      app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
      btn.style.background = "url(./images/magnifying-glass.gif)";
  }
}

// Function to show weekly forecast
function showWeeklyForecast(weeklyForecastData) {
  const weeklyForecastElement = document.querySelector('.weather-forecast');

  // Clearing existing elements from .weather-forecast
  weeklyForecastElement.innerHTML = '';

  // Looping through each day's forecast data and creating forecast items
  weeklyForecastData.forEach(day => {
      const forecastItem = document.createElement('div');
      forecastItem.classList.add('weather-forecast-item');

      // Creating HTML structure for each forecast item
      forecastItem.innerHTML = `
          <div class="day-for">${day.date}</div>
          <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" class="W-icon">
          <div class="temp-for">Day</div>
          <div class="grade">${day.day.maxtemp_c}&#176; C</div>
          <div class="temp-for">Night</div>
          <div class="grade">${day.day.mintemp_c}&#176; C</div>
      `;

      // Appending forecast item to the weekly forecast element
      weeklyForecastElement.appendChild(forecastItem);
  });
}

// Call the fetchWeatherData function to fetch initial weather data
fetchWeatherData();

// Set the opacity of the app to 1 to make it visible
app.style.opacity = "1";

// Array of countries for autocomplete functionality
    let countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
    
    function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        let currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            let a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
              /*check if the item starts with the same letters as the text field value:*/
              if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
              }
            }
        });
        /*execute a function presses a key on the keyboard:*/
       
        inp.addEventListener("keydown", function(e) {
            let x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
              /*If the arrow DOWN key is pressed,
              increase the currentFocus variable:*/
              currentFocus++;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 38) { //up
              /*If the arrow UP key is pressed,
              decrease the currentFocus variable:*/
              currentFocus--;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 13) {
              /*If the ENTER key is pressed, prevent the form from being submitted,*/
              e.preventDefault();
              if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
              }
            }
        });
        function addActive(x) {
          /*a function to classify an item as "active":*/
          if (!x) return false;
          /*start by removing the "active" class on all items:*/
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = (x.length - 1);
          /*add class "autocomplete-active":*/
          x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
          /*a function to remove the "active" class from all autocomplete items:*/
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
          }
        }
        function closeAllLists(elmnt) {
          /*close all autocomplete lists in the document,
          except the one passed as an argument:*/
          var x = document.getElementsByClassName("autocomplete-items");
          for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }
      /*execute a function when someone clicks in the document:*/
      document.addEventListener("click", function (e) {
          closeAllLists(e.target);
      });
      }

      
      