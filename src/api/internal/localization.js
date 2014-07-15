trackbox.api.internal.localization = {};

// Add localized text to every textual element on the page.
trackbox.api.internal.localization.load = function() {
	$("#app-title").html(trackbox.api.internal.localization.get("Title"));
};


// Load localized word from key.
trackbox.api.internal.localization.get = function(key) {
	if (trackbox.api.internal.localization.language[trackbox.api.internal.localization.language.perfered][key]) {
		return trackbox.api.internal.localization.language[trackbox.api.internal.localization.language.perfered][key]
	} else if (trackbox.api.internal.localization.language.en[key]) {
		return trackbox.api.internal.localization.language.en[key];
	} else {
		console.log("The key " + key + " was not found in the perfered language or in english.");
		return key;
	}
}

trackbox.api.internal.localization.set = function(language) {
	trackbox.api.internal.localization.language.perfered = language;
	init();
};

trackbox.api.internal.localization.language = {};
trackbox.api.internal.localization.language.perfered = "en";
trackbox.api.internal.localization.language.en = {
	"Title"   : "Trackbox",
	"Songs"   : "Songs",
	"Albums"  : "Albums",
	"Artists" : "Artists",
	"Tags"    : "Tags",
	"Boxes"   : "Boxes"
};

trackbox.api.internal.localization.language.da = {
	"Title"   : "Trackbox",
	"Songs"   : "Sange",
	"Albums"  : "Albums",
	"Artists" : "Kunstnere",
	"Tags"    : "Tags",
	"Boxes"   : "Kasser"
}

trackbox.api.internal.localization.language.de = {
	"Title"   : "Trackbox",
	"Songs"   : "Lieder",
	"Albums"  : "Alben",
	"Artists" : "Künstler",
	"Tags"    : "Tags",
	"Boxes"   : "Kisten"
}

trackbox.api.internal.localization.language.es = {
	"Title"   : "Trackbox",
	"Songs"   : "Canciones",
	"Albums"  : "Álbumes",
	"Artists" : "Artistas",
	"Tags"    : "Etiqueta",
	"Boxes"   : "Cajas"
}

trackbox.api.internal.localization.language.fi = {
	"Title"   : "Trackbox",
	"Songs"   : "Laulut",
	"Albums"  : "Albumit",
	"Artists" : "Artistit",
	"Tags"    : "Tagit",
	"Boxes"   : "Boxit"
}

trackbox.api.internal.localization.language.ja = {
	"Title"   : "トラクーバカス",
	"Songs"   : "歌",
	"Albums"  : "アルバム",
	"Artists" : "アーティスト",
	"Tags"    : "荷札",
	"Boxes"   : "ボックス"
}

trackbox.api.internal.localization.language.sv = {
	"Title"   : "Trackbox",
	"Songs"   : "Låtar",
	"Albums"  : "Album",
	"Artists" : "Artister",
	"Tags"    : "Taggar",
	"Boxes"   : "Lådor"
}