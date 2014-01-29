/**
 * The API exported by the Scribe Analytics.
 * @namespace scribe
 */
(function(definition) {
  if (typeof bootstrap === "function") {
    // Montage Require
    bootstrap("scribe", definition);
  } else if (typeof exports === "object") {
    // CommonJS
    module.exports = definition();
  } else if (typeof define === "function") {
    // RequireJS
    define(definition);
  } else if (typeof ses !== "undefined") {
    // SES (Secure EcmaScript)
    if (!ses.ok()) return;
    ses.makeScribe = definition;
  } else {
    // <script>
    window.Scribe = definition();
  }
})(function() {
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

  /*
      json2.js
      2012-10-08
  
      Public Domain.
  
      NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
  
      See http://www.JSON.org/js.html
  
  
      This code should be minified before deployment.
      See http://javascript.crockford.com/jsmin.html
  
      USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
      NOT CONTROL.
  
  
      This file creates a global JSON object containing two methods: stringify
      and parse.
  
          JSON.stringify(value, replacer, space)
              value       any JavaScript value, usually an object or array.
  
              replacer    an optional parameter that determines how object
                          values are stringified for objects. It can be a
                          function or an array of strings.
  
              space       an optional parameter that specifies the indentation
                          of nested structures. If it is omitted, the text will
                          be packed without extra whitespace. If it is a number,
                          it will specify the number of spaces to indent at each
                          level. If it is a string (such as '\t' or '&nbsp;'),
                          it contains the characters used to indent at each level.
  
              This method produces a JSON text from a JavaScript value.
  
              When an object value is found, if the object contains a toJSON
              method, its toJSON method will be called and the result will be
              stringified. A toJSON method does not serialize: it returns the
              value represented by the name/value pair that should be serialized,
              or undefined if nothing should be serialized. The toJSON method
              will be passed the key associated with the value, and this will be
              bound to the value
  
              For example, this would serialize Dates as ISO strings.
  
                  Date.prototype.toJSON = function (key) {
                      function f(n) {
                          // Format integers to have at least two digits.
                          return n < 10 ? '0' + n : n;
                      }
  
                      return this.getUTCFullYear()   + '-' +
                           f(this.getUTCMonth() + 1) + '-' +
                           f(this.getUTCDate())      + 'T' +
                           f(this.getUTCHours())     + ':' +
                           f(this.getUTCMinutes())   + ':' +
                           f(this.getUTCSeconds())   + 'Z';
                  };
  
              You can provide an optional replacer method. It will be passed the
              key and value of each member, with this bound to the containing
              object. The value that is returned from your method will be
              serialized. If your method returns undefined, then the member will
              be excluded from the serialization.
  
              If the replacer parameter is an array of strings, then it will be
              used to select the members to be serialized. It filters the results
              such that only members with keys listed in the replacer array are
              stringified.
  
              Values that do not have JSON representations, such as undefined or
              functions, will not be serialized. Such values in objects will be
              dropped; in arrays they will be replaced with null. You can use
              a replacer function to replace those with JSON values.
              JSON.stringify(undefined) returns undefined.
  
              The optional space parameter produces a stringification of the
              value that is filled with line breaks and indentation to make it
              easier to read.
  
              If the space parameter is a non-empty string, then that string will
              be used for indentation. If the space parameter is a number, then
              the indentation will be that many spaces.
  
              Example:
  
              text = JSON.stringify(['e', {pluribus: 'unum'}]);
              // text is '["e",{"pluribus":"unum"}]'
  
  
              text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
              // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'
  
              text = JSON.stringify([new Date()], function (key, value) {
                  return this[key] instanceof Date ?
                      'Date(' + this[key] + ')' : value;
              });
              // text is '["Date(---current time---)"]'
  
  
          JSON.parse(text, reviver)
              This method parses a JSON text to produce an object or array.
              It can throw a SyntaxError exception.
  
              The optional reviver parameter is a function that can filter and
              transform the results. It receives each of the keys and values,
              and its return value is used instead of the original value.
              If it returns what it received, then the structure is not modified.
              If it returns undefined then the member is deleted.
  
              Example:
  
              // Parse the text. Values that look like ISO date strings will
              // be converted to Date objects.
  
              myData = JSON.parse(text, function (key, value) {
                  var a;
                  if (typeof value === 'string') {
                      a =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                      if (a) {
                          return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                              +a[5], +a[6]));
                      }
                  }
                  return value;
              });
  
              myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                  var d;
                  if (typeof value === 'string' &&
                          value.slice(0, 5) === 'Date(' &&
                          value.slice(-1) === ')') {
                      d = new Date(value.slice(5, -1));
                      if (d) {
                          return d;
                      }
                  }
                  return value;
              });
  
  
      This is a reference implementation. You are free to copy, modify, or
      redistribute.
  */
  
  /*jslint evil: true, regexp: true */
  
  /*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
      call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
      getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
      lastIndex, length, parse, prototype, push, replace, slice, stringify,
      test, toJSON, toString, valueOf
  */
  
  
  // Create a JSON object only if one does not already exist. We create the
  // methods in a closure to avoid creating global variables.
  
  if (typeof JSON !== 'object') {
      JSON = {};
  }
  
  (function () {
      'use strict';
  
      function f(n) {
          // Format integers to have at least two digits.
          return n < 10 ? '0' + n : n;
      }
  
      if (typeof Date.prototype.toJSON !== 'function') {
  
          Date.prototype.toJSON = function (key) {
  
              return isFinite(this.valueOf())
                  ? this.getUTCFullYear()     + '-' +
                      f(this.getUTCMonth() + 1) + '-' +
                      f(this.getUTCDate())      + 'T' +
                      f(this.getUTCHours())     + ':' +
                      f(this.getUTCMinutes())   + ':' +
                      f(this.getUTCSeconds())   + 'Z'
                  : null;
          };
  
          String.prototype.toJSON      =
              Number.prototype.toJSON  =
              Boolean.prototype.toJSON = function (key) {
                  return this.valueOf();
              };
      }
  
      var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
          escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
          gap,
          indent,
          meta = {    // table of character substitutions
              '\b': '\\b',
              '\t': '\\t',
              '\n': '\\n',
              '\f': '\\f',
              '\r': '\\r',
              '"' : '\\"',
              '\\': '\\\\'
          },
          rep;
  
  
      function quote(string) {
  
  // If the string contains no control characters, no quote characters, and no
  // backslash characters, then we can safely slap some quotes around it.
  // Otherwise we must also replace the offending characters with safe escape
  // sequences.
  
          escapable.lastIndex = 0;
          return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
              var c = meta[a];
              return typeof c === 'string'
                  ? c
                  : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          }) + '"' : '"' + string + '"';
      }
  
  
      function str(key, holder) {
  
  // Produce a string from holder[key].
  
          var i,          // The loop counter.
              k,          // The member key.
              v,          // The member value.
              length,
              mind = gap,
              partial,
              value = holder[key];
  
  // If the value has a toJSON method, call it to obtain a replacement value.
  
          if (value && typeof value === 'object' &&
                  typeof value.toJSON === 'function') {
              value = value.toJSON(key);
          }
  
  // If we were called with a replacer function, then call the replacer to
  // obtain a replacement value.
  
          if (typeof rep === 'function') {
              value = rep.call(holder, key, value);
          }
  
  // What happens next depends on the value's type.
  
          switch (typeof value) {
          case 'string':
              return quote(value);
  
          case 'number':
  
  // JSON numbers must be finite. Encode non-finite numbers as null.
  
              return isFinite(value) ? String(value) : 'null';
  
          case 'boolean':
          case 'null':
  
  // If the value is a boolean or null, convert it to a string. Note:
  // typeof null does not produce 'null'. The case is included here in
  // the remote chance that this gets fixed someday.
  
              return String(value);
  
  // If the type is 'object', we might be dealing with an object or an array or
  // null.
  
          case 'object':
  
  // Due to a specification blunder in ECMAScript, typeof null is 'object',
  // so watch out for that case.
  
              if (!value) {
                  return 'null';
              }
  
  // Make an array to hold the partial results of stringifying this object value.
  
              gap += indent;
              partial = [];
  
  // Is the value an array?
  
              if (Object.prototype.toString.apply(value) === '[object Array]') {
  
  // The value is an array. Stringify every element. Use null as a placeholder
  // for non-JSON values.
  
                  length = value.length;
                  for (i = 0; i < length; i += 1) {
                      partial[i] = str(i, value) || 'null';
                  }
  
  // Join all of the elements together, separated with commas, and wrap them in
  // brackets.
  
                  v = partial.length === 0
                      ? '[]'
                      : gap
                      ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                      : '[' + partial.join(',') + ']';
                  gap = mind;
                  return v;
              }
  
  // If the replacer is an array, use it to select the members to be stringified.
  
              if (rep && typeof rep === 'object') {
                  length = rep.length;
                  for (i = 0; i < length; i += 1) {
                      if (typeof rep[i] === 'string') {
                          k = rep[i];
                          v = str(k, value);
                          if (v) {
                              partial.push(quote(k) + (gap ? ': ' : ':') + v);
                          }
                      }
                  }
              } else {
  
  // Otherwise, iterate through all of the keys in the object.
  
                  for (k in value) {
                      if (Object.prototype.hasOwnProperty.call(value, k)) {
                          v = str(k, value);
                          if (v) {
                              partial.push(quote(k) + (gap ? ': ' : ':') + v);
                          }
                      }
                  }
              }
  
  // Join all of the member texts together, separated with commas,
  // and wrap them in braces.
  
              v = partial.length === 0
                  ? '{}'
                  : gap
                  ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                  : '{' + partial.join(',') + '}';
              gap = mind;
              return v;
          }
      }
  
  // If the JSON object does not yet have a stringify method, give it one.
  
      if (typeof JSON.stringify !== 'function') {
          JSON.stringify = function (value, replacer, space) {
  
  // The stringify method takes a value and an optional replacer, and an optional
  // space parameter, and returns a JSON text. The replacer can be a function
  // that can replace values, or an array of strings that will select the keys.
  // A default replacer method can be provided. Use of the space parameter can
  // produce text that is more easily readable.
  
              var i;
              gap = '';
              indent = '';
  
  // If the space parameter is a number, make an indent string containing that
  // many spaces.
  
              if (typeof space === 'number') {
                  for (i = 0; i < space; i += 1) {
                      indent += ' ';
                  }
  
  // If the space parameter is a string, it will be used as the indent string.
  
              } else if (typeof space === 'string') {
                  indent = space;
              }
  
  // If there is a replacer, it must be a function or an array.
  // Otherwise, throw an error.
  
              rep = replacer;
              if (replacer && typeof replacer !== 'function' &&
                      (typeof replacer !== 'object' ||
                      typeof replacer.length !== 'number')) {
                  throw new Error('JSON.stringify');
              }
  
  // Make a fake root object containing our value under the key of ''.
  // Return the result of stringifying the value.
  
              return str('', {'': value});
          };
      }
  
  
  // If the JSON object does not yet have a parse method, give it one.
  
      if (typeof JSON.parse !== 'function') {
          JSON.parse = function (text, reviver) {
  
  // The parse method takes a text and an optional reviver function, and returns
  // a JavaScript value if the text is a valid JSON text.
  
              var j;
  
              function walk(holder, key) {
  
  // The walk method is used to recursively walk the resulting structure so
  // that modifications can be made.
  
                  var k, v, value = holder[key];
                  if (value && typeof value === 'object') {
                      for (k in value) {
                          if (Object.prototype.hasOwnProperty.call(value, k)) {
                              v = walk(value, k);
                              if (v !== undefined) {
                                  value[k] = v;
                              } else {
                                  delete value[k];
                              }
                          }
                      }
                  }
                  return reviver.call(holder, key, value);
              }
  
  
  // Parsing happens in four stages. In the first stage, we replace certain
  // Unicode characters with escape sequences. JavaScript handles many characters
  // incorrectly, either silently deleting them, or treating them as line endings.
  
              text = String(text);
              cx.lastIndex = 0;
              if (cx.test(text)) {
                  text = text.replace(cx, function (a) {
                      return '\\u' +
                          ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                  });
              }
  
  // In the second stage, we run the text against regular expressions that look
  // for non-JSON patterns. We are especially concerned with '()' and 'new'
  // because they can cause invocation, and '=' because it can cause mutation.
  // But just to be safe, we want to reject all unexpected forms.
  
  // We split the second stage into 4 regexp operations in order to work around
  // crippling inefficiencies in IE's and Safari's regexp engines. First we
  // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
  // replace all simple value tokens with ']' characters. Third, we delete all
  // open brackets that follow a colon or comma or that begin the text. Finally,
  // we look to see that the remaining characters are only whitespace or ']' or
  // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
  
              if (/^[\],:{}\s]*$/
                      .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                          .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                          .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
  
  // In the third stage we use the eval function to compile the text into a
  // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
  // in JavaScript: it can begin a block or an object literal. We wrap the text
  // in parens to eliminate the ambiguity.
  
                  j = eval('(' + text + ')');
  
  // In the optional fourth stage, we recursively walk the new structure, passing
  // each name/value pair to a reviver function for possible transformation.
  
                  return typeof reviver === 'function'
                      ? walk({'': j}, '')
                      : j;
              }
  
  // If the text is not JSON parseable, then a SyntaxError is thrown.
  
              throw new SyntaxError('JSON.parse');
          };
      }
  }());

  /** HTML5 sessionStorage
   * @build       2009-08-20 23:35:12
   * @author      Andrea Giammarchi
   * @license     Mit Style License
   * @project     http://code.google.com/p/sessionstorage/
   */if(typeof sessionStorage==="undefined"){(function(j){var k=j;try{while(k!==k.top){k=k.top}}catch(i){}var f=(function(e,n){return{decode:function(o,p){return this.encode(o,p)},encode:function(y,u){for(var p=y.length,w=u.length,o=[],x=[],v=0,s=0,r=0,q=0,t;v<256;++v){x[v]=v}for(v=0;v<256;++v){s=(s+(t=x[v])+y.charCodeAt(v%p))%256;x[v]=x[s];x[s]=t}for(s=0;r<w;++r){v=r%256;s=(s+(t=x[v]))%256;p=x[v]=x[s];x[s]=t;o[q++]=e(u.charCodeAt(r)^x[(p+t)%256])}return o.join("")},key:function(q){for(var p=0,o=[];p<q;++p){o[p]=e(1+((n()*255)<<0))}return o.join("")}}})(j.String.fromCharCode,j.Math.random);var a=(function(n){function o(r,q,p){this._i=(this._data=p||"").length;if(this._key=q){this._storage=r}else{this._storage={_key:r||""};this._key="_key"}}o.prototype.c=String.fromCharCode(1);o.prototype._c=".";o.prototype.clear=function(){this._storage[this._key]=this._data};o.prototype.del=function(p){var q=this.get(p);if(q!==null){this._storage[this._key]=this._storage[this._key].replace(e.call(this,p,q),"")}};o.prototype.escape=n.escape;o.prototype.get=function(q){var s=this._storage[this._key],t=this.c,p=s.indexOf(q=t.concat(this._c,this.escape(q),t,t),this._i),r=null;if(-1<p){p=s.indexOf(t,p+q.length-1)+1;r=s.substring(p,p=s.indexOf(t,p));r=this.unescape(s.substr(++p,r))}return r};o.prototype.key=function(){var u=this._storage[this._key],v=this.c,q=v+this._c,r=this._i,t=[],s=0,p=0;while(-1<(r=u.indexOf(q,r))){t[p++]=this.unescape(u.substring(r+=2,s=u.indexOf(v,r)));r=u.indexOf(v,s)+2;s=u.indexOf(v,r);r=1+s+1*u.substring(r,s)}return t};o.prototype.set=function(p,q){this.del(p);this._storage[this._key]+=e.call(this,p,q)};o.prototype.unescape=n.unescape;function e(p,q){var r=this.c;return r.concat(this._c,this.escape(p),r,r,(q=this.escape(q)).length,r,q)}return o})(j);if(Object.prototype.toString.call(j.opera)==="[object Opera]"){history.navigationMode="compatible";a.prototype.escape=j.encodeURIComponent;a.prototype.unescape=j.decodeURIComponent}function l(){function r(){s.cookie=["sessionStorage="+j.encodeURIComponent(h=f.key(128))].join(";");g=f.encode(h,g);a=new a(k,"name",k.name)}var e=k.name,s=k.document,n=/\bsessionStorage\b=([^;]+)(;|$)/,p=n.exec(s.cookie),q;if(p){h=j.decodeURIComponent(p[1]);g=f.encode(h,g);a=new a(k,"name");for(var t=a.key(),q=0,o=t.length,u={};q<o;++q){if((p=t[q]).indexOf(g)===0){b.push(p);u[p]=a.get(p);a.del(p)}}a=new a.constructor(k,"name",k.name);if(0<(this.length=b.length)){for(q=0,o=b.length,c=a.c,p=[];q<o;++q){p[q]=c.concat(a._c,a.escape(t=b[q]),c,c,(t=a.escape(u[t])).length,c,t)}k.name+=p.join("")}}else{r();if(!n.exec(s.cookie)){b=null}}}l.prototype={length:0,key:function(e){if(typeof e!=="number"||e<0||b.length<=e){throw"Invalid argument"}return b[e]},getItem:function(e){e=g+e;if(d.call(m,e)){return m[e]}var n=a.get(e);if(n!==null){n=m[e]=f.decode(h,n)}return n},setItem:function(e,n){this.removeItem(e);e=g+e;a.set(e,f.encode(h,m[e]=""+n));this.length=b.push(e)},removeItem:function(e){var n=a.get(e=g+e);if(n!==null){delete m[e];a.del(e);this.length=b.remove(e)}},clear:function(){a.clear();m={};b.length=0}};var g=k.document.domain,b=[],m={},d=m.hasOwnProperty,h;b.remove=function(n){var e=this.indexOf(n);if(-1<e){this.splice(e,1)}return this.length};if(!b.indexOf){b.indexOf=function(o){for(var e=0,n=this.length;e<n;++e){if(this[e]===o){return e}}return -1}}if(k.sessionStorage){l=function(){};l.prototype=k.sessionStorage}l=new l;if(b!==null){j.sessionStorage=l}})(window)};

  
  var MD5 = (typeof MD5 === 'undefined') ? {} : MD5;
  
  (function(MD5) {
    function md5cycle(x, k) {
      var a = x[0],
          b = x[1],
          c = x[2],
          d = x[3];
  
      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22, 1236535329);
  
      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);
  
      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);
      d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520);
      b = hh(b, c, d, a, k[2], 23, -995338651);
  
      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);
  
      x[0] = add32(a, x[0]);
      x[1] = add32(b, x[1]);
      x[2] = add32(c, x[2]);
      x[3] = add32(d, x[3]);
  
    }
  
    function cmn(q, a, b, x, s, t) {
      a = add32(add32(a, q), add32(x, t));
      return add32((a << s) | (a >>> (32 - s)), b);
    }
  
    function ff(a, b, c, d, x, s, t) {
      return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
  
    function gg(a, b, c, d, x, s, t) {
      return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
  
    function hh(a, b, c, d, x, s, t) {
      return cmn(b ^ c ^ d, a, b, x, s, t);
    }
  
    function ii(a, b, c, d, x, s, t) {
      return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
  
    function md51(s) {
      txt = '';
      var n = s.length,
        state = [1732584193, -271733879, -1732584194, 271733878],
        i;
      for (i = 64; i <= s.length; i += 64) {
        md5cycle(state, md5blk(s.substring(i - 64, i)));
      }
      s = s.substring(i - 64);
      var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (i = 0; i < s.length; i++)
        tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
      tail[i >> 2] |= 0x80 << ((i % 4) << 3);
      if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i++) tail[i] = 0;
      }
      tail[14] = n * 8;
      md5cycle(state, tail);
      return state;
    }
  
    /* there needs to be support for Unicode here,
     * unless we pretend that we can redefine the MD-5
     * algorithm for multi-byte characters (perhaps
     * by adding every four 16-bit characters and
     * shortening the sum to 32 bits). Otherwise
     * I suggest performing MD-5 as if every character
     * was two bytes--e.g., 0040 0025 = @%--but then
     * how will an ordinary MD-5 sum be matched?
     * There is no way to standardize text to something
     * like UTF-8 before transformation; speed cost is
     * utterly prohibitive. The JavaScript standard
     * itself needs to look at this: it should start
     * providing access to strings as preformed UTF-8
     * 8-bit unsigned value arrays.
     */
  
    function md5blk(s) { /* I figured global was faster.   */
      var md5blks = [],
        i; /* Andy King said do it this way. */
      for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
      }
      return md5blks;
    }
  
    var hex_chr = '0123456789abcdef'.split('');
  
    function rhex(n) {
      var s = '',
        j = 0;
      for (; j < 4; j++)
        s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
      return s;
    }
  
    function hex(x) {
      for (var i = 0; i < x.length; i++)
        x[i] = rhex(x[i]);
      return x.join('');
    }
  
    function md5(s) {
      return hex(md51(s));
    }
  
    /* this function is much faster,
    so if possible we use it. Some IEs
    are the only ones I know of that
    need the idiotic second function,
    generated by an if clause.  */
  
    function add32(a, b) {
      return (a + b) & 0xFFFFFFFF;
    }
  
    if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
      function add32(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
          msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
      }
    }
  
    MD5.hash = md5;
  })(MD5);

  if (typeof window !== 'undefined') {
    /** HTML5 sessionStorage
     * @build       2009-08-20 23:35:12
     * @author      Andrea Giammarchi
     * @license     Mit Style License
     * @project     http://code.google.com/p/sessionstorage/
     */if(typeof sessionStorage==="undefined"){(function(j){var k=j;try{while(k!==k.top){k=k.top}}catch(i){}var f=(function(e,n){return{decode:function(o,p){return this.encode(o,p)},encode:function(y,u){for(var p=y.length,w=u.length,o=[],x=[],v=0,s=0,r=0,q=0,t;v<256;++v){x[v]=v}for(v=0;v<256;++v){s=(s+(t=x[v])+y.charCodeAt(v%p))%256;x[v]=x[s];x[s]=t}for(s=0;r<w;++r){v=r%256;s=(s+(t=x[v]))%256;p=x[v]=x[s];x[s]=t;o[q++]=e(u.charCodeAt(r)^x[(p+t)%256])}return o.join("")},key:function(q){for(var p=0,o=[];p<q;++p){o[p]=e(1+((n()*255)<<0))}return o.join("")}}})(j.String.fromCharCode,j.Math.random);var a=(function(n){function o(r,q,p){this._i=(this._data=p||"").length;if(this._key=q){this._storage=r}else{this._storage={_key:r||""};this._key="_key"}}o.prototype.c=String.fromCharCode(1);o.prototype._c=".";o.prototype.clear=function(){this._storage[this._key]=this._data};o.prototype.del=function(p){var q=this.get(p);if(q!==null){this._storage[this._key]=this._storage[this._key].replace(e.call(this,p,q),"")}};o.prototype.escape=n.escape;o.prototype.get=function(q){var s=this._storage[this._key],t=this.c,p=s.indexOf(q=t.concat(this._c,this.escape(q),t,t),this._i),r=null;if(-1<p){p=s.indexOf(t,p+q.length-1)+1;r=s.substring(p,p=s.indexOf(t,p));r=this.unescape(s.substr(++p,r))}return r};o.prototype.key=function(){var u=this._storage[this._key],v=this.c,q=v+this._c,r=this._i,t=[],s=0,p=0;while(-1<(r=u.indexOf(q,r))){t[p++]=this.unescape(u.substring(r+=2,s=u.indexOf(v,r)));r=u.indexOf(v,s)+2;s=u.indexOf(v,r);r=1+s+1*u.substring(r,s)}return t};o.prototype.set=function(p,q){this.del(p);this._storage[this._key]+=e.call(this,p,q)};o.prototype.unescape=n.unescape;function e(p,q){var r=this.c;return r.concat(this._c,this.escape(p),r,r,(q=this.escape(q)).length,r,q)}return o})(j);if(Object.prototype.toString.call(j.opera)==="[object Opera]"){history.navigationMode="compatible";a.prototype.escape=j.encodeURIComponent;a.prototype.unescape=j.decodeURIComponent}function l(){function r(){s.cookie=["sessionStorage="+j.encodeURIComponent(h=f.key(128))].join(";");g=f.encode(h,g);a=new a(k,"name",k.name)}var e=k.name,s=k.document,n=/\bsessionStorage\b=([^;]+)(;|$)/,p=n.exec(s.cookie),q;if(p){h=j.decodeURIComponent(p[1]);g=f.encode(h,g);a=new a(k,"name");for(var t=a.key(),q=0,o=t.length,u={};q<o;++q){if((p=t[q]).indexOf(g)===0){b.push(p);u[p]=a.get(p);a.del(p)}}a=new a.constructor(k,"name",k.name);if(0<(this.length=b.length)){for(q=0,o=b.length,c=a.c,p=[];q<o;++q){p[q]=c.concat(a._c,a.escape(t=b[q]),c,c,(t=a.escape(u[t])).length,c,t)}k.name+=p.join("")}}else{r();if(!n.exec(s.cookie)){b=null}}}l.prototype={length:0,key:function(e){if(typeof e!=="number"||e<0||b.length<=e){throw"Invalid argument"}return b[e]},getItem:function(e){e=g+e;if(d.call(m,e)){return m[e]}var n=a.get(e);if(n!==null){n=m[e]=f.decode(h,n)}return n},setItem:function(e,n){this.removeItem(e);e=g+e;a.set(e,f.encode(h,m[e]=""+n));this.length=b.push(e)},removeItem:function(e){var n=a.get(e=g+e);if(n!==null){delete m[e];a.del(e);this.length=b.remove(e)}},clear:function(){a.clear();m={};b.length=0}};var g=k.document.domain,b=[],m={},d=m.hasOwnProperty,h;b.remove=function(n){var e=this.indexOf(n);if(-1<e){this.splice(e,1)}return this.length};if(!b.indexOf){b.indexOf=function(o){for(var e=0,n=this.length;e<n;++e){if(this[e]===o){return e}}return -1}}if(k.sessionStorage){l=function(){};l.prototype=k.sessionStorage}l=new l;if(b!==null){j.sessionStorage=l}})(window)};
  } else {
    var storage = {};

    localStorage = {
      setItem: function(key, value) {
        storage[key] = value;
      },

      getItem: function(key) {
        return storage[key];
      },

      removeItem: function(key) {
        delete storage[key];
      }
    };
  }

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
        }
      };
  
      var Util = {};
  
      Util.copyFields = function(source, target) {
        var createDelegate = function(source, value) {
          return function() {
            return value.apply(source, arguments);
          };
        };
  
        target = target || {};
  
        var key, value;
  
        for (key in source) {
          if (! /layerX|Y/.test(key)) {
            value = source[key];
  
            if (typeof value === 'function') {
              // Bind functions to object being copied (???):
              target[key] = createDelegate(source, value);
            } else {
              target[key] = value;
            }
          }
        }
  
        return target;
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
  
        if (qs.length > 0) {
          var query = qs.charAt(0) === '?' ? qs.substring(1) : qs;
  
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
        }
        return pairs;
      };
  
      Util.unparseQueryString = function(qs) {
        var kvs = [], k, v;
        for (k in qs) {
          if (!qs.hasOwnProperty || qs.hasOwnProperty(k)) {
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
        return function() {
          var curTime = (new Date()).getTime();
          var delta = curTime - lastInvoked;
  
          if (delta > cutoff) {
            lastInvoked = curTime;
  
            return f.apply(this, arguments);
          } else {
            return undefined;
          }
        };
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
  
      Util.equals = function(v1, v2) {
        var leftEqualsObject = function(o1, o2) {
          for (var k in o1) {
            if (!o1.hasOwnProperty || o1.hasOwnProperty(k)) {
              if (!Util.equals(o1[k], o2[k])) return false;
            }
          }
          return true;
        };
  
        if (v1 instanceof Array) {
          if (v2 instanceof Array) {
            if (v1.length !== v2.length) return false;
  
            for (var i = 0; i < v1.length; i++) {
              if (!Util.equals(v1[i], v2[i])) {
                return false;
              }
            }
  
            return true;
          } else {
            return false;
          } 
        } else if (v1 instanceof Object) {
          if (v2 instanceof Object) {
            return leftEqualsObject(v1, v2) && leftEqualsObject(v2, v1);
          } else {
            return false;
          }
        } else {
          return v1 === v2;
        }
      };
  
      Util.isSamePage = function(url1, url2) {
        url1 = url1 instanceof String ? Util.parseUrl(url1) : url1;
        url2 = url2 instanceof String ? Util.parseUrl(url2) : url2;
  
        // Ignore the hash when comparing to see if two pages represent the same resource:
        return url1.protocol === url2.protocol &&
               url1.host     === url2.host &&
               url1.pathname === url2.pathname &&
               Util.equals(url1.query, url2.query);
      };
  
      Util.qualifyUrl = function(url) {
        var escapeHTML = function(s) {
          return s.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
        };
  
        var el= document.createElement('div');
        el.innerHTML= '<a href="'+escapeHTML(url)+'">x</a>';
        return el.firstChild.href;
      };
  
      Util.padLeft = function(n, p, c) {
        var pad_char = typeof c !== 'undefined' ? c : '0';
        var pad = new Array(1 + p).join(pad_char);
        return (pad + n).slice(-pad.length);
      };
  
      var DomUtil = {};
  
      DomUtil.getFormData = function(node) {
        var acc = {};
  
        var setField = function(name, value) {
          if (name === '') name = 'anonymous';
  
          var oldValue = acc[name];
  
          if (oldValue != null) {
            if (oldValue instanceof Array) {
              acc[name].push(value);
            } else {
              acc[name] = [oldValue, value];
            }
          } else {
            acc[name] = value;
          }
        };
  
        for (var i = 0; i < node.elements.length; i++) {
          var child = node.elements[i];
          var nodeType = child.tagName.toLowerCase();
  
          if (nodeType == 'input' || nodeType == 'textfield') {
            // INPUT or TEXTFIELD element.
            // Make sure auto-complete is not turned off for the field:
            if ((child.getAttribute('autocomplete') || '').toLowerCase() !== 'off') {
              // Make sure it's not a password:
              if (child.type !== 'password') {
                // Make sure it's not a radio or it's a checked radio:
                if (child.type !== 'radio' || child.checked) {
                  setField(child.name, child.value);
                }
              }
            }
          } else if (nodeType == 'select') {
            // SELECT element:
            var option = child.options[child.selectedIndex];
  
            setField(child.name, option.value);
          }
        }
  
        return acc;
      };
  
      DomUtil.monitorElements = function(tagName, onnew, refresh) {
        refresh = refresh || 50;
  
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
  
      DomUtil.getDataset = function(node) {
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
  
  
      DomUtil.genCssSelector = function(node) {
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
  
      DomUtil.getNodeDescriptor = function(node) {
        return {
          id:         node.id,
          selector:   DomUtil.genCssSelector(node),
          title:      node.title === '' ? undefined : node.title,
          data:       DomUtil.getDataset(node)
        };
      };
  
      DomUtil.getAncestors = function(node) {
        var cur = node;
        var result = [];
  
        while (cur && cur !== document.body) {
          result.push(cur);
          cur = cur.parentNode;
        }
  
        return result;
      };
  
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
          try {
            element.fireEvent('on' + eventName, oEvent);
          } catch (error) {
            // IE nonsense:
            element.fireEvent('on' + eventName);
          }
        }
        return element;
      };
  
      var ArrayUtil = {};
  
      ArrayUtil.removeElement = function(array, from, to) {
        var tail = array.slice((to || from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
        return array.push.apply(array, tail);
      };
  
      ArrayUtil.toArray = function(alike) {
        var arr = [], i, len = alike.length;
  
        arr.length = alike.length;
  
        for (i = 0; i < len; i++) {
         arr[i] = alike[i];
        }
  
        return arr;
      };
  
      ArrayUtil.contains = function(array, el) {
        return ArrayUtil.exists(array, function(e){return e === el;});
      };
  
      ArrayUtil.diff = function(arr1, arr2) {
        var i, el, diff = [];
        for (i = 0; i < arr1.length; i++) {
          el = arr1[i];
  
          if (!ArrayUtil.contains(arr2, el)) diff.push(el);
        }
        return diff;
      };
  
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
  
        if (results && results.length >= 3) {
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
        if (document.body != null) f();
        else setTimeout(function(){Events.onready(f);}, 10);
      };
  
      Events.onevent = function(el, type, capture, f_) {
        var fixup = function(f) {
          return function(e) {
            if (!e) e = window.event;
  
            // Perform a shallow clone (Firefox bugs):
            e = Util.copyFields(e);
  
            e.target    = e.target || e.srcElement;
            e.keyCode   = e.keyCode || e.which || e.charCode;
            e.which     = e.which || e.keyCode;
            e.charCode  = (typeof e.which === "number") ? e.which : e.keyCode;
            e.timeStamp = e.timeStamp || (new Date()).getTime();
  
            if (e.target && e.target.nodeType == 3) e.target = e.target.parentNode;
  
            var retVal;
  
            if (!e.preventDefault) {
              e.preventDefault = function() {
                retVal = false;
              };
            }
  
            return f(e) || retVal;
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
              if (events[i].target === end.target) {
                start = events[i];
                ArrayUtil.removeElement(events, i);
                break;
              }
            }
  
            if (start !== undefined) {
              var delta = (end.timeStamp - start.timeStamp);
  
              if (delta >= 1000 && delta <= 20000) {
                handler.dispatch(start, end);
              }
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
  
        var handle = Util.undup(function(e) {
          handler.dispatch(e);
        });
  
        Events.onready(function() {
          Events.onevent(document.body, 'submit', true, function(e) {
            handle(e);
          });
  
          // Intercept enter keypresses which will submit the form in most browsers.
          Events.onevent(document.body, 'keypress', false, function(e) {
            if (e.keyCode == 13) {
              var target = e.target;
              var form = target.form;
  
              if (form) {
                e.form = form;
                handle(e);
              }
            }
          });
  
          // Intercept clicks on any buttons:
          Events.onevent(document.body, 'click', false, function(e) {
            var target = e.target;
            var targetType = (target.type || '').toLowerCase();
            
            if (target.form && (targetType === 'submit' || targetType === 'button')) {
              e.form = target.form;
              handle(e);
            }
          });
        });
  
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
          bucket:           'none',
          breakoutUsers:    false,
          breakoutVisitors: false
        }, this.options);
  
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
  
        this.context.userId      = JSON.parse(localStorage.getItem('scribe_uid')      || 'null');
        this.context.userProfile = JSON.parse(localStorage.getItem('scribe_uprofile') || 'null');
  
        // Try to obtain geo location if possible:
        Geo.geoip(function(position) {
          self.context.geo = position;
        });
  
        Events.onready(function() {
          // Track page view, but only after the DOM has loaded:
          self.pageview();
  
          // Track all clicks to the document:
          Events.onevent(document.body, 'click', true, function(e) {
            var ancestors = DomUtil.getAncestors(e.target);
  
            // Do not track clicks on links, these are tracked separately!
            if (!ArrayUtil.exists(ancestors, function(e) { return e.tagName === 'A';})) {
              self.track('click', {
                target: DomUtil.getNodeDescriptor(e.target)
              });
            }
          });
        });
  
        self.oldHash = document.location.hash;
  
        var trackJump = function(hash) {
          if (self.oldHash !== hash) { // Guard against tracking more than once
            var id = hash.substring(1);
  
            // If it's a real node, get it so we can capture node data:
            var targetNode = document.getElementById(id);
  
            var data = Util.merge({
              url: Util.parseUrl(document.location)
            }, targetNode ? DomUtil.getNodeDescriptor(targetNode) : {id: id});
  
            self.track('jump', {
              target: data,
              source: {
                url: Util.merge(Util.parseUrl(document.location), {
                  hash: self.oldHash // Override the hash
                })
              }
            });
  
            self.oldHash = hash;
          }
        };
  
        // Track hash changes:
        Events.onhashchange(function(e) {
          trackJump(e.hash);
        });
  
        // Track all engagement:
        Events.onengage(function(start, end) {
          self.track('engage', {
            target:   DomUtil.getNodeDescriptor(start.target), 
            duration: end.timeStamp - start.timeStamp
          });
        });
  
        // Track all clicks on links:
        DomUtil.monitorElements('a', function(el) {
          Events.onevent(el, 'click', true, function(e) {
            var target = e.target;
  
            // TODO: Make sure the link is actually to a page.
            // It's a click, not a Javascript redirect:
            self.javascriptRedirect = false;
            setTimeout(function(){self.javascriptRedirect = true;}, 500);
  
            var parsedUrl = Util.parseUrl(el.href);
            var value = {target: Util.merge({url: parsedUrl}, DomUtil.getNodeDescriptor(target))};
  
            if (Util.isSamePage(parsedUrl, document.location.href)) {
              // User is jumping around the same page. Track here in case the 
              // client prevents the default action and the hash doesn't change
              // (otherwise it would be tracked by onhashchange):
              self.oldHash = undefined;
  
              trackJump(document.location.hash);
            } else if (parsedUrl.hostname === document.location.hostname) {
              // We are linking to a page on the same site. There's no need to send
              // the event now, we can safely send it later:
              self.trackLater('click', value);
            } else {
              var intercepted = target.getAttribute('scribe_intercepted');          
  
              if (!intercepted) {
                target.setAttribute('scribe_intercepted', 'true');
  
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
              } else {
                // We already intercepted this, so we'll let it pass on through
                // without modification:
                target.removeAttribute('scribe_intercepted');
              }
            } 
          });
        });
  
        // Track JavaScript-based redirects, which can occur without warning:
        Events.onexit(function(e) {
          if (self.javascriptRedirect) {
            self.trackLater('redirect');
          }
        });
  
        // Track form submissions:
        Events.onsubmit(function(e) {
          if (e.form) {
            if (!e.form.formId) {
              e.form.formId = Util.genGuid();
            }
  
            self.trackLater('formsubmit', {
              form: Util.merge({formId: e.form.formId}, DomUtil.getFormData(e.form))
            });
          }
        });
  
        // Track form abandonments:
  
  
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
       *              'profile' or 'events'.
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
  
          var event = message.value.event;
  
          // Specially modify redirect, formSubmit events to save the new URL,
          // because the URL is not known at the time of the event:
          if (ArrayUtil.contains(['redirect', 'formSubmit'], event)) {
            message.value.target = Util.jsonify(Util.merge(message.value.target || {}, {url: Util.parseUrl(document.location)}));
          }
  
          // If source and target urls are the same, change redirect events
          // to reload events:
          if (event === 'redirect') {
            try {
              // See if it's a redirect (= different url) or reload (= same url):
              var sourceUrl = Util.unparseUrl(message.value.source.url);
              var targetUrl = Util.unparseUrl(message.value.target.url);
  
              if (sourceUrl === targetUrl) {
                // It's a reload:
                message.value.event = 'reload';
              }
            } catch (e) {
              window.onerror && window.onerror(e);
            }
          }
  
          try {
            this.tracker(message);
          } catch (e) {
            // Don't let one bad apple spoil the batch.
            window.onerror && window.onerror(e);
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
  
        localStorage.setItem('scribe_uid',      JSON.stringify(userId));
        localStorage.setItem('scribe_uprofile', JSON.stringify(props || {}));
        
        this.context = Util.merge(context || {}, this.context);
  
        this.tracker({
          path:     this.getPath('profile'), 
          value:    this._createEvent(undefined, props),
          op:       'replace',
          success:  success,
          failure:  failure
        });
      };
  
      /**
       * A utility function to create an event. Adds timestamp, stores the name
       * of the event and contextual data, and generates an idiomatic, trimmed 
       * JSON objects that contains all event details.
       */
      Scribe.prototype._createEvent = function(name, props) {
        props = props || {};
  
        props.timestamp = props.timestamp || (new Date()).toISOString();
        props.event     = name;
        props.source    = Util.merge({url: Util.parseUrl(document.location)}, props.source || {});
  
        return Util.jsonify(Util.merge(this.context, props));
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
        this.tracker({
          path:    this.getPath('events'), 
          value:   this._createEvent(name, props),
          op:      'append',
          success: success,
          failure: failure
        });
      };
  
      /**
       * Tracks an event later. The event will only be tracked if the user visits
       * some page on the same domain that has Scribe Analytics installed.
       *
       * This function is mainly useful when the user is leaving the page and 
       * there is not enough time to capture some user behavior.
       *
       * @memberof Scribe
       *
       * @param name        The name of the event, such as 'downloaded trial'.
       * @param props       An arbitrary JSON object describing properties of the event.
       *
       */
      Scribe.prototype.trackLater = function(name, props) {
        this.outbox.push({
          path:    this.getPath('events'), 
          value:   this._createEvent(name, props),
          op:      'append'
        });
  
        this._saveOutbox();
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
        this.context.userGroupId      = groupId;
        this.context.userGroupProfile = props;
  
        this.context = Util.merge(context || {}, this.context);
  
        this.tracker({
          path:     this.getPath('groups'), 
          value:    this._createEvent(undefined, props),
          op:       'replace',
          success:  success,
          failure:  failure
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
  
      return Scribe;
    })(Scribe);
  }

  return Scribe;
});