---
methodName: getLibrary
methodInfo: Returns an array with a copy of the complete library
---

The `tb.getLibrary()` method returns a copy of the entire music library. Modifications to this copy are not made to the actual library. The array contains many objects, each one a different track. There is no guarantee that the tracks are in any coherent order. Use [tb.sortByProperties()](#sortByProperties) to sort the library.