$(document).ready(function () {

    // 
    let history = JSON.parse(window.localStorage.getItem('history')) || [];
    history.forEach(function(city){
        addHistoryButton(city)
        
    })



    $('#search-button').on('click', function () {
        $('.card').remove()
        let cityName = $("#city-input").val();
        console.log("click");
        currentWeather(cityName)
        getForecast(cityName)
        addHistoryButton(cityName)
        $('#city-input').val("")
        history.push(cityName)
        window.localStorage.setItem(history, JSON.stringify(history))


    })

    function addHistoryButton(pizza) {
        let temp = $('<li>').addClass('list-group-item list-group-item-action').text(pizza)
        $('history').prepend(temp)

    }

    function currentWeather(pizza) {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: `https://api.openweathermap.org/data/2.5/weather?q=${pizza}&appid=166a433c57516f51dfab1f7edaed8413&units=Imperial`,
        })
            .then(function (response) {

                let lon = response.coord.lon;
                let lat = response.coord.lat;
                let todaysDate = new Date().toLocaleDateString()

                let card = $('<div>').addClass("card");
                let title = $('<h1>').addClass("card-title").text(`${response.name} (${todaysDate})`);
                let temp = $('<p>').addClass("card-text").text(`Temperature: ${response.main.temp}`)
                let humidity = $('<p>').addClass("card-text").text(`Humidity: ${response.main.humidity}`)
                let wind = $('<p>').addClass("card-text").text(`Wind: ${response.wind.speed}`)

                let img = $('<img>').attr('src', `http://openweathermap.org/img/w/${response.weather[0].icon}.png`);

                title.append(img)
                card.append(title, temp, humidity, wind)


                $('#current-weather').append(card)


                // // add temp content to html
                // $(".temp").text("Temperature (K) " + response.main.temp);
                // $(".tempF").text("Temperature (F) " + tempF.toFixed(2));
                uvIndex(lat, lon)
            })

    }

    /* onlick funtion for search button
      capture city name input for 2 api calls
      pulls lat and lon for UV api call

      function for current weather
      function for 5 day forecast

    */


    function uvIndex(lat, lon) {
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=166a433c57516f51dfab1f7edaed8413`,
            method: "GET"

        })
            .then(function (response) {
                let uv = $('<p>').addClass("card-text").text(`UV: ${response.value}`)
                console.log("click2");

                $("#current-weather .card").append(uv)

            })
    }


    function getForecast(cityName) {
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=166a433c57516f51dfab1f7edaed8413&units=Imperial`,
            method: "GET"

        })
            .then(function (response) {
                // creates 5 cards for weather forecast
                for (let i = 4; i < 40; i += 8){
                new Date(response.list[i].dt_txt).toLocaleDateString()
                
                let date = $('<h4>').addClass('card-date').text(new Date(response.list[i].dt_txt).toLocaleDateString())
                let weather = $('<img>').attr('src', `http://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png`)
                let temp = $('<p>').addClass("card-text").text(`Temperature: ${response.list[i].main.temp}`)
                let humidity = $('<p>').addClass("card-text").text(`Humidity: ${response.list[i].main.humidity}`)

                // creates forecast card
                let card = $('<div>').addClass("card col-md-2 forecast-card");
                let cardBody =$('<div>').addClass('p-2')
                card.append(date, weather, temp, humidity);
                $('#weather-forecast').append(card)
                }

            });
    }

   

})