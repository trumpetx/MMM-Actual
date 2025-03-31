Module.register("MMM-Actual", {
    result: [],
    defaults: {
        serverURL: 'https://localhost:5006',
        password: '',
        budgetSyncId: '',
        categories: ["Food", "General", "Bills", "Bills (Flexible)", "Savings"],
        updateMinutes: 60,
        autoStartProxy: true,
        socketFile: '/tmp/actual-proxy.sock',
        proxyDir: undefined, // defaults to .../MMM-Actual/proxy-server/
        dataDir: undefined, // defaults to ${proxyDir}/budget/
    },

    getStyles() {
        return ['MMM-Actual.css']
    },

    start() {
        if (this.config.autoStartProxy) {
            this.sendSocketNotification('ACTUAL_PROXY_START', this.config);
        }
    },

    getDom() {
        var wrapper = document.createElement("div");
        wrapper.classList = ["xsmall"];
        wrapper.innerHTML = "Loading Actual";
        if (this.result && this.result.length > 0) {
            for (let i of this.result) {
                wrapper.innerHTML = this.result.map(a =>
                    `<span class='actual-name'>${a.name}</span><span class='actual-${a.display >= 0 ? 'positive' : 'negative'}'>$${Math.abs(a.display)}</span>`
                ).join('');
            }
        }
        return wrapper;
    },

    socketNotificationReceived(notification, payload) {
        console.log(notification);
        if (notification === "ACTUAL_UPDATE_RESPONSE") {
            this.result = payload;
            this.updateDom();
        } else if (notification === "ACTUAL_PROXY_INITIALIZED") {
            this.sendSocketNotification('ACTUAL_UPDATE_REQUEST');
            const updateMinutes = this.config.updateMinutes || 60;
            console.log(`Updating from Actual Proxy every ${updateMinutes} minutes`);
            setInterval(() => this.sendSocketNotification('ACTUAL_UPDATE_REQUEST'), updateMinutes * 1000 * 60);
        }
    }
});
