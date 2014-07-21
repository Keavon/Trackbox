//// Handels the rendering of pages
//trackbox.api.internal.theme.page = {};

//// Container for every known page.
//trackbox.api.internal.theme.page.pages = {};
//trackbox.api.internal.theme.page.pages.albums = {
//	"name": "Albums",
//	"page": "themes/pages/albums/albums.ejs",
//	"javascripts": [],
//	"css": ["themes/pages/headers/standard.css", "themes/pages/card/card.css"]
//};

//// default page to render
//trackbox.api.internal.theme.page.default  = "albums";

//// page currently in use.
//trackbox.api.internal.theme.page.current             = {};
//trackbox.api.internal.theme.page.current.id          = "albums";
//trackbox.api.internal.theme.page.current.page        = trackbox.api.internal.theme.page.pages[trackbox.api.internal.theme.page.current.id].page;
//trackbox.api.internal.theme.page.current.javascripts = trackbox.api.internal.theme.page.pages[trackbox.api.internal.theme.page.current.id].javascripts;
//trackbox.api.internal.theme.page.current.css         = trackbox.api.internal.theme.page.pages[trackbox.api.internal.theme.page.current.id].css;

//// Render the page
//trackbox.api.internal.theme.page.set = function(name) {
//	trackbox.api.internal.theme.page.current.id = name;
//	var page = new EJS({url: trackbox.api.internal.theme.page.current.page}).render();
//	$("#page").html(page);

//	for (var script in trackbox.api.internal.theme.page.current.javascripts) {
//		$("#page-scripts").append("<script type=\"text/javascript\" src=\"" + trackbox.api.internal.theme.page.current.javascripts[script] + "\"></script>");
//	}

//	for (var css in trackbox.api.internal.theme.page.current.css) {
//		$("#page-styles").append('<link href=\"' + trackbox.api.internal.theme.page.current.css[css] + '\" rel=\"stylesheet\"/>');
//	}
//};

//// Load all of the pages and add them as a button to the interface
//trackbox.api.internal.theme.page.load = function() {
//	// Add all of the pages as buttons to the sidebar
//	for (var page in trackbox.api.internal.theme.page.pages) {
//		trackbox.api.internal.sidebar.button.add(trackbox.api.internal.theme.page.pages[page].name, page);
//	}
//};