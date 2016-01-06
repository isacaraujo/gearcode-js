"use strict";

var utils = {};
var $ = require('jquery')

/**
 * @plugin $.isMobile
 * @static
 * Check if this is a Mobile device.
 */
utils.isMobile = (function (a) {
return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a);
}(navigator.userAgent || navigator.vendor || window.opera));

/**
 * @plugin $.Events
 * Facade for Mobile Events.
 */
utils.Events = (function () {
    return {
      touchstart: $.isMobile ? 'touchstart' : 'mousedown',
      touchmove:  $.isMobile ? 'touchmove'  : 'mousemove',
      touchend:   $.isMobile ? 'touchend'   : 'mouseup'
    };
}());

/**
 * @plugin $.callback
 * Create a generic callback constructor.
 */
utils.callback = function (callbackListener, scope) {
    return function () {
      var args = $.makeArray(arguments);
      return callbackListener.apply(scope, args);
    };
};

/**
 * @plugin $.ucfirst
 * Capitalize a word
 */
utils.ucfirst = function (text) {
  return text.charAt(0).toUpperCase() + text.substr(1);
};

/**
 * @plugin $.ucfirst
 * Capitalize all words in text
 */
utils.ucwords = function (text) {
  return $.map(text.split(' '), $.ucfirst).join(' ');
};

utils.regexp = function (text) {
  text = text.replace(/\//g, "\\/")
             .replace(/\./g, "\\.")
             .replace(/\+/g, "\\+")
             .replace(/\*/g, "\\*");
  return text;
};

utils.removeAccents = function (text) {
  var haystack    = "ãáàäâéèëêíìïîõóòöôúùüûç",
      replacement = 'aaaaaeeeeiiiiooooouuuuc';
  text = text.toLowerCase();
  for (var i = 0; i < haystack.length; i++) {
      var chr = haystack.charAt(i);
      var rep = replacement.charAt(i);
      text = text.replace(new RegExp(chr, 'g'), rep);
  }
  return text;
};

module.exports = utils;
