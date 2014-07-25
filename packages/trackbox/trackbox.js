document.getElementById("timeline-bar-sensor").addEventListener("mousedown", scrubMouseDownListener, false);
var seeking = false;

function scrubMouseDownListener(evt) {
	seeking = true;
	window.addEventListener("mouseup", scrubMouseUpListener, false);
	evt.preventDefault();
	document.addEventListener("mousemove", scrubMouseDownListener, false);
	scrubMouseMoveListener(evt);
	if (!music.paused) {
		enableSliderUpdate(false);
	}
}
function scrubMouseUpListener() {
	window.removeEventListener("mouseup", scrubMouseUpListener, false);
	document.removeEventListener("mousemove", scrubMouseDownListener, false);
	if (!music.paused) {
		enableSliderUpdate(true);
	}
	seeking = false;
}
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

var music = new Audio('http://media.steampowered.com/apps/portal2/soundtrack/01/mp3/01_Science_is_Fun.mp3');
music.addEventListener("ended", function () { $("#playback-play-pause > #pause").hide(); $("#playback-play-pause > #play").show(); }, false);
var duration = 0.0;
var durationTotal = "-:--";

$.ajax({
	url: "packages/trackbox/icons/playback_play.svg",
	dataType: "text"
}).done(function (data) {
	$("#playback-play-pause > #play").html(data);
});

$.ajax({
	url: "packages/trackbox/icons/playback_pause.svg",
	dataType: "text"
}).done(function (data) {
	$("#playback-play-pause > #pause").hide().html(data);
});

music.addEventListener('loadedmetadata', function () {
	duration = music.duration;
	durationTotal = Math.floor(duration / 60) + ":" + Math.floor(duration % 60);
	$("#song-time").html("0:00/" + durationTotal);
});

var sliderLoop;
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

$('body').keyup(function (e) {
	if (e.keyCode === 32) {
		pausePlay();
	}
});
$("#playback-play-pause").click(function () {
	pausePlay();
});

function pausePlay() {
	if (music.paused) {
		music.play();
		if (!seeking) {
			enableSliderUpdate(true);
		}
		$("#playback-play-pause > #play").hide();
		$("#playback-play-pause > #pause").show();
	} else {
		music.pause();
		enableSliderUpdate(false);
		$("#playback-play-pause > #pause").hide();
		$("#playback-play-pause > #play").show();
	}
}