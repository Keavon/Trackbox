var music = new Audio();
var currentTrack;

tb.loadTrack = function (song, autoPlay) {
	autoPlay = autoPlay || false;
	music.pause();
	if (typeof song === "number") {
		tb.findById(song, function (track) {
			currentTrack = track;
			tb.loadTrack(currentTrack.location, autoPlay);
		});
	} else if (typeof song === "string") {
		music.src = song;
		$(window).trigger("playbackStarted");
		if (autoPlay === true) {
			music.play();
		}
	} else if (!song) {
		music.src = "";
		$(window).trigger("playbackStopped");
	}
};

tb.playbackStarted = function (callback) {
	$(window).on("playbackStarted", function () {
		callback();
	});
};

tb.playbackStopped = function (callback) {
	$(window).on("playbackStopped", function () {
		callback();
	});
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

tb.onPlaybackStateChange = function (callback) {
	$(music).on("pause", function () {
		callback("pause");
	});
	$(music).on("play", function () {
		callback("play");
	});
	$(music).on("ended", function () {
		callback("ended");
	});
};

tb.trackTime = function (time) {
	if (typeof time !== "undefined") {
		music.currentTime = time;
	} else {
		return music.currentTime;
	}
};

tb.getExactTrackTime = function () {
	return music.duration;
};

tb.getMetadata = function (metadata) {
	if (metadata === "duration") {
		// Use getExactTrackTime() for accurate time of currently playing track
		return currentTrack.time;
	} else if (metadata === "title") {
		return currentTrack.title;
	} else if (metadata === "album") {
		return currentTrack.album;
	} else if (metadata === "artist") {
		return currentTrack.artists[0];
	} else if (metadata === "artwork") {
		if (currentTrack.artwork) {
			return currentTrack.artwork;
		} else {
			return "covers/album_art.png";
		}
	}
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

tb.volume = function (vol) {
	if (vol || vol === 0) {
		music.volume = vol / 100;
	} else {
		return music.volume;
	}
};