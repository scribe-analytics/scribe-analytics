var ScribePrecogTracker = function(config) {
  if (!(this instanceof ScribePrecogTracker)) return new ScribePrecogTracker(config);

  this.config = config;
  this.api    = new Precog.api({apiKey: config.apiKey, analyticsService: config.analyticsService});
};

ScribePrecogTracker.prototype.tracker = function(info) {
  var sanitizePath = function(path) {
    return path.replace(/\/+/g, '/');
  };

  info.path = sanitizePath(this.config.rootPath + '/' + info.path);

  if (info.op === 'append') {
    this.api.append({
      path:  info.path,
      value: info.value
    });
  } else if (info.op === 'replace') {
    this.api.uploadFile({
      path:     info.path, 
      contents: JSON.stringify(info.value), 
      type:     'application/json'
    });
  } else throw new Error('Unknown operational semantic: ' + info.op);
};