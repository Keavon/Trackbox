var seeking = false;
var pauseKeyDown = false;

/* Mouse Down */
$("#timeline-bar-sensor")[0].addEventListener("mousedown", scrubMouseDownListener);
function scrubMouseDownListener(evt) {
	seeking = true;
	window.addEventListener("mouseup", scrubMouseUpListener);

	// Disable text selection while dragging
	evt.preventDefault();

	// Bind and call the move listener
	document.addEventListener("mousemove", scrubMouseDownListener);
	scrubMouseMoveListener(evt);
}

/* Mouse Up */
function scrubMouseUpListener() {
	seeking = false;
	window.removeEventListener("mouseup", scrubMouseUpListener);
	document.removeEventListener("mousemove", scrubMouseDownListener);

	// Get slider position
	var timePercent = $("#timeline-bar-sensor .slider-knob")[0].style.left.substring(0, $("#timeline-bar-sensor .slider-knob")[0].style.left.length - 1) / 100;

	// Set track time
	tb.trackTime(timePercent * tb.getMetadata("duration"));
}

/* Mouse Movement */
function scrubMouseMoveListener(evt) {
	// Get mouse movement
	var percentage = (evt.clientX / document.body.clientWidth) * 100;

	// Constrain movement inside timeline
	if (percentage < 0) { percentage = 0; }
	if (percentage > 100) { percentage = 100; }

	// Set slider position
	$("#timeline-bar-sensor .slider-knob").css("left", percentage + "%");
	$("#timeline-bar").css("width", percentage + "%");
}

/* Get and Display Track Information */
tb.playbackStarted(function () {
	$("#current-track-title").html(tb.getMetadata("title"));
	$("#current-track-album").html(tb.getMetadata("album"));
	$("#current-track-artist").html(tb.getMetadata("artist"));
	$("<img src='" + tb.getMetadata("artwork") + "' />").appendTo($("#playback-art").html(""));
	$("#playback").removeClass("hidden");
	timelineUpdater();
});

tb.playbackStopped(function () {
	$("#playback").addClass("hidden");
});

$(document).on("mousedown", "#playback-play-pause", function (event) {
	if (event.which === 3) {
		tb.loadTrack();
	}
});

/* Update Slider Position */
function timelineUpdater() {
	if (!seeking) {
		var percentage = tb.trackTime() / tb.getExactTrackTime() * 100;
		if (percentage >= 100) {
			percentage = 100;
		}
		$("#timeline-bar-sensor .slider-knob").css("left", percentage + "%");
		$("#timeline-bar").css("width", percentage + "%");
		$("#song-time").html(tb.formatTime(Math.floor(tb.trackTime())) + " / " + tb.formatTime(tb.getMetadata("duration")));
	}
	requestAnimationFrame(timelineUpdater);
}
/* Spacebar Pause */
$("body").keydown(function (e) {
	var target = e.target || e.srcElement;
	if (target.tagName !== "textarea" && target.type !== "text") {
		if (e.keyCode === 32) {
			if (!pauseKeyDown) {
				pauseKeyDown = true;
				tb.playbackState("toggle");
			}
			return false;
		}
	}
}).keyup(function (e) {
	if (e.keyCode === 32 && pauseKeyDown) {
		pauseKeyDown = false;
	}
});

/* Play/Pause Button Click */
$("#playback-play-pause").click(function () {
	tb.playbackState("toggle");
});

/* Change button when song is played or paused */
tb.onPlaybackStateChange(function (state) {
	if (state === "play") {
		$("#playback-play-pause #play").hide();
		$("#playback-play-pause #pause").show();
		$("#playback-play-pause").attr("title", tb.getTranslation("Pause"));
	} else if (state === "pause") {
		$("#playback-play-pause #pause").hide();
		$("#playback-play-pause #play").show();
		$("#playback-play-pause").attr("title", tb.getTranslation("Play"));
	} else if (state === "ended") {
		$("#playback-play-pause #pause").hide();
		$("#playback-play-pause #play").show();
		$("#playback-play-pause").attr("title", tb.getTranslation("Play"));
	}
});

