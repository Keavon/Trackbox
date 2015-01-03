// Create the audio player object
tb.private.audioPlayer = new Audio();
tb.private.audioPlayer.pause();

// Define the current track
tb.private.currentTrack;

// Load a track given the song and an optional value of true to autoplay it
tb.setCurrentTrack = function (id, autoPlay) {
	// Pause the track
	tb.private.audioPlayer.pause();

	if (typeof id === "string") {
		// Get information about the track from its ID
		tb.getTrack(id, function (track) {
			// Save the information about the current track
			tb.private.currentTrack = track;

			// Set the source of the song
			tb.private.audioPlayer.src = track.location;

			// Trigger track loaded
			tb.triggerOnTrackLoad();

			// Start playing if autoplay is true
			if (autoPlay) {
				tb.play();
			}
		});
	} else {
		// Set the current track info to null
		tb.private.currentTrack = null;

		// Set time to 0
		tb.private.audioPlayer.currentTime = 0;

		// Set the current track source to blank
		tb.private.audioPlayer.src = "";

		// Trigger the unload event
		tb.triggerOnTrackUnload();
	}
};

// Returns information about the current track
tb.getCurrentTrack = function () {
	return tb.private.currentTrack;
};

// Triggers onTrackLoad
tb.triggerOnTrackLoad = function () {
	$(window).trigger("onTrackLoad");
};

// Calls back when a track is loaded
tb.onTrackLoad = function (callback) {
	$(window).on("onTrackLoad", function () {
		callback();
	});
};

// Triggers onTrackUnload
tb.triggerOnTrackUnload = function () {
	$(window).trigger("onTrackUnload");
};

// Calls back when a track is unloaded
tb.onTrackUnload = function (callback) {
	$(window).on("onTrackUnload", function () {
		callback();
	});
};

// Triggers onPlay
tb.triggerOnPlay = function () {
	$(window).trigger("onPlay");
};

// Calls back when the track starts playing
tb.onPlay = function (callback) {
	$(window).on("onPlay", function () {
		callback();
	});
};

// Triggers onPause
tb.triggerOnPause = function () {
	$(window).trigger("onPause");
};

// Calls back when the track is paused
tb.onPause = function (callback) {
	$(window).on("onPause", function () {
		callback();
	});
};

// Pause the playing track
tb.pause = function () {
	tb.triggerOnPause();
	tb.private.audioPlayer.pause();
};

// Returns true if the current track is paused, false if playing
tb.isPaused = function () {
	return tb.private.audioPlayer.paused;
};

// Plays the current track
tb.play = function () {
	tb.triggerOnPlay();
	tb.private.audioPlayer.play();
};

// Returns true if the current track is playing, false if paused
tb.isPlaying = function () {
	return !tb.private.audioPlayer.paused;
};

// Plays the song if paused and pauses the song if playing
tb.togglePlayPause = function () {
	if (tb.isPlaying()) {
		tb.pause();
	} else {
		tb.play();
	}
};

// Returns true if the current track is loaded, false if it is unloaded
tb.isLoaded = function () {
	// Check if the current track as no source
	if (tb.private.currentTrack === "") {
		return false;
	} else {
		return true;
	}
};

// Returns the current time the track is at
tb.getCurrentTime = function () {
	return tb.private.audioPlayer.currentTime;
};

// Sets the time of the current track
tb.setCurrentTime = function (time) {
	tb.private.audioPlayer.currentTime = time;
};

// Returns the length of the current audio file track
tb.getLength = function () {
	return tb.private.audioPlayer.duration;
};

// Returns the volume of the audio player where 1.0 is 100%
tb.getVolume = function () {
	return tb.private.audioPlayer.volume;
};

// Sets the volume of the audio player where 1.0 is 100%
tb.setVolume = function (volume) {
	tb.private.audioPlayer.volume = volume;
};

// Formats an integer of seconds into hours:minutes:seconds
tb.formatTime = function (time) {
	// Determine the number of hours
	var hours = Math.floor(time / 3600);
	// Remove those hours from the time
	time -= 3600 * hours;

	// Determine the number of minutes
	var minutes = Math.floor(time / 60);
	// Remove those minutes from the time
	time -= 60 * minutes;

	// Add a leading 0 before single-digit minutes
	if (hours > 0 && minutes < 10) {
		minutes = "0" + minutes;
	}

	// Add the colon between minutes and seconds
	minutes += ":";

	// If there are any hours, add the hours and the colon between hours and minutes
	if (hours > 0) {
		hours = hours + ":";
	} else {
		hours = "";
	}

	// Seconds is the remaining time
	var seconds = time;

	// Add a leading 0 before single-digit seconds
	if (seconds < 10) {
		seconds = "0" + seconds;
	}

	// Concatenate the hours, minutes, and seconds
	return hours + minutes + seconds;
};