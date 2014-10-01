
// Loads a shell of a given location into the document body
tb.loadShell = function (shellLocation) {
	tb.findPackage({"location" : shellLocation}, false, function(data) {
		// Fill document body with shell and call router
		console.log(data[0]);
		console.log(shellLocation + "/" + data[0].shell);
		tb.renderTemplate(shellLocation + "/" + data[0].shell, function (shell) {
			$("body").html(shell);
			tb.packageStartup();
			tb.router();
		});
	}, 1);
};

tb.addPageButton = function (id, displayName, iconLink) {
	tb.getFileContents(iconLink, function (icon) {
		tb.renderTemplate("packages/trackbox/templates/page-button.html", { "ID": id + "-button", "LINK": id, "NAME": displayName, "ICON": icon }, function (template) {
			var buttons = interfacePreferences.trackbox.buttonLayout[0].alignment[1].pageButtons.buttonOrder;
			var value = buttons[id].order;
			var nextLowest;
			var offset;
			var array = [];

			// Fill an array with all the currently loaded buttons in the interface
			var existingButtons = [];
			$("#page-tabs").children().each(function () {
				existingButtons.push(this.id);
			});

			// Turn array of names into array of orders
			for (var name in existingButtons) {
				existingButtons[name] = existingButtons[name].substring(0, existingButtons[name].length - 7);
				array.push(buttons[existingButtons[name]].order);
			}

			// Find the highest value that is lower than the given value
			for (var item in array) {
				if (array[item] < value) {
					if (typeof offset === "undefined" || value - array[item] < offset) {
						offset = value - array[item];
						nextLowest = array[item];
					}
				}
			}

			// Apply to the top if first or after the appropriate sibling
			if (typeof nextLowest === "undefined") {
				$("#page-tabs").prepend(template);
			} else {
				var afterElement;
				for (var next in buttons) {
					if (buttons[next].order === nextLowest) {
						afterElement = next;
					}
				}
				$("#" + afterElement + "-button").after(template);
			}
		});
	});
};

tb.private.pageButtonSelectedAdd = "";
tb.private.pageButtonSelectedRemove = "";
tb.private.pageButtonSelected = "";

tb.selectPageButton = function (id) {
	if (tb.private.pageButtonSelectedAdd === "" && tb.private.pageButtonSelectedRemove === "") {
		tb.getFileContents("packages/trackbox/templates/page-button-selected.html", function (text) {
			text = text.split('\n');
			tb.private.pageButtonSelectedAdd = text[0];
			tb.private.pageButtonSelectedRemove = text[1];
			tb.selectPageButton(id);
		});
	} else {
		$("#" + tb.private.pageButtonSelected + "-button").addClass(tb.private.pageButtonSelectedRemove);
		$("#" + tb.private.pageButtonSelected + "-button").removeClass(tb.private.pageButtonSelectedAdd);
		tb.private.pageButtonSelected = id;
		$("#" + id + "-button").addClass(tb.private.pageButtonSelectedAdd);
		$("#" + id + "-button").removeClass(tb.private.pageButtonSelectedRemove);
	}
};
