$(function () {
	$("#listings > div > div").hide();
	$("#listings > div > a").click(function (event) {
		$(this).next().slideToggle(150);

		// Prevents page jump
		event.preventDefault();
		return false;
	});
});