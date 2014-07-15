// Handels the rendering of pages
trackbox.api.internal.theme.page = {};

// Container for every known page.
trackbox.api.internal.theme.page.pages = {};
trackbox.api.internal.theme.page.pages.album = {
	"name" : "Albums", 
	"page" : "themes/trackbox/page.ejs",
	"javascripts" : [],
	"css" : []
}

// page currently in use.
trackbox.api.internal.theme.page.current             = {};
trackbox.api.internal.theme.page.current.id          = "album";
trackbox.api.internal.theme.page.current.page        = trackbox.api.internal.theme.page.pages[trackbox.api.internal.theme.page.current.id].page;
trackbox.api.internal.theme.page.current.javascripts = trackbox.api.internal.theme.page.pages[trackbox.api.internal.theme.page.current.id].javascripts;
trackbox.api.internal.theme.page.current.css         = trackbox.api.internal.theme.page.pages[trackbox.api.internal.theme.page.current.id].css;

// Render the page
trackbox.api.internal.theme.page.set = function(name) {
	var pate = new EJS({url: trackbox.api.internal.theme.page.current.page}).render();
	$("#page").html(shell);
};

// Load all of the pages and add them as a button to the interface
trackbox.api.internal.theme.page.load = function() {
	// Add all of the pages as buttons to the sidebar
	for( page in trackbox.api.internal.theme.page.pages) {
		trackbox.api.internal.sidebar.button.add(trackbox.api.internal.theme.page.pages[page].name, page);
	}
};