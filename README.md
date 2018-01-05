# synchronized

Java `synchronized` keyword, but for javascript.

If an asynchronous function is decorated with `synchronized`, it delays calls to this function until all the previous calls are finished. This is true for any function that returns a promise.

Usage:

```javascript
import synchronized from 'synchronized'

const asyncFunction = synchronized(async (a, b, c) => {
	...	
})

const promiseFunction = synchronized((a, b, c) => {
	...	
	return new Promise(...)
})
```

If used as a decorator, it makes method to be `synchronized` only within instance of a class. That means that executing method once at a time is restricted only for one instance, other instances can have their own running methods at that moment.

```javascript
import synchronized from 'synchronized'

class MyClass {
	@synchronized
	async asyncMethod(a, b, c) {
		....
	}

	@synchronized
	promiseMethod(a, b, c) {
		...
		return new Promise(...)
	}
}
```

If you want get decorator behavior but with a function call, you can use `synchronizedMethod` function.

```javascript
import {synchronizedMethod} from 'synchronized'

function MyClass(...) {...}

MyClass.prototype = synchronizedMethod(function(a, b, c) {...})
```
