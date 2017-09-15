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
          let title = `, ${body.data[i].profile.title}`;
          if (body.data[i].profile.title === undefined) {
            title = "";
          }

          let website = body.data[i].practices[0].website;
          if (body.data[i].practices[0].website === undefined) {
            website = "N/A";
          }

          let yn;
          if(body.data[i].practices[0].accepts_new_patients) {
            yn = "yes";
          } else {
            yn = "no";
          }
          $('#results').append(`<tr><td><img src="${body.data[i].profile.image_url}"</td><td>${body.data[i].profile.first_name} ${body.data[i].profile.last_name}${title}</td><td>${body.data[i].practices[0].visit_address.street} <br> ${body.data[i].practices[0].visit_address.city}, ${body.data[i].practices[0].visit_address.state_long} <br> ${body.data[i].practices[0].visit_address.zip}</td><td>${body.data[i].practices[0].phones[0].number}</td><td>${website}</td><td>${yn}</td></tr>`);
        }
      } else {
        $('#results').text("No results found.")
      }
    }, function(error) {
      alert("Not a valid search query.")
    });
  });
});
