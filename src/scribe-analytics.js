if (typeof Scribe === 'undefined') {
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

    var Geo = {};

    Geo.geoip = function(success, failure) {
      // MaxMind GeoIP2 JavaScript API:
      if (typeof geoip2 !== 'undefined') {
        geoip2.city(function(results) {
          success({
            latitude:   success.location.latitude,
            longitude:  success.location.longitude
          });
        }, failure, {
          timeout:                  2000,
          w3c_geolocation_disabled: true
        });
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          success({
            latitude:   position.latitude,
            longitude:  position.longitude
          });
        }, failure, {maximumAge:Infinity, timeout:0});
      }
    };

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
        
        var nthchild = 1;

        for (var i = 0; i < parent.childNodes.length; i++) {
          if (parent.childNodes[i] === node) break;
          else {
            var childTagName = parent.childNodes[i].tagName;
            if (childTagName !== undefined) {
              nthchild = nthchild + 1;
            }
          }
        }

        if (sel !== '') sel = '>' + sel;

        sel = prefix + ':nth-child(' + nthchild + ')' + sel;

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

    Util.toArray = function(alike) {
      var arr = [], i, len = alike.length;

      arr.length = alike.length;

      for (i = 0; i < len; i++) {
       arr[i] = alike[i];
      }

      return arr;
    };

    Util.arrContains = function(array, el) {
      var i;
      for (i = 0; i < array.length; i++) {
        if (array[i] === el) return true;
      }
      return false;
    };

    Util.arrDiff = function(arr1, arr2) {
      var i, el, diff = [];
      for (i = 0; i < arr1.length; i++) {
        el = arr1[i];

        if (!Util.arrContains(arr2, el)) diff.push(el);
      }
      return diff;
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

            try {            
              var name = decodeURIComponent(pair[0]);
              var value = (pair.length > 1) ? decodeURIComponent(pair[1]) : 'true';

              pairs[name] = value; 
            } catch (e) { }
          }
        }
      }
      return pairs;
    };

    Util.unparseQueryString = function(qs) {
      var kvs = [], k, v;
      for (k in qs) {
        if (!qs.hasOwnProperty(k)) {
          v = qs[k];

          kvs.push(
            encodeURIComponent(k) + '=' + encodeURIComponent(v)
          );
        }
      }
      var string = kvs.join('&');

      if (string.length > 0) return '?' + string;
      else return '';
    };

    Util.size = function(v) {
      if (v === undefined) return 0;
      else if (v instanceof Array) return v.length;
      else if (v instanceof Object) {
        var size = 0;
        for (var key in v) {
          if (!v.hasOwnProperty || v.hasOwnProperty(key)) ++size;
        }
        return size;
      } else return 1;
    };

    Util.mapJson = function(v, f) {
      var vp, vv;
      if (v instanceof Array) {
        vp = [];
        for (var i = 0; i < v.length; i++) {
          vv = Util.mapJson(v[i], f);

          if (Util.size(vv) > 0) vp.push(vv);
        }
        return vp;
      } else if (v instanceof Object) {
        vp = {};
        for (var k in v) {
          vv = Util.mapJson(v[k], f);

          if (Util.size(vv) > 0) vp[k] = vv;
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

    Util.monitorElements = function(tagName, onnew, refresh) {
      refresh = refresh || 25;

      var checker = function() {
        var curElements = document.getElementsByTagName(tagName);

        for (var i = 0; i < curElements.length; i++) {
          var el = curElements[i];

          var scanned = el.getAttribute('scribe_scanned');

          if (!scanned) {
            el.setAttribute('scribe_scanned', true);
            try { 
              onnew(el);
            } catch (e) {
              window.onerror(e);
            }
          }
        }

        setTimeout(checker, refresh);
      };

      setTimeout(checker, 0);
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

    Util.parseUrl = function(url) {
      var l = document.createElement("a");
      l.href = url;
      if (l.host === '') {
        l.href = l.href;
      }
      return {
        hash:     l.hash,
        host:     l.host,
        hostname: l.hostname,
        pathname: l.pathname,
        protocol: l.protocol,
        query:    Util.parseQueryString(l.search)
      };
    };

    Util.unparseUrl = function(url) {
      return (url.protocol || '') + 
             '//' + 
             (url.host || '') + 
             (url.pathname || '') +
             Util.unparseQueryString(url.query) + 
             (url.hash || '');
    };

    Util.padLeft = function(n, p, c) {
      var pad_char = typeof c !== 'undefined' ? c : '0';
      var pad = new Array(1 + p).join(pad_char);
      return (pad + n).slice(-pad.length);
    };

    Util.getNodeDescriptor = function(node) {
      return {
        id:         node.id,
        selector:   Util.genCssSelector(node),
        title:      node.title === '' ? undefined : node.title,
        data:       Util.getDataset(node)
      };
    };

    Util.getAncestors = function(node) {
      var cur = node;
      var result = [];

      while (cur && cur !== document.body) {
        result.push(cur);
        cur = cur.parentNode;
      }

      return result;
    };

    var DomUtil = {};

    DomUtil.simulateMouseEvent = function(element, eventName, options) {
      var eventMatchers = {
        'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
        'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
      };
 
      options = Util.merge({
        pointerX: 0,
        pointerY: 0,
        button: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        bubbles: true,
        cancelable: true
      }, options || {});

      var oEvent, eventType = null;

      for (var name in eventMatchers) {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
      }

      if (!eventType) throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

      if (document.createEvent) {
        oEvent = document.createEvent(eventType);
        if (eventType === 'HTMLEvents') {
          oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        } else {
          oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element
          );
        }
        element.dispatchEvent(oEvent);
      } else {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = Util.merge(evt, options);
        element.fireEvent('on' + eventName, oEvent);
      }
      return element;
    };

    var ArrayUtil = {};

    ArrayUtil.exists = function(array, f) {
      for (var i = 0; i < array.length; i++) {
        if (f(array[i])) return true;
      }
      return false;
    };

    ArrayUtil.map = function(array, f) {
      var r = [], i;
      for (i = 0; i < array.length; i++) {
        r.push(f(array[i]));
      }
      return r;
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
        plugins:      Env.getPluginsData()
      });
    };

    Env.getUrlData = function() {
      var l = document.location;
      return ({
        hash:     l.hash,
        host:     l.host,
        hostname: l.hostname,
        pathname: l.pathname,
        protocol: l.protocol,
        query:    Util.parseQueryString(l.search)
      });
    };

    Env.getDocumentData = function() {
      return ({
        title:    document.title,
        referrer: document.referrer && Util.parseUrl(document.referrer) || undefined,
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
            type:         pi[0].type,
            description:  pi[0].description,
            suffixes:     pi[0].suffixes
          }) : undefined
        });
      }
      return plugins;
    };

    var Handler = function() {
      this.handlers = [];
      this.onerror = (console && console.log) || window.onerror || (function(e) {});
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

    Events.onexit = (function() {
      var unloaded = false;

      var handler = new Handler();

      var handleUnload = function(e) {
        if (!unloaded) {
          handler.dispatch(e);
          unloaded = true;
        }
      };

      Events.onevent(window, 'unload', undefined, handleUnload);

      var replaceUnloader = function(obj) {
        var oldUnloader = obj.onunload || (function(e) {});

        obj.onunload = function(e) {
          handleUnload();

          oldUnloader(e);
        };
      };

      replaceUnloader(window);

      Events.onready(function() {
        replaceUnloader(document.body);
      });

      return function(f) {
        handler.push(f);
      };
    })();

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

            if (delta >= 750 /*self.options().minEngagement*/ && 
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
        minEngagement:    250,
        maxEngagement:    20000,
        bucket:           'none',
        breakoutUsers:    false,
        breakoutVisitors: false
      }, this.options);

      this.data = {
        browser:      Env.getBrowserData(),
        document:     Env.getDocumentData(),
        screen:       Env.getScreenData(),
        locale:       Env.getLocaleData(),
        fingerprint:  Env.getFingerprint()
      };

      // Always assume that Javascript is the culprit of leaving the page
      // (we'll detect and intercept clicks on links and buttons as best 
      // as possible and override this assumption in these cases):
      this.javascriptRedirect = true;

      this.context = {};

      this.context.fingerprint = Env.getFingerprint();

      this.context.sessionId = (function() {
        var sessionId = sessionStorage.getItem('scribe_sid') || Util.genGuid();

        sessionStorage.setItem('scribe_sid', sessionId);

        return sessionId;
      })();

      this.context.visitorId = (function() {
        var visitorId = localStorage.getItem('scribe_vid') || Util.genGuid();

        localStorage.setItem('scribe_vid', visitorId);

        return visitorId;
      })();

      // Try to obtain geo location if possible:
      Geo.geoip(function(position) {
        self.context.geo = position;
      });

      // Track page view, but only after the DOM has loaded:
      Events.onready(function() {
        // Track the initial pageview:
        self.pageview();
      });

      // Track hash changes:
      Events.onhashchange(function(e) {
        var id = e.hash.substring(1);

        // If it's a real node, get it so we can capture node data:
        var targetNode = document.getElementById(id);

        var data = targetNode ? Util.getNodeDescriptor(targetNode) : {id: id};

        self.track('jump', {target: data});
      });

      // Track all clicks to the document:
      Events.onevent(document.body, 'click', true, function(e) {
        var ancestors = Util.getAncestors(e.target);

        // Do not track clicks on links, these are tracked separately!
        if (!ArrayUtil.exists(ancestors, function(e) { return e.tagName === 'A';})) {
          self.track('click', {target: Util.getNodeDescriptor(e.target)});
        }
      });

      // Track all engagement:
      Events.onengage(function(start, end) {
        self.track('engage', {target: Util.getNodeDescriptor(start.target), duration: end.timeStamp - start.timeStamp});
      });

      // Track all clicks on links:
      Util.monitorElements('a', function(el) {
        Events.onevent(el, 'click', true, function(e) {
          var target = e.target;

          // TODO: Make sure the link is actually to a page.
          // It's a click, not a Javascript redirect:
          self.javascriptRedirect = false;
          setTimeout(function(){self.javascriptRedirect = true;}, 500);

          var intercepted = target.getAttribute('scribe_intercepted');          

          if (!intercepted) {
            target.setAttribute('scribe_intercepted', 'true');            

            var parsedUrl = Util.parseUrl(el.href);
            var value = {source: {url: Util.parseUrl(document.location)}, 
                         target: Util.merge({url: parsedUrl}, Util.getNodeDescriptor(target))};

            if (parsedUrl.hostname === document.location.hostname) {
              // We are linking to a page on the same site. There's no need to send
              // the event now, we can safely send it later:
              self.trackLater('click', value);
            } else {
              e.preventDefault();

              // We are linking to a page that is not on this site. So we first
              // wait to send the event before simulating a different click
              // on the link. This ensures we don't lose the event if the user
              // does not return to this site ever again.
              self.track('click', 
                value,
                function() {
                  // It's a click, not a Javascript redirect:
                  self.javascriptRedirect = false;

                  // Simulate a click to the original element:
                  DomUtil.simulateMouseEvent(target, 'click');
                }
              );
            }
          } else {
            // We already intercepted this, so we'll let it pass on through
            // without modification:
            target.removeAttribute('scribe_intercepted');
          }
        });
      });

      // Track JavaScript-based redirects, which can occur without warning:
      Events.onexit(function(e) {
        if (self.javascriptRedirect) {
          self.trackLater('redirect', {source: {url: Util.parseUrl(document.location)}});
        }
      });

      // Load and send any pending events:
      this._loadOutbox();
      this._sendOutbox();
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
      var rootNode =  this.context.userId ? (this.options.breakoutUsers ? '/users/' + this.context.userId + '/' : '/users/') : 
                     (this.options.breakoutVisitors ? '/visitors/' + this.context.visitorId + '/' : '/visitors/');
      var dateNode;

      if (/daily|day/.test(this.options.bucket)) {
        dateNode = now.getUTCFullYear() + '-' + Util.padLeft(now.getUTCMonth(), 2) + '-' + Util.padLeft(now.getUTCDate(), 2) + '/';
      } else if (/month/.test(this.options.bucket)) {
        dateNode = now.getUTCFullYear() + '-' + Util.padLeft(now.getUTCMonth(), 2) + '/';
      } else if (/year/.test(this.options.bucket)) {
        dateNode = now.getUTCFullYear() + '/';
      } else {
        dateNode = '';
      } 

      var targetNode = type + '/';

      return rootNode + dateNode + targetNode;
    };

    Scribe.prototype._saveOutbox = function() {
      localStorage.setItem('scribe_outbox', JSON.stringify(this.outbox));
    };

    Scribe.prototype._loadOutbox = function() {
      this.outbox = JSON.parse(localStorage.getItem('scribe_outbox') || '[]');
    };

    Scribe.prototype._sendOutbox = function() {
      for (var i = 0; i < this.outbox.length; i++) {
        var message = this.outbox[i];

        // Specially modify redirect events to save the new URL,
        // because the URL is not known at the time of the redirect:
        if (message.value.event === 'redirect') {
          message.value.target = Util.merge(message.value.target || {}, {url: Util.parseUrl(document.location)});

          try {
            // See if it's a redirect (= different url) or reload (= same url):
            var sourceUrl = Util.unparseUrl(message.value.source.url);
            var targetUrl = Util.unparseUrl(message.value.target.url);

            console.log('source url = ' + sourceUrl);
            console.log('target url = ' + targetUrl);

            if (sourceUrl === targetUrl) {
              // It's a reload:
              message.value.event = 'reload';
            }
          } catch (e) {
          }
        }

        try {
          this.tracker(message);
        } catch (e) {
          // Don't let one bad apple spoil the batch.
        }
      }
      this.outbox = [];
      this._saveOutbox();
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
    Scribe.prototype.identify = function(userId, props, context, success, failure) {
      this.context.userId       = userId;
      this.context.userProfile  = props;
      
      this.context = Util.merge(context || {}, this.context);

      props = props || {};

      props.timestamp = props.timestamp || (new Date()).toISOString();

      this.tracker({
        path:   this.getPath('profile'), 
        value:  Util.jsonify(Util.merge(this.context, props)),
        op:     'replace',
        success: success,
        failure: failure
      });
    };

    /**
     * Tracks an event now.
     *
     * @memberof Scribe
     *
     * @param name        The name of the event, such as 'downloaded trial'.
     * @param props       An arbitrary JSON object describing properties of the event.
     * @param callback    A function to call when the tracking is complete.
     *
     */
    Scribe.prototype.track = function(name, props, success, failure) {
      props = props || {};

      props.timestamp = props.timestamp || (new Date()).toISOString();
      props.event     = name;

      this.tracker({
        path:    this.getPath('events'), 
        value:   Util.jsonify(Util.merge(this.context, props)),
        op:      'append',
        success: success,
        failure: failure
      });
    };

    /**
     * Tracks an event later.
     *
     * @memberof Scribe
     *
     * @param name        The name of the event, such as 'downloaded trial'.
     * @param props       An arbitrary JSON object describing properties of the event.
     *
     */
    Scribe.prototype.trackLater = function(name, props) {
      props = props || {};

      props.timestamp = props.timestamp || (new Date()).toISOString();
      props.event     = name;

      var value = {
        path:    this.getPath('events'), 
        value:   Util.jsonify(Util.merge(this.context, props)),
        op:      'append'
      };

      this.outbox.push(value);
      this._saveOutbox();

      return value;
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
    Scribe.prototype.group = function(groupId, props, success, failure) {
      this.userGroupId      = groupId;
      this.userGroupProfile = props;

      props = props || {};

      props.timestamp = props.timestamp || (new Date()).toISOString();

      this.tracker({
        path:   this.getPath('groups'), 
        value:  Util.jsonify(Util.merge(this.context, props)),
        op:     'replace',
        success: success,
        failure: failure
      });
    };

    /**
     * Tracks a page view.
     *
     */
    Scribe.prototype.pageview = function(url, success, failure) {
      url = url || document.location;

      this.track('pageview', Util.merge(Env.getPageloadData(), {url: Util.parseUrl(url + '')}), success, failure);
    };
    
    Events.onready(function() {
      Events.onsubmit(function(e) {
        console.log('Form submit');
        console.log(e);
        console.log(Util.getFormData(e.form));
        e.preventDefault();
      });
    });

    return Scribe;
  })(Scribe);
}