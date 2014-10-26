---
methodName: onPlaybackStarted
methodInfo:  Calls back when the current track starts or resumes playback
methodParameters:
  - parameter:
    name: "callback"
    info: "Calls back without arguments"
    type:
      - function
---

The `tb.onPlaybackStarted()` method calls the passed function when playback starts or resumes from pause.

{% highlight javascript %}
// Alerts "I just started playing!" when playback starts or resumes
tb.onPlaybackStarted(function() {
	alert("I just started playing!");
});
{% endhighlight %}