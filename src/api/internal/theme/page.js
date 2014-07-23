// Handels the rendering of pages
trackbox.api.internal.theme.page = {};

// Container for every known page.
trackbox.api.internal.theme.page.pages = {};
trackbox.api.internal.theme.page.pages.songs = {
	"name": "Songs",
	"page": "themes/pages/songs/songs.html",
	"location": "themes/pages/songs/",
	"icon": "themes/pages/songs/songs.svg"
};
trackbox.api.internal.theme.page.pages.albums = {
	"name": "Albums",
	"page": "themes/pages/albums/albums.html",
	"location": "themes/pages/albums/",
	"icon": "themes/pages/albums/albums.svg"
};
trackbox.api.internal.theme.page.pages.artists = {
	"name": "Artists",
	"page": "themes/pages/artists/artists.html",
	"location": "themes/pages/artists/",
	"icon": "themes/pages/artists/artists.svg"
};
trackbox.api.internal.theme.page.pages.tags = {
	"name": "Tags",
	"page": "themes/pages/tags/tags.html",
	"location": "themes/pages/tags/",
	"icon": "themes/pages/tags/tags.svg"
};
trackbox.api.internal.theme.page.pages.boxes = {
	"name": "Boxes",
	"page": "themes/pages/boxes/boxes.html",
	"location": "themes/pages/boxes/",
	"icon": "themes/pages/boxes/boxes.svg"
};

// Default page to render
trackbox.api.internal.theme.page.default = "albums";

// Page currently in use
trackbox.api.internal.theme.page.current = {};
trackbox.api.internal.theme.page.current.id = "albums";
trackbox.api.internal.theme.page.current.page = trackbox.api.internal.theme.page.pages[trackbox.api.internal.theme.page.current.id].page;
trackbox.api.internal.theme.page.current.icon = trackbox.api.internal.theme.page.pages[trackbox.api.internal.theme.page.current.id].icon;
trackbox.api.internal.theme.page.current.location = trackbox.api.internal.theme.page.pages[trackbox.api.internal.theme.page.current.id].location;

// Render the page
trackbox.api.internal.theme.page.set = function (name) {
	trackbox.api.internal.theme.page.current.id = name;
	var page = $.ajax({
		url: trackbox.api.internal.theme.page.pages[name].page,
		dataType: "text",
		async: false
	}).responseText;
	$("#page").html(page);
};

// Load all of the pages and add them as a button to the interface
trackbox.api.internal.theme.page.load = function () {
	// Add all of the pages as buttons to the tab bar
	for (var page in trackbox.api.internal.theme.page.pages) {
		var isActive = false;
		if (page == trackbox.api.internal.theme.page.default) {
			isActive = true;
		}
		var icon = $.ajax({
			url: trackbox.api.internal.theme.page.pages[page].icon,
			dataType: "text",
			async: false
		}).responseText;
		var translatedName = trackbox.api.internal.localization.get(trackbox.api.internal.theme.page.pages[page].name);
		trackbox.api.internal.pageTab.add(icon, page, translatedName, isActive);
	}
};