var ScribeConsoleTracker = function(config) {
  if (!(this instanceof ScribeConsoleTracker)) return new ScribeConsoleTracker(config);

  this.config = config;
};

ScribeConsoleTracker.prototype.tracker = function(info) {
  var path = info.path;
  var value = info.value;

  if (typeof console !== 'undefined') {
    console.log(path);
    console.log(value);

    info.success && setTimeout(info.success, 0);
  } else {
    info.failure && setTimeout(info.failure, 0);
  }
};