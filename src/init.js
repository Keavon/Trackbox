// Initializes the Trackbox Interface
$(document).ready(function () {
	$(document.body).html(trackbox.api.internal.theme.interface.default.html);
	trackbox.api.internal.localization.load();
	trackbox.api.internal.buttons.load();
});