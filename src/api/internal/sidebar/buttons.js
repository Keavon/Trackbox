// Handles dynamic addition and deletion of buttons in the sidebar
trackbox.api.internal.sidebar.button = {};


// Add a new button to the interface. Don't call this directly, use 'add' instead.
trackbox.api.internal.sidebar.button.add = function(name, id) {
	var translatedName = trackbox.api.internal.localization.get(name);
	var button = new EJS({url:trackbox.api.internal.theme.shell.current.button}).render({"name" : translatedName, "link" : id, "id" : id + "Button"});
	$(button).appendTo("#sidebar-menu");
};

// Removes a button from the interface
trackbox.api.internal.sidebar.button.remove = function(id) {
	$("#" + id + "Button").remove();
};

// Remove every sidebar button and loads them again
trackbox.api.internal.sidebar.button.reset = function() {
	$("#sidebar-menu").empty();
	init();
};