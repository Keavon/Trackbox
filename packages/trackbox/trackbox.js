﻿var seeking = false;
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
	var timePercent = $("#timeline-knob")[0].style.left.substring(0, $("#timeline-knob")[0].style.left.length - 1) / 100;

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
	$("#timeline-knob").css("left", percentage + "%");
	$("#timeline-bar").css("width", percentage + "%");
}

/* Get and Display Track Information */
tb.trackLoaded(function () {
	$("#current-track-title").html(tb.getMetadata("title"));
	$("#current-track-album").html(tb.getMetadata("album"));
	$("#current-track-artist").html(tb.getMetadata("artist"));
	$("<img src='" + tb.getMetadata("artwork") + "' />").appendTo($("#playback-art").html(""));
	$("#playback").removeClass("hidden");
});

tb.trackLoaded(function () {
	timelineUpdater();
});

/* Update Slider Position */
function timelineUpdater() {
	if (!seeking) {
		var percentage = tb.trackTime() / tb.getExactTrackTime() * 100;
		if (percentage >= 100) {
			percentage = 100;
		}
		$("#timeline-knob").css("left", percentage + "%");
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
		$("#playback-play-pause > #play").hide();
		$("#playback-play-pause > #pause").show();
		$("#playback-play-pause").attr("title", tb.getTranslation("Pause"));
	} else if (state === "pause") {
		$("#playback-play-pause > #pause").hide();
		$("#playback-play-pause > #play").show();
		$("#playback-play-pause").attr("title", tb.getTranslation("Play"));
	} else if (state === "ended") {
		$("#playback-play-pause > #pause").hide();
		$("#playback-play-pause > #play").show();
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