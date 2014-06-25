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
	trackbox.api.internal.localization.load();
	trackbox.api.internal.buttons.reset();
};

trackbox.api.internal.localization.language = {};
trackbox.api.internal.localization.language.perfered = "en";
trackbox.api.internal.localization.language.en = {
	"Title"   : "Trackbox",
	"Songs"   : "Songs",
	"Albums"  : "Albums",
	"Artists" : "Artists",
	"Tags"    : "Tags",
	"Pages"   : "Pages"
};

trackbox.api.internal.localization.language.es = {
	"Title"   : "Trackbox",
	"Songs"   : "Canciones",
	"Albums"  : "Álbumes",
	"Artists" : "Artistas",
	"Tags"    : "Etiqueta",
	"Pages"   : "Páginas"
}

trackbox.api.internal.localization.language.jp = {
	"Title"   : "トラクーバカス",
	"Songs"   : "歌",
	"Albums"  : "アルバム",
	"Artists" : "アーティスト",
	"Tags"    : "荷札",
	"Pages"   : "頁"
}