tb.loadTrack("http://download.blender.org/demo/movies/ToS/Tears-Of-Steel-OST/02%20The%20dome.mp3", false);
var seeking = false;
var durationTotal = "-:--";
var sliderLoop;
var pauseKeyDown = false;

/* Mouse Down */
$("#timeline-bar-sensor")[0].addEventListener("mousedown", scrubMouseDownListener);
function scrubMouseDownListener(evt) {
	seeking = true;
	window.addEventListener("mouseup", scrubMouseUpListener);
	evt.preventDefault();
	document.addEventListener("mousemove", scrubMouseDownListener);
	scrubMouseMoveListener(evt);
	if (tb.playbackState() === "playing") {
		enableSliderUpdate(false);
	}
}

/* Mouse Up */
function scrubMouseUpListener() {
	window.removeEventListener("mouseup", scrubMouseUpListener);
	document.removeEventListener("mousemove", scrubMouseDownListener);

	// Set time
	var timePercent = $("#timeline-knob")[0].style.left;
	timePercent = timePercent.substring(0, timePercent.length - 1);
	timePercent = timePercent / 100;
	tb.trackTime(timePercent * tb.getTrackDuration());
	if (tb.playbackState() === "playing") {
		enableSliderUpdate(true);
	}
	seeking = false;
}

/* Mouse Movement */
function scrubMouseMoveListener(evt) {
	var percentage = (evt.clientX / document.body.clientWidth) * 100;
	if (percentage < 0) {
		percentage = 0;
	}
	if (percentage > 100) {
		percentage = 100;
	}
	$("#timeline-knob").css("left", percentage + "%");
	$("#timeline-bar").css("width", percentage + "%");
}

/* Check When Music Ends */
tb.trackEnded(function () {
	$("#playback-play-pause > #pause").hide();
	$("#playback-play-pause > #play").show();
	enableSliderUpdate(false);
});

/* Get and Display Track Length */
tb.metadataLoaded(function () {
	durationTotal = Math.floor(tb.getTrackDuration() / 60) + ":" + Math.floor(tb.getTrackDuration() % 60);
	$("#song-time").html("0:00/" + durationTotal);
});

/* Update Slider Position Every 50 ms */
function enableSliderUpdate(enable) {
	if (enable) {
		sliderLoop = setInterval(function () {
			var durationMinutes = Math.floor(tb.trackTime() / 60);
			var durationSeconds = Math.floor(tb.trackTime() % 60);
			if (durationSeconds < 10) {
				durationSeconds = "0" + durationSeconds;
			}
			var percentage = (tb.trackTime() / tb.getTrackDuration()) * 100;
			$("#timeline-knob").css("left", percentage + "%");
			$("#timeline-bar").css("width", percentage + "%");
			$("#song-time").html(durationMinutes + ":" + durationSeconds + "/" + durationTotal);
		}, 50);
	} else {
		clearInterval(sliderLoop);
	}
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

/* Play/Pause Button Click */
$("#playback-play-pause").click(function () {
	tb.playbackState("toggle");
});

// Change button when song is played or paused
tb.playbackStateChange(function (state) {
	if (state === "play") {
		if (!seeking) {
			enableSliderUpdate(true);
		}
		$("#playback-play-pause > #play").hide();
		$("#playback-play-pause > #pause").show();
		$("#playback-play-pause").attr("title", tb.getTranslation("Pause"));
	} else if (state === "pause") {
		enableSliderUpdate(false);
		$("#playback-play-pause > #pause").hide();
		$("#playback-play-pause > #play").show();
		$("#playback-play-pause").attr("title", tb.getTranslation("Play"));
	}
});