const SocketIOClient = require("push-node-socket-io-client").SocketIOClient;
const FreeSpace = require('./src/FreeSpace').FreeSpace;


let server = require('./server.json');



var client = (new SocketIOClient(server.url)).connect(server.credentials, (success) => {


	if (!success) {
		throw 'Failed to connect';
	}

	console.log('start interval');
	let timeout = setInterval(() => {

		client.emit(server.channel, 'heartbeat', {});
		console.log('update loop');


		let fileSpaceData = '{}';
		(new FreeSpace()).getStats({
			'mounted on': '/System/Volumes/Data'
		}).then((data) => {
			let jsonData = JSON.stringify(data);
			if (jsonData != fileSpaceData) {
				client.emit(server.channel, 'data', data);
				console.log(data);
				fileSpaceData = jsonData;
			}


		}).catch((err) => {
			console.error(err);
		});



	}, 5000);


});