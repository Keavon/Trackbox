var music = new Audio();
tb.loadTrack = function (song, autoPlay) {
	if (typeof song === "number") {
		tb.libraryFind({ "id": song }, false, function (track) {
			console.log(track);
			tb.loadTrack(track[0].location, true);
		});
	} else if (typeof song === "string") {
		music.src = song;
		if (autoPlay === true) {
			music.play();
		}
	}
};

tb.metadataLoaded = function(callback){
	music.addEventListener('loadedmetadata', function () {
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

tb.getTrackDuration = function () {
	return music.duration;
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