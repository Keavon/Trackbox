// Handels the rendering of pages
trackbox.api.internal.theme.page = {};

// Container for every known page.
trackbox.api.internal.theme.page.pages = {};
trackbox.api.internal.theme.page.pages.songs = {
	"name": "Songs",
	"page": "packages/songs/songs.html",
	"location": "packages/songs/",
	"icon": "packages/songs/songs.svg"
};
trackbox.api.internal.theme.page.pages.albums = {
	"name": "Albums",
	"page": "packages/albums/albums.html",
	"location": "packages/albums/",
	"icon": "packages/albums/albums.svg"
};
trackbox.api.internal.theme.page.pages.artists = {
	"name": "Artists",
	"page": "packages/artists/artists.html",
	"location": "packages/artists/",
	"icon": "packages/artists/artists.svg"
};
trackbox.api.internal.theme.page.pages.tags = {
	"name": "Tags",
	"page": "packages/tags/tags.html",
	"location": "packages/tags/",
	"icon": "packages/tags/tags.svg"
};
trackbox.api.internal.theme.page.pages.boxes = {
	"name": "Boxes",
	"page": "packages/boxes/boxes.html",
	"location": "packages/boxes/",
	"icon": "packages/boxes/boxes.svg"
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
	var page = "";
	$.ajax({
		url: trackbox.api.internal.theme.page.pages[name].page,
		dataType: "text",
		async: false,
		success: function (data) {
			page = data;
		}
	});
	trackbox.api.internal.pageTab.select(name);
	$("#page").html(page);
};

// Load all of the pages and add them as a button to the interface
trackbox.api.internal.theme.page.load = function () {
	// Add all of the pages as buttons to the tab bar
	for (var page in trackbox.api.internal.theme.page.pages) {
		var icon = $.ajax({
			url: trackbox.api.internal.theme.page.pages[page].icon,
			dataType: "text",
			async: false
		}).responseText;
		var translatedName = trackbox.api.internal.localization.get(trackbox.api.internal.theme.page.pages[page].name);
		trackbox.api.internal.pageTab.add(icon, page, translatedName);
	}
};