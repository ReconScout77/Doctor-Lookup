var apiKey = require('./../.env').apiKey;

$(function() {
  $('#doctor-search-form').submit(function(event) {
    event.preventDefault();
    let name = $('#name').val();
    let nameQuery;

    if (name != "") {
      nameQuery = `name=${name}&`;
    }

    let medicalIssue = $('#medical-issue').val();
    let medicalIssueQuery;

    if (medicalIssue != "") {
      medicalIssueQuery = `query=${medicalIssue}&`;
    }

    let promise = new Promise(function(resolve, reject) {

      let request = new XMLHttpRequest();
      let url = `https://api.betterdoctor.com/2016-03-01/doctors?${nameQuery}${medicalIssueQuery}location=or-portland&user_location=45.543066%2C-122.9346037&skip=0&limit=20&user_key=${apiKey}`;

      request.onload = function() {
        if (this.status === 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      };
      request.open("GET", url, true);
      request.send();
    });

    promise.then(function(response) {
      let body = JSON.parse(response);

      $('#results').text("");

      if (body.meta.count > 0) {
        for(let i = 0; i < body.meta.count; i++) {
          $('#results').append(`<p>Name: ${body.data[i].practices[0].name}</p>`);
        }
      } else {
        $('#results').text("No results found.")
      }
    }, function(error) {
      alert("Not a valid search query.")
    });
  });
});
