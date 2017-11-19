"use strict";

const request = require('request');

function getPublicGists(userName){
  return new Promise((resolve, reject) => {
    const url = `https://api.github.com/users/${userName}/gists`;
    const headers = {"User-Agent":"davideicardi_website"};

    request(url, {headers: headers}, function (error, response, body) {
      if (!error && body && response.statusCode >= 200 && response.statusCode < 300 ) {
        var data = JSON.parse(body);
        resolve(data);
      } else {
        reject(error || "Error " + response.statusCode);
      }
    });
  });
}


exports.getPublicGists = getPublicGists;
