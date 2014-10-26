---
functionName: onPlaybackStarted
functionInfo:  Calls back when the current track starts or resumes playback
functionParameters:
  - parameter:
    name: "callback"
    info: "Calls back without arguments"
    type:
      - function
---

The `tb.onPlaybackStarted()` function calls the passed function when playback starts or resumes from pause.

{% highlight javascript %}
// Alerts "I just started playing!" when playback starts or resumes
tb.onPlaybackStarted(function() {
	alert("I just started playing!");
});
{% endhighlight %}