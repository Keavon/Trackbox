// Handles dynamic addition and deletion of buttons in the sidebar

trackbox.api.internal.buttons = {};

// Load every button that is known to program
trackbox.api.internal.buttons.load = function() {
	for(button in trackbox.api.internal.buttons.known) {
		trackbox.api.internal.buttons.add(trackbox.api.internal.localization.get(trackbox.api.internal.buttons.known[button].name),
		trackbox.api.internal.buttons.known[button].link,
		trackbox.api.internal.buttons.known[button].id);
	}
};

// Add a new button to the interface
trackbox.api.internal.buttons.add = function(name, link, id) {
    var button = new EJS({url:trackbox.api.internal.theme.interface.default.button.path}).render({"name" : name, "link" : link, "id" : id})
	$(button).appendTo("#sidebar-menu");
};

// Removes a button from the interface
trackbox.api.internal.buttons.remove = function(id) {
	$("#" + id).remove();
};

// Remove every sidebar button and loads them again
trackbox.api.internal.buttons.reset = function() {
	$("#sidebar-menu").empty();
	trackbox.api.internal.buttons.load();
};

// Every button known to program
trackbox.api.internal.buttons.known = [
	{"name" : "Songs",   "link" : "songs",   "id" : "songsButton"  },
	{"name" : "Albums",  "link" : "albums",  "id" : "albumsButton" },
	{"name" : "Artists", "link" : "artists", "id" : "artistsButton"},
	{"name" : "Tags",    "link" : "tags",    "id" : "tagsButton"   },
	{"name" : "Pages",   "link" : "pages",   "id" : "pagesButton"  }
];