trackbox.api.localization = {};

// Add localized text to every textual element on the page.
trackbox.api.localization.load = function () {
	$("#app-title").html(trackbox.api.localization.get("Title"));
};

// Load localized word from key.
trackbox.api.localization.get = function (key) {
	if (trackbox.api.localization.language[trackbox.api.localization.language.perfered][key]) {
		return trackbox.api.localization.language[trackbox.api.localization.language.perfered][key];
	} else if (trackbox.api.localization.language.en[key]) {
		return trackbox.api.localization.language.en[key];
	} else {
		console.log("The key " + key + " was not found in the perfered language or in english.");
		return key;
	}
};

trackbox.api.localization.set = function(language) {
	trackbox.api.localization.language.perfered = language;
	init();
};

trackbox.api.localization.language = {};
trackbox.api.localization.language.perfered = "en";
trackbox.api.localization.language.en = {
	"Title"   : "Trackbox",
	"Songs"   : "Songs",
	"Albums"  : "Albums",
	"Artists" : "Artists",
	"Tags"    : "Tags",
	"Boxes"   : "Boxes"
};

trackbox.api.localization.language.da = {
	"Title": "Trackbox",
	"Songs": "Sange",
	"Albums": "Albums",
	"Artists": "Kunstnere",
	"Tags": "Tags",
	"Boxes": "Kasser"
};

trackbox.api.localization.language.de = {
	"Title": "Trackbox",
	"Songs": "Lieder",
	"Albums": "Alben",
	"Artists": "Künstler",
	"Tags": "Tags",
	"Boxes": "Kisten"
};

trackbox.api.localization.language.es = {
	"Title": "Trackbox",
	"Songs": "Canciones",
	"Albums": "Álbumes",
	"Artists": "Artistas",
	"Tags": "Etiqueta",
	"Boxes": "Cajas"
};

trackbox.api.localization.language.fi = {
	"Title": "Trackbox",
	"Songs": "Laulut",
	"Albums": "Albumit",
	"Artists": "Artistit",
	"Tags": "Tagit",
	"Boxes": "Boxit"
};

trackbox.api.localization.language.ja = {
	"Title": "トラクーバカス",
	"Songs": "歌",
	"Albums": "アルバム",
	"Artists": "アーティスト",
	"Tags": "荷札",
	"Boxes": "ボックス"
};

trackbox.api.localization.language.sv = {
	"Title": "Trackbox",
	"Songs": "Låtar",
	"Albums": "Album",
	"Artists": "Artister",
	"Tags": "Taggar",
	"Boxes": "Lådor"
};
