// Handels the rendering of pages
trackbox.api.theme.page = {};

// Container for every known page.
trackbox.api.theme.page.pages = {};
trackbox.api.theme.page.pages.songs = {
	"name": "Songs",
	"page": "packages/songs/songs.html",
	"location": "packages/songs/",
	"icon": "packages/songs/songs.svg"
};
trackbox.api.theme.page.pages.albums = {
	"name": "Albums",
	"page": "packages/albums/albums.html",
	"location": "packages/albums/",
	"icon": "packages/albums/albums.svg"
};
trackbox.api.theme.page.pages.artists = {
	"name": "Artists",
	"page": "packages/artists/artists.html",
	"location": "packages/artists/",
	"icon": "packages/artists/artists.svg"
};
trackbox.api.theme.page.pages.tags = {
	"name": "Tags",
	"page": "packages/tags/tags.html",
	"location": "packages/tags/",
	"icon": "packages/tags/tags.svg"
};
trackbox.api.theme.page.pages.boxes = {
	"name": "Boxes",
	"page": "packages/boxes/boxes.html",
	"location": "packages/boxes/",
	"icon": "packages/boxes/boxes.svg"
};

// Default page to render
trackbox.api.theme.page.default = "albums";

// Page currently in use
trackbox.api.theme.page.current = {};
trackbox.api.theme.page.current.id = "albums";
trackbox.api.theme.page.current.page = trackbox.api.theme.page.pages[trackbox.api.theme.page.current.id].page;
trackbox.api.theme.page.current.icon = trackbox.api.theme.page.pages[trackbox.api.theme.page.current.id].icon;
trackbox.api.theme.page.current.location = trackbox.api.theme.page.pages[trackbox.api.theme.page.current.id].location;

// Render the page
trackbox.api.theme.page.set = function (name) {
	trackbox.api.theme.page.current.id = name;
	getFileContents(trackbox.api.theme.page.pages[name].page, function (page) {
		trackbox.api.pageTab.select(name);
		$("#page").html(page);
	});
};

// Load all of the pages and add them as a button to the interface
trackbox.api.theme.page.load = function () {
	// Add all of the pages as buttons to the tab bar
	for (var page in trackbox.api.theme.page.pages) {
		var translatedName = trackbox.api.localization.get(trackbox.api.theme.page.pages[page].name);
		trackbox.api.pageTab.add(trackbox.api.theme.page.pages[page].icon, page, translatedName);
	}
};