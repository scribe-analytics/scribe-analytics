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