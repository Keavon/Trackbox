// Says if all packages have been loaded
tb.isPackagesLoaded = function () {
	return tb.private.packagesLoaded || false;
};

// Triggers onPackagesLoaded and marks packages as loaded
tb.triggerOnPackagesLoaded = function () {
	tb.private.packagesLoaded = true;
	$.event.trigger("onPackagesLoaded");
};

// Calls back when packages are loaded
tb.onPackagesLoaded = function (callback) {
	$(window).on("onPackagesLoaded", function () {
		callback();
	});
};

// Triggers onShellPackageLoaded
tb.triggerOnShellPackageLoaded = function () {
	$.event.trigger("onShellPackageLoaded");
};

// Calls back when the shell package is loaded
tb.onShellPackageLoaded = function (callback) {
	$(window).on("onShellPackageLoaded", function () {
		callback();
	});
};
