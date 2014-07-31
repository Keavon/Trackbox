var music = new Audio();
var currentTrack;
tb.loadTrack = function (song, autoPlay) {
	autoPlay = autoPlay || false;
	if (typeof song === "number") {
		tb.libraryFind({ "id": song }, false, function (track) {
			currentTrack = track[0];
			console.log(track);
			tb.loadTrack(currentTrack.location, autoPlay);
		});
	} else if (typeof song === "string") {
		music.src = song;
		$(window).trigger("trackLoaded");
		if (autoPlay === true) {
			music.play();
		}
	}
};

tb.trackLoaded = function (callback) {
	$(window).on("trackLoaded", function () {
		callback();
	});
	//music.addEventListener('loadedmetadata', function () {
	//});
};

tb.playbackState = function (action) {
	if (typeof action === "undefined") {
		if (music.paused) {
			return "paused";
		} else {
			return "playing";
		}
	} else {
		if (action === "play") {
			music.play();
		} else if (action === "pause") {
			music.pause();
		} else if (action === "toggle") {
			if (music.paused) {
				music.play();
			} else {
				music.pause();
			}
		}
	}
};

tb.playbackStateChange = function (callback) {
	$(music).on("pause", function () {
		callback("pause");
	});
	$(music).on("play", function () {
		callback("play");
	});
};

tb.trackTime = function (time) {
	if (typeof time !== "undefined") {
		music.currentTime = time;
	} else {
		return music.currentTime;
	}
};

tb.getMetadata = function (metadata) {
	if (metadata === "duration") {
		return currentTrack.time;
	} else if (metadata === "title") {
		return currentTrack.title;
	} else if (metadata === "album") {
		return currentTrack.album;
	} else if (metadata === "artist") {
		return currentTrack.artists[0];
	}
};

tb.trackEnded = function (callback) {
	music.addEventListener("ended", callback());
};

tb.formatTime = function (time) {
	var hours = Math.floor(time / 3600);
	time -= 3600 * hours;

	var minutes = Math.floor(time / 60);
	time -= 60 * minutes;
	if (hours > 0 && minutes < 10) {
		minutes = "0" + minutes;
	}
	minutes += ":";

	if (hours > 0) {
		hours = hours + ":";
	} else {
		hours = "";
	}

	var seconds = time;
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	return hours + minutes + seconds;
};