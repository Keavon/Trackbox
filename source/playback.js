tb.private.audioPlayer = new Audio();
tb.private.currentTrack;

tb.loadTrack = function (song, autoPlay) {
	autoPlay = autoPlay || false;
	tb.private.audioPlayer.pause();
	if (typeof song === "number") {
		tb.findById(song, function (track) {
			tb.private.currentTrack = track;
			tb.loadTrack(tb.private.currentTrack.location, autoPlay);
		});
	} else if (typeof song === "string") {
		tb.private.audioPlayer.src = song;
		$(window).trigger("playbackStarted");
		if (autoPlay === true) {
			tb.private.audioPlayer.play();
		}
	} else if (!song) {
		tb.private.audioPlayer.src = "";
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
		if (tb.private.audioPlayer.paused) {
			return "paused";
		} else {
			return "playing";
		}
	} else {
		if (action === "play") {
			tb.private.audioPlayer.play();
		} else if (action === "pause") {
			tb.private.audioPlayer.pause();
		} else if (action === "toggle") {
			if (tb.private.audioPlayer.paused) {
				tb.private.audioPlayer.play();
			} else {
				tb.private.audioPlayer.pause();
			}
		}
	}
};

tb.onPlaybackStateChange = function (callback) {
	$(tb.private.audioPlayer).on("pause", function () {
		callback("pause");
	});
	$(tb.private.audioPlayer).on("play", function () {
		callback("play");
	});
	$(tb.private.audioPlayer).on("ended", function () {
		callback("ended");
	});
};

tb.trackTime = function (time) {
	if (typeof time !== "undefined") {
		tb.private.audioPlayer.currentTime = time;
	} else {
		return tb.private.audioPlayer.currentTime;
	}
};

tb.getExactTrackTime = function () {
	return tb.private.audioPlayer.duration;
};

tb.getMetadata = function (metadata) {
	if (metadata === "duration") {
		// Use getExactTrackTime() for accurate time of currently playing track
		return tb.private.currentTrack.time;
	} else if (metadata === "title") {
		return tb.private.currentTrack.title;
	} else if (metadata === "album") {
		return tb.private.currentTrack.album;
	} else if (metadata === "artist") {
		return tb.private.currentTrack.artists[0];
	} else if (metadata === "artwork") {
		if (tb.private.currentTrack.artwork) {
			return tb.private.currentTrack.artwork;
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
		tb.private.audioPlayer.volume = vol / 100;
	} else {
		return tb.private.audioPlayer.volume;
	}
};