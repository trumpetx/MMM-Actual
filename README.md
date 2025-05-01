# Overview
`MMM-Actual` is a [MagicMirror²](https://github.com/MichMich/MagicMirror/) module which provides a front-end to [actual-proxy](https://github.com/trumpetx/actual-proxy), a socket-based proxy server which can be managed and launched by this module.  The reason why this code is required to be in a proxy is becuase Electron (the framework [MagicMirror²](https://github.com/MichMich/MagicMirror/) is built on) does not play nice with Actual API due to its use of [better-sqllite3](https://www.npmjs.com/package/better-sqlite3).  If this is confusing, don't worry about it!  Hopefully the setup will guide you through the process.

![image](https://github.com/user-attachments/assets/554f9e81-93a6-4018-bff2-fe03dc7ceb96)


# Install
* Check out the module
* Check out the proxy server
* Update Actual API version information
* Build the proxy server
```bash
cd /path/to/magicmirror/modules/
git clone https://github.com/trumpetx/MMM-Actual.git
cd MMM-Actual
git clone https://github.com/trumpetx/actual-proxy.git
cd actual-proxy
nano package.json # Update the @actual-app/api version to match the version of your server
npm i && npm rebuild
```

# Setup config/config.js
Modify the config/config.js file with `MMM-Actual` settings
```js
		{
			module: "MMM-Actual",
			position: "top_center",
			config: {
				serverURL: "https://192.168.10.207:5006",
				password: "<YOUR PASSWORD>",
				budgetSyncId: "a6d25fdb-4014-494d-b6ee-7fcb33016a64", // Budget → Settings → Show Advanced Settings → IDs
				categories: [ "Food", "General", "Bills", "Savings" ],
				updateMinutes: 60,
				// autoStartProxy: true, // If you use multiple module configurations for this module, disable this on all but one
				// proxyDir: "/home/pi/magicmirror/modules/MMM-Actual/actual-proxy/", // If you install the proxy server somewhere else, point there instead
				// dataDir: "/home/pi/magicmirror/modules/MMM-Actual/actual-proxy/budget", // If you want to store the budget data somewhere else, point there instead
				// socketFile: "/tmp/actual-proxy.sock", # Customze at your own risk - must be in a writable location; file is chmod'd to ${socketPermissions} regardless of the location
                // socketPermissions: "600" # This should not be necessary, but some running conditions may requiere a more lenient permission.  This requires u+rw (600) at a minimum (most secure)
			}
		},
```
# FAQ

Check the FAQ over at [actual-proxy](https://github.com/trumpetx/actual-proxy) first to see if the error you're getting is there.  90% of the time, the issue will be matching the version of your Actual Budet with the API version used by the [actual-proxy](https://github.com/trumpetx/actual-proxy) server.

# Credits

This module is loosely based off of [MMM-YNAB](https://github.com/thesoftwarejedi/MMM-YNAB), thanks for the inspiration!
