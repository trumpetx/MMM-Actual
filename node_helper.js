const NodeHelper = require("node_helper");
const path = require('path');
const net = require('net');
const spawn = require('child_process').spawn;

let prc;

module.exports = NodeHelper.create({
	socketNotificationReceived(notification, payload) {
		if (notification === "ACTUAL_PROXY_START") {
			try {
				this.config = payload;
				const proxyJsPath = path.join(this.config.proxyDir || path.join(__dirname, 'actual-proxy'), 'proxy.js');
				console.log(proxyJsPath);
				prc = spawn(
					'node',
					[proxyJsPath],
					{
						env: {
							...process.env,
							NODE_TLS_REJECT_UNAUTHORIZED: 0,
							ACTUAL_SOCK_FILE: this.config.socketFile,
                            ACTUAL_SOCK_PERMISSIONS: this.config.socketPermissions
						}
					});
				prc.stdout.setEncoding('utf8');
				prc.stdout.on('data', function (data) {
					const str = data.toString()
					const lines = str.split(/(\r?\n)/g);
					console.log(lines.join(""));
				});
				prc.on('close', function (code) {
					console.log('Actual Proxy Exit: ' + code);
				});
				// Delay the response to allow the proxy to start fully
				setTimeout(() => this.sendSocketNotification("ACTUAL_PROXY_INITIALIZED"), 5000);
			} catch (e) {
				console.log(e);
			}
		} else if (notification === "ACTUAL_UPDATE_REQUEST") {
			this.updateBudget();
		}
	},

	updateBudget() {
		var conn = net.createConnection(this.config.socketFile);
		conn.on("connect", function () {
			console.log('Connected to Actual Proxy');
		});

		let json = '';
		conn.on('data', buffer => {
			json += buffer.toString()
			try {
				const res = JSON.parse(json);
				console.log('Data received from Actual Proxy');
				this.sendSocketNotification("ACTUAL_UPDATE_RESPONSE", res.categories || []);
				conn.destroy();
			} catch (e) { console.log(e); }
		})
		conn.write(JSON.stringify(this.config) + '\n', 'utf8', () => {
			console.log('Request Sent to Actual Proxy');
		});
	}
});
