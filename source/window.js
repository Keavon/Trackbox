tb.private.window = require('remote').getCurrentWindow();

// Triggers onWindowMaximize when the window is maximized
tb.private.window.on("maximize", function () {
	$.event.trigger("onWindowMaximize");
});

// Calls back when the window is maximized
tb.onWindowMaximize = function (callback) {
	$(window).on("onWindowMaximize", function () {
		callback();
	});
};

// Triggers onWindowRestore when the window is unmaximized
tb.private.window.on("unmaximize", function () {
	$.event.trigger("onWindowUnmaximize");
});

// Calls back when the window is unmaximized
tb.onWindowUnmaximize = function (callback) {
	$(window).on("onWindowUnmaximize", function () {
		callback();
	});
};