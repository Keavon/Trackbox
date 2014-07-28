var music = new Audio('http://media.steampowered.com/apps/portal2/soundtrack/01/mp3/01_Science_is_Fun.mp3');
var seeking = false;
var duration = 0.0;
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
	if (!music.paused) {
		enableSliderUpdate(false);
	}
}

/* Mouse Up */
function scrubMouseUpListener() {
	window.removeEventListener("mouseup", scrubMouseUpListener);
	document.removeEventListener("mousemove", scrubMouseDownListener);

	var timePercent = $("#timeline-knob")[0].style.left;
	timePercent = timePercent.substring(0, timePercent.length - 1);
	timePercent = timePercent / 100;
	music.currentTime = timePercent * duration;

	if (!music.paused) {
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
music.addEventListener("ended", function () {
	$("#playback-play-pause > #pause").hide();
	$("#playback-play-pause > #play").show();
	enableSliderUpdate(false);
});

/* Get and Display Track Length */
music.addEventListener('loadedmetadata', function () {
	duration = music.duration;
	durationTotal = Math.floor(duration / 60) + ":" + Math.floor(duration % 60);
	$("#song-time").html("0:00/" + durationTotal);
});

/* Update Slider Position Every 50 ms */
function enableSliderUpdate(enable) {
	if (enable) {
		sliderLoop = setInterval(function () {
			var durationMinutes = Math.floor(music.currentTime / 60);
			var durationSeconds = Math.floor(music.currentTime % 60);
			if (durationSeconds < 10) {
				durationSeconds = "0" + durationSeconds;
			}
			var percentage = (music.currentTime / duration) * 100;
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
				pausePlay();
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
	pausePlay();
});

/* Pause/Play */
function pausePlay() {
	if (music.paused) {
		music.play();
		if (!seeking) {
			enableSliderUpdate(true);
		}
		$("#playback-play-pause > #play").hide();
		$("#playback-play-pause > #pause").show();
		$("#playback-play-pause").attr("title", tb.getTranslation.v1("Pause"));
	} else {
		music.pause();
		enableSliderUpdate(false);
		$("#playback-play-pause > #pause").hide();
		$("#playback-play-pause > #play").show();
		$("#playback-play-pause").attr("title", tb.getTranslation.v1("Play"));
	}
}

$("#search-bar > div > a").click(function () {
	$("#search-bar > div > input").val("");
});

// Usually doesn't work in Firefox for some reason
$("#search-bar > div > input").keydown(function (key) {
	if (key.keyCode === 27) {
		$("#search-bar > div > input").val("");
	}
});