---
methodName: getJSONFileContents
methodInfo:  Reads an external JSON file and calls back with its data
methodParameters:
  - parameter:
    name: "filePath"
    info: "Full path to the JSON file to be read"
    type:
      - string
  - parameter:
    name: "callback"
    info: "Calls back with one argument, the file's JavaScript object"
    type:
      - function
---

The `tb.getJSONFileContents()` method takes a string as the path to a `.json` file and calls back with one argument, the JavaScript object read from the file.

{% highlight javascript %}
// Alerts the JavaScript object retrieved from data.json
tb.getJSONFileContents("data.json", function(data) {
	alert(data);
});
{% endhighlight %}