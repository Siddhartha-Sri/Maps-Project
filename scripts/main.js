import { ajax,filterData,initialLayout } from "./setup.js";
import { removeMarkers, removeCircle } from "./map.js";

var centerLocation, check = 0;

//Get user location
(function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(function (position) {
    centerLocation = {
      lat: position.coords.latitude,
      long: position.coords.longitude
    };
    ajax();//ajax call in setup.js
  })
})();

//event listener to get the radius and category entered by the user in large screen
document.getElementById("filter-pannel").addEventListener("click", function (ele) {
  if (ele.target.matches("button") && ele.target.innerHTML == "SEARCH") {
    let radius = document.getElementById("map-radius").value;
    let category = document.getElementById("map-category").value;

    removeMarkers();//remove markers, function defined in map.js
    filterData(radius, category);//function call in setup.js to filter markers based on the arguments passed
  }
  if (ele.target.matches("button") && ele.target.innerHTML == "RESET") {
    removeMarkers();//remove markers, function defined in map.js
    removeCircle();//remove areaCircle created based on the radius, function defined in map.js
    initialLayout();//creates all intial markers, function defined in map.js
  }
});

//event listener to show and unshow the filter-pannel on small screem 
document.getElementById("filter-button").addEventListener("click", function () {
  if (check === 0) {
    document.getElementById("sm-filter-pannel").style.display = "block";
    check = 1;//variable to check if the filter-button is clicked or not
  } else {
    document.getElementById("sm-filter-pannel").style.display = "none";
    check = 0;
  }
});


//event listener to get the radius and category entered by the user in large screen
document.getElementById("sm-filter-pannel").addEventListener("click", function (ele) {
  if (ele.target.matches("button") && ele.target.innerHTML == "Go") {
    let radius = document.getElementById("sm-map-radius").value;
    let category = document.getElementById("sm-map-category").value;

    removeMarkers();//remove markers, function defined in map.js
    filterData(radius, category);//function call in setup.js to filter markers based on the arguments passed
  }
  if (ele.target.matches("button") && ele.target.innerHTML == "Clear") {
    removeMarkers();//remove markers, function defined in map.js
    removeCircle();//remove areaCircle created based on the radius, function defined in map.js
    initialLayout();//creates all intial markers, function defined in map.js
  }
});

export { centerLocation }


