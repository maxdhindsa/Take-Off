var config = require('../config');

var airport = require('airport-codes').toJSON();

console.log(airport);

var express = require('express');

var app_id = config.application_id;

var api = express.Router();

var topic_details = [];

var request = require("request-promise")

api.get('/weather', function(req,res) {
  console.log(req);

  var found1 = false;
  var found2 = false;

  var city1 = req.param('city1');
  var city2 = req.param('city2');
  var openweather_url = "http://api.openweathermap.org/data/2.5/weather?q="+city1+"&APPID=31490bd8ba57314162fc21d6a60ec80e";
  var openweather_url2 = "http://api.openweathermap.org/data/2.5/weather?q="+city2+"&APPID=31490bd8ba57314162fc21d6a60ec80e";
  var response = {};
  for (var i = 0; i<airport.length; ++i) {
    var ob = airport[i];
    if ((!found1)&&(ob.city==city1)) {
      found1=ob.iata;
      console.log(found1);
    }
    else if ((!found2)&&(ob.city==city2)) {
      found2=ob.iata;
      console.log(found2);
    }
  }

  var url1 = "http://services.faa.gov/airport/status/"+found1+"?format=application/json"
  var url2 ="http://services.faa.gov/airport/status/"+found2+"?format=application/json"

  var delay1 = 0;
  var delay2 = 0;

  request(openweather_url)
    .then(function (resp) {
      resp = JSON.parse(resp);
      console.log(resp);
      response[city1] = {};
      response[city1].coord = resp.coord;
      response[city1].desc = resp.weather;
      response[city1].main = resp.weather;
      response[city1].temp = resp.main;
      response[city1].temp.temp = Math.round((response[city1].temp.temp - 273) * 10) / 10;
      response[city1].pressure = resp.main;
      response[city1].humidity = resp.main;
      response[city1].wind = resp.wind;
      response[city1].name = resp.name;

    }).then(function(resp) {
        return request(openweather_url2);
      })
      .then(function (resp) {
      console.log(resp);
      resp = JSON.parse(resp);
      response[city2] = {};
      response[city2].coord = resp.coord;
      response[city2].desc = resp.weather;
      response[city2].main = resp.weather;
      response[city2].temp = resp.main;
      response[city2].temp.temp = Math.round((response[city2].temp.temp - 273) * 10) / 10;
      response[city2].pressure = resp.main;
      response[city2].humidity = resp.main;
      response[city2].wind = resp.wind;
      response[city2].name = resp.name;
      return res;
    })
      .then(function(resp) {
        if (found1) {
          return request(url1);
        }
        else return resp;
      })
      .then(function(resp) {
        //if delay information is found
        resp = JSON.parse(resp);
        var delay = (resp.delay);
        if (delay!="false") {
          delay1 = 1;
        }
        return request(url2);
      }, function(err) {
        //not found delay for city1
        return request(url2);
      })

      .then(function(resp) {
        //if delay information is found
        resp = JSON.parse(resp);
        var delay = (resp.delay);
        if (delay!="false") {
          delay2 = 1;
        }
      }, function(err) {
        //not found delay for city1
      })

      .then(function(resp) {
        var total_delay = delay1 + delay2;
        if (total_delay) {
          response.delay = true;
        }
        else response.delay = false;
        res.send(response);
      })
})

module.exports = api;
