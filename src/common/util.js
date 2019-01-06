const throttle = function(fn, delay, mustRunDelay) {
  let timer = null;
  let tStart;
  return function(context, ...args) {
    const tCurr = +new Date();
    clearTimeout(timer);
    if (!tStart) {
      tStart = tCurr;
    }
    if (tCurr - tStart >= mustRunDelay) {
      fn.apply(context, args);
      tStart = tCurr;
    } else {
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, delay);
    }
  };
};

export {
  throttle,
};
