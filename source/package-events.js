tb.triggerOnPackagesLoaded = function() {
	$.event.trigger({"type": "onPackagesLoaded"});
};

tb.onPackagesLoaded = function(callback) {
	$(window).on("onPackagesLoaded", function() {
		callback();
	});
};

tb.triggerOnShellPackageLoaded = function() {
	$.event.trigger({"type": "onShellPackageLoaded"});
};

tb.onShellPackageLoaded = function(callback) {
	$(window).on("onShellPackageLoaded", function() {
		callback();
	});
};
