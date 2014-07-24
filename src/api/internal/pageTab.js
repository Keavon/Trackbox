// Manage tha addation and removal of tabs.
trackbox.api.internal.pageTab = {};

// Add a tab to the interface.
trackbox.api.internal.pageTab.add = function(icon, id, titleText){
	$.ajax({
		url: trackbox.api.internal.theme.shell.current.pageTab,
		dataType: "text",
		success: function (data) {
			var tabHTML    = data;
			var idRegExp   = new RegExp("%ID%", "g");
			var iconRegExp = new RegExp("%ICON%", "g");
			var titleTextRegExp = new RegExp("%TITLE_TEXT%", "g");
			tabHTML = tabHTML.replace(idRegExp, id);
			tabHTML = tabHTML.replace(iconRegExp, icon);
			tabHTML = tabHTML.replace(titleTextRegExp, titleText);

			$("#page-tabs").append(tabHTML);
		},
		error: function() {
			console.log("Error loading tab file.");
		}
	});
};

trackbox.api.internal.pageTab.selected = null;
trackbox.api.internal.pageTab.select = function (id) {
	if (trackbox.api.internal.pageTab.selected) {
		$("#" + trackbox.api.internal.pageTab.selected + "-button").removeClass("page-selector-active palette-hint-primary-border palette-background-primary-bg").addClass("palette-background-quaternary-hover-bg");
	}
	$("#" + id + "-button").addClass("page-selector-active palette-hint-primary-border palette-background-primary-bg").removeClass("palette-background-quaternary-hover-bg");
	trackbox.api.internal.pageTab.selected = id;
};