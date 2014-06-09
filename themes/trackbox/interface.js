trackbox.api.internal.theme.interface.style.getStyled("trackbox");

var view = "albums";
if (window.location.hash) {
	// Adds hash to variable and removes the # character
	var hash = window.location.hash.substring(1);

	if (hash == "songs") {
		view = "songs";
	}
	if (hash == "albums") {
		view = "albums";
	}
	if (hash == "artists") {
		view = "artists";
	}
	if (hash == "tags") {
		view = "tags";
	}
}

function drawView() {
	var renderedView;
	if (view == "songs") {
		renderedView = new EJS({ url: "themes/trackbox/frames/headers/songs.ejs" }).render();
	}
	if (view == "albums" || view == "artists" || view == "tags") {
		renderedView = new EJS({ url: "themes/trackbox/frames/headers/standard.ejs" }).render();
	}
	$("#frame").html(renderedView);
}

drawView();

$(".sidebar-menu-item").click(function () {
	var selection = $(this).attr("id");

	if (selection == "songsButton") {
		view = "songs";
	}
	if (selection == "albumsButton") {
		view = "albums";
	}
	if (selection == "artistsButton") {
		view = "artists";
	}
	if (selection == "tagsButton") {
		view = "tags";
	}
	if (selection == "pagesButton") {
		view = "pages";
	}

	drawView();
});