const path = require('path');
const http = require('http');
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const server = http.createServer(app);


var apiplayerCount;

app.use(express.static(path.join(__dirname + '/public')));
const PORT = 23000 || process.env.PORT;

fetch("https://api.minehut.com/server/CherryPR?byName=true").then(res => res.json())
.then(json => {
	apiplayerCount = ({ globalPlayers: json.server.playerCount })
})
setInterval(() => {
  fetch("https://api.minehut.com/server/CherryPR?byName=true").then(res => res.json())
  .then(json => {
    apiplayerCount = { globalPlayers: json.server.playerCount }
  })
}, 300000);

app.get('/v1/getPlayersNetwork', (req, res) => {
  fetch("https://api.minehut.com/server/CherryPR?byName=true").then(res => res.json())
    .then(json => {
      res.json(apiplayerCount)
    })
})

app.get('/v1/minehut/serversRaw', (req, res) => {
  fetch("https://api.minehut.com/servers").then(res => res.json())
    .then(json => {
      res.json(json)
    })
})
app.get('/v1/minehut/servers', (req, res) => {
	let list = [];
	fetch("https://api.minehut.com/servers").then(res => res.json())
	.then(json => {
		for (let i = 0; i < json.total_servers; i++) {
			if (i < json.total_servers) {
				list.push(`<div class="server"><div class="title">${json.servers[i]['name']}</div></div>`)
			}
		}
	});
	res.send(list.join(' '))
})

server.listen(PORT, () => console.log(`API running on port ${PORT}`));
