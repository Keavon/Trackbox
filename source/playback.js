// Create the audio player object
tb.private.audioPlayer = new Audio();

// Define the current track
tb.private.currentTrack;

// Load a track given the song and an optional value of true to autoplay it
tb.setTrack = function (song, autoPlay) {
	// Set autoPlay to false if argument is omitted
	autoPlay = autoPlay || false;

	// Pause the track
	tb.private.audioPlayer.pause();

	// Track ID
	if (typeof song === "number") {
		// Find the song by its ID
		tb.findById(song, function (track) {
			// Set the location from the ID
			tb.private.currentTrack = track;
			// Call the function again with the path to the track
			tb.setTrack(tb.private.currentTrack.location, autoPlay);
		});
	} else if (typeof song === "string") {
		// Set the source of the song
		tb.private.audioPlayer.src = song;

		// Trigger playback started
		$(window).trigger("playbackStarted");

		// Start playing if autoplay is true
		if (autoPlay === true) {
			tb.private.audioPlayer.play();
		}
	} else if (!song) {
		// No song, unload track and stop playback
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

tb.getTrackTime = function () {
	return tb.private.audioPlayer.currentTime;
};

tb.setTrackTime = function (time) {
	tb.private.audioPlayer.currentTime = time;
};

tb.getTrackLength = function () {
	return tb.private.audioPlayer.duration;
};

tb.getMetadata = function (metadata) {
	if (metadata === "duration") {
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