tb.onShellLoaded(function () {
	var pauseKeyDown = false;
	var updateScrubber = true;

	// Scrubber Mouse Down
	$("#timeline-bar-sensor")[0].addEventListener("mousedown", scrubMouseDownListener);
	function scrubMouseDownListener(evt) {
		updateScrubber = false;
		window.addEventListener("mouseup", scrubMouseUpListener);

		// Disable text selection while dragging
		evt.preventDefault();

		// Bind and call the move listener
		document.addEventListener("mousemove", scrubMouseDownListener);
		scrubMouseMoveListener(evt);
	}

	// Scrubber mouse up
	function scrubMouseUpListener() {
		updateScrubber = true;
		window.removeEventListener("mouseup", scrubMouseUpListener);
		document.removeEventListener("mousemove", scrubMouseDownListener);

		// Get slider position
		var timePercent = $("#timeline-bar-sensor .slider-knob")[0].style.left.substring(0, $("#timeline-bar-sensor .slider-knob")[0].style.left.length - 1) / 100;

		// Set track time
		tb.setCurrentTime(timePercent * tb.getLength());
	}

	// Scrubber mouse movement
	function scrubMouseMoveListener(evt) {
		// Get mouse movement
		var percentage = (evt.clientX / document.body.clientWidth) * 100;

		// Constrain movement inside timeline
		if (percentage < 0) { percentage = 0; }
		if (percentage > 100) { percentage = 100; }

		// Set slider position
		$("#timeline-bar-sensor .slider-knob").css("left", percentage + "%");
		$("#timeline-bar").css("width", percentage + "%");
	}

	// Get and display track information
	tb.onTrackLoad(function () {
		updateScrubber = true;
		var metadata = tb.getCurrentTrack();
		$("#current-track-title").html(metadata.title);
		$("#current-track-album").html(metadata.album);
		$("#current-track-artist").html(metadata.artists[0]);
		$("<img src='" + metadata.artwork + "' />").appendTo($("#playback-art").html(""));
		$("#playback").removeClass("hidden");
		timelineUpdater();
	});

	// Hide the playback bar when the track is unloaded
	tb.onTrackUnload(function () {
		$("#playback").addClass("hidden");
	});

	$(document).on("mousedown", "#playback-play-pause", function (event) {
		// Right click on the playback button to close the track
		if (event.which === 3) {
			updateScrubber = false;
			tb.setCurrentTrack();
		}
	});

	// Update slider position
	function timelineUpdater() {
		if (updateScrubber) {
			var percentage = tb.getCurrentTime() / tb.getLength() * 100;
			if (percentage >= 100) {
				percentage = 100;
			}
			$("#timeline-bar-sensor .slider-knob").css("left", percentage + "%");
			$("#timeline-bar").css("width", percentage + "%");
			$("#song-time").html(tb.formatTime(Math.floor(tb.getCurrentTime())) + " / " + tb.formatTime(Math.round(tb.getLength())));
		}

		requestAnimationFrame(timelineUpdater);
	}
	// Spacebar pause
	$("body").keydown(function (e) {
		var target = e.target || e.srcElement;
		if (target.tagName !== "textarea" && target.type !== "text") {
			if (e.keyCode === 32) {
				if (!pauseKeyDown) {
					pauseKeyDown = true;
					tb.togglePlayPause();
				}
				return false;
			}
		}
	}).keyup(function (e) {
		if (e.keyCode === 32 && pauseKeyDown) {
			pauseKeyDown = false;
		}
	});

	// Play/Pause button click
	$("#playback-play-pause").click(function () {
		tb.togglePlayPause();
	});

	// Change Play/Pause button to Pause when the music is playing
	tb.onPlay(function () {
		$("#playback-play-pause #play").hide();
		$("#playback-play-pause #pause").show();
		$("#playback-play-pause").attr("title", tb.getTranslation("Pause"));
	});

	// Change Play/Pause button to Play when the music is paused
	tb.onPause(function () {
		$("#playback-play-pause #pause").hide();
		$("#playback-play-pause #play").show();
		$("#playback-play-pause").attr("title", tb.getTranslation("Play"));
	});

	// REST OF INTERFACE //

	// Clear search bar
	$("#search-bar > div > a").click(function () {
		$("#search-bar > div > input").val("");
	});
	$("#search-bar > div > input").keydown(function (key) {
		// Usually doesn't work in Firefox for some reason
		if (key.keyCode === 27) {
			$("#search-bar > div > input").val("");
		}
	});

	// Disable selection with Ctrl + A
	$(function () {
		$(document).keydown(function (objEvent) {
			if (objEvent.ctrlKey) {
				if (objEvent.keyCode === 65 || objEvent.keyCode === 97) {
					return false;
				}
			}
		});
	});

	// Volume slider mouse down
	$("#volume-control")[0].addEventListener("mousedown", volumeMouseDownListener);
	function volumeMouseDownListener(event) {
		window.addEventListener("mouseup", volumeMouseUpListener);

		// Bind and call the move listener
		document.addEventListener("mousemove", volumeMouseDownListener);
		volumeMouseMoveListener(event);
	}

	// Volume slider mouse up
	function volumeMouseUpListener() {
		window.removeEventListener("mouseup", volumeMouseUpListener);
		document.removeEventListener("mousemove", volumeMouseDownListener);
	}

	// Volume slider mouse movement
	function volumeMouseMoveListener(evt) {
		// Get mouse movement
		var percentage = ((evt.clientX - $("#volume-control .knob").offset().left) / $("#volume-control .knob").width() * 100);

		// Constrain movement inside timeline
		if (percentage < 0) { percentage = 0; }
		if (percentage > 100) { percentage = 100; }

		// Set playback volume
		tb.setVolume(percentage / 100);

		// Set slider position
		$("#volume-control .knob > div").css("left", percentage + "%");
		$("#volume-control .track > div > div:first-child > div").css("width", percentage + "%");

		// Hide speaker icon sound waves
		if (tb.getVolume() * 100 < 66) { $("#volume-control svg path:nth-child(1)").hide(); } else { $("#volume-control svg path:nth-child(1)").show(); }
		if (tb.getVolume() * 100 < 33) { $("#volume-control svg path:nth-child(2)").hide(); } else { $("#volume-control svg path:nth-child(2)").show(); }
		if (tb.getVolume() * 100 === 0) { $("#volume-control svg path:nth-child(3)").hide(); } else { $("#volume-control svg path:nth-child(3)").show(); }
	}

	// Playback Order buttons
	playbackOrderWrap(0);
	function playbackOrderWrap(index) {
		$("#playback-order a").removeClass("playback-order-active");
		$("#playback-order a:eq(" + index + ")").addClass("playback-order-active");

		// Reset wrappers
		$("div[class^='playback-order-before-'] > a, div[class*=' playback-order-before-'] > a").unwrap();
		$("div[class^='playback-order-after-'] > a, div[class*=' playback-order-before-'] > a").unwrap();
		$(".playback-order-current > a").unwrap();

		// Add wrappers
		if (index > 0) {
			$("#playback-order > a:nth-child(-n+" + index + ")").wrapAll('<div class="playback-order-before-' + index + '"></div>');
		}
		$("#playback-order > a:eq(0)").wrapAll('<div class="playback-order-current"></div>');
		if ($("#playback-order > a").length > 0) {
			$("#playback-order > a").wrapAll('<div class="playback-order-after-' + $("#playback-order > a").length + '"></div>');
		}
	}

	// Click on a Playback Order button
	$("#playback-order a").click(function () {
		playbackOrderWrap($("#playback-order a").index(this));
	});

	// Add page tabs
	function addPageTabs() {
		tb.onPackagesLoaded(function () {
			tb.getPackages({ "type": "page" }, false, function (pages) {
				tb.getPackageLocation("trackbox/trackbox", function (location) {
					tb.getFileContents(location + "/templates/page-button.html", function (template) {
						$("#page-tabs").html("");
						Object.keys(pages).forEach(function (page) {
							tb.getFileContents(pages[page].location + "/" + pages[page].pageIcon, function (icon) {
								var renderedTemplate = tb.render(template, {
									"URL": pages[page].preferredUrl,
									"REPO": pages[page].repo.replace("/", ":"),
									"NAME": tb.getTranslation(pages[page].pageName),
									"ICON": icon
								});
								$("#page-tabs").append(renderedTemplate);
								if (tb.getCurrentPageUrl() === pages[page].url || pages[page].standardUrl.indexOf(tb.getCurrentPageUrl()) !== -1) {
									selectPageTab(pages[page].repo);
								}
							});
						});
					});
				});
			});
		});
	}

	// Call for page tabs to be added
	if (tb.isPackagesLoaded) {
		addPageTabs();
	} else {
		tb.onPackagesLoaded(function () {
			addPageTabs();
		});
	}

	// Call to select current page tab
	tb.onPageLoadInitiated(function (repo) {
		selectPageTab(repo);
	});

	// Mark active page tab as selected
	function selectPageTab(repo) {
		repo = repo.replace("/", "\\:");
		$("#page-tabs > a").removeClass("page-selector-active");
		$("#" + repo).addClass("page-selector-active");
	}
});