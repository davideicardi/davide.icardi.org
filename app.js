// const _projects = [
//   { "name":"live-plugin-manager", "description": "Install any node package at runtime from npm registry", "type": "github", "url": "https://github.com/davideicardi/live-plugin-manager" },
//   { "name":"nestore", "description": ".NET/NodeJs Event Store", "type": "github", "url": "https://github.com/deltatre-webplu/NEStore" },
//   { "name":"shelf-dependency", "description":"Dependency Injection for node.js", "type":"github", "url":"https://github.com/davideicardi/shelf-dependency" },
//   { "name":"Dynamic Expresso", "description":"C# expressions interpreter", "type":"github", "url":"https://github.com/davideicardi/DynamicExpresso" },
//   { "name":"search-crawler", "description":"Node.js search engine for dummies", "type":"github", "url":"https://github.com/davideicardi/search-crawler" },
//   { "name":"open-weather", "description":"Cordova weather application for dummies", "type":"github", "url":"https://github.com/davideicardi/open-weather" }
// ];

const app = new Vue({
  el: "#vueApp",
  data: {
    gists: [
      // { language: "js", url: "https://someurl", description: "bla bla" }
    ]
  }
});

function getPublicGists(userName){
  const url = `https://api.github.com/users/${userName}/gists`;
  
  return fetch(url)
  .then((res) => res.json());
}

function getGists(){
  return getPublicGists("davideicardi")
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

getGists()
.then((data) => {
  for (const d of data) {
    app.gists.push(d);
  }
});