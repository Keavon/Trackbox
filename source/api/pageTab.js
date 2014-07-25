// Manage tha addation and removal of tabs.
trackbox.api.pageTab = {};

// Add a tab to the interface.
trackbox.api.pageTab.add = function(icon, id, titleText){
	getFileContents(icon, function (icon) {
		renderTemplate(trackbox.api.theme.shell.current.pageTab, { "ID": 'albums', "ICON": icon, "TITLE_TEXT": "Albums" }, function (data) {
			$("#page-tabs").append(data);
		});
	});
};

trackbox.api.pageTab.selected = null;
trackbox.api.pageTab.select = function (id) {
	if (trackbox.api.pageTab.selected) {
		$("#" + trackbox.api.pageTab.selected + "-button").removeClass("page-selector-active palette-hint-primary-border palette-background-primary-bg").addClass("palette-background-quaternary-hover-bg");
	}
	$("#" + id + "-button").addClass("page-selector-active palette-hint-primary-border palette-background-primary-bg").removeClass("palette-background-quaternary-hover-bg");
	trackbox.api.pageTab.selected = id;
};