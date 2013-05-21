var ScribeConsoleTracker = function(config) {
  if (!(this instanceof ScribeConsoleTracker)) return new ScribeConsoleTracker(config);

  this.config = config;
};

ScribeConsoleTracker.prototype.tracker = function(opts) {
  var path = opts.path;
  var value = opts.value;

  console.log(path);
  console.log(value);
};