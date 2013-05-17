
/**
 * Constructs a new Scribe Analytics tracker.
 *
 * @constructor Scribe
 *
 * @param options.tracker   The tracker to use for tracking events.
 *                          Must be: function(collection, event).
 *
 */
var Scribe = function(options) {
  if (!(this instanceof Scribe)) return new Scribe(config);

  options = options || {};

  this.options    = options;
  this.tracker    = options.tracker;

  this.initialize();
};

(function(Scribe) {
  Scribe.prototype.options = function() {
    return this.options;
  };

  // Browser Detection
  var BrowserDetect = (function() {
  var BrowserDetect = {
    init: function () {
      this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
      this.version = this.searchVersion(navigator.userAgent) || 
        this.searchVersion(navigator.appVersion) || 
        "an unknown version";
      this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
      for (var i=0;i<data.length;i++) {
        var dataString = data[i].string;
        var dataProp = data[i].prop;
        this.versionSearchString = data[i].versionSearch || data[i].identity;
        if (dataString) {
          if (dataString.indexOf(data[i].subString) != -1)
            return data[i].identity;
        }
        else if (dataProp)
          return data[i].identity;
      }
    },
    searchVersion: function (dataString) {
      var index = dataString.indexOf(this.versionSearchString);
      if (index == -1) return;
      return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: [
      {
        string: navigator.userAgent,
        subString: "Chrome",
        identity: "Chrome"
      },
      {   string: navigator.userAgent,
        subString: "OmniWeb",
        versionSearch: "OmniWeb/",
        identity: "OmniWeb"
      },
      {
        string: navigator.vendor,
        subString: "Apple",
        identity: "Safari",
        versionSearch: "Version"
      },
      {
        prop: window.opera,
        identity: "Opera",
        versionSearch: "Version"
      },
      {
        string: navigator.vendor,
        subString: "iCab",
        identity: "iCab"
      },
      {
        string: navigator.vendor,
        subString: "KDE",
        identity: "Konqueror"
      },
      {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
      },
      {
        string: navigator.vendor,
        subString: "Camino",
        identity: "Camino"
      },
      {   // for newer Netscapes (6+)
        string: navigator.userAgent,
        subString: "Netscape",
        identity: "Netscape"
      },
      {
        string: navigator.userAgent,
        subString: "MSIE",
        identity: "Explorer",
        versionSearch: "MSIE"
      },
      {
        string: navigator.userAgent,
        subString: "Gecko",
        identity: "Mozilla",
        versionSearch: "rv"
      },
      {     // for older Netscapes (4-)
        string: navigator.userAgent,
        subString: "Mozilla",
        identity: "Netscape",
        versionSearch: "Mozilla"
      }
    ],
    dataOS : [
      {
        string: navigator.platform,
        subString: "Win",
        identity: "Windows"
      },
      {
        string: navigator.platform,
        subString: "Mac",
        identity: "Mac"
      },
      {
           string: navigator.userAgent,
           subString: "iPod",
           identity: "iPod"
      },
      {
           string: navigator.userAgent,
           subString: "iPad",
           identity: "iPad"
      },
      {
           string: navigator.userAgent,
           subString: "iPhone",
           identity: "iPhone"
      },      
      {
        string: navigator.platform,
        subString: "Linux",
        identity: "Linux"
      }
    ]

  };
  BrowserDetect.init();
  return BrowserDetect;})();

  var Util = {};

  Util.removeElement = function(array, from, to) {
    var tail = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, tail);
  };

  Util.genCssSelector = function(node) {
    var sel = '';

    while (node != document.body) {
      var id = node.id;
      var classes = node.className.split(" ").join(".");
      var tagName = node.nodeName.toLowerCase();

      if (id && id !== "") id = '#' + id;
      if (classes !== "") classes = '.' + classes;

      var prefix = tagName + id + classes;

      var parent = node.parentNode;
      
      var index = -1;
      var priors = [];
      for (var i = 0; i < parent.childNodes.length; i++) {
        if (parent.childNodes[i] === node) {
          index = (i + 1);
          break;
        } else {
          var childTagName = parent.childNodes[i].tagName;
          if (childTagName !== undefined) {
            var suffix = (priors.length === 0) ? ':first-child' : '';

            priors.push(childTagName.toLowerCase() + suffix);
          }
        }
      }

      priors.clear();

      priors.push(prefix);

      if (sel !== '') sel = '>' + sel;

      sel = priors.join('+') + ':nth-child(' + index + ')' + sel;

      node = parent;
    }

    return sel;
  };

  Util.merge = function(o1, o2) {
    var r, key, index;
    if (o1 === undefined) return o1;
    else if (o2 === undefined) return o1;
    else if (o1 instanceof Array && o2 instanceof Array) {
      r = [];
      // Copy
      for (index = 0; index < o1.length; index++) {
        r.push(o1[index]);
      }
      // Merge
      for (index = 0; index < o2.length; index++) {
        if (r.length > index) {
          r[index] = Util.merge(r[index], o2[index]);
        } else {
          r.push(o2[index]);
        }
      }
      return r;
    } else if (o1 instanceof Object && o2 instanceof Object) {
      r = {};
      // Copy:
      for (key in o1) {
        r[key] = o1[key];
      }
      // Merge:
      for (key in o2) {
        if (r[key] !== undefined) {
          r[key] = Util.merge(r[key], o2[key]);
        } else {
          r[key] = o2[key];
        }
      }
      return r;
    } else {
      return o2;
    }
  };

  Util.toObject = function(olike) {
    var o = {}, key;

    for (key in olike) {
      o[key] = olike[key];
    }

    return o;
  };

  Util.genGuid = function() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };

  Util.parseQueryString = function(qs) {
    var pairs = {};
    var query = window.location.search.substring(1);
    if (query.length > 0) {
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        if (vars[i].length > 0) {
          var pair = vars[i].split('=');
          
          var name = decodeURIComponent(pair[0]);
          var value = (pair.length > 1) ? decodeURIComponent(pair[1]) : 'true';

          pairs[name] = value; 
        }
      }
    }
    return pairs;
  };

  Util.mapJson = function(v, f) {
    var vp, vv;
    if (v instanceof Array) {
      vp = [];
      for (var i = 0; i < v.length; i++) {
        vv = Util.mapJson(v[i], f);

        if (vv !== undefined) vp.push(vv);
      }
      return vp;
    } else if (v instanceof Object) {
      vp = {};
      for (var k in v) {
        vv = Util.mapJson(v[k], f);

        if (vv !== undefined) vp[k] = vv;
      }
      return vp;
    } else return f(v);
  };

  Util.jsonify = function(v) {
    return Util.mapJson(v, function(v) {
      if (v === '') return undefined;
      else {
        var r;
        try {
          r = JSON.parse(v);
        } catch (e) {
          r = v;
        }

        return r;
      }
    });
  };

  Util.undup = function(f, cutoff) {
    cutoff = cutoff || 250;

    var lastInvoked = 0;
    return function(e) {
      var curTime = (new Date()).getTime();
      var delta = curTime - lastInvoked;

      if (delta > cutoff) {
        lastInvoked = curTime;

        var result = f.apply(this, arguments);

        return result;
      } return undefined;
    };
  };

  Util.getFormData = function(node) {
    var acc = {};

    var setAcc = function(name, value) {
      if (acc[name]) {
        if (acc[name] instanceof Array) {
          acc[name].push(value);
        } else {
          acc[name] = [acc[name], value];
        }
      } else {
        acc[name] = value;
      }
    };

    for (var i = 0; i < node.elements.length; i++) {
      var child = node.elements[i];
      var type = child.tagName.toUpperCase();

      if (type == 'INPUT' || type == 'TEXTFIELD') {
        // INPUT or TEXTFIELD element.
        // Make sure it's not a password:
        if (child.type != 'password') {
          // Make sure it's not a radio or it's a checked radio:
          if (child.type != 'radio' || child.checked) {
            setAcc(child.name, child.value);
          }
        }
      } else if (type == 'SELECT') {
        // SELECT element:
        var option = child.options[child.selectedIndex];

        setAcc(child.name, option.value);
      }
    }

    return acc;
  };

  Util.getDataset = function(node) {
    if (typeof node.dataset !== 'undefined') {
      return Util.toObject(node.dataset);
    } else if (node.attributes) {
      var dataset = {};

      var attrs = node.attributes;

      for (var i = 0; i < attrs.length; i++) {
        var name = attrs[i].name;
        var value = attrs[i].value;

        if (name.indexOf('data-') === 0) {
          name = name.substr('data-'.length);

          dataset[name] = value;
        }
      }

      return dataset;
    } else return {};
  };

  var Env = {};

  Env.getFingerprint = function() {    
    var data = [
      JSON.stringify(Env.getPluginsData()),
      JSON.stringify(Env.getLocaleData()),
      navigator.userAgent.toString()
    ];

    return MD5.hash(data.join(""));
  };
  
  Env.getBrowserData = function() {
    var fingerprint = Env.getFingerprint();

    return ({
      ua:           navigator.userAgent,
      name:         BrowserDetect.browser,
      version:      BrowserDetect.version,
      platform:     BrowserDetect.OS,
      language:     navigator.language || navigator.userLanguage || navigator.systemLanguage,
      fingerprint:  fingerprint,
      plugins:      Env.getPluginsData()
    });
  };

  Env.getUrlData = function() {
    var l = document.location;
    return ({
      hash:     l.hash,
      hostname: l.hostname,
      pathname: l.pathname,
      protocol: l.protocol,
      query:    Util.parseQueryString(l.search)
    });
  };

  Env.getDocumentData = function() {
    return ({
      title:    document.title,
      referrer: document.referrer,
      url:      Env.getUrlData()
    });
  };

  Env.getScreenData = function() {
    return ({
      height: screen.height, 
      width: screen.width, 
      colorDepth: screen.colorDepth
    });
  };

  Env.getLocaleData = function() {
    // "Mon Apr 15 2013 12:21:35 GMT-0600 (MDT)"
    // 
    var results = new RegExp('([A-Z]+-[0-9]+) \\(([A-Z]+)\\)').exec((new Date()).toString());

    var gmtOffset, timezone;

    if (results.length >= 3) {
      gmtOffset = results[1];
      timezone  = results[2];
    }

    return ({
      language: navigator.systemLanguage || navigator.userLanguage || navigator.language,
      timezoneOffset: (new Date()).getTimezoneOffset(),
      gmtOffset: gmtOffset,
      timezone:  timezone
    });
  };

  Env.getPageloadData = function() {
    var l = document.location;
    return {
      browser:  Env.getBrowserData(),
      document: Env.getDocumentData(),
      screen:   Env.getScreenData(),
      locale:   Env.getLocaleData()
    };
  };

  Env.getPluginsData = function() {
    var plugins = [];
    var p = navigator.plugins;
    for (var i = 0; i < p.length; i++) {
      var pi = p[i];
      plugins.push({
        name:         pi.name,
        description:  pi.description,
        filename:     pi.filename,
        version:      pi.version,
        mimeType: (pi.length > 0) ? ({
          type: pi[0].type,
          description: pi[0].description,
          suffixes: pi[0].suffixes
        }) : undefined
      });
    }
    return plugins;
  };

  var Handler = function() {
    this.handlers = [];
    this.onerror = (console && console.log) || (function() {});
  };

  Handler.prototype.push = function(f) {
    this.handlers.push(f);
  };

  Handler.prototype.dispatch = function() {
    var args = Array.prototype.slice.call(arguments, 0), i;

    for (i = 0; i < this.handlers.length; i++) {
      try {
        this.handlers[i].apply(null, args);
      }
      catch (e) {
        onerror(e);
      }
    }
  };

  var Events = {};

  Events.onready = function(f) {
    if (document.body) f();
    else setTimeout(function(){Events.onready(f);}, 10);
  };

  Events.onevent = function(el, type, capture, f_) {
    var fixup = function(f) {
      return function(e) {
        if (!e) e = window.event;

        e.target    = e.target || e.srcElement;
        e.timeStamp = e.timeStamp || (new Date()).getTime();
        e.keyCode   = e.keyCode || e.which || e.charCode;
        e.which     = e.which || e.keyCode;
        e.charCode  = (typeof e.which === "number") ? e.which : e.keyCode;

        if (e.target.nodeType == 3) e.target = e.target.parentNode;

        // console.log(Util.getDataset(e.target));

        return f(e);
      };
    };

    var f = fixup(f_);

    if (el.addEventListener) {
      el.addEventListener(type, f, capture); 
    } else if (el.attachEvent)  {
      el.attachEvent('on' + type, f);
    }
  };

  Events.onengage = (function() {
    var handler = new Handler();
    var events = [];

    Events.onready(function() {
      Events.onevent(document.body, 'mouseover', true, function(e) {
        events.push(e);
      });

      Events.onevent(document.body, 'mouseout', true, function(end) {
        var i, start;

        for (i = events.length - 1; i >= 0; i--) {
          if (events[i].target == end.target) {
            start = events[i];
            Util.removeElement(events, i);
            break;
          }
        }

        if (start !== undefined) {
          var delta = (end.timeStamp - start.timeStamp);

          if (delta >= 250 /*self.options().minEngagement*/ && 
              delta <= 20000 /*self.options().maxEngagement*/)
            handler.dispatch(start, end);
        }
      });
    });

    return function(f) {
      handler.push(f);
    };
  })();

  Events.onhashchange = (function() {
    var handler = new Handler();
    var lastHash = document.location.hash;

    var dispatch = function(e) {
      var newHash = document.location.hash;

      if (lastHash != newHash) {
        lastHash = newHash;

        e.hash = newHash;

        handler.dispatch(e);
      }
    };

    if (window.onhashchange) {
      Events.onevent(window, 'hashchange', false, dispatch);
    } else {
      setInterval(function() { dispatch({}); }, 25);
    }

    return function(f) {
      handler.push(f);
    };
  })();

  Events.onerror = (function() {
    var handler = new Handler();

    if (typeof window.onerror === 'function') handler.push(window.onerror);

    window.onerror = function(err, url, line) { handler.dispatch(err, url, line); };

    return function(f) {
      handler.push(f);
    };
  })();

  Events.onsubmit = (function() {
    var handler = new Handler();
    var lastClick, lastEnter;

    var handle = Util.undup(function(e) {
      handler.dispatch(e);
    });

    Events.onready(function() {
      Events.onevent(document.body, 'submit', true, function(e) {
        e.form = e.target;
        handle(e);
      });

      Events.onevent(document.body, 'keypress', true, function(e) {
        if (e.keyCode == 13) {
          lastEnter = e;
        }
      });

      Events.onevent(document.body, 'click', true, function(e) {
        lastClick = e;
      });
    });

    var formSubmitEvent = function() {
      if (lastClick) {
        if (lastEnter) {
          return (lastClick.timeStamp > lastEnter.timeStamp) ? lastClick : lastEnter;
        } else return lastClick;
      } else return lastEnter;
    };

    var forms = document.getElementsByTagName('form');

    var createSubmitter = function(form) {
      var oldSubmit = form.submit;

      return function() {
        var cancel = false;
        var submitEvent = formSubmitEvent();
        if (submitEvent) {
          submitEvent.preventDefault = function() {
            cancel = true;
          };

        } else {
          submitEvent = {};
        }
        submitEvent.form = form;
        handle(submitEvent);
        if (!cancel) oldSubmit.apply(form);
      };
    };

    for (var i = 0; i < forms.length; i++) {
      form.submit = createSubmitter(forms[i]);
    }

    return function(f) {
      handler.push(f);
    };
  })();

  /**
   * Initializes Scribe. This is called internally by the constructor and does
   * not need to be called manually.
   */
  Scribe.prototype.initialize = function() {
    var self = this;

    this.options = Util.merge({
      minEngagement: 250,
      maxEngagement: 20000,
      bucket:       'none'
    }, this.options);

    this.data = {
      browser:      Env.getBrowserData(),
      document:     Env.getDocumentData(),
      screen:       Env.getScreenData(),
      locale:       Env.getLocaleData(),
      fingerprint:  Env.getFingerprint()
    };

    this.visitorId = (function() {
      var createCookie = function(name,value,days) {
        var expires, date;
        if (days) {
          date = new Date();
          date.setTime(date.getTime()+(days*24*60*60*1000));
          expires = "; expires="+date.toGMTString();
        }
        else expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
      };

      var readCookie = function(name) {
        var nameEQ = name + "=", ca, c, i;
        ca = document.cookie.split(';');
        for(i=0;i < ca.length;i++) {
          c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
      };

      var lid = (typeof localStorage !== 'undefined') ? localStorage.getItem('visitorId') : undefined;
      var cid = readCookie('visitorId');

      var visitorId = lid || cid || Util.genGuid();

      (typeof localStorage !== 'undefined') && localStorage.setItem('visitorId', visitorId);
      createCookie('visitorId', visitorId);

      return visitorId;
    })();

    // Date shim:
    if (!Date.prototype.toISOString ) {
      (function() {
        function pad(number) {
          var r = String(number);
          if ( r.length === 1 ) {
            r = '0' + r;
          }
          return r;
        }
      
        Date.prototype.toISOString = function() {
          return this.getUTCFullYear() + 
            '-' + pad( this.getUTCMonth() + 1 ) + 
            '-' + pad( this.getUTCDate() ) + 
            'T' + pad( this.getUTCHours() ) +
            ':' + pad( this.getUTCMinutes() ) +
            ':' + pad( this.getUTCSeconds() ) +
            '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 ) + 
            'Z';
        };
      }());
    }
  };

  /**
   * Retrieves the path where a certain category of data is stored.
   *
   * @memberof Scribe
   *
   * @param type  A simple String describing the category of data, such as
   *              'profile' or 'history'.
   */
  Scribe.prototype.getPath = function(type) {
    var now = new Date();
    var rootNode = this.userId ? '/users/' + this.userId + '/' : 
                   (this.visitorId ? '/visitors/' + this.visitorId + '/' : '/visitors/anon/');
    var dateNode;

    if (/none/.test(this.options.bucket)) {
      dateNode = '';
    } else if (/daily|day/.test(this.options.bucket)) {
      dateNode = now.getUTCDate() + '/';
    } else if (/month/.test(this.options.bucket)) {
      dateNode = (now.getUTCMonth() + 1) + '/';
    } else if (/year/.test(this.options.bucket)) {
      dateNode = now.getUTCFullYear() + '/';
    }

    var targetNode = type + '/';

    return rootNode + dateNode + targetNode;
  };

  /**
   * Identifies a user.
   *
   * @memberof Scribe
   *
   * @param userId  The unique user id.
   * @param props   An arbitrary JSON object describing properties of the user.
   *
   */
  Scribe.prototype.identify = function(userId, props, context) {
    this.userId       = userId;
    this.userProfile  = props;
    this.context      = context;

    this.tracker({
      path: this.getPath('profile'), 
      value: Util.jsonify({
        fingerprint:  this.data.fingerprint,
        ipAddress:    this.data.ipAddress,
        userId:       userId,
        userProfile:  userProfile,
        visitorId:    this.visitorId
      }), 
      op: 'replace'
    });
  };

  /**
   * Tracks an event.
   *
   * @memberof Scribe
   *
   * @param name        The name of the event, such as 'downloaded trial'.
   * @param props       An arbitrary JSON object describing properties of the event.
   * @param callback    A function to call when the tracking is complete.
   *
   */
  Scribe.prototype.track = function(name, props, callback) {
    var path = this.getPath('history');

    this.tracker({
      path: this.getPath('events'),
      value: Util.jsonify(
        Util.merge(
          props || {}, 
          {
            event:      name, 
            userId:     this.userId, 
            visitorId:  this.visitorId,
            timestamp:  props.timestamp || (new Date()).toISOString()
          }
        )
      ),
      op: 'append'
    });
  };

  /**
   * Identifies the user as a member of some group.
   *
   * @memberof Scribe
   *
   * @param groupId
   * @param props
   *
   */
  Scribe.prototype.group = function(groupId, props) {
    this.userGroupId      = groupId;
    this.userGroupProfile = props;

    return this.tracker.group(groupId, props);
  };

  /**
   * Tracks a page view.
   *
   */
  Scribe.prototype.pageview = function(url) {
    this.track('pageview', Env.getPageloadData());
  };
  
  Events.onready(function() {
    console.log(Util.jsonify(Env.getPageloadData()));

    Events.onengage(function(start, end) {
      var target = start.target;

      var delta = end.timeStamp - start.timeStamp;

      console.log('Engaged: ' + delta + ' milliseconds with ' + Util.genCssSelector(target));
    });

    Events.onsubmit(function(e) {
      console.log('Form submit');
      console.log(e);
      console.log(Util.getFormData(e.form));
      e.preventDefault();
    });

    Events.onhashchange(function(e) {
      console.log('hashChanged: ' + e.hash);
    });
  });
})(Scribe);