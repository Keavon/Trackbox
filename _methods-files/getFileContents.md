---
methodName: getFileContents
methodInfo: Reads an external file and calls back with the contents of its text
methodParameters:
  - parameter:
    name: "filePath"
    info: "Full path to the file to be read"
    type:
      - string
  - parameter:
    name: "callback"
    info: "Calls back with one argument, a string with the file's text"
    type:
      - function
---

The `tb.getFileContents()` method takes a string as the path to a file and calls back with one argument, a string containing the file's text. File type does not matter. See tb.getJSONFileContents for reading JSON files.

{% highlight javascript %}
// Alerts the plaintext contents of the lorem-ipsum.txt file
tb.getFileContents("files/lorem-ipsum.txt", function(text) {
	alert(text);
});
{% endhighlight %}

{% highlight javascript %}
// Inserts the contents of template.html in a div with the ID "container"
tb.getFileContents("template.html", function(template) {
	$("container").html(template);
});
{% endhighlight %}
