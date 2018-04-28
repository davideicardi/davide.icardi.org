const _projects = [
  { "name":"live-plugin-manager", "description": "Install any node package at runtime from npm registry", "type": "github", "url": "https://github.com/davideicardi/live-plugin-manager" },
  { "name":"nestore", "description": ".NET/NodeJs Event Store", "type": "github", "url": "https://github.com/deltatre-webplu/NEStore" },
  { "name":"shelf-dependency", "description":"Dependency Injection for node.js", "type":"github", "url":"https://github.com/davideicardi/shelf-dependency" },
  { "name":"Dynamic Expresso", "description":"C# expressions interpreter", "type":"github", "url":"https://github.com/davideicardi/DynamicExpresso" },
  { "name":"search-crawler", "description":"Node.js search engine for dummies", "type":"github", "url":"https://github.com/davideicardi/search-crawler" },
  { "name":"open-weather", "description":"Cordova weather application for dummies", "type":"github", "url":"https://github.com/davideicardi/open-weather" }
];

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

function getGists(){
  // TODO Get from configuration the github api key and use here to not have quota limits...

  return gists.getPublicGists("davideicardi")
  .then((data) => {
    data.sort((a, b) => {
      if (a.created_at > b.created_at) return -1;
      if (a.created_at < b.created_at) return 1;
      return 0;
    });
    return data.map(d=> {
      return {
        description: d.description,
        url: d.html_url,
        language: d.files[Object.keys(d.files)[0]].language
      };
    });
  })
  .catch((e) => {
    return [{
      description: "Gists not available",
      url: "/",
      language: "-"
    }];
  });
}
