var pages = [
	{
		"displayName": "Songs",
		"packageName": "songs",
	},
	{
		"displayName": "Albums",
		"packageName": "albums",
	},
	{
		"displayName": "Artists",
		"packageName": "artists",
	},
	{
		"displayName": "Tags",
		"packageName": "tags",
	},
	{
		"displayName": "Boxes",
		"packageName": "boxes",
	}
];
var defaultPage = "albums";

tb.router = {};
tb.router.v1 = function () {
	// Get hash string and remove hash
	var pageName = window.location.hash.substring(1);

	// Prepare package name page data
	var packageNames = pages.map(function (x) {
		return x.packageName;
	});

	// Check if hash equals any of the page names, otherwise set it to the default
	if (packageNames.indexOf(pageName) !== -1) {
		tb.loadPage.v1(pageName);
	} else {
		window.location.hash = "#" + defaultPage;
		tb.router.v1();
	}
};