/* Clear search bar */
$("#search-bar > div > a").click(function () {
	$("#search-bar > div > input").val("");
});
$("#search-bar > div > input").keydown(function (key) {
	// Usually doesn't work in Firefox for some reason
	if (key.keyCode === 27) {
		$("#search-bar > div > input").val("");
	}
});

/* Disable selection with Ctrl + A */
$(function () {
	$(document).keydown(function (objEvent) {
		if (objEvent.ctrlKey) {
			if (objEvent.keyCode === 65 || objEvent.keyCode === 97) {
				return false;
			}
		}
	});
});

/* Volume Mouse Down */
$("#volume-control")[0].addEventListener("mousedown", volumeMouseDownListener);
function volumeMouseDownListener(evt) {
	window.addEventListener("mouseup", volumeMouseUpListener);

	// Bind and call the move listener
	document.addEventListener("mousemove", volumeMouseDownListener);
	volumeMouseMoveListener(evt);
}

/* Volume Mouse Up */
function volumeMouseUpListener() {
	window.removeEventListener("mouseup", volumeMouseUpListener);
	document.removeEventListener("mousemove", volumeMouseDownListener);
}

/* Volume Mouse Movement */
function volumeMouseMoveListener(evt) {
	//cords.left - evt.clientX /

	// Get mouse movement
	var percentage = ((evt.clientX - $("#volume-control .knob").offset().left) / $("#volume-control .knob").width() * 100);

	// Constrain movement inside timeline
	if (percentage < 0) { percentage = 0; }
	if (percentage > 100) { percentage = 100; }

	// Set playback volume
	tb.volume(percentage);

	// Set slider position
	$("#volume-control .knob > div").css("left", percentage + "%");
	$("#volume-control .track > div > div:first-child > div").css("width", percentage + "%");

	// Hide speaker icon sound waves
	if (tb.volume() * 100 < 66) { $("#volume-control svg path:nth-child(1)").hide(); } else { $("#volume-control svg path:nth-child(1)").show(); }
	if (tb.volume() * 100 < 33) { $("#volume-control svg path:nth-child(2)").hide(); } else { $("#volume-control svg path:nth-child(2)").show(); }
	if (tb.volume() * 100 === 0) { $("#volume-control svg path:nth-child(3)").hide(); } else { $("#volume-control svg path:nth-child(3)").show(); }
}

/* Playback Order Buttons */
playbackOrderWrap(0);
function playbackOrderWrap(index) {
	$("#playback-order a").removeClass("playback-order-selected");
	$("#playback-order a:eq(" + index + ")").addClass("playback-order-selected");

	// Reset wrappers
	$("div[class^='playback-order-before-'] > a, div[class*=' playback-order-before-'] > a").unwrap();
	$("div[class^='playback-order-after-'] > a, div[class*=' playback-order-before-'] > a").unwrap();
	$(".playback-order-current > a").unwrap();

	// Add wrappers
	if (index > 0) {
		$("#playback-order > a:nth-child(-n+" + index + ")").wrapAll('<div class="playback-order-before-' + index + '"></div>');
	}
	$("#playback-order > a:eq(0)").wrapAll('<div class="playback-order-current"></div>');
	if ($("#playback-order > a").length > 0) {
		$("#playback-order > a").wrapAll('<div class="playback-order-after-' + $("#playback-order > a").length + '"></div>');
	}
}

$("#playback-order a").click(function () {
	playbackOrderWrap($("#playback-order a").index(this));
});

/* Add buttons */
function addPageTabs() {
	tb.findPackages({ "type": "page" }, false, function (pages) {
		tb.getFileContents("packages/trackbox/templates/page-button.html", function (template) {
			$("#page-tabs").html("");
			Object.keys(pages).forEach(function (page) {
				tb.getFileContents(pages[page].location + "/" + pages[page].pageIcon, function (icon) {
					tb.renderTextTemplate(template, { "URL": pages[page].standardUrl[0], "REPO": pages[page].repo, "NAME": pages[page].name, "ICON": icon }, function (renderedTemplate) {
						$("#page-tabs").append(renderedTemplate);
					});
				});
			});
		});
	});
}

// Call when loaded
if (tb.isPackagesLoaded) {
	addPageTabs();
} else {
	tb.onPackagesLoaded(function () {
		addPageTabs();
	});
}