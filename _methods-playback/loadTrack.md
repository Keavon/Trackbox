---
functionName: loadTrack
functionInfo: Loads a given audio file path as the current track
functionParameters:
  - parameter:
    name: "trackPath"
    info: "Full path to the audio file to be set as the current track"
    type:
      - string
  - parameter:
    name: "autoPlay"
    info: "Play track as soon as it's loaded (default: false)"
    optional: true
    type:
      - boolean
---

The `tb.loadTrack()` function takes a string as the path to an audio file and loads it into the current track. An optional second argument of `true` may be supplied which will make the new track start playing as soon as it's loaded. If this behavior is not desired, it is recommended that the second argument be omitted rather than supplying a value of `false`.

{% highlight javascript %}
// Loads 'Typewriter Dance' as the current track
tb.loadTrack("http://download.blender.org/ED/2-TypewriterDance.mp3");
{% endhighlight %}

{% highlight javascript %}
// Loads 'The Wires' as the current track and starts it playing as soon as it loads
tb.loadTrack("http://download.blender.org/ED/1-TheWires.mp3");
{% endhighlight %}