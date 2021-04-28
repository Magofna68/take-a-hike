import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import NpsMainService from './js/nps-main-api.js'; 

function getStateParks(response) {
  $(".parkInfoOutput").hide();
  let parkListHTML = ``;
  if (response.data[0]) {
    response.data.forEach((object, index) => {
      parkListHTML += (`<p><button id=${index} class="park-names">${object.fullName}</button></p>`);
    });
    $(".park-list").html(parkListHTML);
  } else {
    $(".park-list").html(`<br><h1><em><strong>🍃 Oops! I can't beleaf it! That state doesn't exist 🍃</em></strong></h1>`);
  }
}

function parksInfo(response) {
  $(".park-names").click(function(){
    $(".park-names").hide();
    const clickedPark = this.id; 
    const parkName = response.data[clickedPark].fullName;
    const parkDescription = `${response.data[clickedPark].description}`;
    const parkFees = `${response.data[clickedPark].entranceFees[0].cost}`;
    let parkActivities = ``;
    response.data[clickedPark].activities.forEach((activity) => {
      parkActivities += `<li>${activity.name}</li>`;
    });
    
    const parkCode = response.data[clickedPark].parkCode; 
    NpsMainService.getAlert(parkCode)
      .then(function(response) {
        let parkAlerts = ``;
        if (!response.data[0]) {
          parkAlerts = "None";
        } else {
          response.data.forEach((alert) => {
            parkAlerts += `<li>${alert.category} <p>${alert.description}</p> <a href="${alert.url}" target="_blank">READ MORE HERE</a></li> <br>`;   
          });
        }
        $(".parkInfoOutput").html(`<h2>${parkName}</h2> <br> <h3>Description:</h3>  <ol>${parkDescription}</ol> <br> <h3>Alerts/Warnings:</h3><ol>${parkAlerts}</ol> <br> <h3>Fee: ${parkFees}</h3> <br> <h3>Park Activities:</h3> <ul>${parkActivities}</ul>`);
        $(".parkInfoOutput").slideDown();
      }); 
  });
}

$(document).ready(function () {
  $("#main-page").submit(function (event) {
    event.preventDefault();

    const selectedState = $("#state-select").val();

    NpsMainService.getPark(selectedState)
      .then(function (response) {
        getStateParks(response);
        parksInfo(response);
      });
  });
});