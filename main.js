"use strict";

var app = require("app");
var browserWindow = require("browser-window");

class Main {
	// Launch Trackbox
	constructor() {
		// Bind launch and exit events
		app.on("ready", this.ready.bind(this));
		app.on("window-all-closed", this.exit.bind(this));

		// Enable ES6
		app.commandLine.appendSwitch("js-flags", "--harmony_classes");
		app.commandLine.appendSwitch("js-flags", "--harmony_object_literals");
		app.commandLine.appendSwitch("js-flags", "--harmony_tostring");

		// Create the window variable
		this.trackboxWindow = null;
	}

	// Create the window and load index.html
	ready() {
		// Create the window
		this.trackboxWindow = new browserWindow({
			width: 1400,
			height: 1000,
			frame: false
		});

		// Load index.html
		this.trackboxWindow.loadUrl("file://" + __dirname + "/index.html");
	}

	// Quit the app when the window is closed except on OS X
	exit() {
		// Check that the platform is not OS X
		if (process.platform !== "darwin") {
			// Quit the app
			app.quit();
		}
	}
}

new Main();
