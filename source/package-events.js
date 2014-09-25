tb.triggerOnPackagesLoaded = function() {
	$.event.trigger({"type": "onPackagesLoaded"});
};

tb.onPackagesLoaded = function(callback) {
	$(window).on("onPackagesLoaded", function() {
		callback();
	});
};
