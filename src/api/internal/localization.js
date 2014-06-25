trackbox.api.internal.localization = {};

trackbox.api.internal.localization.set = function () {
	$("#app-title").html(trackbox.api.internal.localization.get("title"));
};

trackbox.api.internal.localization.get = function (key) {
	if (trackbox.api.internal.localization.language[trackbox.api.internal.localization.language.perfered][key]) {
		return trackbox.api.internal.localization.language[trackbox.api.internal.localization.language.perfered][key]
	} else if (trackbox.api.internal.localization.language.en[key]) {
		return trackbox.api.internal.localization.language.en[key];
	} else {
		console.log("The key " + key + " was not found in the perfered language or in english.");
		return "";
	}
}

trackbox.api.internal.localization.language = {};
trackbox.api.internal.localization.language.perfered = "en";
trackbox.api.internal.localization.language.en = {
	"title" : "Trackbox"
};