---
methodName: cloneObject
methodInfo: Returns a copy of a given object
methodParameters:
  - parameter:
    name: "originalObject"
    info: "Object to be copied"
    type:
      - object / array / date
---

`tb.cloneObject()` is a helper method that can be used to clone an `Object`, `Array`, or `Date`. These may only contain an assortment of `Object`, `Array`, `Date`, `String`, `Number`, and `Boolean` types. This method is used when it is necessary to make a copy of an `Object`, `Array`, or `Date` so that the copy can be changed without affecting the original.

The problem:
{% highlight javascript %}
var normalYear = { "isLeapYear": false, "daysInYear": 365 };
var leapYear = normalYear;
leapYear.isLeapYear = true;
leapYear.daysInYear = 366;

// Leap Year: true, Days: 366
alert("Leap Year: " + leapYear.isLeapYear + ", Days: " + leapYear.daysInYear);

// This produces the same result because changes to leapYear propagated back to normalYear!
// Leap Year: true, Days: 366
alert("Leap Year: " + normalYear.isLeapYear + ", Days: " + normalYear.daysInYear);
{% endhighlight %}

The solution with `tb.cloneObject()`:
{% highlight javascript %}
var normalYear = { "isLeapYear": false, "daysInYear": 365 };
var leapYear = tb.cloneObject(normalYear);
leapYear.isLeapYear = true;
leapYear.daysInYear = 366;

// Leap Year: true, Days: 366
alert("Leap Year: " + leapYear.isLeapYear + ", Days: " + leapYear.daysInYear);

// Now this produces the correct result because normalYear was cloned with tb.cloneObject()
// Leap Year: false, Days: 365
alert("Leap Year: " + normalYear.isLeapYear + ", Days: " + normalYear.daysInYear);
{% endhighlight %}
