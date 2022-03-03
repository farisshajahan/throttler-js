const throttler = (maxCallsPerInterval, intervalTime) => {
  let numRunning = 0;
  let callsInThisInterval = 0;
  let startTime = 0;
  const queue = [];
  let schedulerRunning = false;
  let abortSignal = false;

  const dequeue = async () => {
    queue.splice(0, maxCallsPerInterval - numRunning).forEach((fn) => {
      numRunning += 1;
      callsInThisInterval += 1;
      fn(abortSignal);
    });
  };

  const runScheduler = async () => {
    schedulerRunning = true;
    const now = Date.now();
    if (queue.length) {
      if (now > intervalTime + startTime) {
        callsInThisInterval = 0;
        startTime = now;
      }
      if (!callsInThisInterval) startTime = now;
      if (callsInThisInterval < maxCallsPerInterval) {
        dequeue();
      }
      setTimeout(runScheduler, (intervalTime + startTime - now + 1) * 1000);
      return;
    }
    numRunning = 0;
    schedulerRunning = false;
  };

  const enqueue = (fn) => {
    abortSignal = false;
    return new Promise((resolve, reject) => {
      const promise = (abort) => {
        if (!abort)
          Promise.resolve()
            .then(fn)
            .then(resolve)
            .catch(reject)
            .finally(() => {
              numRunning -= 1;
            });
        else reject();
      };
      queue.push(promise);
      if (!schedulerRunning) {
        startTime = Date.now();
        runScheduler();
      }
      dequeue();
    });
  };

  const clearQueue = () => {
    abortSignal = true;
    queue.splice(0, queue.length).forEach((fn) => fn(abortSignal));
    numRunning = 0;
    callsInThisInterval = 0;
  };

  return { enqueue, clearQueue };
};

export default throttler;
