# Throttler utility for Javascript

Throttling is a mechanism to control the number of requests / calls performed on a resource in a given amount of time. This can help in scripts where large number of requests are to be sent to a resource which has rate limiting policies set in place or control the pseudo-concurrency level of your program

## How to use?

Create a throttler object and enqueue callback functions asynchronously. In order to abort remaining unprocessed requests, call the clearQueue method on throttler. Please note that there is no way to cancel callbacks that have already entered the processing phase. This is due to JavaScript's inherent language design.

```
const Throttler = require("./throttler.js");
const throttler = Throttler(5, 10) // Creates a throttler that calls and runs atmost 5 functions in queue in 10 seconds

const testFn = async (num) => console.log(num);

for (let i = 0; i < 10; i += 1)
	throttler.enqueue(() => testFn(i));

throttler.clearQueue();
```

