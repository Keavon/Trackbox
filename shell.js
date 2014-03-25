/*$(document).ready(function ()
{
	var slider = $(".slider > div > div > div > div > div");
	var track = $(".slider > div > div > div > div");

	for (var i = 0; i < slider.length; i++)
	{
		slider[i].addEventListener("mousedown", function (event) { return mouseDownListener.call(this, i, event); });
		window.addEventListener("mouseup", function (event) { return mouseUpListener.call(this, i, event); });
	}
	function mouseDownListener(i, evt)
	{
		var sliderOffset = evt.clientX - getPosition(slider[i]);
		alert("It's " + i); // Alerts 2
		window.addEventListener('mousemove', function (event) { return mouseMoveListener.call(this, sliderOffset, i, event); });
		mouseMoveListener(sliderOffset, i, evt);
	}
	function mouseUpListener(i, evt)
	{
		window.removeEventListener("mousemove", mouseMoveListener);
		slider[i].className = "";
	}
	function mouseMoveListener(sliderOffset, i, evt)
	{
		alert(i);
		console.log(sliderOffset);
		var mouseX = evt.clientX;

		var trackWidth = track[i].offsetWidth;
		var trackLeft = getPosition(track[i]);

		var sliderWidth = slider[i].offsetWidth;
		var sliderLeft = getPosition(slider[i]);


		mouseX -= trackLeft - sliderOffset;

		if (mouseX <= 0)
			mouseXGo = 0;
		else if (mouseX >= trackWidth)
			mouseXGo = trackWidth;
		else
			mouseXGo = mouseX;

		slider[i].style.left = ((mouseXGo / trackWidth) * 100) + "%";
		slider[i].className = "slider-hover";
	}

	function getPosition(element)
	{
		var xPosition = 0;

		while (element)
		{
			xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
			element = element.offsetParent;
		}
		return xPosition;
	}
});*/