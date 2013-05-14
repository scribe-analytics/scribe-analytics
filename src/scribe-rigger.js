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
  //= ext/json2.js

  //= ext/md5.js

  if (typeof window !== 'undefined') {
    //= ext/sessionstorage.1.4.js
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

  //= scribe-analytics.js

  return Scribe;
});
