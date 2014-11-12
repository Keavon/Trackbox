---
methodName: sortByProperties
methodInfo:  Returns a function used in Array.sort() to sort tracks by specified properties
methodParameters:
  - parameter:
    name: "sortProperties"
    info: "One or more strings starting with + or - followed by the sort property name"
    type:
      - string
---

The `tb.sortByProperties()` method returns a function that is used by Array.sort(). It orders an array of objects (i.e. a library of tracks) by the objects' properties (i.e. a track's metadata). An unlimited number of arguments may be supplied. Each argument contains a `+` or `-` prefix followed by the name of the sort property, e.g. `+album` or `-artist`. Use `+` for ascending order and `-` for descending order. Missing properties are ordered last.

Note: The `+` prefix is usually optional, but highly recommended. It *is* necessary when sorting by a property starting with a plus character or minus character, e.g. `+-foo-` where the property name is &ldquo;-foo-&rdquo;.

{% highlight javascript %}
// Sorts a music library by album name then track number, both in ascending order
var library = tb.getLibrary();
library.sort(tb.sortByProperties("+album", "+track"));
{% endhighlight %}