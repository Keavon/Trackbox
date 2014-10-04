tb.private.packagesLoaded = false;

tb.isPackagesLoaded = function () {
	return tb.private.packagesLoaded;
};

tb.triggerOnPackagesLoaded = function () {
	tb.private.packagesLoaded = true;
	$.event.trigger({ "type": "onPackagesLoaded" });
};

tb.onPackagesLoaded = function (callback) {
	$(window).on("onPackagesLoaded", function () {
		callback();
	});
};

tb.triggerOnShellPackageLoaded = function () {
	$.event.trigger({ "type": "onShellPackageLoaded" });
};

tb.onShellPackageLoaded = function (callback) {
	$(window).on("onShellPackageLoaded", function () {
		callback();
	});
};
